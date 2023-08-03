import React, { useEffect, useState } from 'react';

import css from './index.less';

export default function RadioBtns({ options, binding, onChange }: AnyType) {
	const [from, key] = binding;
	const [select, setSelect] = useState(from[key]);
  
	useEffect(() => {
		setSelect(from[key]);
	}, [from[key]]);

	return (
		<div className={css.edt}>
			{options.map((opt) => {
				return (
					<div
						key={opt.value}
						className={`${css.opt} ${
							opt.value === select ? css.selected : ''
						}`}
						onClick={() => {
							from[key] = opt.value;
							setSelect(opt.value);
							onChange?.(opt.value);
						}}
					>
						{opt.title}
					</div>
				);
			})}
		</div>
	);
}
