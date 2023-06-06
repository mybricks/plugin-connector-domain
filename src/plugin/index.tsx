import React, {ReactNode, useCallback, useMemo, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import {uuid} from '../utils';
import {
	AGGREGATION_MODEL_VISIBLE,
	DEFAULT_PANEL_VISIBLE,
	DOMAIN_PANEL_VISIBLE,
	exampleParamsFunc,
	exampleResultFunc,
	NO_PANEL_VISIBLE,
} from '../constant';
import css from '../style-cssModules.less';
import {formatDate} from '../utils/moment';
import {getScript} from '../script';
import Toolbar from './compoment/toolbar';
import { arrowR, remove } from '../icon';
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
  const [sidebarContext, setContext] = useState<any>({
	  openFileSelector,
    eidtVisible: false,
    activeId: '',
    panelVisible: NO_PANEL_VISIBLE,
    type: '',
    isDebug: false,
	  formModel: {
		  path: '',
		  title: '',
		  id: '',
		  type: '',
		  input: '',
		  output: '',
	  },
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
  const updateService = useCallback(
    async (action: string, item?: any) => {
      return new Promise((resolve) => {
        const { id = uuid(), script, ...others }: any = item || sidebarContext.formModel;
        if (action === 'create') {
          const serviceItem = {
            id,
            type: sidebarContext.type || 'http',
            content: {
              input: encodeURIComponent(exampleParamsFunc),
              output: encodeURIComponent(exampleResultFunc),
              inputSchema: { type: 'object' },
              ...others,
            },
            script,
            createTime: Date.now(),
            updateTime: Date.now(),
          };
          data.domainModels.push(serviceItem);
          sidebarContext.domainModel.add({
            id,
            type:
              sidebarContext.formModel.type || sidebarContext.type || 'http',
            title: others.title,
            inputSchema: others.inputSchema,
            outputSchema: others.outputSchema,
            script: script || getScript({
              ...serviceItem.content,
              globalParamsFn: data.config.paramsFn,
              globalResultFn: data.config.resultFn,
            }),
          });
        } else {
          data.domainModels.forEach((service: any, index: number) => {
            if (service.id === id) {
              let serviceItem = data.domainModels[index];
              try {
                sidebarContext.domainModel.update({
                  id,
                  title: others.title || serviceItem.content.title,
                  type:
                    sidebarContext.formModel.type ||
                    sidebarContext.type ||
                    'http',
                  inputSchema: serviceItem.content.inputSchema,
                  outputSchema: serviceItem.content.outputSchema,
                  script: serviceItem.script || getScript({
                    ...serviceItem.content,
                    globalParamsFn: data.config.paramsFn,
                    globalResultFn: data.config.resultFn,
                  }),
                });
              } catch (error) {}
            }
          });
        }
        // @ts-ignore
        resolve('');
      });
    },
    [sidebarContext]
  );

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
    setContext((ctx: any) => ({ ...ctx, formModel: { ...ctx.formModel }, ...value }));
  }, []);

  const onRemoveItem = useCallback(async (item) => {
    if (confirm(`确认删除 ${item.content.title} 吗`)) {
      await removeService(item);
      sidebarContext.panelVisible = NO_PANEL_VISIBLE;
      setRender(sidebarContext);
    }
  }, [sidebarContext]);

	sidebarContext.addDefaultService = useCallback(async () => {
	  sidebarContext.panelVisible = DEFAULT_PANEL_VISIBLE;
	  sidebarContext.formModel = {
		  title: '',
		  type: sidebarContext.formModel.type,
		  path: '',
		  desc: '',
		  method: 'GET',
		  useMock: false,
		  input: encodeURIComponent(exampleParamsFunc),
		  output: encodeURIComponent(exampleResultFunc),
	  };
	  setRender(sidebarContext);
  }, []);
  sidebarContext.updateService = updateService;

	sidebarContext.onCancel = useCallback(() => {
	  sidebarContext.panelVisible = NO_PANEL_VISIBLE;
	  sidebarContext.isDebug = false;
	  sidebarContext.activeId = void 0;
	  setRender(sidebarContext);
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
    return sidebarContext.addActions.map(({ type, render: Compnent }: any) => {
      let visible = 0;
			let node: ReactNode = ReactDOM.createPortal(
				sidebarContext.panelVisible & visible ? (
					<div
						style={{ left: 361, top: ref.current?.getBoundingClientRect().top }}
						key={type}
						className={`${css['sidebar-panel-edit']}`}
					>
						<Compnent
							panelCtx={sidebarContext}
							constant={{ exampleParamsFunc, exampleResultFunc, NO_PANEL_VISIBLE }}
						/>
					</div>
				) : null,
				document.body
			);
	
	    switch (type) {
        case 'domain':
          visible = DOMAIN_PANEL_VISIBLE;
	        node = (
		        <DomainPanel
			        sidebarContext={sidebarContext}
			        setRender={setRender}
			        updateService={updateService}
			        key='domain'
			        data={data}
			        style={{ top: ref.current?.getBoundingClientRect().top }}
		        />
	        );
          break;
        case 'aggregation-model':
          visible = AGGREGATION_MODEL_VISIBLE;
	        node = (
		        <AggregationModel
			        sidebarContext={sidebarContext}
			        setRender={setRender}
			        updateService={updateService}
			        key='aggregation-model'
			        style={{ top: ref.current?.getBoundingClientRect().top }}
		        />
	        );
          break;
      }
			
      return node;
    });
  }, [sidebarContext]);

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
            />
          </div>
          <div className={css['sidebar-panel-list']}>
	          {
		          data.domainModels
		          .filter((item) => item.content.type === 'domain')
		          .filter((item) => searchValue ? item.content.title.includes(searchValue) : true)
		          .map((item) => {
			          const expand = sidebarContext.expandId === item.id;
			          item.updateTime = formatDate(item.updateTime || item.createTime);
								let entity: Record<string, unknown> = {};
								try {
									entity = JSON.parse(item.script);
								} catch {}
								
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
								          <div className={css.tag}>领域模型</div>
								          <div className={css.name}>
									          <span>{item.content.title}</span>
								          </div>
							          </div>
							          <div className={css['sidebar-panel-list-item__right']}>
								          <div></div>
								          <div
									          className={css.action}
									          onClick={() => onRemoveItem(item)}
								          >
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
							          <div className={css['sidebar-panel-list-item__param']}>
								          <span className={css['sidebar-panel-list-item__name']}>模型:</span>
								          <span className={css['sidebar-panel-list-item__content']}>{entity.domainFileName}</span>
							          </div>
							          <div className={css['sidebar-panel-list-item__param']}>
								          <span className={css['sidebar-panel-list-item__name']}>实体:</span>
								          <span className={css['sidebar-panel-list-item__content']}>{entity.name}</span>
							          </div>
						          </div>
					          ) : null}
				          </div>
			          );
		          })
	          }
          </div>
        </div>
        {renderAddActions()}
      </div>
    </>
  );
}
