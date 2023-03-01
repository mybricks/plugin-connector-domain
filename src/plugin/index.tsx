import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { uuid } from '../utils';
import {
  exampleParamsFunc,
  exampleResultFunc,
  SERVICE_TYPE,
  TG_PANEL_VISIBLE,
  DEFAULT_PANEL_VISIBLE,
  NO_PANEL_VISIBLE,
  templateResultFunc,
  exampleSQLParamsFunc,
  TYPE
} from '../constant';
import css from '../style-cssModules.less';
import { get } from '../utils/lodash';
import { formatDate } from '../utils/moment';
import { parseQuery } from '../utils/index'
import DefaultPanel from './compoment/defaultPanel';
import SQLPanel from './compoment/sqlPanel';

import { getScript } from '../script';
import Toolbar from './compoment/toolbar';
import * as Icons from '../icon';
import { cloneDeep } from '../utils/lodash/cloneDeep';
import axios from 'axios';

interface Iprops {
  connector: Iconnector;
  addActions?: any[];
  data: {
    connectors: any[];
    config: { paramsFn: string; resultFn?: string };
  };
  ininitialValue: any;
  serviceListUrl?: string;
  callServiceUrl?: string;
}

interface Iconnector {
  add: (params: any) => null;
  remove: (id: number | string) => null;
  update: (params: any) => null;
  test: (...args: any) => any;
}

const interfaceParams = [
  { key: 'id', name: '标识', copy: true },
  { key: 'content.title', name: '标题' },
  { key: 'content.method', name: '方法' },
  { key: 'content.path', name: '路径' },
  { key: 'content.doc', name: '文档链接', link: true },
  { key: 'updateTime', name: '更新时间', format: 'YYYY-MM-DD HH:mm:ss' },
];

export default function Sidebar({
  connector,
  data,
  ininitialValue = {},
  serviceListUrl,
  callServiceUrl,
}: Iprops) {
  const ref = useRef();
  const [searchValue, setSearchValue] = useState('');
  const [sidebarContext, setContext] = useState<any>({
    eidtVisible: false,
    activeId: '',
    panelVisible: NO_PANEL_VISIBLE,
    kdev: {
      departmentOptions: [],
      interfaceOptions: [],
      searchOptions: [],
      interfaceMap: {},
    },
    tg: {},
    type: '',
    comlibNavVisible: true,
    isEdit: false,
    formModel: {
      path: '',
      title: '',
      id: '',
      type: TYPE,
      input: '',
      output: '',
    },
    isDebug: false,
    templateVisible: false,
    templateForm: {},
    leftWidth: 271,
    enableRenderPortal: true,
    addActions: [{ type: 'sql', title: 'sql' }],
    connector: {
      add: (args: any) => connector.add({ ...args }),
      remove: (id: string) => connector.remove(id),
      update: (args: any) => {
        connector.update({ ...args });
      },
      test: (...args: any) => connector.test(...args),
    },
    search: (v: string) => {
      setSearchValue(v);
    },
  });
  // @ts-ignore
  const baseFileId = parseQuery(location.search)?.id;

  const updateService = useCallback(
    async (action: string, item?: any) => {
      return new Promise((resolve) => {
        const {
          id = uuid(),
          type,
          inputSchema,
          ...others
        }: any = item || sidebarContext.formModel;
        if (action === 'create') {
          const serviceItem = {
            id,
            type: TYPE,
            content: {
              input: encodeURIComponent(exampleParamsFunc),
              output: encodeURIComponent(exampleResultFunc),
              inputSchema: inputSchema || { type: 'object' },
              ...others,
            },
            createTime: Date.now(),
            updateTime: Date.now(),
          };
          data.connectors.push(serviceItem);
          sidebarContext.connector.add({
            id,
            type: TYPE,
            title: others.title,
            inputSchema: inputSchema,
            outputSchema: others.outputSchema,
            script: getScript({
              ...serviceItem.content,
              globalParamsFn: data.config.paramsFn,
              globalResultFn: data.config.resultFn,
            }),
          });
        } else {
          const updateAll = action === 'updateAll';
          data.connectors.forEach((service: any, index: number) => {
            if (service.id === id || updateAll) {
              let serviceItem = data.connectors[index];
              if (!updateAll) {
                serviceItem = {
                  ...service,
                  updateTime: Date.now(),
                  content: { ...others },
                };
                data.connectors[index] = serviceItem;
              }
              try {
                sidebarContext.connector.update({
                  id: updateAll ? serviceItem.id : id,
                  title: others.title,
                  type: TYPE,
                  inputSchema: serviceItem.content.inputSchema,
                  outputSchema: serviceItem.content.outputSchema,
                  script: getScript({
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

  const createService = useCallback(() => {
    return updateService('create');
  }, []);

  const removeService = useCallback((item: any) => {
    return new Promise((resolve) => {
      const index = data.connectors.findIndex((service) => {
        return String(service.id) === String(item.id);
      });
      data.connectors.splice(index, 1);
      try {
        sidebarContext.connector.remove(item.id);
      } catch (error) {}
      resolve('');
    });
  }, []);

  const clickRef = useRef();

  const setRender = useCallback((value: any) => {
    setContext((ctx: any) => ({
      ...ctx,
      formModel: {
        ...ctx.formModel,
      },
      ...value,
    }));
  }, []);

  const onEditItem = useCallback((item) => {
    const obj: any = {
      isEdit: true,
      isDebug: true,
      activeId: item.id,
      templateVisible: false,
    };
    if (item.type === SERVICE_TYPE.TG) {
      obj.panelVisible = TG_PANEL_VISIBLE;
      obj.formModel = { id: item.id, type: item.type, ...item.content };
    } else {
      obj.panelVisible = DEFAULT_PANEL_VISIBLE;
      obj.formModel = {
        ...item.content,
        type: item.type,
        id: item.id,
        input: item.content.input || exampleParamsFunc,
        output: item.content.output || exampleResultFunc,
      };
    }
    setRender(obj);
  }, []);

  const onCopyItem = useCallback(async (item) => {
    sidebarContext.formModel = cloneDeep(item.content);
    sidebarContext.formModel.title += ' 复制';
    setRender(sidebarContext);
    await createService();
  }, []);

  const onRemoveItem = useCallback(async (item) => {
    if (confirm(`确认删除 ${item.content.title} 吗`)) {
      await removeService(item);
      sidebarContext.panelVisible = NO_PANEL_VISIBLE;
      setRender(sidebarContext);
    }
  }, []);

  const addDefaultService = useCallback(async () => {
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

  sidebarContext.addDefaultService = addDefaultService;
  sidebarContext.updateService = updateService;

  const onGlobalConfigClick = useCallback(() => {
    sidebarContext.templateVisible = true;
    sidebarContext.panelVisible = NO_PANEL_VISIBLE;
    setRender(sidebarContext);
  }, []);

  const onCancel = useCallback(() => {
    sidebarContext.panelVisible = NO_PANEL_VISIBLE;
    sidebarContext.isDebug = false;
    sidebarContext.activeId = void 0;
    sidebarContext.isEdit = false;
    setRender(sidebarContext);
  }, []);
  sidebarContext.onCancel = onCancel;

  const onFinish = async () => {
    if (sidebarContext.isEdit) {
      await updateService();
    } else {
      await createService();
    }
    sidebarContext.panelVisible = NO_PANEL_VISIBLE;
    sidebarContext.activeId = void 0;
    sidebarContext.formModel = {};
    sidebarContext.isEdit = false;
    setRender(sidebarContext);
  };

  const onItemClick = useCallback((e: any, item: any) => {
    if (item.id === sidebarContext.expandId) {
      sidebarContext.expandId = 0;
      setRender(sidebarContext);
      return;
    }
    sidebarContext.expandId = item.id;
    setRender(sidebarContext);
  }, []);

  const onLinkClick = useCallback((url: string) => {
    window.open(url);
  }, []);

  const renderParam = useCallback(
    (item, { key, format, copy, link, isTpl }) => {
      if (format) {
        return formatDate(item[key], format);
      }
      if (copy) {
        return (
          <span
            className={css['sidebar-panel-list-item__copy']}
          >{`${item[key]}`}</span>
        );
      }
      if (link) {
        return get(item, key) ? (
          <span
            onClick={() => onLinkClick(get(item, key))}
            className={css['doc-link']}
          >
            点击跳转
          </span>
        ) : (
          '无'
        );
      }
      if (isTpl) {
        const domainObj = item[key];
        return (
          <>
            <span>
              {typeof domainObj === 'object'
                ? domainObj.domain || '无'
                : domainObj || '无'}
            </span>
            <br />
            {get(item, [key, 'laneId']) && (
              <span>{get(item, [key, 'laneId'])}</span>
            )}
          </>
        );
      }
      return get(item, key, '无');
    },
    []
  );

  const onSaveSQl = useCallback(async (sqlList: any[]) => {
    setRender({
      panelVisible: NO_PANEL_VISIBLE,
    });
    for(let l = sqlList.length, i=0; i<l; i++) {
      const item = sqlList[i]
      const relativePath: string = await fetchRelativePath(item.fileId);
      const inputSchema = item.paramAry?.reduce((obj, cur) => {
        obj[cur.name] = { type: cur.type };
        return obj;
      }, {});
      const debugParams = item.paramAry?.map((item) => ({
        id: uuid(),
        name: item.name,
        type: item.type,
        defaultValue: item.debugValue,
      }));

      updateService('create', {
        id: item.serviceId,
        title: item.title,
        method: 'POST',
        type: TYPE,
        inputSchema: {
          type: 'object',
          properties: {
            ...inputSchema,
          },
        },
        resultSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'number',
            },
            data: {
              type: 'object',
            },
            msg: {
              type: 'string',
            },
          },
        },
        params: debugParams
          ? {
              type: 'root',
              name: 'root',
              children: debugParams,
            }
          : void 0,
        input: encodeURIComponent(
          exampleSQLParamsFunc
            .replace('__serviceId__', item.serviceId)
            .replace('__relativePath__', relativePath)
            // .replace('__fileId__', item.fileId)
            // .replace('__baseFileId__', baseFileId)
        ),
        path: callServiceUrl || `/api/system/domain/run`,
      });
    }
  }, []);

  const fetchRelativePath = useCallback(async (relativeId): Promise<string> => {
    return new Promise((resolve) => {
      axios({
        url: serviceListUrl || '/paas/api/file/getRelativePathBetweenFileId',
        method: 'POST',
        data: {
          baseFileId: baseFileId,
          relativeId
        }
      })
        .then((res) => res.data)
        .then((res) => {
          if (res.code === 1) {
            resolve(res.data)
          }
        });
    })
  }, [])

  const renderAddActions = useCallback(() => {
    return (
      <>
        <SQLPanel
          sidebarContext={sidebarContext}
          setRender={setRender}
          onSubmit={onFinish}
          onSaveSQl={onSaveSQl}
          key='sql'
          data={data}
          style={{ top: ref.current?.getBoundingClientRect().top }}
        />
        <DefaultPanel
          sidebarContext={sidebarContext}
          setRender={setRender}
          onSubmit={onFinish}
          key='default'
          globalConfig={data.config}
          style={{ top: ref.current?.getBoundingClientRect().top }}
        />
      </>
    );
  }, [sidebarContext]);

  const onGlobalConfigChange = useCallback(() => {
    updateService('updateAll');
  }, []);

  const getInterfaceParams = useCallback((item) => {
    if (item.type === SERVICE_TYPE.TG) {
      return interfaceParams.filter(
        ({ key }) =>
          !['content.path', 'content.method', 'content.desc'].includes(key)
      );
    }
    return interfaceParams;
  }, []);

  const onServiceItemTitleClick = (e, item) => {
    e.stopPropagation();
    const { id, content, type } = item;
    if (type === SERVICE_TYPE.TG) return;
    if (!content.mockAddress) {
      sidebarContext.toolTipId = id;
      setTimeout(() => {
        sidebarContext.toolTipId = void 0;
      }, 2500);
      return;
    }
    sidebarContext.formModel = {
      id,
      ...content,
      useMock: !content.useMock,
    };
    updateService();
  };
  const initData = useCallback(() => {
    data.config = data.config || {
      paramsFn:
        ininitialValue.paramsFn || encodeURIComponent(exampleParamsFunc),
      resultFn: ininitialValue.resultFn || templateResultFunc,
    };
    data.config.resultFn =
      data.config.resultFn || ininitialValue.resultFn || templateResultFunc;
    if (data.connectors.length === 0 && ininitialValue.serviceList?.length) {
      data.connectors = ininitialValue.serviceList;
      ininitialValue.serviceList.forEach((item: any) => {
        const { title, inputSchema, outputSchema } = item.content || {};
        const ctr = {
          id: item.id,
          type: TYPE,
          title,
          inputSchema,
          outputSchema,
          script: getScript({
            ...item.content,
            globalParamsFn: data.config.paramsFn,
            globalResultFn: data.config.resultFn,
          }),
        };
        try {
          sidebarContext.connector.add(ctr);
        } catch (error) {
          console.log(error);
        }
      });
    }
  }, []);

  useMemo(() => {
    initData();
  }, []);

  useEffect(() => {
    function fetchServiceList() {
      axios({
        url: serviceListUrl || '/paas/api/system/domain/list',
        method: 'POST',
        data: {
          fileId: baseFileId
        }
      })
        .then((res) => res.data)
        .then((res) => {
          if (res.code === 1) {
            setRender({
              sqlList: res.data,
            });
          }
        });
    }

    fetchServiceList();
  }, []);

  return (
    <>
      <div
        ref={ref}
        className={`${css['sidebar-panel']} ${css['sidebar-panel-open']}`}
      >
        <div className={`${css['sidebar-panel-view']}`}>
          <div className={css['sidebar-panel-header']}>
            <div className={css['sidebar-panel-header__title']}>
              <span>接口列表</span>
              <div className={css.icon} onClick={onGlobalConfigClick}>
                {Icons.set}
              </div>
            </div>
            <Toolbar
              searchValue={searchValue}
              ctx={sidebarContext}
              setRender={setRender}
            />
          </div>
          <div className={css['sidebar-panel-list']}>
            {(searchValue
              ? data.connectors.filter((item) =>
                  item.content.title.includes(searchValue)
                )
              : data.connectors
            ).map((item) => {
              const expand = sidebarContext.expandId === item.id;
              item.updateTime = formatDate(item.updateTime || item.createTime);
              const { useMock } = item.content;
              return (
                <div key={item.id}>
                  <div
                    // key={item.id}
                    className={`${css['sidebar-panel-list-item']} ${
                      sidebarContext.activeId === item.id ? css.active : ''
                    } ${
                      sidebarContext.isEdit
                        ? sidebarContext.activeId === item.id
                          ? css.chose
                          : css.disabled
                        : ''
                    }`}
                  >
                    <div>
                      <div
                        onClick={(e) => onItemClick(e, item)}
                        className={css['sidebar-panel-list-item__left']}
                      >
                        <div
                          className={`${css.icon} ${
                            expand ? css.iconExpand : ''
                          }`}
                        >
                          {Icons.arrowR}
                        </div>
                        <div
                          className={css.tag}
                          onClick={(e) => onServiceItemTitleClick(e, item)}
                        >
                          {useMock ? 'Mock' : '接口'}
                        </div>
                        <div className={css.name}>
                          <span>{item.content.title}</span>
                        </div>
                      </div>
                      <div className={css['sidebar-panel-list-item__right']}>
                        <div
                          ref={clickRef}
                          className={css.action}
                          onClick={() => onEditItem(item)}
                        >
                          {Icons.edit}
                        </div>
                        <div
                          className={css.action}
                          onClick={() => onCopyItem(item)}
                        >
                          {Icons.copy}
                        </div>
                        <div
                          className={css.action}
                          onClick={() => onRemoveItem(item)}
                        >
                          {Icons.remove}
                        </div>
                      </div>
                    </div>
                  </div>
                  {expand ? (
                    <div className={css['sidebar-panel-list-item__expand']}>
                      {getInterfaceParams(item).map((param: any) => {
                        return (
                          <div
                            className={css['sidebar-panel-list-item__param']}
                            key={param.key}
                          >
                            <span
                              className={css['sidebar-panel-list-item__name']}
                              style={{ width: param.width }}
                            >
                              {param.name}:
                            </span>
                            <span
                              className={
                                css['sidebar-panel-list-item__content']
                              }
                            >
                              {renderParam(item, param)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
        {renderAddActions()}
      </div>
    </>
  );
}
