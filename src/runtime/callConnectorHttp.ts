import axios from 'axios';
import { schema2data } from '../utils';
interface IOptions {
  method: string;
  url: string;
  data: any;
  params: any;
  headers: any;
  [key: string]: any;
}

interface IConfig {
  before: (options: IOptions) => any;
	action: 'SELECT' | 'DELETE' | 'UPDATE' | 'CREATE' | 'SEARCH_BY_FIELD';
}

const defaultFn = (options: IOptions, ...args: any) => ({
  ...options,
  ...args,
});

const httpRegExp = new RegExp('^(http|https)://');

export function call(
  domainModel: {
    id: string;
	  content: Record<string, any>;
    useProxy?: boolean;
    [key: string]: any
  },
  params: any,
  config?: IConfig
) {
  return new Promise((resolve, reject) => {
    try {
      const fn = eval(`(${decodeURIComponent(domainModel.mode === 'test' ? domainModel.script : domainModel.query[config.action.toLocaleUpperCase()].script)})`);
      const { before = defaultFn } = config || {};
      fn(
        params,
        { then: resolve, onError: reject },
        {
          ajax(options: IOptions) {
            const opts = before({ ...options });
            const { url } = opts;

            if (domainModel.useProxy && httpRegExp.test(url)) {
              return axios({url: '/paas/api/proxy', method: 'post', data: opts || options}).catch(error => {
                reject(error)
              })
            }

            return axios(opts || options).catch(error => {
              reject(error)
            })
          },
        }
      );
    } catch (ex) {
			console.error(ex);
      reject('连接器script错误.');
    }
  });
}

export function mock(
  connector: { id: string; script: string; [key: string]: any },
) {
  return new Promise((resolve, reject) => {
    if (connector.type === 'http' || connector.type === 'http-sql') {
      try {
        if (connector.outputSchema) {
          // use mock data
          return resolve(schema2data(connector.outputSchema))
        } else {
          reject(`当前接口不存在返回值schema，不支持Mock`)
        }
      } catch (ex) {
        reject(`connecotr mock error.`);
      }
    } else {
      reject(`error connecotr type`);
    }
  });
}
