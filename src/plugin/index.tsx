import React, {ReactNode, useCallback, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import {
	AGGREGATION_MODEL_VISIBLE,
	exampleParamsFunc,
	exampleResultFunc,
	NO_PANEL_VISIBLE,
} from '../constant';
import css from '../style-cssModules.less';
import {formatDate} from '../utils/moment';
import Toolbar from './compoment/toolbar';
import {arrowR, edit, remove} from '../icon';
import DomainPanel from './compoment/domainPanel';
import AggregationModel from './compoment/aggregation-model';

interface IProps {
  domainModel: IDomainModel;
  callServiceUrl?: string;
  addActions?: any[];
  data: {
	  domainModels: any[];
    config: { paramsFn: string; resultFn?: string };
  };
	openFileSelector?(): Promise<unknown>;
}

interface IDomainModel {
  add: (params: any) => null;
  remove: (id: number | string) => null;
  update: (params: any) => null;
  test: (...args: any) => any;
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
  const [panelVisible, setPanelVisible] = useState(NO_PANEL_VISIBLE);
  const [sidebarContext, setContext] = useState<any>({
	  openFileSelector,
    eidtVisible: false,
    activeId: '',
    type: '',
    isDebug: false,
    leftWidth: 271,
    addActions: addActions
      ? addActions.some(({ type }: any) => type === 'defalut')
        ? addActions
        : [{ type: 'domain', title: '领域模型' }, { type: 'aggregation-model', title: '聚合模型' }].concat(addActions)
      : [{ type: 'domain', title: '领域模型' }, { type: 'aggregation-model', title: '聚合模型' }],
    domainModel: {
      add: (args: any) => domainModel.add({ ...args }),
      remove: (id: string) => domainModel.remove(id),
      update: (args: any) => {
        domainModel.update({ ...args });
      },
      test: (...args: any) => domainModel.test(...args),
    },
    search: (v: string) => {
      setSearchValue(v);
    },
  });
	const [cueEditModel, setCurEditModel] = useState<any>(undefined);
	
  const updateService = useCallback((action: string, serviceItem: any) => {
	  if (action === 'create') {
		  /** 领域模型插件内数据 */
		  data.domainModels.push(serviceItem);
		  /** 设计器内领域模型数据，用以支持组件选择到对应模型 */
		  sidebarContext.domainModel.add(serviceItem);
	  } else {
		  const index = data.domainModels.findIndex(model => model.id === serviceItem.id);
		
		  if (index !== -1) {
				console.log(serviceItem, index);
			  data.domainModels[index] = serviceItem;
			  // sidebarContext.domainModel.update(serviceItem);
		  }
	  }
	}, [sidebarContext]);

  const removeService = useCallback((item: any) => {
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

  const setRender = useCallback((value: any) => {
    setContext((ctx: any) => ({ ...ctx, ...value }));
  }, []);

  const onRemoveItem = useCallback(async (item) => {
    if (confirm(`确认删除 ${item.title} 吗`)) {
      await removeService(item);
			setPanelVisible(NO_PANEL_VISIBLE);
    }
  }, [sidebarContext]);

  const onEditItem = useCallback((item) => {
	  setPanelVisible(AGGREGATION_MODEL_VISIBLE);
		setCurEditModel(item);
  }, [sidebarContext]);
	
	const onClose = useCallback(() => {
		setPanelVisible(NO_PANEL_VISIBLE);
		setCurEditModel(undefined);
	}, []);

  const onItemClick = useCallback((e: any, item: any) => {
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
      .map(({ type, visible, render: Component }: any) => {
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
					node = (
						<DomainPanel
							sidebarContext={sidebarContext}
							panelVisible={panelVisible}
							updateService={updateService}
							onClose={onClose}
							key="domain"
							data={data}
							style={{ top: ref.current?.getBoundingClientRect().top }}
						/>
					)
				}
				
	      return node;
      });
  }, [sidebarContext, panelVisible, updateService, onClose, data]);

  return (
    <>
      <div
        ref={ref}
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
          <div className={css['sidebar-panel-list']}>
	          {
		          data.domainModels
			          .filter((item) => searchValue ? item.content.title.includes(searchValue) : true)
			          .map((item) => {
				          const expand = sidebarContext.expandId === item.id;
				          item.updateTime = formatDate(item.updateTime || item.createTime);
									
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
									          <div></div>
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
        </div>
        {renderAddActions()}
	      {panelVisible & AGGREGATION_MODEL_VISIBLE ? (
		      <AggregationModel
			      panelVisible={panelVisible}
			      sidebarContext={sidebarContext}
			      onClose={onClose}
			      initialModel={cueEditModel}
			      updateService={updateService}
			      key="aggregation-model"
			      style={{ top: ref.current?.getBoundingClientRect().top }}
		      />
	      ) : null}
      </div>
    </>
  );
}
