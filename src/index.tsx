import React from 'react';
import Plugin from './plugin';
import { icon } from './icon';
import data from './data';
// @ts-ignore
import pkg from '../package.json';

console.log(`%c ${pkg.name} %c@${pkg.version}`, 'color:#FFF;background:#fa6400', '', '');

export { call } from './runtime/callConnectorHttp';
export { mock } from './script/mock';

export default function pluginEntry(config?: AnyType) {
	return {
		name: '@mybricks/plugins/domain-service',
		title: '领域模型',
		description: '领域模型连接器',
		data,
		contributes: {
			sliderView: {
				tab: {
					title: '连接器',
					icon: icon,
					apiSet: ['domainModel'],
					render(args: AnyType) {
	          // @ts-ignore
						return <Plugin {...config} {...args} />;
					},
				},
			},
		},
	};
}

