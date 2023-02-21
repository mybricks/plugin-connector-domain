import React, { useState, useCallback, useEffect } from 'react';
import css from './index.less';
import { arror } from '../../icon';
export default function Collapse({ children, defaultFold = true, header, ...props }: any) {
  const [fold, setFold] = useState<boolean>(defaultFold);

  const onHeaderClick = useCallback(() => {
    setFold((fold) => !fold);
  }, []);

  return (
    <div className={css.ct} {...props}>
      <div className={`${css.header}`} onClick={onHeaderClick}>
        <div className={`${css.icon} ${fold ? css.fold : ''}`}>{arror}</div>
        {header}
      </div>
      {fold ? null : children}
    </div>
  );
}
