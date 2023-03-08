import css from './index.less';
import { plus } from '../../../icon'
import React, { useCallback } from 'react';
import {
  KDEV_PANEL_VISIBLE,
  TG_PANEL_VISIBLE,
  SQL_PANEL_VISIBLE
} from '../../../constant';
export default function ({ ctx, setRender }: any) {
  const onAddClick = async (type = 'http') => {
	  ctx.type = type;
	  ctx.activeId = void 0;
	  ctx.isEdit = false;
	  ctx.templateVisible = false;
	  ctx.formModel = { type };
	  switch (type) {
		  case 'http-kdev':
			  ctx.panelVisible = KDEV_PANEL_VISIBLE;
			  setRender(ctx);
			  break;
		
		  case 'http-tg':
			  ctx.panelVisible = TG_PANEL_VISIBLE;
			  setRender(ctx);
			  break;
		
		  case 'sql':
			  ctx.panelVisible = SQL_PANEL_VISIBLE;
			  setRender(ctx);
			  break;
		
		  default:
			  setRender(ctx);
			  ctx.addDefaultService();
	  }
  };

  const renderAddActionList = useCallback(() => {
    return (
      <div className={css.icon} onClick={() => onAddClick('sql')}>
        {plus}
      </div>
    );
  }, [onAddClick]);

  return (
    <div className={css.toolbar}>
      <div className={css.search}>
        <input
          type={'text'}
          placeholder={'请输入名称搜索服务接口'}
          onChange={(e) => ctx.search(e.target.value)}
        />
      </div>
      {renderAddActionList()}
    </div>
  );
}
