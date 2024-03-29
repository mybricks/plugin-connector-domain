import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import Editor from '@mybricks/code-editor';
import Collapse from '../../../../components/Collapse';
import RadioButton from '../../../../components/RadioBtn';
import { fullScreen, fullScreenExit } from '../../../../icon';
import { getEntityBySchema, getSchemaByMarkedMap, safeDecode, uuid } from '../../../../utils';
import FormItem from '../../../../components/FormItem';
import Input, { TextArea } from '../../../../components/Input';
import { CDN, MarkList, MethodOpts } from '../../../../constant';
import RequestInfo from '../request-info';
import ProtocolInfo from '../protocol-info';

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
	const [errorMap, setErrorMap] = useState<Record<string, string>>({});
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

			/** 兼容 resultSchema 不存在的情况 */
			if (!formModel?.resultSchema && formModel?.outputSchema) {
				formModel.resultSchema = formModel.outputSchema;
				onChange(formModel);
			}
			return;
		}
		onChange(formModel);
	}, [formModel]);
	
	return (
	  <>
		  <div className={styles.ct}>
			  <Collapse header='基本信息' defaultFold={false}>
				  <div className={styles.item}>
					  <label>名称</label>
					  <div className={`${styles.editor} ${styles.textEdt}`}>
						  <input
							  type="text"
							  placeholder={'服务接口的标题'}
							  defaultValue={formModel.title}
							  onChange={(e) => {
								  setFormModel(model => ({ ...model, title: e.target.value }));
							  }}
						  />
					  </div>
				  </div>
				  <div className={styles.item}>
					  <label>
						  <i>*</i>地址
					  </label>
					  <div
						  className={`${styles.editor} ${styles.textEdt} ${errorMap.path ? styles.error : ''}`}
						  data-err={errorMap.path}
					  >
							<textarea
								defaultValue={formModel.path}
								placeholder="接口的请求路径"
								onChange={(e) => {
									setFormModel(model => ({ ...model, path: e.target.value }));

									if (e.target.value) {
										setErrorMap(error => ({ ...error, path: '' }));
									}
								}}
							/>
					  </div>
				  </div>
				  <div></div>
				  <div className={styles.item}>
					  <label>
						  <i>*</i>请求方法
					  </label>
					  <div className={styles.editor}>
						  <RadioButton
							  binding={[formModel, 'method']}
							  options={MethodOpts}
							  onChange={(value) => setFormModel(model => ({ ...model, method: value }))}
						  />
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
					  CDN={CDN}
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
					  CDN={CDN}
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
			  <Collapse header='其他信息'>
				  <FormItem label='接口描述'>
					  <Input
						  defaultValue={formModel.desc}
						  onBlur={(e) => {
							  setFormModel(model => ({ ...model, desc: e.target.value }));
						  }}
					  />
				  </FormItem>
				  <FormItem label='文档链接'>
					  <TextArea
						  style={{ height: 80 }}
						  onBlur={(e) => {
							  setFormModel(model => ({ ...model, doc: e.target.value }));
						  }}
						  defaultValue={formModel.doc}
					  />
				  </FormItem>
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
					  validate={() => {
						  if (!formModel.path) {
							  setErrorMap(error => ({ ...error, path: '请填写完整的地址' }));
							  return false;
						  }
						
						  return true;
					  }}
				   onChange={onChangeForProtocol}
				  />
			  </Collapse>
		  </div>
	  </>
	);
};

export default Select;
