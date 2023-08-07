import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import {
	AGGREGATION_MODEL_VISIBLE,
	DOMAIN_PANEL_VISIBLE,
	exampleParamsFunc,
	exampleResultFunc,
	NO_PANEL_VISIBLE,
} from '../constant';
import css from '../style-cssModules.less';
import { formatDate } from '../utils/moment';
import Toolbar from './compoment/toolbar';
import { arrowR, edit, refresh, remove } from '../icon';
import DomainPanel, { ActionMessage, checkDomainModel, getDomainBundle, getDomainService } from './compoment/domainPanel';
import AggregationModel from './compoment/aggregation-model';
import Loading from './compoment/loading';
import { notice } from '../components/Message';
import DomainEditModel from './compoment/domain-edit-model';

interface IProps {
  domainModel: IDomainModel;
  callServiceUrl?: string;
  addActions?: AnyType[];
  data: {
	  domainModels: AnyType[];
    config: { paramsFn: string; resultFn?: string };
  };
	openFileSelector?(): Promise<unknown>;
}

interface IDomainModel {
  add: (params: AnyType) => null;
  remove: (id: number | string) => null;
  update: (params: AnyType) => null;
  test: (...args: AnyType) => AnyType;
}

export default function Sidebar({
	addActions,
	domainModel,
	data,
	openFileSelector = () => Promise.resolve(null),
}: IProps) {
	const ref = useRef<HTMLDivElement>(null);
	const blurMap = useRef<Record<string, () => void>>({});
	const [searchValue, setSearchValue] = useState('');
	const [shouldUpdateDomainMap, setShouldUpdateDomainMap] = useState<Record<string, string>>({});
	const [panelVisible, setPanelVisible] = useState(NO_PANEL_VISIBLE);
	const [sidebarContext, setContext] = useState<AnyType>({
	  openFileSelector,
		eidtVisible: false,
		activeId: '',
		type: '',
		isDebug: false,
		leftWidth: 271,
		addActions: Array.isArray(addActions)
			? addActions
			: [{ type: 'domain', title: '领域模型' }, { type: 'aggregation-model', title: '聚合模型' }],
		domainModel: {
			add: (args: AnyType) => domainModel.add({ ...args }),
			remove: (id: string) => domainModel.remove(id),
			update: (args: AnyType) => {
				domainModel.update({ ...args });
			},
			test: (...args: AnyType) => domainModel.test(...args),
		},
		search: (v: string) => {
			setSearchValue(v);
		},
	});
	const [curEditModel, setCurEditModel] = useState<AnyType>(undefined);
	
	const updateService = useCallback((action: string, serviceItem: AnyType) => {
		if (action === 'create') {
		  /** 领域模型插件内数据 */
		  data.domainModels.push(serviceItem);
		  /** 设计器内领域模型数据，用以支持组件选择到对应模型 */
		  sidebarContext.domainModel.add(serviceItem);
	  } else {
		  const index = data.domainModels.findIndex(model => model.id === serviceItem.id);
		
		  if (index !== -1) {
			  data.domainModels[index] = serviceItem;
			  sidebarContext.domainModel.update(serviceItem);
		  }
	  }
	}, [sidebarContext]);

	const removeService = useCallback((item: AnyType) => {
		return new Promise((resolve) => {
			const index = data.domainModels.findIndex((service) => {
				return String(service.id) === String(item.id);
			});
			data.domainModels.splice(index, 1);
			try {
				sidebarContext.domainModel.remove(item.id);
			} catch (error) {}
			resolve('');
		});
	}, []);

	const setRender = useCallback((value: AnyType) => {
		setContext((ctx: AnyType) => ({ ...ctx, ...value }));
	}, []);

	const onRemoveItem = useCallback(async (item) => {
		if (confirm(`确认删除 ${item.title} 吗`)) {
			await removeService(item);
			setPanelVisible(NO_PANEL_VISIBLE);
		}
	}, [sidebarContext]);

	const onEditItem = useCallback((item) => {
	  setPanelVisible(item.type === 'aggregation-model' ? AGGREGATION_MODEL_VISIBLE : DOMAIN_PANEL_VISIBLE);
		setCurEditModel(item);
	}, [sidebarContext]);

	const onRefreshItem = useCallback((item) => {
		getDomainBundle(item.query.entity.domainFileId).then((entityList: Array<Record<string, unknown>>) => {
			const entity = entityList.find(entity => entity.id === item.query.entity.id && entity.isOpen);

			if (item.query.edited) {
				notice('模型已被修改，无法自动刷新实体~');
			} else if (!entity) {
				notice('对应模型中实体已删除 或 未开放领域服务，请前往模型编辑页确认~');
			} else {
				updateService(
					'',
					getDomainService(item.id, {
						...entity,
						domainFileId: item.query.entity.domainFileId,
						domainFileName: item.query.entity.domainFileName,
					})
				);
				setShouldUpdateDomainMap({ ...shouldUpdateDomainMap, [item.query.entity.domainFileId + item.query.entity.id]: undefined });

				notice('实体刷新成功~', { type: 'success' });
			}
		});
	}, [sidebarContext, shouldUpdateDomainMap, updateService]);
	
	const onClose = useCallback(() => {
		setPanelVisible(NO_PANEL_VISIBLE);
		setCurEditModel(undefined);
	}, []);

	const onItemClick = useCallback((e: AnyType, item: AnyType) => {
		if (item.id === sidebarContext.expandId) {
			sidebarContext.expandId = 0;
			setRender(sidebarContext);
			return;
		}
		sidebarContext.expandId = item.id;
		setRender(sidebarContext);
	}, [setRender, sidebarContext]);

	const renderAddActions = useCallback(() => {
		return sidebarContext.addActions.filter(action => !['aggregation-model'].includes(action.type))
			.map(({ type, visible, render: Component }: AnyType) => {
				let node: ReactNode = Component ? ReactDOM.createPortal(
					panelVisible & visible ? (
						<div
							style={{ left: 361, top: ref.current?.getBoundingClientRect().top }}
							key={type}
							className={`${css['sidebar-panel-edit']}`}
						>
							<Component
								panelCtx={sidebarContext}
								constant={{ exampleParamsFunc, exampleResultFunc, NO_PANEL_VISIBLE }}
							/>
						</div>
					) : null,
					document.body
				) : null;
				
				if (type === 'domain') {
					node = curEditModel ? (
						<DomainEditModel
							sidebarContext={sidebarContext}
							onClose={onClose}
							initialModel={curEditModel}
							updateService={updateService}
							key="domain"
							style={{ top: ref.current?.getBoundingClientRect().top }}
						/>
					) : (
						<DomainPanel
							sidebarContext={sidebarContext}
							panelVisible={panelVisible}
							updateService={updateService}
							onClose={onClose}
							key="domain"
							data={data}
						/>
					);
				}
				
	      return node;
			});
	}, [sidebarContext, panelVisible, updateService, onClose, data, curEditModel]);
	
	useEffect(() => {
		const domainService = data.domainModels.filter(item => item.type === 'domain' && !item.query.edited);
		
		if (domainService.length) {
			const promises = [];
			const shouldUpdateDomainMap: Record<string, string> = {};
			promises.push(...domainService.map((item) => {
				return getDomainBundle(item.query.entity.domainFileId)
					.then((entityList: Array<Record<string, unknown>>) => {
						shouldUpdateDomainMap[item.query.entity.domainFileId + item.query.entity.id] =
						checkDomainModel(entityList.find(entity => entity.id === item.query.entity.id && entity.isOpen), item.query.entity);
					});
			}));
			
			Promise.all(promises).then(() => {
				setShouldUpdateDomainMap(shouldUpdateDomainMap);
			});
		}
	}, []);

	return (
		<>
			<div
				ref={ref}
				data-id="active-plugin-panel"
				className={`${css['sidebar-panel']} ${css['sidebar-panel-open']}`}
				onClick={() => Object.values(blurMap.current).forEach(fn => fn())}
			>
				<div className={`${css['sidebar-panel-view']}`}>
					<div className={css['sidebar-panel-header']}>
						<div className={css['sidebar-panel-header__title']}>
							<span>模型列表</span>
						</div>
						<Toolbar
	            blurMap={blurMap.current}
							searchValue={searchValue}
							ctx={sidebarContext}
							setRender={setRender}
	            setPanelVisible={setPanelVisible}
	            panelVisible={panelVisible}
						/>
					</div>
	        {data ? (
		        <div className={css['sidebar-panel-list']}>
			        {
				        data.domainModels
				        .filter((item) => searchValue ? item.content.title.includes(searchValue) : true)
				        .map((item) => {
					        const expand = sidebarContext.expandId === item.id;
					        item.updateTime = formatDate(item.updateTime || item.createTime);
										const action = item.type === 'domain'
											? shouldUpdateDomainMap[item.query.entity.domainFileId + item.query.entity.id]
											: undefined;
					
					        return (
						        <div key={item.id}>
							        <div key={item.id} className={css['sidebar-panel-list-item']}>
								        <div>
									        <div
										        onClick={(e) => onItemClick(e, item)}
										        className={css['sidebar-panel-list-item__left']}
									        >
										        <div className={`${css.icon} ${expand ? css.iconExpand : ''}`}>
											        {arrowR}
										        </div>
										        <div className={css.tag}>{item.type === 'domain' ? '领域模型' : '聚合模型'}</div>
										        <div className={css.name}>
											        <span>{item.title}</span>
										        </div>
									        </div>
									        <div className={css['sidebar-panel-list-item__right']}>
										        {item.type === 'domain' ? (
											        <div
												        data-mybricks-tip={ActionMessage[action] || '刷新领域模型实体'}
												        className={`${css.action} ${action ? css.upgrade : ''}`}
												        onClick={() => onRefreshItem(item)}
											        >
												        {refresh}
											        </div>
											        ) : (
																<svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
																</svg>
															)}
															<div data-mybricks-tip="编辑" className={css.action} onClick={() => onEditItem(item)}>
																{edit}
															</div>
										        <div className={css.action} data-mybricks-tip="删除" onClick={() => onRemoveItem(item)}>
											        {remove}
										        </div>
									        </div>
								        </div>
							        </div>
							        {expand ? (
								        <div className={css['sidebar-panel-list-item__expand']}>
									        <div className={css['sidebar-panel-list-item__param']}>
										        <span className={css['sidebar-panel-list-item__name']}>标识:</span>
										        <span className={css['sidebar-panel-list-item__content']}>{item.id}</span>
									        </div>
									        {item.type === 'domain' ? (
										        <>
											        <div className={css['sidebar-panel-list-item__param']}>
												        <span className={css['sidebar-panel-list-item__name']}>模型:</span>
												        <span className={css['sidebar-panel-list-item__content']}>{item.query.entity.domainFileName}</span>
											        </div>
											        <div className={css['sidebar-panel-list-item__param']}>
												        <span className={css['sidebar-panel-list-item__name']}>实体:</span>
												        <span className={css['sidebar-panel-list-item__content']}>{item.query.entity.name}</span>
											        </div>
										        </>
									        ) : null}
								        </div>
							        ) : null}
						        </div>
					        );
				        })
			        }
		        </div>
	        ) : <Loading />}
				</div>
				{renderAddActions()}
	      {panelVisible & AGGREGATION_MODEL_VISIBLE ? (
		      <AggregationModel
			      panelVisible={panelVisible}
			      sidebarContext={sidebarContext}
			      onClose={onClose}
			      initialModel={curEditModel}
			      updateService={updateService}
			      key="aggregation-model"
			      style={{ top: ref.current?.getBoundingClientRect().top }}
		      />
	      ) : null}
			</div>
		</>
	);
}
