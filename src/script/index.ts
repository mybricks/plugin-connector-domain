// @ts-nocheck

import { exampleParamsFunc } from '../constant';

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
    function del(data, keys) {
      const len = keys.length;
      function dfs(data, index) {
        if (!data || index === len) return;
        const key = keys[index];
        if (index === len - 1) {
          Reflect.deleteProperty(data, key);
        }
        if (Array.isArray(data)) {
          data.forEach((item) => {
            dfs(item, index);
          });
        } else {
          dfs(data[key], index + 1);
        }
      }
      dfs(data, 0);
    }
    function serviceAgent(params, config) {
      const method = `__method__`;
      const path = `__path__`;
      const outputKeys = __outputKeys__;
      const excludeKeys = __excludeKeys__;

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
		.replace('__outputKeys__', JSON.stringify(serviceItem.outputKeys))
		.replace('__excludeKeys__', JSON.stringify(serviceItem.excludeKeys || []));
	
	return encodeURIComponent(
    isTest || modelType === 'domain'
	    ? fetchString.replace('__convert_page_info__', '(() => {})')
	      .replace('__convert_response__', '(response => response)')
	    : fetchString
	      .replace('__convert_page_info__', serviceItem.pageInfo ? `((options) => {
	        const pageNum = options.params.page ? options.params.page.pageNum : undefined;
	        const pageSize = options.params.page ? options.params.page.pageSize : undefined;
	        delete options.params.page;
	        ${serviceItem.pageInfo.pageNumKey ? `options[method.startsWith('GET') ? 'params' : 'data'].${serviceItem.pageInfo.pageNumKey} = pageNum;` : ''}
	        ${serviceItem.pageInfo.pageSizeKey ? `options[method.startsWith('GET') ? 'params' : 'data'].${serviceItem.pageInfo.pageSizeKey} = pageSize;` : ''}
	      })` : `((options) => { delete options.params.page; })`)
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
			      
			      if (keys.length || !originResponse) {
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
