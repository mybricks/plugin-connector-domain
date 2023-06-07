import React, {FC, useCallback, useState} from 'react';
import {formatSchema, getDecodeString, jsonToSchema, params2data} from '../../../../utils';
import FormItem from '../../../../components/FormItem';
import ParamsEdit from '../../paramsEdit';
import Button from '../../../../components/Button';
import OutputSchemaMock from '../../outputSchemaMock';
import ReturnSchema from '../../returnSchema';
import ParamsType from '../../params';
import {getScript} from "../../../../script";

interface ProtocolInfoProps {
	sidebarContext: any;
	formModel: any;
	validate(): boolean;
	onChange(model: any): void;
}

const ProtocolInfo: FC<ProtocolInfoProps> = props => {
	const { formModel, validate, onChange, sidebarContext } = props;
	const [errorInfo, setError] = useState('');
	const [edit, setEdit] = useState(false);
	const [context] = useState({formModel, editNowId: void 0});
	
	const onDebugClick = async () => {
		try {
			if (!validate()) return;
			const params = params2data(formModel.params);
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
			
			const outputSchema = jsonToSchema(data);
			formatSchema(outputSchema);
			onChange({ outputSchema });
		} catch (error: any) {
			console.log(error);
			onChange({ outputSchema: undefined });
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
	
	const onMockSchemaChange = useCallback((schema) => {
		onChange({ resultSchema: schema });
	}, []);
	
	const editSchema = useCallback(() => setEdit(false), []);
	const saveSchema = useCallback(() => setEdit(false), []);
	
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
							markedKeymap={formModel.markedKeymap}
							schema={formModel.outputSchema}
							error={errorInfo}
						/>
					</FormItem>
				</>
			)}
		</>
	);
	
};

export default ProtocolInfo;
