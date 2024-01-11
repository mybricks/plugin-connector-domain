import axios from 'axios';

interface IOptions {
  method: string;
  url: string;
  data: AnyType;
  params: AnyType;
  headers: AnyType;
  [key: string]: AnyType;
}

interface IConfig {
  before: (options: IOptions) => AnyType;
	action: 'SELECT' | 'DELETE' | 'UPDATE' | 'CREATE' | 'SEARCH_BY_FIELD';
}

const defaultFn = (options: IOptions, ...args: AnyType) => ({
	...options,
	...args,
});

const httpRegExp = new RegExp('^(http|https)://');

export function call(
	domainModel: {
    id: string;
	  content: Record<string, AnyType>;
    useProxy?: boolean;
    [key: string]: AnyType
  },
	params: AnyType,
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

						if (domainModel.useProxy && httpRegExp.test(url) && url.match(/^https?:\/\/([^/#&?])+/g)?.[0] !== location.origin) {
							return axios({
								...opts,
								url: '/paas/api/proxy',
								headers: { ...(opts.headers || {}), ['x-target-url']: opts.url },
								data: opts.data
							})
								.catch(error => reject(error.response.data?.message || error));
						}

						return axios(opts || options).catch(error => reject(error.response.data?.message || error));
					},
				}
			);
		} catch (ex) {
			console.error(ex);
			reject('连接器script错误.');
		}
	});
}

