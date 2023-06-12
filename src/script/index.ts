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
      const method = `__method__`;
      const path = `__path__`;

      try {
        const url = path;
        const newParams = method.startsWith('GET') ? { params, url, method } : { data: params, url, method };
        const options = __input__(newParams);
        options.url = (options.url || url).replace(/{(\w+)}/g, (match, key) => {
          const param = params[key] || '';
          Reflect.deleteProperty(options.params || {}, key);
          return param;
        });
        options.method = options.method || method;
	      __convert_page_info__(options);
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
		.replace('__path__', serviceItem.path?.trim())
	
	return encodeURIComponent(
    isTest || serviceItem.modelType === 'domain'
	    ? fetchString.replace('__convert_page_info__', '(() => {})')
	      .replace('__convert_response__', '(response => response)')
	    : fetchString
	      .replace('__convert_page_info__', serviceItem.pageInfo ? `((options) => {
	        const paramKey = '${serviceItem.method.startsWith('GET') ? 'params' : 'data'}';
	        const pageNum = options[paramKey].page ? options[paramKey].page.pageNum : undefined;
	        const pageSize = options[paramKey].page ? options[paramKey].page.pageSize : undefined;
	        delete options[paramKey].page;
	        delete options[paramKey].fields;
	        options[paramKey] = { ...options[paramKey], ...(options[paramKey].query || {}) };
	        delete options[paramKey].query;
	        
	        ${serviceItem.pageInfo.pageNumKey ? `options[paramKey].${serviceItem.pageInfo.pageNumKey} = pageNum;` : ''}
	        ${serviceItem.pageInfo.pageSizeKey ? `options[paramKey].${serviceItem.pageInfo.pageSizeKey} = pageSize;` : ''}
	      })` : `((options) => {
	        const paramKey = '${serviceItem.method.startsWith('GET') ? 'params' : 'data'}';
	        delete options[paramKey].page;
	        delete options[paramKey].fields;
	        options[paramKey] = { ...options[paramKey], ...(options[paramKey].query || {}) };
	        delete options[paramKey].query;
	      })`)
	      .replace('__convert_response__', serviceItem.markedKeymap ? `((response) => {
        const markedKeyMap = ${JSON.stringify(serviceItem.markedKeymap)};
        const newResponse = { code: 1, data: {} };
        
        for(let markedKey in markedKeyMap) {
          if (Array.isArray(markedKeyMap[markedKey]) && markedKeyMap[markedKey].length) {
            let keys = [...markedKeyMap[markedKey]];
			      let originResponse = response;
			      
			      while (keys.length && originResponse) {
			        const key = keys.shift();
			        originResponse = originResponse[key];
			      }
			      
			      if (keys.length || originResponse === undefined || originResponse === null || (markedKey === 'dataSource' && !Array.isArray(originResponse))) {
			        return { code: -1, msg: \`标记的数据（\${markedKeyMap[markedKey].join('.')}）返回不全\` };
			      }
						newResponse.data[markedKey] = originResponse;
					}
        }
        
        return newResponse;
      })` : `(response => response)`)
  );
}

export { getScript };
