import React, {CSSProperties, FC, useCallback, useState} from 'react';
import ReactDOM from 'react-dom';
import Button from '../../../components/Button';
import {
	AGGREGATION_MODEL_VISIBLE,
	exampleParamsFunc,
	exampleResultFunc
} from '../../../constant';
import Select from './select';
import Insert from './insert';
import {uuid} from '../../../utils';
import {getScript} from '../../../script';
import {notice} from '../../../components/Message';
import {cloneDeep} from '../../../utils/lodash';

import styles from './index.less';

interface AggregationModelProps {
	sidebarContext: any;
	style: CSSProperties;
	panelVisible: number;
	initialModel?: any;
	onClose(): void;
	updateService(action: string, entity: any): void;
}
const tabList = [
	{ name: '查询', key: 'SELECT' },
	// { name: '新建', key: 'INSERT' },
	// { name: '更新', key: 'UPDATE' },
	// { name: '删除', key: 'DELETE' }
];
const tabNameMap = {
	SELECT: '查询',
	INSERT: '新建',
	UPDATE: '更新',
	DELETE: '删除',
};
const INIT_QUERY = {
	SELECT: {
		method: 'GET',
		entity: { fieldAry: [] },
		input: encodeURIComponent(exampleParamsFunc),
		output: encodeURIComponent(exampleResultFunc),
	},
	DELETE: {
		method: 'DELETE',
		input: encodeURIComponent(exampleParamsFunc),
		output: encodeURIComponent(exampleResultFunc),
		params: { type: 'root', name: 'root', children: [{ type: 'string', id: uuid(), name: 'id' }] },
	},
	UPDATE: {
		method: 'PUT',
		input: encodeURIComponent(exampleParamsFunc),
		output: encodeURIComponent(exampleResultFunc),
		params: { type: 'root', name: 'root', children: [{ type: 'string', id: uuid(), name: 'id' }] },
	},
	INSERT: {
		method: 'POST',
		input: encodeURIComponent(exampleParamsFunc),
		output: encodeURIComponent(exampleResultFunc),
	},
	entity: { id: uuid(), fieldAry: [] },
	abilitySet: []
};
const AggregationModel: FC<AggregationModelProps> = props => {
	const { panelVisible, style, onClose, updateService, initialModel, sidebarContext } = props;
	const [activeTab, setActiveTab] = useState('SELECT');
	const [model, setModel] = useState(cloneDeep(initialModel) || {
		id: uuid(),
		title: '',
		type: 'aggregation-model',
		query: { ...INIT_QUERY },
		createTime: Date.now(),
		updateTime: Date.now(),
	});
	
	const onSave = useCallback(() => {
		const queryAbilitySet = model.query.abilitySet.filter(key => key !== 'PAGE');
		
		for (let idx = 0; idx < queryAbilitySet.length; idx++) {
			const ability = queryAbilitySet[idx];
			
			if (!model.query[ability]?.path?.trim()) {
				notice(`${tabNameMap[ability]}的请求路径不能为空`);
				setActiveTab(ability);
				return;
			}
		}
		
		if (!model.query.SELECT.markedKeymap?.dataSource?.length) {
			notice('未标识查询的接口返回信息数据源，可能会造成组件运行错误', { type: 'warning' });
			setActiveTab('SELECT');
		}
		
		queryAbilitySet?.forEach(key => {
			model.query[key].script = getScript(model.query[key]);
		});
		
		updateService(initialModel ? 'update' : 'create', model);
		onClose();
	}, [model, initialModel]);
	
	const renderTabContent = useCallback(() => {
		if (activeTab === 'SELECT') {
			return (
				<Select
					sidebarContext={sidebarContext}
					entity={model.query.entity}
					formModel={model.query.SELECT}
					onChangeEntity={entity => setModel(model => ({ ...model, query: { ...model.query, entity } }))}
					onChange={(select: any) => {
						setModel(model => {
							let abilitySet = model.query.abilitySet || [];
							
							if (!abilitySet.includes('SELECT')) {
								abilitySet.push('SELECT');
							}
							
							if (select.pageInfo) {
								if (!abilitySet.includes('PAGE')) {
									abilitySet.push('PAGE');
								}
							} else {
								abilitySet = abilitySet.filter(key => key !== 'PAGE');
							}
							
							return { ...model, query: { ...model.query, SELECT: select, abilitySet } };
						});
					}}
				/>
			);
		} else {
			if (!['INSERT', 'UPDATE', 'DELETE'].includes(activeTab)) {
				return null;
			}
			
			return (
				<Insert
					key={activeTab}
					sidebarContext={sidebarContext}
					entity={model.query.entity}
					formModel={model.query[activeTab]}
					onChangeEntity={entity => setModel(model => ({ ...model, query: { ...model.query, entity } }))}
					onChange={(insert: any) => {
						setModel(model => {
							let abilitySet = model.query.abilitySet || [];
							
							if (!abilitySet.includes(activeTab)) {
								abilitySet.push(activeTab);
							}
							
							return { ...model, query: { ...model.query, [activeTab]: insert, abilitySet } };
						});
					}}
				/>
			);
		}
	}, [activeTab]);
	
	return ReactDOM.createPortal(
	  panelVisible & AGGREGATION_MODEL_VISIBLE ? (
		  <div className={styles.sidebarPanelEdit} data-id="plugin-panel" style={{ ...style, left: 361 }}>
			  <div className={styles.sidebarPanelTitle}>
				  <div>聚合模型</div>
				  <div>
					  <Button size="small" type="primary" onClick={onSave}>
						  保 存
					  </Button>
					  <Button size="small" style={{ marginLeft: '12px' }} onClick={onClose}>
						  关 闭
					  </Button>
				  </div>
			  </div>
			  <div className={styles.item}>
				  <label>模型名称</label>
				  <div className={`${styles.editor} ${styles.textEdt}`} style={{ marginRight: '12px' }}>
					  <input
						  type="text"
						  placeholder="模型名称"
						  defaultValue={model.title}
						  onChange={(e) => setModel(model => ({ ...model, title: e.target.value }))}
					  />
				  </div>
			  </div>
			  <div className={styles.tabs}>
				  {tabList.map(tab => {
						return (
							<div
								key={tab.key}
								className={`${styles.tab} ${activeTab === tab.key ? styles.activeTab : ''}`}
								onClick={() => setActiveTab(tab.key)}
							>
								{tab.name}
							</div>
						);
				  })}
			  </div>
			  <div className={styles.tabContent}>
				  {renderTabContent()}
			  </div>
		  </div>
	  ) : null,
	  document.body
  );
};

export default AggregationModel;
