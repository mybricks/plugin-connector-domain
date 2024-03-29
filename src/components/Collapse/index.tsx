import React, { useState, useCallback } from 'react';
import { arrow } from '../../icon';

import css from './index.less';

export default function Collapse({ children, defaultFold = true, header, headerStyle, contentStyle, ...props }: any) {
	const [fold, setFold] = useState<boolean>(defaultFold);

	const onHeaderClick = useCallback(() => {
		setFold((fold) => !fold);
	}, []);

	return (
		<div className={css.collapse} {...props}>
			<div className={`${css.header}`} style={headerStyle} onClick={onHeaderClick}>
				<div className={`${css.icon} ${fold ? css.fold : ''}`}>{arrow}</div>
				{header}
			</div>
	    {fold ? null : <div className={`${css.content}`} style={contentStyle}>{children}</div>}
		</div>
	);
}
