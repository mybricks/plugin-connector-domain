import { plus } from '../../../icon'
import React from 'react';
import { AGGREGATION_MODEL_VISIBLE, DOMAIN_PANEL_VISIBLE } from '../../../constant';
import Dropdown from '../../../components/Dropdown';

import css from './index.less';

export default function ({ ctx, setRender, setPanelVisible, blurMap, panelVisible }: any) {
  const onAddClick = async (type = 'domain') => {
	  ctx.type = type;
	  ctx.activeId = void 0;
	  ctx.templateVisible = false;
	  switch (type) {
			/** 领域模型实体 */
		  case 'domain':
			  setPanelVisible(DOMAIN_PANEL_VISIBLE);
			  setRender(ctx);
			  break;
			/** 聚合接口为模型，支持在 CRUD 组件中使用 */
		  case 'aggregation-model':
			  setPanelVisible(AGGREGATION_MODEL_VISIBLE);
			  setRender(ctx);
			  break;
		  default:
			  setPanelVisible(DOMAIN_PANEL_VISIBLE);
			  setRender(ctx);
	  }
  };

  const renderAddActionList = () => {
		if (!ctx.addActions) {
			return null;
		}
		
	  if (ctx.addActions.length === 1) {
		  return (
			  <div className={css.icon} onClick={() => onAddClick(ctx.addActions[0].type)}>
				  {plus}
			  </div>
		  );
	  }
		
	  const menu = (
		  <div className={css.ct}>
			  {ctx.addActions.map(({ type, title }: any) => (
				  <div className={css.item} onClick={() => onAddClick(type)} key={type}>{title}</div>
			  ))}
		  </div>
	  );
	
	  return (
		  <Dropdown dropDownStyle={(panelVisible || !!document.querySelector('div[data-id=plugin-panel]')) ? { right: 0 } : undefined} onBlur={fn => blurMap['toolbar'] = fn} overlay={menu}>
			  <div className={css.icon}>
				  {plus}
			  </div>
		  </Dropdown>
	  );
  };

  return (
    <div className={css.toolbar}>
      <div className={css.search}>
        <input
          type="text"
          placeholder="请输入名称搜索模型"
          onChange={(e) => ctx.search(e.target.value)}
        />
      </div>
      {renderAddActionList()}
    </div>
  );
}
