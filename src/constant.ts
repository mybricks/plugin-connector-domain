export const exampleParamsFunc = `export default function ({ params, data, headers, url, method }) {
  // 设置请求query、请求体、请求头
  return { params, data, headers, url, method };
 }
`;

export const exampleResultFunc = `export default function (result, { method, url, params, data, headers }) {
  return result;
}`;

export const exampleSQLParamsFunc = `export default function ({ params, data, headers, url, method }) {
  const domainInfo = {
    serviceId: '__serviceId__',
    fileId: '__fileId__'
  }
  // 设置请求query、请求体、请求头
  return { params, data: {
    params: {
      ...data
    },
    ...domainInfo,
  }, headers, url, method };
 }
`;

/** 领域服务的模板 */
export const exampleOpenSQLParamsFunc = `export default function ({ params, data, headers, url, method }) {
  const domainInfo = {
    serviceId: '__serviceId__',
    fileId: '__fileId__'
  }
  
  // 设置请求query、请求体、请求头
  return { params, data: {
    params: {
      ...data,
			action: '__action__'
    },
    ...domainInfo,
  }, headers, url, method };
 }
`;

export const NO_PANEL_VISIBLE = 0;
export const DOMAIN_PANEL_VISIBLE = 0b10000;
export const AGGREGATION_MODEL_VISIBLE = 0b100000;

export const MethodOpts = [
	{ title: 'GET', value: 'GET' },
	{ title: 'POST', value: 'POST' },
	{ title: 'PUT', value: 'PUT' },
	{ title: 'DELETE', value: 'DELETE' },
];


export const MarkList = [
	{ key: 'successStatus', title: '请求成功标识', description: '标识请求是否成功', needMarkValue: true },
	// { key: 'id', title: '数据主键', description: '标识数据项主键，将用于更新、删除等操作' },
	{ key: 'dataSource', title: '列表数据源', description: '标识数据列表数据源' },
	{ key: 'total', title: '数据源总数', description: '数据列表总条数' },
	{ key: 'pageNum', title: '分页索引', description: '数据分页索引值，即当前页码' },
	{ key: 'pageSize', title: '分页大小', description: '列表每页展示数据量大小，如每页10条' },
	{ key: 'error', title: '错误提示信息', description: '透传到领域模型 CRUD 组件中的错误信息' },
];
export const ResponseMarkList = [
	{ key: 'successStatus', title: '请求成功标识', description: '标识请求是否成功', needMarkValue: true },
	{ key: 'response', title: '数据响应值', description: '透传到领域模型 CRUD 组件中的值' },
	{ key: 'error', title: '错误提示信息', description: '透传到领域模型 CRUD 组件中的错误信息' },
];
export const MarkTypeLabel = {
	dataSource: '列表数据源',
	id: '数据主键',
	total: '数据源总数',
	pageNum: '分页索引',
	pageSize: '分页大小',
	successStatus: '请求成功标识',
	response: '数据响应值',
	error: '错误提示信息',
};
export const MarkTypes = {
	dataSource: ['array'],
	id: ['string', 'number'],
	total: ['number'],
	pageNum: ['number'],
	pageSize: ['number'],
	response: ['any'],
	successStatus: ['number', 'string', 'boolean'],
	error: ['any']
};

/** 字段类型 */
export enum FieldBizType {
  STRING = 'string',
  NUMBER = 'number',
  DATETIME = 'datetime',
  JSON = 'json',
  /** 枚举 */
  ENUM = 'enum',
  /** 外键，关联其他表 */
  RELATION = 'relation',
  /** 映射其他表 */
  MAPPING = 'mapping',
  /** 系统表 */
  SYS_USER = 'SYS_USER',
  SYS_ROLE = 'SYS_ROLE',
  SYS_ROLE_RELATION = 'SYS_ROLE_RELATION',
}

export const CDN = {
	prettier: {
		standalone: '/mfs/editor_assets/prettier/2.6.2/standalone.js',
		babel: '/mfs/editor_assets/prettier/2.6.2/parser-babel.js'
	},
	eslint: '/mfs/editor_assets/eslint/8.15.0/eslint.js',
	paths: {
		vs: '/mfs/editor_assets/monaco-editor/0.33.0/min/vs',
	},
	monacoLoader: '/mfs/editor_assets/monaco-editor/0.33.0/min/vs/loader.min.js'
};
