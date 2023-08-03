/**
 * 使用树形选择器完成字段映射
 */

import React, {
	forwardRef,
	ForwardRefRenderFunction,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState
} from 'react';
import { remove } from '../../../icon';

import css from './index.less';

interface ParamsEditProps {
	schema: AnyType;
}

const ParamsEdit: ForwardRefRenderFunction<{ getSchema(): AnyType }, ParamsEditProps> = (props, ref) => {
	const { schema: defaultSchema } = props;
	const schemaRef = useRef(defaultSchema || { type: 'object', properties: {} });
	const [schema, setSchema] = useState(defaultSchema || { type: 'object', properties: {} });
	
	useEffect(() => {
		schemaRef.current = schema || { type: 'object', properties: {} };
		setSchema(schema || { type: 'object', properties: {} });
	}, [defaultSchema]);
	
	useImperativeHandle(ref, () => {
		return {
			getSchema: () => schemaRef.current
		};
	}, []);

	const set = useCallback((parent, itemKey, key, val) => {
	  const properties = parent.type === 'array' ? parent : parent.properties;
	  const item = properties[itemKey];
		
		if (key === 'name') {
			if (itemKey !== val) {
				properties[val] = properties[itemKey];
				delete properties[itemKey];
			}
		} else if (key === 'type') {
			if (!item || item.type !== val) {
				item.type = val;
				
				if (val === 'object') {
					item.properties = {};
					delete item.items;
				} else if (val === 'array') {
					item.items = {};
					delete item.properties;
				} else {
					delete item.properties;
					delete item.items;
				}
			}
		}
		
		setSchema({ ...schemaRef.current });
	}, []);

	const removeItem = (itemName, parent) => {
		if (parent.type === 'object') {
			delete parent.properties[itemName];
			setSchema({ ...schemaRef.current });
		}
	};

	const addItem = (item) => {
	  if (item.type === 'object') {
		  const name = `name${Object.keys(item.properties || {}).length + 1}`;
		  item.properties[name] = { title: name, type: 'string' };
		  setSchema({ ...schemaRef.current });
	  }
	};

	const processAry = useCallback((item, xPath: string[]) => {
		return processItem(item.items, item, [...xPath, 'items']);
	}, []);
	const processObject = useCallback((item, xPath: string[], showAdder) => {
		return Object.keys((item?.properties || {})).map((key: AnyType, index) => {
			return processItem(item?.properties?.[key], item, [...xPath, key], showAdder && !index);
		});
	}, []);

	const processItem = useCallback((item, parent, xPath: string[] = [], showAdder = false) => {
	  if (!xPath.length) {
	    return parent.type === 'object'? processObject(parent, xPath, true) : processAry(parent, xPath);
		}
	
	  if (!item) return null;
	  let jsx = null;
	
	  const isParentArray = parent.type === 'array';
		const itemName = xPath[xPath.length - 1];
		if (item.type === 'array') {
			jsx = processAry(item, xPath);
		} else if (item.type === 'object') {
			jsx = processObject(item, xPath);
		}
		const addAble = showAdder || (!isParentArray && item.type === 'object') || (isParentArray && itemName === 'items' && (item.type === 'object' || item.type === 'array'));
		const removeAble = !(isParentArray && itemName === 'items');
		
		return (
			<div key={item.id} className={css.ct}>
				<div className={css.item}>
					<input
						style={{ width: 331 - (xPath.length - 1) * 20 }}
						type='text'
						value={isParentArray && itemName !== 'items' ? `[${itemName}]` : itemName}
						disabled={isParentArray}
						onChange={(e) => set(parent, itemName, 'name', e.target.value)}
					/>
					<select
						className={css.type}
						value={item.type}
						onChange={(e) => set(parent, itemName, 'type', e.target.value)}
					>
						<option label="字符" value="string" />
						<option label="数字" value="number" />
						<option label="布尔" value="boolean" />
						<option label="对象" value="object" />
						<option label="列表" value="array" />
					</select>
					<div className={`${css.operate} ${css.flex}`}>
						{removeAble ? (
							<span className={`${css.iconRemove}`} onClick={() => removeItem(itemName, parent)}>
								{remove}
							</span>
						) : null}
						{addAble ? (
							<span className={css.iconAdder} onClick={() => addItem(showAdder ? parent : item)}>
                +
							</span>
						) : null}
					</div>
				</div>
				{jsx}
			</div>
		);
	}, []);
	
	return (
		<>
			{schema ? (
				<div>
					{!Object.keys(schema?.properties || schema.items.properties || {}).length ? (
						<div className={css.adder}>
							<span style={{ cursor: 'pointer' }} onClick={() => addItem(schema)}>
                +
							</span>
						</div>
					) : (
						<>
							<div className={css.header}>
								<p className={css.fieldName}>字段名</p>
								<p className={css.type}>类型</p>
								<p className={css.operate}>操作</p>
							</div>
							<div className={css.content}>
	              <div className={css.list}>
									{processItem(schema, schema)}
	              </div>
							</div>
						</>
					)}
				</div>
			) : (
				<div className={css.empty}>类型无效</div>
			)}
		</>
	);
};

export default forwardRef(ParamsEdit);
