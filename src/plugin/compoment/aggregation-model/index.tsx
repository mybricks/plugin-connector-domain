import React, {CSSProperties, FC, useCallback, useState} from 'react';
import ReactDOM from 'react-dom';
import Button from '../../../components/Button';
import {
	AGGREGATION_MODEL_VISIBLE,
	exampleParamsFunc,
	exampleResultFunc,
	exampleSQLParamsFunc
} from '../../../constant';
import Select from './select';
import {uuid} from '../../../utils';
import {getScript} from '../../../script';

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
	{ name: '新增', key: 'CREATE' },
	{ name: '更新', key: 'UPDATE' },
	{ name: '删除', key: 'DELETE' }
];
const INIT_QUERY = {
	SELECT: {
		method: 'GET',
		entity: { fieldAry: [] },
		input: encodeURIComponent(exampleParamsFunc),
		output: encodeURIComponent(exampleResultFunc),
	},
	DELETE: {
		method: 'POST',
		input: encodeURIComponent(exampleParamsFunc),
		output: encodeURIComponent(exampleResultFunc),
	},
	UPDATE: {
		method: 'POST',
		input: encodeURIComponent(exampleParamsFunc),
		output: encodeURIComponent(exampleResultFunc),
	},
	CREATE: {
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
	const [model, setModel] = useState(initialModel || {
		id: uuid(),
		title: '',
		type: 'aggregation-model',
		query: { ...INIT_QUERY },
		createTime: Date.now(),
		updateTime: Date.now(),
	});
	
	const onSave = useCallback(() => {
		model.query.abilitySet?.forEach(key => {
			model.query[key].script = getScript(model.query[key]);
		});
		
		updateService(initialModel ? 'update' : 'create', model);
		onClose();
	}, [model, initialModel]);
	
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
				  {activeTab === 'SELECT' ? (
					  <Select
						  sidebarContext={sidebarContext}
						  formModel={model.query.SELECT}
						  onChange={(select: any) => {
								setModel(model => {
									const abilitySet = model.query.abilitySet || [];
									
									if (!abilitySet.includes('SELECT')) {
										abilitySet.push('SELECT');
									}
									
									return { ...model, query: { ...model.query, SELECT: select, abilitySet } };
								});
						  }}
					  />
				  ) : null}
			  </div>
		  </div>
	  ) : null,
	  document.body
  );
};

export default AggregationModel;
