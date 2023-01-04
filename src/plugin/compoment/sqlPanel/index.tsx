import React, { useCallback, useState } from 'react';
import ReactDOM from 'react-dom';
import css from '../../../../src/style-cssModules.less';
import Button from '../../../components/Button';
import curCss from './index.less';
import { SQL_PANEL_VISIBLE } from '../../../constant';
import Collapse from '../../../components/Collapse';
import { chose } from '../../../icon';

export default function GlobalPanel({
  sidebarContext,
  onSaveSQl,
  style,
  data,
}: any) {
  const [sqlList, setSQList] = useState([]);
  const onItemClick = useCallback((item) => {
    if (data.connectors.some(({ id }) => item.serviceId === id)) return;
    setSQList((sql) => {
      if (sql.some(({ serviceId }) => item.serviceId === serviceId)) {
        sql = sql.filter(({ serviceId }) => serviceId !== item.serviceId);
      } else {
        sql.push(item);
      }
      return [...sql];
    });
  }, []);

  return ReactDOM.createPortal(
    sidebarContext.panelVisible & SQL_PANEL_VISIBLE ? (
      <div
        style={{
          left: 361,
          ...style,
        }}
        className={`${css['sidebar-panel-edit']}`}
      >
        <div className={css['sidebar-panel-title']}>
          <div>接口选择</div>
          <div>
            <div className={css['actions']}>
              <Button size='small' onClick={() => onSaveSQl(sqlList)}>
                保 存
              </Button>
            </div>
          </div>
        </div>
        <div className={curCss.ct}>
          {sidebarContext.sqlList.map((sql) => (
            <Collapse header={sql.fileName} defaultFold={false}>
              {sql.serviceList.map((item) => (
                <div
                  key={item.serviceId}
                  className={
                    sqlList.some(
                      ({ serviceId }) => item.serviceId === serviceId
                    ) || data.connectors.some(({ id }) => item.serviceId === id)
                      ? curCss.chosed
                      : curCss.item
                  }
                  onClick={() => onItemClick({ ...item, fileId: sql.fileId })}
                >
                  <div className={curCss.left}>{item.title}</div>
                  <div className={curCss.right}>{chose}</div>
                </div>
              ))}
            </Collapse>
          ))}
        </div>
      </div>
    ) : null,
    document.body
  );
}
