import { isEmpty, cloneDeep } from '../utils/lodash';
import { FieldBizType } from '../constant';

export function getDecodeString(fn: string) {
	return decodeURIComponent(fn).replace(
		/export\s+default.*function.*\(/,
		'function _RT_('
	);
}

export function formatSchema(schema: AnyType) {
	if (!schema) return;
	if (schema.type === 'object') {
		Object.values(schema.properties).forEach((item) => {
			formatSchema(item);
		});
	} else if (schema.type === 'array') {
		if (isEmpty(schema.items)) {
			Object.defineProperty(schema, 'type', {
				writable: true,
				value: 'array',
			});
			Reflect.deleteProperty(schema, 'items');
		} else {
			if (schema.items.type === 'object') {
				Object.values(schema.items.properties).forEach((item) => {
					formatSchema(item);
				});
			}
			// TODO oneOf
		}
	} else if (schema.type === 'unknown') {
		Object.defineProperty(schema, 'type', {
			writable: true,
			value: 'string',
		});
	}
}

function setData(data, keys, val) {
	const len = keys.length;
	function dfs(res, index, val) {
		if (!res || index === len) {
			return res;
		}
		const key = keys[index];
		if (Array.isArray(res)) {
			return res.map((item, i) => {
				const curVal = val[i];
				let obj;
				if (curVal === void 0) {
					obj = {};
					val.push(obj);
				} else {
					obj = curVal;
				}
				return dfs(item, index, obj);
			});
		} else {
			if (index === len - 1) {
				val[key] = res[key];
				return res[key];
			}
			res = res[key];
			if (Array.isArray(res)) {
				val[key] = val[key] || [];
			} else {
				val[key] = val[key] || {};
			}
		}
		return dfs(res, index + 1, Array.isArray(val) ? val : val[key]);
	}
	return dfs(data, 0, val);
}

export function getDataByOutputKeys(data, outputKeys) {
	let outputData: AnyType = Array.isArray(data) ? [] : {};
	if (outputKeys === void 0 || outputKeys.length === 0) {
		outputData = data;
	} else {
		outputKeys.forEach((key: string) => {
			setData(data, key.split('.'), outputData);
		});
	}
	return outputData;
}

function del(data, keys) {
	const len = keys.length;
	function dfs(data, index) {
		if (!data || index === len) return;
		const key = keys[index];
		if (index === len - 1) {
			Reflect.deleteProperty(data, key);
		}
		if (Array.isArray(data)) {
			data.forEach(item => { dfs(item, index);});
		} else {
	    dfs(data[key], index + 1);
		}
	}
	dfs(data, 0);
}

export function getDataByExcludeKeys(data, excludeKeys) {
	if (!excludeKeys || excludeKeys.length === 0) {
		return data;
	}
	const res = cloneDeep(data);
	excludeKeys.forEach(keys => {
		del(res, keys.split('.'));
	});
	return res;
}

export function params2data(params: AnyType) {
	if (!params) return;
	let obj: AnyType = {};

	if (params.type === 'string') {
		return params.defaultValue || '';
	}
	if (params.type === 'number') {
		return +params.defaultValue;
	}

	if (params.children) {
		if (params.type === 'array') {
			obj = [];
		}
		params.children.forEach((child: AnyType) => {
			obj[child.name] = params2data(child);
		});
	}

	return obj;
}

export function uuid(len = 6) {
	const seed = 'abcdefhijkmnprstwxyz';
	const maxPos = seed.length;
	let rtn = '';
	for (let i = 0; i < len; i++) {
		rtn += seed.charAt(Math.floor(Math.random() * maxPos));
	}
	return 'u_' + rtn;
}

export function schema2data(schema: AnyType) {
	function getBasicData(schema: AnyType) {
		const { type } = schema;

		if (schema.default !== void 0 && schema.default !== '') {
			return schema.default;
		}

		if (type === 'string') {
			const { minLength = 0, maxLength = 8 } = schema;
			const min = +minLength;
			const max = +maxLength;
			const str = uuid(max).slice(
				max - Math.round(min + Math.random() * (max - min))
			);
			return str;
		} else {
			const { minimum = 0, maximum = 100 } = schema;
			const min = +minimum;
			const max = +maximum;
			return min + Math.round(Math.random() * (max - min));
		}
	}
	function uuid(len = 6) {
		const seed = 'abcdefhijkmnprstwxyz';
		const maxPos = seed.length;
		let rtn = '';
		for (let i = 0; i < len; i++) {
			rtn += seed.charAt(Math.floor(Math.random() * maxPos));
		}
		return rtn;
	}
	function mockSchemaData(schema: AnyType) {
		if (!schema) return;
		let obj: AnyType;
		const { type } = schema;
		if (type === 'string' || type === 'number') {
			return getBasicData(schema);
		}

		if (type === 'array') {
			obj = [];
			const { minItems = 1, maxItems = 5 } = schema;
			const len = minItems + Math.round(Math.random() * (maxItems - minItems));
			for (let i = 0; i < len; i++) {
				const value = schema2data(schema.items);
				if (value !== null && value !== void 0) {
					obj.push(value);
				}
			}
		}
		if (schema.type === 'object') {
			obj = {};
			Object.keys(schema.properties || {}).forEach((key) => {
				obj[key] = schema2data(schema.properties[key]);
			});
		}
		return obj;
	}
	return mockSchemaData(schema);
}

export function jsonToSchema(json: AnyType): AnyType {
	const schema = { type: void 0 };
	proItem({ schema, val: json });
	if (schema.type) {
		return schema;
	} else {
		return;
	}
}

function proItem({ schema, val, key, fromAry }: { schema: AnyType; val: AnyType; key?: string; fromAry?: AnyType[] }) {
	if (Array.isArray(val)) {
		const items = val.length ? {} : void 0 ;
		if (key) {
			schema[key] = {
				type: 'array',
				items
			};
			if (items) {
				schema[key].items = items;
			}
		} else {
			schema.type = 'array';
			if (items) {
				schema.items = items;
			}
		}

		proAry(items, val);
	} else {
		if (typeof val === 'object' && val) {
			let nSchema;
			if (fromAry) {
				schema.type = 'object';
				nSchema = schema.properties = {};
			}

			const properties = fromAry ? nSchema : {};

			if (!fromAry) {
				if (key) {
					schema[key] = {
						type: 'object',
						properties
					};
				} else {
					schema.type = 'object';
					schema.properties = properties;
				}
			}

			proObj(properties, val);
		} else {
			const type = val === null || val === void 0 ? 'unknown' : typeof val;
			if (key === void 0) {
				schema.type = type;
			} else {
				schema[key] = { type };
			}
		}
	}
}

function proObj(curSchema: AnyType, obj: AnyType) {
	Object.keys(obj).map((key) => {
		return proItem({ schema: curSchema, val: obj[key], key });
	});
}

function proAry(curSchema, ary) {
	if (!curSchema) return;
	
	const schemaList = [];
	if (ary.length > 0) {
	  ary.forEach(item => {
			const schema = JSON.parse(JSON.stringify(curSchema));
		  proItem({ schema, val: item, fromAry: true } as unknown as AnyType);
		  schemaList.push(schema);
	  });
	}
	mergeSchemaTypeBySchemaList(curSchema, schemaList.filter(Boolean));
}

const mergeSchemaTypeBySchemaList = (schema, schemaList) => {
	if (!schemaList) {
		return schema;
	}
	
	let curSchema = null;
	for (let index	= 0; index < schemaList.length; index++) {
		const item = schemaList[index];
		
		if (!item || !Object.keys(item).length) {
			continue;
		}
		
		if (!curSchema) {
			if (item.type !== 'unknown') {
				if (item.type === 'object' || item.type === 'array') {
					curSchema = item;
					Object.assign(schema, item);
				} else {
					delete schema.properties;
					Object.assign(schema, item);
					break;
				}
			} else {
				delete schema.properties;
				Object.assign(schema, item);
			}
		} else {
			if (schema.type === 'object' && item.type === 'object') {
				Object.keys(item.properties || {}).forEach((key) => {
					const property = schema.properties[key];
					
					if ((!property && item.properties[key]) || (property.type === 'unknown' && item.properties[key].type !== 'unknown')) {
						schema.properties[key] = item.properties[key];
					}
				});
			} else if (schema.type === 'array' && item.type === 'array') {
				if (!schema.items || !Object.keys(schema.items).length) {
					schema.items = item.items || {};
				}
			}
		}
	}
	
	if (schema.type === 'object') {
		Object.keys(schema.properties || {}).forEach((key) => {
			if (schema.properties?.[key]?.type === 'object') {
				mergeSchemaTypeBySchemaList(schema.properties[key], schemaList.filter(Boolean).map(item => item?.properties?.[key]));
			} else if (schema.properties?.[key]?.type === 'array') {
				if (!schema.properties?.[key]?.items) {
					schema.properties[key].items = {};
				}
				
				mergeSchemaTypeBySchemaList(schema.properties[key], schemaList.filter(Boolean).map(item => item?.properties?.[key]));
			}
		});
	} else if (schema.type === 'array') {
		if (!schema.items) {
			schema.items = {};
		}
		
		mergeSchemaTypeBySchemaList(schema.items, schemaList.filter(Boolean).map(item => item?.items || {}));
	}
};

export function safeDecode(code: string) {
	try {
		return decodeURIComponent(code);
	} catch (error) {
		return code;
	}
}

const getBizTypeBySchemaType = type => {
	switch (type) {
	case 'string': return 'string';
	case 'boolean': return 'boolean';
	case 'number': return 'number';
	case 'object': return 'relation';
	case 'array': return 'mapping';
	default: return 'string';
	}
};

const getDBTypeBySchemaType = type => {
	switch (type) {
	case 'string': return 'varchar';
	case 'boolean': return 'varchar';
	case 'number': return 'bigint';
	case 'object': return 'bigint';
	case 'array': return '';
	default: return '';
	}
};

export const getEntityBySchema = (schema, markedKey = []) => {
	let newSchema = schema;
	while (markedKey.length && newSchema) {
		newSchema = (newSchema.properties || newSchema.items?.properties)?.[markedKey.shift()];
	}
	
	if (markedKey.length || !newSchema || newSchema.type !== 'array' || newSchema.items?.type !== 'object') {
		return { fieldAry: [] };
	}
	
	const getEntityDesc = curSchema => {
		if (curSchema.type === 'object' || (curSchema.type === 'array' && curSchema.items?.type === 'object')) {
			return Object.keys((curSchema.type === 'object' ? curSchema.properties : curSchema.items.properties) || {}).map(key => {
				const item = curSchema.properties[key];
				const field: Record<string, AnyType> = {
					id: uuid(),
					name: key,
					bizType: getBizTypeBySchemaType(item.type),
					dbType: getDBTypeBySchemaType(item.type),
				};
				
				if (item.type === 'object') {
					field.mapping = {
						condition: '-1',
						type: 'primary',
						entity: {
							id: uuid(),
							fieldAry: getEntityDesc(item),
						}
					};
				} else if (item.type === 'array' && item.items?.type === 'object') {
					field.mapping = {
						condition: '-1',
						type: 'foreigner',
						entity: {
							id: uuid(),
							fieldAry: getEntityDesc(item.items),
						}
					};
				}
				return field;
			});
		} else {
			return [];
		}
	};
	
	return { fieldAry: getEntityDesc(newSchema.items) };
};

/** stringify JSON string，同时 catch 错误 */
export const safeStringify = (content: AnyType) => {
	try {
		return JSON.stringify(content);
	} catch {
		return '';
	}
};

const getSchemaTypeByFieldType = (field) => {
	switch (field.bizType) {
	case FieldBizType.ENUM:
		return 'string';
	case FieldBizType.DATETIME:
		return field.showFormat ? 'string' : 'number';
	case FieldBizType.STRING:
		return 'string';
	case FieldBizType.NUMBER:
		return 'number';
	case FieldBizType.JSON:
		return 'any';
	case FieldBizType.RELATION:
		return 'number';
	case FieldBizType.SYS_USER:
		return 'number';
	case FieldBizType.SYS_ROLE:
		return 'number';
	case FieldBizType.SYS_ROLE_RELATION:
		return 'number';
	}
};

export const getPageSchemaByEntity = entity => {
	const outputSchema = {
		type: 'object',
		properties: {
			code: { type: 'number' },
			data: {
				type: 'object',
				properties: {
					dataSource: { type: 'array', items: { type: 'object', properties: {} } },
					total: { type: 'number' },
					pageNum: { type: 'number' },
					pageSize: { type: 'number' }
				}
			},
			msg: { type: 'string' },
		},
	};

	entity?.fieldAry
		.filter(field => field.bizType !== 'mapping' && !field.isPrivate)
		.forEach(field => {
			outputSchema.properties.data.properties.dataSource.items.properties[field.name] = { type: getSchemaTypeByFieldType(field) };
		});

	return outputSchema;
};

export const getSchemaByEntity = entity => {
	const outputSchema = {
		type: 'object',
		properties: {
			code: { type: 'number' },
			data: { type: 'array', items: { type: 'object', properties: {} } },
			msg: { type: 'string' },
		},
	};

	entity?.fieldAry
		.filter(field => field.bizType !== 'mapping' && !field.isPrivate)
		.forEach(field => {
			outputSchema.properties.data.items.properties[field.name] = { type: getSchemaTypeByFieldType(field) };
		});

	return outputSchema;
};

export const getSchemaByMarkedMap = (resultSchema, markedKeymap) => {
	if (!resultSchema || !markedKeymap) {
		return { outputSchema: undefined, errorSchema: undefined };
	}
	const outputSchema = {
		type: 'object',
		properties: {
			code: { type: 'number' },
			data: { type: 'object', properties: {} },
			msg: { type: 'string' },
		}
	};
	const errorSchema = {
		type: 'object',
		properties: { code: { type: 'number' } }
	};

	Object.keys(markedKeymap)
		.filter(key => !!markedKeymap[key]?.path?.length)
		.forEach(key => {
			let originSchema = resultSchema;
			const keys = [...markedKeymap[key].path];

			while (keys.length && originSchema) {
				const key = keys.shift();
				originSchema = originSchema.properties?.[key] || originSchema.items?.properties?.[key];
			}

			/** 类型找不到 */
			if (keys.length || !originSchema) {
				return;
			}

			if (['dataSource', 'total', 'pageNum', 'pageSize'].includes(key)) {
				outputSchema.properties.data.properties[key] = originSchema;
			} else if (key === 'response') {
				outputSchema.properties.data = originSchema;
			} else if (key === 'error') {
				errorSchema.properties['msg'] = originSchema;
			}
		});

	return { outputSchema, errorSchema };
};