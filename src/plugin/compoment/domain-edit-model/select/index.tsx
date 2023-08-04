import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import Editor from '@mybricks/code-editor';
import Collapse from '../../../../components/Collapse';
import Button from '../../../../components/Button';
import { fullScreen, fullScreenExit } from '../../../../icon';
import { getEntityBySchema, getSchemaByMarkedMap, safeDecode, uuid } from '../../../../utils';
import FormItem from '../../../../components/FormItem';
import Input, { TextArea } from '../../../../components/Input';
import { MarkList } from '../../../../constant';
import RequestInfo from '../../aggregation-model/request-info';
import ProtocolInfo from '../../aggregation-model/protocol-info';

import parentCss from '../../../../style-cssModules.less';
import styles from '../index.less';

interface SelectProps {
	sidebarContext: AnyType;
	entity: AnyType;
	formModel: Record<string, AnyType>;
	onChange(model: Record<string, AnyType>): void;
	onChangeEntity(entity: Record<string, AnyType>): void;
}

const Select: FC<SelectProps> = props => {
	const { formModel: defaultFormModel, onChange, sidebarContext, onChangeEntity, entity } = props;
	const [formModel, setFormModel] = useState<Record<string, AnyType>>(defaultFormModel);
	const paramRef = useRef<HTMLDivElement>();
	const resultRef = useRef<HTMLDivElement>();
	const firstLoad = useRef(true);
	const [fullScreenParamsEditor, setFullScreenParamsEditor] = useState(false);
	const [fullScreenResultEditor, setFullScreenResultEditor] = useState(false);
	
	const onParamsEditorFullscreen = () => {
		paramRef.current?.classList.add(parentCss['sidebar-panel-code-full']);
		setFullScreenParamsEditor(true);
	};
	const onParamsEditorFullscreenExit = () => {
		paramRef.current?.classList.remove(parentCss['sidebar-panel-code-full']);
		setFullScreenParamsEditor(false);
	};
	const onResultEditorFullscreen = () => {
		setFullScreenResultEditor(true);
		resultRef.current?.classList.add(parentCss['sidebar-panel-code-full']);
	};
	const onResultEditorFullscreenExit = () => {
		setFullScreenResultEditor(false);
		resultRef.current?.classList.remove(parentCss['sidebar-panel-code-full']);
	};
	
	const onChangeForProtocol = useCallback(model => {
		let curEntity = entity || { id: uuid(), fieldAry: [] };
		if (model.markedKeymap) {
			curEntity = model.markedKeymap.dataSource?.path?.length
				? {
					id: curEntity.id,
					...getEntityBySchema(
						'resultSchema' in model ? model.resultSchema : formModel.resultSchema,
						[...model.markedKeymap.dataSource.path]
					)
				}
				: { id: curEntity.id, fieldAry: [] };
		}
		
		onChangeEntity(curEntity);
		setFormModel(pre => {
			return {
				...pre,
				...model,
				...(model.markedKeymap ? getSchemaByMarkedMap(model.resultSchema || pre.resultSchema, model.markedKeymap) : {})
			};
		});
	}, [onChangeEntity, entity, formModel]);
	
	useEffect(() => {
		if (firstLoad.current) {
			firstLoad.current = false;
			return;
		}
		onChange(formModel);
	}, [formModel]);
	
	return (
	  <>
		  <div className={styles.ct}>
			  <Collapse header='基本信息' defaultFold={false}>
				  <div className={styles.item}>
					  <label>领域接口</label>
						<div className={`${styles.editor} ${styles.textEdt}`}>
							<Button size="small" type="default" className={styles.defaultButton}>
								更新接口
							</Button>
							<div className={styles.serviceTitle}>已选择接口: {formModel.title}</div>
						</div>
				  </div>
			  </Collapse>
		  </div>
		  <div className={styles.ct}>
			  <Collapse header='当开始请求'>
				  {fullScreenParamsEditor ? (
					  <div onClick={onParamsEditorFullscreenExit} className={parentCss['sidebar-panel-code-icon-full']}>
						  {fullScreenExit}
					  </div>
				  ) : (
					  <div onClick={onParamsEditorFullscreen} className={parentCss['sidebar-panel-code-icon']}>
						  {fullScreen}
					  </div>
				  )}
				  <Editor
					  onMounted={(editor, monaco, container: HTMLDivElement) => {
						  paramRef.current = container;
						  container.onclick = (e) => {
							  if (e.target === container) {
								  onParamsEditorFullscreenExit();
							  }
						  };
					  }}
					  env={{ isNode: false, isElectronRenderer: false }}
					  onChange={(code: string) => {
						  setFormModel(model => ({ ...model, input: encodeURIComponent(code) }));
					  }}
					  value={safeDecode(formModel.input)}
					  width="100%"
					  height="100%"
					  minHeight={300}
					  language="javascript"
					  theme="light"
					  lineNumbers="off"
					  /** @ts-ignore */
					  scrollbar={{ horizontalScrollbarSize: 2, verticalScrollbarSize: 2 }}
					  minimap={{ enabled: false }}
				  />
			  </Collapse>
		  </div>
		  <div className={styles.ct}>
			  <Collapse header='当返回响应'>
				  {fullScreenResultEditor ? (
					  <div onClick={onResultEditorFullscreenExit} className={parentCss['sidebar-panel-code-icon-full']}>
						  {fullScreen}
					  </div>
				  ) : (
					  <div onClick={onResultEditorFullscreen} className={parentCss['sidebar-panel-code-icon']}>
						  {fullScreen}
					  </div>
				  )}
				  <Editor
					  onMounted={(editor, monaco, container: HTMLDivElement) => {
						  resultRef.current = container;
						  container.onclick = (e) => {
							  if (e.target === container) {
								  onResultEditorFullscreenExit();
							  }
						  };
					  }}
					  env={{ isNode: false, isElectronRenderer: false }}
					  onChange={(code: string) => {
						  setFormModel(model => ({ ...model, output: encodeURIComponent(code) }));
					  }}
					  value={safeDecode(formModel.output)}
					  width="100%"
					  height="100%"
					  minHeight={300}
					  language="javascript"
					  theme="light"
					  lineNumbers="off"
					  /** @ts-ignore */
					  scrollbar={{ horizontalScrollbarSize: 2, verticalScrollbarSize: 2 }}
					  minimap={{ enabled: false }}
				  />
			  </Collapse>
		  </div>
		  <div className={styles.ct}>
			  <Collapse header='请求入参' defaultFold={false}>
				  <RequestInfo
					  pageInfo={formModel?.pageInfo}
					  onChange={(pageInfo) => {
						  setFormModel(model => ({ ...model, pageInfo }));
					  }}
				  />
			  </Collapse>
		  </div>
		  <div className={styles.ct}>
			  <Collapse header='接口调试' defaultFold={false}>
				  <ProtocolInfo
					  markList={MarkList}
					  sidebarContext={sidebarContext}
					  formModel={formModel}
					  validate={() => true}
				   	onChange={onChangeForProtocol}
				  />
			  </Collapse>
		  </div>
	  </>
	);
};

export default Select;
