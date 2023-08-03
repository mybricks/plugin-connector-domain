// @ts-nocheck

function getDecodeString(fn: string) {
	return fn
		? decodeURIComponent(fn).replace(
			/export\s+default.*function.*\(/,
			'function _RT_('
		)
		: fn;
}

function getScript(serviceItem, isTest = false) {
	function fetch(params, { then, onError }, config) {
		function serviceAgent(params, config) {
			const method = '__method__';
			const path = '__path__';
			
			try {
				const url = path;
				__convert_page_info__(params);
				const newParams = method.startsWith('GET') ? { params, url, method } : { data: params, url, method };
				const options = __input__(newParams);
				options.url = (options.url || url).replace(/{(\w+)}/g, (match, key) => {
					const param = params[key] || '';
					Reflect.deleteProperty(options.params || {}, key);
					return param;
				});
				options.method = options.method || method;
				config
					.ajax(options)
					.then((response) => {
						return response.data;
					})
					.then((response) => {
						return __output__(response, Object.assign({}, options), {
							throwStatusCodeError: (data) => {
								onError(data);
							},
						});
					})
					.then((response) => {
						return __convert_response__(response);
					})
					.then(then)
					.catch((error) => {
						onError((error && error.message) || error);
					});
			} catch (error) {
				return onError(error);
			}
		}
		return serviceAgent(params, config);
	}
	
	let fetchString = fetch
		.toString()
		.replace('__input__', getDecodeString(serviceItem.input))
		.replace('__output__', getDecodeString(serviceItem.output))
		.replace('__method__', serviceItem.method)
		.replace('__path__', serviceItem.path?.trim());
	
	return encodeURIComponent(
		isTest || serviceItem.modelType === 'domain'
			? fetchString.replace('__convert_page_info__', '(() => {})')
				.replace('__convert_response__', '(response => response)')
			: fetchString
				.replace('__convert_page_info__', serviceItem.pageInfo ? `((params) => {
	        if (!params) { return; }
	        const pageNum = params.page ? params.page.pageNum : undefined;
	        const pageSize = params.page ? params.page.pageSize : undefined;
	        delete params.page;
	        delete params.fields;
	        Object.assign(params, params.query || {});
	        delete params.query;
	        delete params.orders;
	        
	        ${serviceItem.pageInfo.pageNumKey ? `params.${serviceItem.pageInfo.pageNumKey} = pageNum;` : ''}
	        ${serviceItem.pageInfo.pageSizeKey ? `params.${serviceItem.pageInfo.pageSizeKey} = pageSize;` : ''}
	      })` : `((params) => {
	        if (!params) { return; }
	        delete params.page;
	        delete params.fields;
	        Object.assign(params, params.query || {});
	        delete params.query;
	      })`)
				.replace('__convert_response__', serviceItem.markedKeymap ? `((response) => {
        const markedKeyMap = ${JSON.stringify(serviceItem.markedKeymap)};
        
        if (!markedKeyMap.successStatus || !Array.isArray(markedKeyMap.successStatus.path) || markedKeyMap.successStatus.value === undefined) {
          return { code: -1, msg: '未标记请求成功标识值' };
        }
        const newResponse = { code: 1, data: {} };
        
        for(let markedKey in markedKeyMap) {
          if (markedKeyMap[markedKey] && Array.isArray(markedKeyMap[markedKey].path) && markedKeyMap[markedKey].path.length) {
            let keys = markedKeyMap[markedKey].path;
			      let originResponse = response;
			      
			      while (keys.length && originResponse) {
			        const key = keys.shift();
			        originResponse = originResponse[key];
			      }
			      
			      if (markedKey === 'successStatus' && markedKeyMap[markedKey].value !== originResponse) {
			        newResponse.code = -1;
			        newResponse.msg = newResponse.msg || '接口请求失败';
			        continue;
			      } else if (keys.length || originResponse === undefined || originResponse === null || (markedKey === 'dataSource' && !Array.isArray(originResponse))) {
			        continue;
			      }
			      
			      if (markedKey === 'error') {
			      	newResponse.msg = originResponse;
			      } else if (markedKey !== 'successStatus') {
							newResponse.data[markedKey] = originResponse;
						}
					}
        }
        
        return newResponse;
      })` : '(response => response)')
	);
}

export { getScript };
