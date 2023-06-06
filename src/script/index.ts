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

function getScript(serviceItem) {
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
        config
          .ajax(options)
          .then((response) => {
            return  __output__(response, Object.assign({}, options), {
	            throwStatusCodeError: (data) => {
		            onError(data);
	            },
            });
          })
          .then((response) => {
            if (resultTransformDisabled) {
              return then(response);
            }
            if (excludeKeys.length === 0) {
              return response;
            }
            excludeKeys.forEach((key) => {
              const keys = key.split('.');
              del(response, keys);
            });
            return response;
          })
          .then((response) => {
	          let outputData: any = Array.isArray(response) ? [] : {};
            if (outputKeys === void 0 || outputKeys.length === 0) {
              outputData = response;
            } else {
              outputKeys.forEach((key) => {
                setData(response, key.split('.'), outputData)
              });
							
	            /** 当标记单项时，自动返回单项对应的值 */
	            if (Array.isArray(outputKeys) && outputKeys.length && (outputKeys.length > 1 || !(outputKeys.length === 1 && outputKeys[0] === ''))) {
		            try {
			            let cascadeOutputKeys = outputKeys.map(key => key.split('.'));
			            while (Object.prototype.toString.call(outputData) === '[object Object]' && cascadeOutputKeys.every(keys => !!keys.length) && Object.values(outputData).length === 1) {
				            outputData = Object.values(outputData)[0];
				            cascadeOutputKeys.forEach(keys => keys.shift());
			            }
		            } catch(e) {
									console.log('connector format data error', e);
		            }
	            }
            }
	
	          then(outputData);
          })
          .catch((error) => {
            onError((error && error.message) || error);
          });
      } catch (error) {
        return onError(error);
      }
    }
    return serviceAgent(params, config);
  }
	
  return encodeURIComponent(
    fetch
      .toString()
      .replace('__input__', getDecodeString(serviceItem.input))
      .replace('__output__', getDecodeString(serviceItem.output))
      .replace('__method__', serviceItem.method)
      .replace('__path__', serviceItem.path.trim())
      .replace('__outputKeys__', JSON.stringify(serviceItem.outputKeys))
      .replace('__excludeKeys__', JSON.stringify(serviceItem.excludeKeys || []))
  );
}

export { getScript };
