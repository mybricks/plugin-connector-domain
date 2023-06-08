import React, {FC, useCallback, useRef, useState} from 'react';
import {formatSchema, getDecodeString, jsonToSchema, params2data} from '../../../../utils';
import FormItem from '../../../../components/FormItem';
import ParamsEdit from '../../paramsEdit';
import Button from '../../../../components/Button';
import OutputSchemaEdit from '../../outputSchemaEdit';
import ReturnSchema, {MarkTypeLabel} from '../../returnSchema';
import ParamsType from '../../params';
import {getScript} from '../../../../script';
import {notice} from '../../../../components/Message';

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
	const outputSchemaEditRef = useRef(null);
	
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
			    script: getDecodeString(getScript({ ...formModel, path: formModel.path?.trim(),}, true)),
			  },
			  params
			);
			
			const outputSchema = jsonToSchema(data);
			formatSchema(outputSchema);
			
			const markedKeymap = formModel.markedKeymap;
			const willResetMarkedTypes = [];
			const needCheckMarkedKeys = Object.keys(markedKeymap || {}).filter(key => !!markedKeymap[key]?.length);
			for (let i = 0; i < needCheckMarkedKeys.length; i++) {
				const type = needCheckMarkedKeys[i];
				const keys = [...markedKeymap[type]];
				const targetSchemaType = type === 'dataSource' ? 'array' : 'number';
				let originSchema = outputSchema;
				
				while (keys.length && originSchema) {
					const key = keys.shift();
					originSchema = originSchema.properties?.[key] || originSchema.items?.properties?.[key];
				}
				
				if (originSchema.type !== targetSchemaType || keys.length) {
					willResetMarkedTypes.push(MarkTypeLabel[type]);
					markedKeymap[type] = [];
				}
			}
			
			if (willResetMarkedTypes.length) {
				notice(`【${willResetMarkedTypes.join('、')}】标识数据类型错误，已被重置`, { type: 'warning' });
			}
			
			onChange({ outputSchema, markedKeymap });
		} catch (error: any) {
			console.log(error);
			onChange({ outputSchema: undefined, markedKeymap: undefined });
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
	
	const editSchema = useCallback(() => setEdit(true), []);
	const saveSchema = useCallback(() => {
		setEdit(false);
		const outputSchema = outputSchemaEditRef.current?.getSchema?.();
		
		const markedKeymap = formModel.markedKeymap;
		const willResetMarkedTypes = [];
		const needCheckMarkedKeys = Object.keys(markedKeymap || {}).filter(key => !!markedKeymap[key]?.length);
		for (let i = 0; i < needCheckMarkedKeys.length; i++) {
			const type = needCheckMarkedKeys[i];
			const keys = [...markedKeymap[type]];
			const targetSchemaType = type === 'dataSource' ? 'array' : 'number';
			let originSchema = outputSchema;
			
			while (keys.length && originSchema) {
				const key = keys.shift();
				originSchema = originSchema.properties?.[key] || originSchema.items?.properties?.[key];
			}
			
			if (originSchema.type !== targetSchemaType || keys.length) {
				willResetMarkedTypes.push(MarkTypeLabel[type]);
				markedKeymap[type] = [];
			}
		}
		
		if (willResetMarkedTypes.length) {
			notice(`【${willResetMarkedTypes.join('、')}】标识数据类型错误，已被重置`, { type: 'warning' });
		}
		
		onChange({ outputSchema, markedKeymap });
	}, [onChange]);
	
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
						{formModel.outputSchema ? (
							<Button style={{margin: 0, marginBottom: 6}} onClick={saveSchema}>
								保存
							</Button>
						) : null}
						<OutputSchemaEdit schema={formModel.outputSchema} ref={outputSchemaEditRef} />
					</FormItem>
				</>
			) : (
				<>
					<FormItem label='返回数据'>
						{formModel.outputSchema ? (
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
