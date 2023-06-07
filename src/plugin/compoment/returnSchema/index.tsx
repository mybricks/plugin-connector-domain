import React, {FC, useEffect, useRef, useState} from 'react';
import { useCallback } from 'react';
import { isEmpty } from '../../../utils/lodash';

import css from './index.less';

const emptyAry: any[] = [];

interface ReturnSchemaProps {
	markedKeymap: Record<string, string[]>;
	schema: any;
	error: string;
	setMarkedKeymap(keymap: Record<string, string[]>): void;
}

const MarkTypeLabel = {
	dataSource: '列表数据源',
	total: '数据源总数',
	pageNum: '分页索引',
	pageSize: '分页大小'
};
const ReturnSchema: FC<ReturnSchemaProps> = props => {
	const { markedKeymap, schema, error, setMarkedKeymap } = props;
  const parentEleRef = useRef<HTMLDivElement>(null);
  const curKeyRef = useRef('');
  const [popMenuStyle, setStyle] = useState<any>();

  const markAsReturn = useCallback((type: string) => {
	  setMarkedKeymap({ ...(markedKeymap || {}), [type]: curKeyRef.current?.split('.') || [] })
  }, [markedKeymap, setMarkedKeymap]);

  function proAry(items, xpath) {
    if (!items) return null;
    return proItem({ val: items, xpath });
  }

  function proObj(properties, xpath) {
    if (!properties) return null;
    return (
      <>
        {Object.keys(properties).map((key) => {
          const nXpath =
            xpath !== void 0 ? (xpath ? `${xpath}.${key}` : key) : void 0;
          return proItem({ val: properties[key], xpath: nXpath, key });
        })}
      </>
    );
  }

  function proItem({ val, key, xpath, root }: { val; key?; xpath?; root? }) {
    let jsx;
    if (val.type === 'array') {
      jsx = proAry(val.items, xpath);
    } else {
      if (val.type === 'object') {
        jsx = proObj(val.properties, xpath);
      }
    }
	
		const markType = Object.keys(markedKeymap || {}).find(key => markedKeymap[key]?.join('.') === xpath);
		/** key !== void 0 代表中间层，如列表里的对象，对象这个层级没有名称，但需要展示 */
	  const markedAsReturn = !!markType && key !== void 0;
    const showMark = xpath !== void 0 && key !== void 0 && !markedAsReturn;
    const showCancel = key !== void 0 && xpath !== void 0 && markedAsReturn && !root;

    return (
      <div
        key={key}
        className={`${css.item} ${root ? css.rootItem : ''} ${
	        markedAsReturn ? css.markAsReturn : ''
        }`}
      >
        <div className={css.keyName}>
	        {markedAsReturn ? <div className={css.marked} data-text={MarkTypeLabel[markType]}></div> : null}
          {key}
          <span className={css.typeName}>({getTypeName(val.type)})</span>
          {showMark ? (
            <button
              onClick={(e) => {
                popMark(e, xpath);
                e.stopPropagation();
              }}
            >
              标记
            </button>
          ) : null}
          {showCancel ? (
            <button
              onClick={(e) => {
                cancelMark(e, markType);
                e.stopPropagation();
              }}
            >
              取消
            </button>
          ) : null}
        </div>
        {jsx}
      </div>
    );
  }

  const popMark = useCallback((e, xpath) => {
    const btnEle = e.currentTarget;
    const parentPos = parentEleRef.current.getBoundingClientRect();
    const currentPos = btnEle.getBoundingClientRect();
    curKeyRef.current = xpath;
		let top = currentPos.y - parentPos.y + btnEle.offsetHeight;
		const popMenuHeight = 122;
		
		if (top + popMenuHeight > parentPos.height || currentPos.top + popMenuHeight > document.body.clientHeight) {
			top -= popMenuHeight + btnEle.offsetHeight;
		}
    setStyle({ display: 'block', left: currentPos.x - parentPos.x, top });
  }, []);

  const cancelMark = useCallback((e, markType: string) => {
    setMarkedKeymap({ ...(markedKeymap || {}), [markType]: [] });
  }, [markedKeymap]);

  const resetPopMenuStyle = useCallback(() => {
    setStyle(void 0);
  }, []);

  if (error) {
    return (
      <div className={css.errorInfo}>
        <span>{error}</span>
        <div>{getErrorTips(error)}</div>
      </div>
    );
  }
	
  return schema ? (
    <div
      className={css.returnParams}
      ref={parentEleRef}
      onClick={resetPopMenuStyle}
    >
      <div>{proItem({ val: schema, xpath: '', root: true })}</div>
      <div className={css.popMenu} style={popMenuStyle}>
        <div className={css.menuItem} onClick={() => markAsReturn('dataSource')}>
          列表数据源
        </div>
	      <div className={css.menuItem} onClick={() => markAsReturn('pageNum')}>
		      分页索引
	      </div>
	      <div className={css.menuItem} onClick={() => markAsReturn('pageSize')}>
		      分页大小
	      </div>
	      <div className={css.menuItem} onClick={() => markAsReturn('total')}>
		      数据源总数
	      </div>
      </div>
    </div>
  ) : (
    <div className={css.empty}>类型无效</div>
  );
}

function getTypeName(v: string) {
  switch (v) {
    case 'number':
      return '数字';
    case 'string':
      return '字符';
    case 'boolean':
      return '布尔';
    case 'object':
      return '对象';
    case 'array':
      return '列表';
  }
}

function getErrorTips(message: string) {
  if (message.includes('Network Error')) {
    return '请检查网络是否正常、当前请求是否存在跨域';
  }
  if (message.includes('404')) {
    return '请检查请求地址是否拼写错误';
  }
  return '';
}

export default ReturnSchema;
