import React, {FC, useContext, useRef, useState} from 'react';
import { useCallback } from 'react';
import {notice} from '../../../components/Message';
import {MarkTypeLabel, MarkTypes} from '../../../constant';
import {AggregationPanelContext} from '../aggregation-model/context';

import styles from './index.less';

interface ReturnSchemaProps {
	markedKeymap: Record<string, { path: string[]; value?: string }>;
	schema: any;
	markList: Array<Record<string, unknown>>;
	error: string;
	setMarkedKeymap(keymap: Record<string, { path: string[]; value?: string }>): void;
}

const ReturnSchema: FC<ReturnSchemaProps> = props => {
	const { markedKeymap, schema, error, setMarkedKeymap, markList } = props;
  const aggregationPanelContext = useContext(AggregationPanelContext);
  const parentEleRef = useRef<HTMLDivElement>(null);
  const curKeyRef = useRef('');
  const [popMenuStyle, setStyle] = useState<any>();

  const markAsReturn = useCallback((type: string) => {
		const targetSchemaTypes = MarkTypes[type] || [];
	  let keys = curKeyRef.current?.split('.') || [];
	  let originSchema = schema;
	  while (keys.length && originSchema) {
		  const key = keys.shift();
		  originSchema = originSchema.properties?.[key] || originSchema.items?.properties?.[key];
	  }
	
	  if (!targetSchemaTypes.includes('any') && (!targetSchemaTypes.includes(originSchema.type) || keys.length)) {
			notice(`【${MarkTypeLabel[type]}】所标识数据类型必须为 ${MarkTypes[type]?.map(key => getTypeName(key)).join('、')}`);
		  return;
	  }
	
	  if (!targetSchemaTypes.includes('any') && (targetSchemaTypes.includes('array') && originSchema?.items?.type !== 'object')) {
		  notice(`【${MarkTypeLabel[type]}】所标识数据类型必须为列表，且列表内数据类型必须为对象`);
		  return;
	  }
	  const markItem = markList.find(item => item.key === type);
	  const newMap: any = { path: curKeyRef.current?.split('.') || [] };
		
		/** 设置标识值的默认值 */
		if (markItem.needMarkValue && originSchema.type === 'boolean') {
			newMap.value = true;
		}
	  setMarkedKeymap({ ...(markedKeymap || {}), [type]: newMap })
  }, [markedKeymap, setMarkedKeymap, schema]);

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
	
		const markType = Object.keys(markedKeymap || {}).find(key => markedKeymap[key]?.path?.join('.') === xpath);
		const markItem = markList.find(item => item.key === markType);
	  /** key !== void 0 代表中间层，如列表里的对象，对象这个层级没有名称，但需要展示 */
	  const markedAsReturn = !!markType && key !== void 0;
    const showMark = xpath !== void 0 && key !== void 0 && !markedAsReturn;
    const showCancel = key !== void 0 && xpath !== void 0 && markedAsReturn && !root;
		
		const onChangeValue = value => {
			setMarkedKeymap({ ...(markedKeymap || {}), [markType]: { path: markedKeymap[markType].path, value } })
		};

    return (
      <div
        key={key}
        className={`${styles.item} ${root ? styles.rootItem : ''} ${markedAsReturn ? styles.markAsReturn : ''}`}
      >
	      {markedAsReturn ? <div className={styles.marked} data-text={MarkTypeLabel[markType]} /> : null}
        <div className={styles.keyName}>
          {key}
          <span className={styles.typeName}>({getTypeName(val.type)})</span>
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
	        {markItem?.needMarkValue && markedAsReturn ? (
						<>
							<span className={styles.markValueSelect}>当请求成功时，值为：</span>
							{val.type === 'string' ? (
								<input
									value={markedKeymap[markType].value}
									className={styles.markValueInput}
									type="text"
									onChange={e => onChangeValue(e.target.value)}
								/>
							) : null}
							{val.type === 'number' ? (
								<input
									value={markedKeymap[markType].value}
									className={styles.markValueInput}
									type="number"
									onChange={e => onChangeValue(Number(e.target.value))}
								/>
							) : null}
							{val.type === 'boolean' ? (
								<select
									value={Number(markedKeymap[markType].value)}
									className={styles.markValueInput}
									onChange={e => onChangeValue(Boolean(e.target.value))}
								>
									<option value={1}>True</option>
									<option value={0}>false</option>
								</select>
							) : null}
						</>
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
		/** 每一项高度为 28 */
		const popMenuHeight = 28 * markList.length + 10;
		
		if (top + popMenuHeight > parentPos.height || currentPos.top + popMenuHeight > document.body.clientHeight) {
			top -= popMenuHeight + btnEle.offsetHeight;
		}
    setStyle({ display: 'block', left: currentPos.x - parentPos.x, top });
    aggregationPanelContext.addBlurAry('return-schema', () => setStyle(void 0));
  }, [markList]);

  const cancelMark = useCallback((e, markType: string) => {
    setMarkedKeymap({ ...(markedKeymap || {}), [markType]: { path: [] } });
  }, [markedKeymap]);

  const resetPopMenuStyle = useCallback(event => {
    setStyle(void 0);
    aggregationPanelContext.addBlurAry('return-schema', () => {});
    event.stopPropagation();
  }, []);

  if (error) {
    return (
      <div className={styles.errorInfo}>
        <span>{error}</span>
        <div>{getErrorTips(error)}</div>
      </div>
    );
  }
	
  return schema ? (
    <div
      className={styles.returnParams}
      ref={parentEleRef}
      onClick={resetPopMenuStyle}
    >
      <div>{proItem({ val: schema, xpath: '', root: true })}</div>
      <div className={styles.popMenu} style={popMenuStyle}>
	      {markList.map(mark => {
					return (
						<div
							className={styles.menuItem}
							key={mark.key as string}
							onClick={() => markAsReturn(mark.key as string)}
							data-mybricks-tip={{ content: mark.description }}
						>
							{mark.title}
						</div>
					);
	      })}
      </div>
    </div>
  ) : (
    <div className={styles.empty}>类型无效</div>
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
