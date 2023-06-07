import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {formatSchema, getDataByExcludeKeys, getDataByOutputKeys, jsonToSchema, params2data} from '../../../../utils';
import {cloneDeep} from '../../../../utils/lodash';
import FormItem from '../../../../components/FormItem';
import ParamsEdit from '../../paramsEdit';
import Button from '../../../../components/Button';
import OutputSchemaMock from '../../outputSchemaMock';
import ReturnSchema from '../../returnSchema';
import ParamsType from '../../params';

interface ProtocolInfoProps {
	formModel: any;
	validate(): boolean;
	onChange(model: any): void;
}

const ProtocolInfo: FC<ProtocolInfoProps> = props => {
	const { formModel, validate, onChange } = props;
	const [schema, setSchema] = useState(formModel.resultSchema);
	const allDataRef = useRef<any>();
	const [errorInfo, setError] = useState('');
	const [edit, setEdit] = useState(false);
	const [context] = useState({formModel, editNowId: void 0});
	
	const onDebugClick = async () => {
		try {
			if (!validate()) return;
			const originParams = formModel.paramsList?.[0].data || [];
			const params = params2data(originParams);
			setError('');
			// const data = await sidebarContext.domainModel.test(
			//   {
			//     type: formModel.type || 'http',
			//     mode: 'test',
			//     id: formModel.id,
			//     script: getDecodeString(
			//       getScript({
			//         ...formModel,
			//         path: formModel.path.trim(),
			//         resultTransformDisabled: true,
			//       })
			//     ),
			//   },
			//   params
			// );
			const data = {
				"code": 1, "data": {
					"list": [{
						"id": 144,
						"type": "component",
						"scope_status": 1,
						"namespace": "your-team.pc-lib0.button",
						"version": "1.0.0",
						"creator_id": "lianglihao",
						"creator_name": "lianglihao",
						"create_time": 1685886043175,
						"update_time": 1685886043175,
						"updator_id": "lianglihao",
						"updator_name": "lianglihao",
						"icon": "",
						"preview_img": "",
						"title": "按钮",
						"description": "按钮",
						"status": 1,
						"meta": ""
					}, {
						"id": 141,
						"type": "component",
						"scope_status": 1,
						"namespace": "_cloud_component__371",
						"version": "1.0.1",
						"creator_id": "lianglihao@kuaishou.com",
						"creator_name": "lianglihao@kuaishou.com",
						"create_time": 1678448695963,
						"update_time": 1684324777864,
						"updator_id": "lianglihao@kuaishou.com",
						"updator_name": "lianglihao@kuaishou.com",
						"icon": "",
						"preview_img": "",
						"title": "配置和修改按钮名称",
						"description": "",
						"status": 1,
						"meta": ""
					}, {
						"id": 143,
						"type": "component",
						"scope_status": 1,
						"namespace": "_cloud_component__424101339770949",
						"version": "1.0.21",
						"creator_id": "24",
						"creator_name": "24",
						"create_time": 1681386613594,
						"update_time": 1681386613594,
						"updator_id": "24",
						"updator_name": "24",
						"icon": "",
						"preview_img": "",
						"title": "测试",
						"description": "",
						"status": 1,
						"meta": ""
					}, {
						"id": 142,
						"type": "component",
						"scope_status": 1,
						"namespace": "_cloud_component__376",
						"version": "1.0.0",
						"creator_id": "shangregister@163.com",
						"creator_name": "shangregister@163.com",
						"create_time": 1678676385253,
						"update_time": 1679837634934,
						"updator_id": "shangregister@163.com",
						"updator_name": "shangregister@163.com",
						"icon": "",
						"preview_img": "",
						"title": "ttt",
						"description": "",
						"status": 1,
						"meta": ""
					}, {
						"id": 140,
						"type": "component",
						"scope_status": 1,
						"namespace": "_cloud_component__368",
						"version": "1.0.0",
						"creator_id": "daixiaotian@kuaishou.com",
						"creator_name": "daixiaotian@kuaishou.com",
						"create_time": 1678448153762,
						"update_time": 1678448153762,
						"updator_id": "daixiaotian@kuaishou.com",
						"updator_name": "daixiaotian@kuaishou.com",
						"icon": "",
						"preview_img": "",
						"title": "改按钮名称",
						"description": "",
						"status": 1,
						"meta": ""
					}, {
						"id": 139,
						"type": "component",
						"scope_status": 1,
						"namespace": "_cloud_component__361",
						"version": "1.0.0",
						"creator_id": "lianglihao@kuaishou.com",
						"creator_name": "lianglihao@kuaishou.com",
						"create_time": 1678362043535,
						"update_time": 1678362206809,
						"updator_id": "lianglihao@kuaishou.com",
						"updator_name": "lianglihao@kuaishou.com",
						"icon": "",
						"preview_img": "",
						"title": "按钮2",
						"description": "",
						"status": 1,
						"meta": ""
					}, {
						"id": 138,
						"type": "component",
						"scope_status": 1,
						"namespace": "_cloud_component__360",
						"version": "1.0.0",
						"creator_id": "lianglihao@kuaishou.com",
						"creator_name": "lianglihao@kuaishou.com",
						"create_time": 1678359984004,
						"update_time": 1678359984004,
						"updator_id": "lianglihao@kuaishou.com",
						"updator_name": "lianglihao@kuaishou.com",
						"icon": "",
						"preview_img": "",
						"title": "kk",
						"description": "",
						"status": 1,
						"meta": ""
					}, {
						"id": 137,
						"type": "component",
						"scope_status": 1,
						"namespace": "_cloud_component__359",
						"version": "1.0.0",
						"creator_id": "lianglihao@kuaishou.com",
						"creator_name": "lianglihao@kuaishou.com",
						"create_time": 1678359960436,
						"update_time": 1678359960436,
						"updator_id": "lianglihao@kuaishou.com",
						"updator_name": "lianglihao@kuaishou.com",
						"icon": "",
						"preview_img": "",
						"title": "321",
						"description": "",
						"status": 1,
						"meta": ""
					}, {
						"id": 136,
						"type": "component",
						"scope_status": 1,
						"namespace": "_cloud_component__358",
						"version": "1.0.0",
						"creator_id": "lianglihao@kuaishou.com",
						"creator_name": "lianglihao@kuaishou.com",
						"create_time": 1678357902460,
						"update_time": 1678357902460,
						"updator_id": "lianglihao@kuaishou.com",
						"updator_name": "lianglihao@kuaishou.com",
						"icon": "",
						"preview_img": "",
						"title": "123",
						"description": "",
						"status": 1,
						"meta": ""
					}, {
						"id": 135,
						"type": "component",
						"scope_status": 1,
						"namespace": "_cloud_component__357",
						"version": "1.0.0",
						"creator_id": "lianglihao@kuaishou.com",
						"creator_name": "lianglihao@kuaishou.com",
						"create_time": 1678357833897,
						"update_time": 1678357833897,
						"updator_id": "lianglihao@kuaishou.com",
						"updator_name": "lianglihao@kuaishou.com",
						"icon": "",
						"preview_img": "",
						"title": "213",
						"description": "",
						"status": 1,
						"meta": ""
					}, {
						"id": 131,
						"type": "component",
						"scope_status": 1,
						"namespace": "akfjkajadfaaa",
						"version": "1.0.3",
						"creator_id": "stuzhaoxing@gmail.com",
						"creator_name": "stuzhaoxing@gmail.com",
						"create_time": 1671012378478,
						"update_time": 1671014283483,
						"updator_id": "stuzhaoxing@gmail.com",
						"updator_name": "stuzhaoxing@gmail.com",
						"icon": "",
						"preview_img": "",
						"title": "adfadf",
						"description": "",
						"status": 1,
						"meta": ""
					}, {
						"id": 130,
						"type": "component",
						"scope_status": 1,
						"namespace": "adfadfasfaadf",
						"version": "1.0.1",
						"creator_id": "stuzhaoxing@gmail.com",
						"creator_name": "stuzhaoxing@gmail.com",
						"create_time": 1670946646835,
						"update_time": 1670946646835,
						"updator_id": "stuzhaoxing@gmail.com",
						"updator_name": "stuzhaoxing@gmail.com",
						"icon": "",
						"preview_img": "",
						"title": "大发大发",
						"description": "",
						"status": 1,
						"meta": ""
					}, {
						"id": 129,
						"type": "component",
						"scope_status": 1,
						"namespace": "adfdfaadfdd",
						"version": "1.0.4",
						"creator_id": "stuzhaoxing@gmail.com",
						"creator_name": "stuzhaoxing@gmail.com",
						"create_time": 1670943340440,
						"update_time": 1670943340440,
						"updator_id": "stuzhaoxing@gmail.com",
						"updator_name": "stuzhaoxing@gmail.com",
						"icon": "",
						"preview_img": "",
						"title": "测试组件",
						"description": "",
						"status": 1,
						"meta": ""
					}, {
						"id": 128,
						"type": "component",
						"scope_status": 1,
						"namespace": "sdaasd",
						"version": "1.0.15",
						"creator_id": "15958651599@163.com",
						"creator_name": "15958651599@163.com",
						"create_time": 1670942940493,
						"update_time": 1670942940493,
						"updator_id": "15958651599@163.com",
						"updator_name": "15958651599@163.com",
						"icon": "",
						"preview_img": "",
						"title": "测试rendercom",
						"description": "",
						"status": 1,
						"meta": ""
					}, {
						"id": 126,
						"type": "component",
						"scope_status": 0,
						"namespace": "leonxxxxx",
						"version": "1.0.11",
						"creator_id": "15958651599@163.com",
						"creator_name": "15958651599@163.com",
						"create_time": 1669984885283,
						"update_time": 1670492448867,
						"updator_id": "15958651599@163.com",
						"updator_name": "15958651599@163.com",
						"icon": "",
						"preview_img": "",
						"title": "ssssss",
						"description": "",
						"status": 1,
						"meta": ""
					}, {
						"id": 127,
						"type": "component",
						"scope_status": 0,
						"namespace": "testtest1",
						"version": "1.0.1",
						"creator_id": "stuzhaoxing@gmail.com",
						"creator_name": "stuzhaoxing@gmail.com",
						"create_time": 1670381282065,
						"update_time": 1670381282065,
						"updator_id": "stuzhaoxing@gmail.com",
						"updator_name": "stuzhaoxing@gmail.com",
						"icon": "",
						"preview_img": "",
						"title": "测试云组件",
						"description": "",
						"status": 1,
						"meta": ""
					}, {
						"id": 123,
						"type": "component",
						"scope_status": 0,
						"namespace": "lb_test",
						"version": "1.0.3",
						"creator_id": "cocolbell@163.com",
						"creator_name": "cocolbell@163.com",
						"create_time": 1669982285597,
						"update_time": 1669985492321,
						"updator_id": "cocolbell@163.com",
						"updator_name": "cocolbell@163.com",
						"icon": "",
						"preview_img": "",
						"title": "测试组件",
						"description": "",
						"status": 1,
						"meta": ""
					}, {
						"id": 125,
						"type": "component",
						"scope_status": 0,
						"namespace": "leo-test-2",
						"version": "1.0.1",
						"creator_id": "liulei.leo306@gmail.com",
						"creator_name": "liulei.leo306@gmail.com",
						"create_time": 1669984640051,
						"update_time": 1669984640051,
						"updator_id": "liulei.leo306@gmail.com",
						"updator_name": "liulei.leo306@gmail.com",
						"icon": "",
						"preview_img": "",
						"title": "leo",
						"description": "",
						"status": 1,
						"meta": ""
					}, {
						"id": 124,
						"type": "component",
						"scope_status": 0,
						"namespace": "leonrx",
						"version": "1.0.5",
						"creator_id": "15958651599@163.com",
						"creator_name": "15958651599@163.com",
						"create_time": 1669984365681,
						"update_time": 1669984449977,
						"updator_id": "15958651599@163.com",
						"updator_name": "15958651599@163.com",
						"icon": "",
						"preview_img": "",
						"title": "正经云组件",
						"description": "",
						"status": 1,
						"meta": ""
					}, {
						"id": 120,
						"type": "component",
						"scope_status": 0,
						"namespace": "leo-test-1",
						"version": "1.0.5",
						"creator_id": "liulei.leo306@gmail.com",
						"creator_name": "liulei.leo306@gmail.com",
						"create_time": 1669978607314,
						"update_time": 1669982294165,
						"updator_id": "liulei.leo306@gmail.com",
						"updator_name": "liulei.leo306@gmail.com",
						"icon": "",
						"preview_img": "",
						"title": "leo-test",
						"description": "",
						"status": 1,
						"meta": ""
					}, {
						"id": 122,
						"type": "component",
						"scope_status": 0,
						"namespace": "zx1",
						"version": "1.0.1",
						"creator_id": "15958651599@163.com",
						"creator_name": "15958651599@163.com",
						"create_time": 1669981874635,
						"update_time": 1669981874635,
						"updator_id": "15958651599@163.com",
						"updator_name": "15958651599@163.com",
						"icon": "",
						"preview_img": "",
						"title": "99",
						"description": "",
						"status": 1,
						"meta": ""
					}, {
						"id": 115,
						"type": "component",
						"scope_status": 1,
						"namespace": "rxui-test123",
						"version": "1.0.14",
						"creator_id": "15958651599@163.com",
						"creator_name": "15958651599@163.com",
						"create_time": 1669888750356,
						"update_time": 1669980811294,
						"updator_id": "15958651599@163.com",
						"updator_name": "15958651599@163.com",
						"icon": "",
						"preview_img": "",
						"title": "test123",
						"description": "",
						"status": 1,
						"meta": ""
					}, {
						"id": 117,
						"type": "component",
						"scope_status": 0,
						"namespace": "1231",
						"version": "1.0.3",
						"creator_id": "stuzhaoxing@gmail.com",
						"creator_name": "stuzhaoxing@gmail.com",
						"create_time": 1669978238196,
						"update_time": 1669978268953,
						"updator_id": "stuzhaoxing@gmail.com",
						"updator_name": "stuzhaoxing@gmail.com",
						"icon": "",
						"preview_img": "",
						"title": "12313",
						"description": "",
						"status": 1,
						"meta": ""
					}], "total": 23
				}
			};
			allDataRef.current = data;
			let {outputKeys = [], excludeKeys = []} = formModel;
			const resultSchema = jsonToSchema(data);
			formModel.resultSchema = resultSchema;
			
			outputKeys = outputKeys
			.filter(Boolean)
			.map(key => key.split('.'))
			.filter(keys => {
				let schema = resultSchema.properties || resultSchema.items?.properties;
				
				for (let idx = 0; idx < keys.length; idx++) {
					const key = keys[idx];
					
					if (schema && schema[key]) {
						schema = schema[key].properties || schema[key].items?.properties;
					} else {
						return false;
					}
				}
				
				return true;
			})
			.map(keys => keys.join('.'));
			excludeKeys = excludeKeys
			.filter(Boolean)
			.map(key => key.split('.'))
			.filter(keys => {
				let schema = resultSchema.properties || resultSchema.items?.properties;
				
				for (let idx = 0; idx < keys.length; idx++) {
					const key = keys[idx];
					
					if (schema && schema[key]) {
						schema = schema[key].properties || schema[key].items?.properties;
					} else {
						return false;
					}
				}
				
				return true;
			})
			.map(keys => keys.join('.'));
			
			let outputData = getDataByExcludeKeys(getDataByOutputKeys(data, outputKeys), excludeKeys);
			let outputSchema = jsonToSchema(outputData);
			/** 当标记单项时，自动返回单项对应的值 */
			if (Array.isArray(outputKeys) && outputKeys.length && (outputKeys.length > 1 || !(outputKeys.length === 1 && outputKeys[0] === ''))) {
				try {
					let cascadeOutputKeys = [...outputKeys].map(key => key.split('.'));
					while (Object.prototype.toString.call(outputData) === '[object Object]' && cascadeOutputKeys.every(keys => !!keys.length) && Object.values(outputData).length === 1) {
						outputData = Object.values(outputData)[0];
						outputSchema = Object.values(outputSchema.properties)[0];
						cascadeOutputKeys.forEach(keys => keys.shift());
					}
				} catch {
				}
			}
			
			formatSchema(formModel.resultSchema);
			formatSchema(outputSchema);
			const inputSchema = jsonToSchema(params || {});
			formatSchema(inputSchema);
			formModel.outputKeys = outputKeys;
			formModel.excludeKeys = excludeKeys;
			formModel.outputSchema = outputSchema;
			formModel.inputSchema = inputSchema;
			setSchema({...formModel.resultSchema});
		} catch (error: any) {
			console.log(error);
			formModel.outputSchema = void 0;
			formModel.resultSchema = void 0;
			setError(error?.message || error);
		}
	};
	
	const onParamsChange = useCallback((params) => {
		if (params !== void 0) {
			const data = params2data(params || []);
			const inputSchema = jsonToSchema(data);
			formatSchema(inputSchema);
			onChange({ inputSchema, params });
		}
	}, [onChange]);
	
	const onKeysChange = useCallback((outputKeys = [], excludeKeys = []) => {
		const {resultSchema} = formModel;
		
		try {
			/** 当标记单项时，自动返回单项对应的值 */
			let autoExtra = false;
			
			let outputSchema: any = {};
			if (outputKeys.length === 0) {
				outputSchema = formModel.resultSchema;
			} else if (outputKeys.length === 1 && outputKeys[0] === '') {
				outputSchema = {type: 'any'};
			} else {
				outputSchema = resultSchema.type === 'array'
					? {
						type: 'array',
						items: (resultSchema.items?.type === 'object' ? {
							type: 'object',
							properties: {}
						} : (resultSchema.items?.type === 'array' ? {type: 'array', items: {}} : {type: resultSchema.items?.type}))
					}
					: {type: 'object', properties: {}};
				
				outputKeys.forEach((key: string) => {
					let subSchema = outputSchema.properties || outputSchema.items?.properties || outputSchema.items?.items;
					let subResultSchema = resultSchema.properties || resultSchema.items?.properties || resultSchema.items?.items;
					const keys = key.split('.');
					
					keys.forEach((field, index) => {
						if (!subSchema || !subResultSchema || !subResultSchema[field]) {
							return;
						}
						
						if (index === keys.length - 1) {
							subSchema[field] = {...subResultSchema[field]};
						} else {
							const {type} = subResultSchema[field];
							
							if (type === 'array') {
								subSchema[field] = subSchema[field] || {
									...subResultSchema[field],
									items: (subResultSchema[field].items.type === 'object' ? {
										type: 'object',
										properties: {}
									} : (subResultSchema[field].items.type === 'array' ? {
										type: 'array',
										items: {}
									} : {type: subResultSchema[field].items.type}))
								};
								subSchema = subSchema[field].items.properties;
								subResultSchema = subResultSchema[field].items.properties;
							} else if (type === 'object') {
								subSchema[field] = subSchema[field] || {...subResultSchema[field], properties: {}};
								subSchema = subSchema[field].properties;
								subResultSchema = subResultSchema[field].properties;
							} else {
								subSchema[field] = {...subResultSchema[field]};
								subSchema = subSchema[field].properties;
								subResultSchema = subResultSchema[field].properties;
							}
						}
					});
				});
				if (Object.keys(outputSchema.properties).length === 1) {
					autoExtra = true;
				}
			}
			
			excludeKeys = excludeKeys
			.map(key => key.split('.'))
			.filter(keys => {
				let schema = outputSchema.properties || outputSchema.items?.properties;
				
				for (let idx = 0; idx < keys.length; idx++) {
					const key = keys[idx];
					
					if (schema && schema[key]) {
						schema = schema[key].properties || schema[key].items?.properties;
					} else {
						return false;
					}
				}
				
				return true;
			})
			.map(keys => keys.join('.'));
			
			let newOutputSchema = cloneDeep(outputSchema);
			excludeKeys?.forEach((key: string) => {
				const keys = key.split('.');
				const len = keys.length;
				let schema = newOutputSchema;
				for (let i = 0; i < len - 1; i++) {
					schema = (schema.properties || schema.items.properties)[keys[i]];
				}
				try {
					Reflect.deleteProperty(
						schema.properties || schema.items.properties,
						keys[len - 1]
					);
				} catch (error) {
				}
			});
			
			try {
				const cloneData = cloneDeep(allDataRef.current);
				let outputData = getDataByOutputKeys(getDataByExcludeKeys(cloneData, excludeKeys), outputKeys);
				
				if (autoExtra) {
					try {
						let cascadeOutputKeys = outputKeys.map(key => key.split('.'));
						while (newOutputSchema.type === 'object' && cascadeOutputKeys.every(keys => !!keys.length) && Object.values(newOutputSchema.properties || {}).length === 1) {
							outputData = allDataRef.current ? Object.values(outputData)[0] : outputData;
							newOutputSchema = Object.values(newOutputSchema.properties)[0];
							cascadeOutputKeys.forEach(keys => keys.shift());
						}
					} catch (e) {
						console.log(e);
					}
				}
			} catch (error) {
			}
			
			formModel.outputKeys = outputKeys;
			formModel.excludeKeys = excludeKeys;
			formModel.outputSchema = newOutputSchema;
		} catch (error) {
			console.log(error);
		}
	}, []);
	
	const onOutputKeysChange = useCallback(
		(outputKeys) => {
			onKeysChange(outputKeys, formModel.excludeKeys);
		},
		[formModel]
	);
	
	const onExcludeKeysChange = useCallback(
		(excludeKeys) => {
			onKeysChange(formModel.outputKeys, excludeKeys);
		},
		[formModel]
	);
	
	const onMockSchemaChange = useCallback((schema) => {
		onChange({ resultSchema: schema });
	}, []);
	
	const editSchema = () => setEdit(true);
	const saveSchema = () => setEdit(false);
	return (
		<>
			<FormItem label='请求参数'>
				<ParamsEdit value={formModel.params || { type: 'root', name: 'root', children: [] }} onChange={onParamsChange}/>
			</FormItem>
			<FormItem>
				<ParamsType onDebugClick={onDebugClick} params={formModel.params} onChange={onParamsChange}/>
			</FormItem>
			{edit ? (
				<>
					<FormItem label='返回数据'>
						{formModel.resultSchema ? (
							<Button style={{margin: 0, marginBottom: 6}} onClick={saveSchema}>
								保存
							</Button>
						) : null}
						<OutputSchemaMock schema={formModel.resultSchema} ctx={context} onChange={onMockSchemaChange}/>
					</FormItem>
				</>
			) : (
				<>
					<FormItem label='返回数据'>
						{formModel.resultSchema ? (
							<Button style={{margin: 0, marginBottom: 6}} onClick={editSchema}>
								编辑
							</Button>
						) : null}
						<ReturnSchema
							outputKeys={formModel.outputKeys}
							excludeKeys={formModel.excludeKeys}
							onOutputKeysChange={onOutputKeysChange}
							onExcludeKeysChange={onExcludeKeysChange}
							schema={schema}
							error={errorInfo}
						/>
					</FormItem>
				</>
			)}
		</>
	);
	
};

export default ProtocolInfo;
