/**
 * 使用树形选择器完成字段映射
 */
import React, { useCallback, useEffect, useRef } from 'react';
import { remove } from '../../../icon';
import { uuid } from '../../../utils';

import css from './index.less';

export default function ParamsEdit({ value, onChange }: AnyType) {
	const valueRef = useRef(value);
	
	useEffect(() => {
		valueRef.current = value;
	}, [value]);
	const updateValue = useCallback(() => {
		onChange({ ...valueRef.current });
	}, []);

	const set = useCallback((item, key, val) => {
		if (item[key] === val) return;
		item[key] = val;
		if (key === 'type') {
			item['defaultValue'] = '';
			item.children = [];
		}
		updateValue();
	}, []);

	const removeItem = (item, parent) => {
		parent.children = parent.children.filter(({ name }) => name !== item.name);
		if (parent.type === 'array') {
			parent.children.forEach((child, index) => {
				child.name = `${index}`;
				child.defaultValue = parent.children[index].defaultValue;
			});
		}
		updateValue();
	};

	const addItem = (item, parent) => {
		const id = uuid();
		if (item && (item.type === 'object' || item.type === 'array')) {
			item.children = item.children || [];
			let name = `name${item.children.length + 1}`;
			if (item.type === 'array') {
				name = `${item.children.length}`;
			}
			item.children.push({ id, name, type: 'string' });
		} else {
			parent.children = parent.children || [];
			const name = `name${parent.children.length + 1}`;
			parent.children.push({ id, type: 'string', name });
		}
		updateValue();
	};

	const processAry = useCallback((item, depth) => {
		return item.children.map((child: AnyType) => {
			return processItem(child, item, depth);
		});
	}, []);

	const processItem = useCallback((item, parent, depth = -1) => {
		if (!item) return null;
		let jsx;
		if (item.type === 'root') {
			return <div className={css.list}>{processAry(item, depth + 1)}</div>;
		}
		if (item.children) {
			jsx = processAry(item, depth + 1);
		}

		const isArray = parent.type === 'array';

		const addAble =
      (depth === 0 &&
        parent.children?.[
        	Math.min(
        		parent.children.findLastIndex(
        			({ type }: AnyType) => type === 'string' || type === 'number'
        		),
        		parent.children.length - 1
        	)
        ]?.name === item.name) ||
      item.type === 'object' ||
      item.type === 'array';

		return (
			<div key={item.id} className={css.ct}>
				<div className={css.item}>
					<input
						style={{ width: 270 - depth * 20 }}
						type='text'
						value={isArray ? `[${item.name}]` : item.name}
						disabled={isArray}
						onChange={(e) => set(item, 'name', e.target.value)}
					/>
					<select
						className={css.column2}
						value={item.type}
						onChange={(e) => set(item, 'type', e.target.value)}
					>
						<option label={'字符'} value={'string'} />
						<option label={'数字'} value={'number'} />
						<option label={'布尔'} value={'boolean'} />
						<option label={'对象'} value={'object'} />
						<option label={'列表'} value={'array'} />
					</select>
					<input
						className={css.column3}
						type={'text'}
						disabled={item.type === 'object' || item.type === 'array'}
						value={item.defaultValue}
						onChange={(e) => set(item, 'defaultValue', e.target.value)}
					/>
					<div className={`${css.column4} ${css.flex}`}>
						<span
							className={`${css.iconRemove}`}
							onClick={() => removeItem(item, parent)}
						>
							{remove}
						</span>
						{addAble ? (
							<span
								className={css.iconAdder}
								onClick={() => addItem(item, parent)}
							>
                +
							</span>
						) : null}
					</div>
				</div>
				{jsx}
			</div>
		);
	}, []);

	const pushItemToRoot = useCallback(() => {
		valueRef.current.children.push({
			type: 'string',
			id: uuid(),
			name: `name${valueRef.current.children.length + 1}`
		});
		updateValue();
	}, []);

	return (
		<>
			<div>
				{
					value?.children?.length === 0 ? null: (
	          <>
	            <div className={css.header}>
	              <p className={css.column1}>字段名</p>
	              <p className={css.column2}>类型</p>
	              <p className={css.column3}>调试值</p>
	              <p className={css.column4}>操作</p>
	            </div>
	            <div className={css.content}>{processItem(value, value)}</div>
	          </>
	        )
				}
				{value?.children?.every(({ type }: AnyType) => type ==='object' || type === 'array')? (
					<span className={css.iconRootAdder} onClick={() => pushItemToRoot()}>
            +
					</span>
				) : null}
			</div>
		</>
	);
}
