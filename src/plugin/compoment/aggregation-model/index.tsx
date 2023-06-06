import React, {CSSProperties, FC, useCallback, useState} from 'react';
import ReactDOM from 'react-dom';
import Button from '../../../components/Button';
import {AGGREGATION_MODEL_VISIBLE, exampleParamsFunc, exampleResultFunc, NO_PANEL_VISIBLE} from '../../../constant';
import Select from './select';

import styles from './index.less';

interface AggregationModelProps {
	style: CSSProperties;
	setRender(value: Record<string, unknown>): void;
	sidebarContext: any;
	updateService(action: string, entity: any): void;
}
const tabList = [
	{
		name: '查询',
		key: 'SELECT'
	},
	{
		name: '新增',
		key: 'CREATE'
	},
	{
		name: '更新',
		key: 'UPDATE'
	},
	{
		name: '删除',
		key: 'DELETE'
	}
];

const AggregationModel: FC<AggregationModelProps> = props => {
	const { sidebarContext, style, setRender } = props;
	const [activeTab, setActiveTab] = useState('SELECT');
	const [formModelMap, setFormModelMap] = useState<Record<string, Record<string, any>>>({
		SELECT: {
			method: 'GET',
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
	});
	
	const onSave = useCallback(() => {
		sidebarContext.panelVisible = NO_PANEL_VISIBLE;
		console.log(formModelMap);
		// setRender(sidebarContext);
	}, [sidebarContext]);
	
	return ReactDOM.createPortal(
	  sidebarContext.panelVisible & AGGREGATION_MODEL_VISIBLE ? (
		  <div className={styles.sidebarPanelEdit} data-id="plugin-panel" style={{ ...style, left: 361 }}>
			  <div className={styles.sidebarPanelTitle}>
				  <div>聚合模型</div>
				  <div>
					  <Button size='small' type="primary"  onClick={onSave}>
						  保 存
					  </Button>
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
					  <Select formModel={formModelMap.SELECT} setRender={setRender} sidebarContext={sidebarContext} />
				  ) : null}
			  </div>
		  </div>
	  ) : null,
	  document.body
  );
};

export default AggregationModel;
