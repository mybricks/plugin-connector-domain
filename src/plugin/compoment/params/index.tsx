/**
 * 使用树形选择器完成字段映射
 */

import React, { FC, useCallback } from 'react';
import Button from '../../../components/Button';

import css from './index.less';

interface ParamsTypeProps {
	onDebugClick(): void;
	params: AnyType;
	onChange(value: AnyType): void;
}

const ParamsType: FC<ParamsTypeProps> = props => {
	const { onDebugClick, params, onChange } = props;
	const set = useCallback((item, key, val) => {
		item[key] = val;
		onChange({ ...params });
	}, [params]);
	
	const processItem = useCallback((item, parent, depth = -1) => {
		if (!item) return null;
		if (item.type === 'root' && !item.children) return null;
		let jsx;
		if (item.type === 'root') {
			item.name = '';
		}
		if (item.children) {
			jsx = processAry(item, depth + 1);
		}
		
		const isArrayParent = parent.type === 'array';
		const isObject = item.type === 'object';
		const isRoot = item.type === 'root';
		const isArray = item.type === 'array';
		const hide = isObject || isRoot || isArray;
		
		return (
			<div className={css.ct} key={item.id || 'root'}>
				<div className={`${css.item} ${isRoot ? css.rootItem : ''}`}>
					<div style={{ padding: '0 10px 0 2px' }}>
						{isArrayParent ? `[${item.name}]` : item.name}
						<span className={css.typeName}>({getTypeName(item.type)})</span>
					</div>
					{hide ? null : (
						<input
							className={css.column}
							type={'text'}
							disabled={item.type === 'object' || item.type === 'array'}
							defaultValue={item.defaultValue}
							onChange={(e) => set(item, 'defaultValue', e.target.value)}
						/>
					)}
				</div>
				{jsx}
			</div>
		);
	}, [params]);
	
	const processAry = useCallback((item, depth) => {
		return item.children.map((child: AnyType) => {
			return processItem(child, item, depth);
		});
	}, [params]);
	
	return (
		<div className={css.debug}>
			<div className={css.content}>
				{
					params?.children?.length
						? processItem({ type: 'root', ...params }, { type: 'root', ...params })
						: null
				}
			</div>
			<Button onClick={onDebugClick} type='primary' style={{ marginTop: 12 }}>
				连接测试
			</Button>
		</div>
	);
};

function getTypeName(v: string) {
	switch (v) {
	case 'number':
		return '数字';
	case 'string':
		return '字符';
	case 'boolean':
		return '布尔';
	case 'object':
	case 'root':
		return '对象';
	case 'array':
		return '列表';
	}
}

export default ParamsType;
