import React from 'react';

import css from './index.less';

export default function Input({ label: title, labelStyle, require, contentStyle, children }: AnyType) {
	return (
		<div className={css.item}>
			<label style={labelStyle}>
				{require ? <i>*</i> : null}
				{title}
			</label>
			<div className={css.content} style={contentStyle}>
				{children}
			</div>
		</div>
	);
}
