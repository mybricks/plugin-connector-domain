import React, { CSSProperties, FC, useCallback, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import Button from '../../../components/Button';
import Select from './select';
import Insert from './insert';
import { getScript } from '../../../script';
import { notice } from '../../../components/Message';
import { cloneDeep } from '../../../utils/lodash';
import { AggregationPanelContext } from '../aggregation-model/context';

import styles from './index.less';

interface DomainEditModelProps {
	sidebarContext: AnyType;
	style: CSSProperties;
	initialModel: AnyType;
	onClose(): void;
	updateService(action: string, entity: AnyType): void;
}
const tabList = [
	{ name: '查询', key: 'SELECT' },
	{ name: '新建', key: 'INSERT' },
	{ name: '更新', key: 'UPDATE' },
	{ name: '删除', key: 'DELETE' }
];
const tabNameMap = {
	SELECT: '查询',
	INSERT: '新建',
	UPDATE: '更新',
	DELETE: '删除',
};
const DomainEditModel: FC<DomainEditModelProps> = props => {
	const { style, onClose, updateService, initialModel, sidebarContext } = props;
	const [activeTab, setActiveTab] = useState('SELECT');
	const blurMapRef = useRef<AnyType>({});
	const [model, setModel] = useState(cloneDeep(initialModel));
	const contextValue = useMemo(() => {
		return { addBlurAry: (key, blur) =>( blurMapRef.current = { ...blurMapRef.current, [key]: blur }) };
	}, []);

	const onBlurAll = () => {
		Object.values(blurMapRef.current).forEach((blur: AnyType) => blur?.());
	};
	
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
		
		if (!model.query.SELECT.markedKeymap?.dataSource?.path?.length) {
			notice('未标识查询的接口返回信息数据源，可能会造成组件运行错误', { type: 'warning' });
			setActiveTab('SELECT');
		}
		
		queryAbilitySet?.forEach(key => {
			model.query[key].script = getScript(model.query[key]);
		});
		
		updateService(initialModel ? 'update' : 'create', { ...model, query: { ...model.query, edited: true } });
		onClose();
	}, [model, initialModel]);
	
	const renderTabContent = useCallback(() => {
		if (activeTab === 'SELECT') {
			return (
				<Select
					sidebarContext={sidebarContext}
					entity={model.query.entity}
					formModel={model.query.SELECT}
					onChangeEntity={entity => {
						setModel(model => ({
							...model,
							query: {
								...model.query,
								entity: {
									...entity,
									domainFileId: model.query.entity.domainFileId,
									domainFileName: model.query.entity.domainFileName,
									entityId: model.query.entity.entityId,
								}
							}
						}));
					}}
					onChange={(select: AnyType) => {
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
					onChange={(insert: AnyType) => {
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
		(
			<div className={styles.sidebarPanelEdit} data-id="plugin-panel" style={{ ...style, left: 361 }} onClick={onBlurAll}>
				<AggregationPanelContext.Provider value={contextValue}>
					<div className={styles.sidebarPanelTitle}>
						<div>领域模型</div>
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
				</AggregationPanelContext.Provider>
			</div>
		),
	  document.body
	);
};

export default DomainEditModel;
