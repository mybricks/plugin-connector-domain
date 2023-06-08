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
			const data = await sidebarContext.domainModel.test(
			  {
			    type: 'aggregation-model',
			    mode: 'test',
			    id: formModel.id,
			    script: getDecodeString(
			      getScript({
			        ...formModel,
			        path: formModel.path?.trim(),
			        resultTransformDisabled: true,
			      }, true)
			    ),
			  },
			  params
			);
			
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
				{/* TODO: Debug 后校验标记值是否正确 */}
				<ParamsType onDebugClick={onDebugClick} params={formModel.params} onChange={onParamsChange}/>
			</FormItem>
			{edit ? (
				<>
					<FormItem label='返回数据'>
						{formModel.outputSchema ? (
							<Button style={{margin: 0, marginBottom: 6}} onClick={saveSchema}>
								保存
							</Button>
						) : null}
						{/* TODO: 编辑类型后校验标记值是否正确 */}
						<OutputSchemaMock schema={formModel.outputSchema} ctx={context} onChange={onMockSchemaChange}/>
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
							setMarkedKeymap={markedKeymap => onChange({ markedKeymap })}
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
