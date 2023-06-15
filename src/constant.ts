export const exampleParamsFunc = `export default function ({ params, data, headers, url, method }) {
  // 设置请求query、请求体、请求头
  return { params, data, headers, url, method };
 }
`;

export const exampleResultFunc = `export default function (result, { method, url, params, data, headers }) {
  // return {
  //  total: result.all,
  //  dataSource: result.list.map({id, name} => ({
  //     value:id, label: name
  //  }))
  // }
  return result;
}
`;

export const exampleSQLParamsFunc = `export default function ({ params, data, headers, url, method }) {
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

/** 领域服务的模板 */
export const exampleSelectOpenSQLParamsFunc = `export default function ({ params, data, headers, url, method }) {
  const domainInfo = {
    serviceId: '__serviceId__',
    fileId: '__fileId__'
  }
  const fields = (Array.isArray(data.fields) && data.fields.length ? data.fields : null) || __fields__;
  const query = data.keyword ? fields.reduce((pre, item) => {
    return { ...pre, [item.name]: { operator: 'LIKE', value: data.keyword } };
  }, {}) : undefined;
  
  // 设置请求query、请求体、请求头
  return { params, data: {
    params: {
			...data,
      query,
			fields,
			action: '__action__'
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
      query: data,
			action: '__action__'
    },
    ...domainInfo,
  }, headers, url, method };
 }
`;

export const templateResultFunc = `export default function ({ response, config }) {
  // if (response.code !== 0) {
  //    throw new Error(response.errMsg)
  // }
  return response
}
`;

export const SERVICE_TYPE = {
  HTTP: 'http',
  TG: 'http-tg',
  KDEV: 'http-kdev',
};

export const DEFAULT_SCHEMA = {
  type: 'object',
  required: [],
  properties: {
    code: {
      type: 'number',
    },
    message: {
      type: 'string',
    },
    data: {
      type: 'object',
      properties: {
        list: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              label: {
                type: 'string',
              },
              value: {
                type: 'number',
              },
            },
          },
        },
      },
    },
  },
};
export const NO_PANEL_VISIBLE = 0;
export const DEFAULT_PANEL_VISIBLE = 0b01;
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
];
export const ResponseMarkList = [
	{ key: 'successStatus', title: '请求成功标识', description: '标识请求是否成功', needMarkValue: true },
	{ key: 'response', title: '数据响应值', description: '透传到领域模型 CRUD 组件中的值' },
];
export const MarkTypeLabel = {
	dataSource: '列表数据源',
	id: '数据主键',
	total: '数据源总数',
	pageNum: '分页索引',
	pageSize: '分页大小',
	successStatus: '请求成功标识',
	response: '数据响应值'
};
export const MarkTypes = {
	dataSource: ['array'],
	id: ['string', 'number'],
	total: ['number'],
	pageNum: ['number'],
	pageSize: ['number'],
	response: ['any'],
	successStatus: ['number', 'string', 'boolean']
};
