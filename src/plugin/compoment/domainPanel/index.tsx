import React, {CSSProperties, FC, useCallback, useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {DOMAIN_PANEL_VISIBLE, exampleSQLParamsFunc, NO_PANEL_VISIBLE} from '../../../constant';
import Button from '../../../components/Button';
import Loading from '../loading';
import {getScript} from '../../../script';
import {safeStringify} from '../../../utils';

import styles from './index.less';

interface DomainPanelProps {
	style: CSSProperties;
	onClose(): void;
	sidebarContext: any;
	panelVisible: number;
	updateService(action: string, entity: any): void;
	data: any;
}

interface Entity {
	id: string;
	name: string;
	isSystem: boolean;
	domainFileId: number;
	domainFileName: string;
	[key: string]: any;
}

const baseOptions = {
	output: encodeURIComponent(`export default function (result, { method, url, params, data, headers }) { return result; }`),
	method: 'POST',
	type: 'domain',
	path: '/api/system/domain/run',
};
export const getDomainService = (entity) => {
	const input = exampleSQLParamsFunc
		.replace('__serviceId__', entity.id)
		.replace('__fileId__', String(entity.domainFileId));
	
	return {
		id: entity.id,
		type: 'domain',
		title: entity.name,
		query: {
			SELECT: {
				script: getScript({
					...baseOptions,
					modelType: 'domain',
					input: decodeURIComponent(input.replace('__action__', 'SELECT'))
				})
			},
			DELETE: {
				script: getScript({
					...baseOptions,
					modelType: 'domain',
					input: decodeURIComponent(input.replace('__action__', 'DELETE'))
				})
			},
			UPDATE: {
				script: getScript({
					...baseOptions,
					modelType: 'domain',
					input: decodeURIComponent(input.replace('__action__', 'UPDATE'))
				})
			},
			INSERT: {
				script: getScript({
					...baseOptions,
					modelType: 'domain',
					input: decodeURIComponent(input.replace('__action__', 'INSERT'))
				})
			},
			SEARCH_BY_FIELD: {
				script: getScript({
					...baseOptions,
					modelType: 'domain',
					input: decodeURIComponent(input.replace('__action__', 'SEARCH_BY_FIELD'))
				})
			},
			abilitySet: ['SELECT', 'DELETE', 'UPDATE', 'INSERT', 'SEARCH_BY_FIELD', 'PAGE'],
			entity: entity,
		},
		createTime: Date.now(),
		updateTime: Date.now(),
	};
};

export const getDomainBundle = (fileId) => {
	return new Promise((resolve, reject) => {
		axios
			.get(`/paas/api/domain/bundle?fileId=${fileId}`)
			.then((res) => {
				if (res.data.code === 1) {
					resolve(res.data.data.entityAry.filter(entity => entity.isOpen).map(entity => ({ ...entity, id: entity.id })));
				} else {
					reject(res.data.msg || res.data.message);
				}
			})
			.catch(reject);
	});
};

/** 检验模型是否存在变更 */
export const checkDomainModel = (newEntity, originEntity) => {
	if (!newEntity) {
		return 'deleted';
	}
	
	if (newEntity.fieldAry.length !== originEntity.fieldAry.length) {
		return 'changed';
	}
	
	for (let idx = 0; idx < newEntity.fieldAry.length; idx++) {
		const newField = newEntity.fieldAry[idx];
		const oldField = originEntity.fieldAry[idx];
		
		if (
			newField.id !== oldField.id ||
			newField.name !== oldField.name ||
			newField.bizType !== oldField.bizType ||
			newField.dbType !== oldField.dbType ||
			safeStringify(newField.mapping) !== safeStringify(oldField.mapping) ||
			(newField.bizType === 'enum' && safeStringify(newField.enumValues) !== safeStringify(oldField.enumValues))
		) {
			return 'changed';
		}
	}
};
export const ActionMessage = {
	changed: '实体信息存在变更，请刷新实体~',
	deleted: '对应模型中实体已删除 或 未开放领域服务，请前往模型编辑页确认~',
};

const DomainPanel: FC<DomainPanelProps> = props => {
	const { style, onClose, data, updateService, sidebarContext, panelVisible } = props;
	const [domainFile, setDomainFile] = useState(null);
	const [entityList, setEntityList] = useState<Entity[]>([]);
	const [selectedEntityList, setSelectedEntityList] = useState<Entity[]>([]);
	const [loading, setLoading] = useState(false);
	const domainFileRef = useRef(null);
	
	const onSave = useCallback(() => {
		setSelectedEntityList((entityList => {
			entityList.forEach(item => {
				updateService('create', getDomainService(item));
			})
			domainFileRef.current = null;
			setDomainFile(null);
			return [];
		}));
	}, []);
	
	const onItemClick = useCallback((item) => {
		if (data.domainModels.some(({ id }) => item.id === id)) return;
		setSelectedEntityList((preEntityList) => {
			if (preEntityList.some(({ id }) => item.id === id)) {
				preEntityList = preEntityList.filter(({ id }) => id !== item.id);
			} else {
				preEntityList.push(item);
			}
			
			return [...preEntityList];
		});
	}, []);
	
	const getBundle = useCallback((fileId: number) => {
		setLoading(true);
		getDomainBundle(fileId).then(setEntityList).finally(() => setLoading(false));
	}, [])
	
	useEffect(() => {
		if (panelVisible & DOMAIN_PANEL_VISIBLE) {
			if (domainFileRef.current) {
				domainFileRef.current = null;
				setDomainFile(null);
			}
			sidebarContext.openFileSelector?.()
			.then(file => {
				domainFileRef.current = file;
				setDomainFile(file);
				setEntityList([]);
				
				file && getBundle(file.id);
			})
			.finally(() => {
				onClose();
			});
		} else if (panelVisible !== NO_PANEL_VISIBLE) {
			domainFileRef.current = null;
			setDomainFile(null);
		}
	}, [panelVisible, onClose]);
	
  return ReactDOM.createPortal(
	  !!domainFile ? (
			<div className={styles.sidebarPanelEdit} data-id="plugin-panel" style={{ ...style, left: 361 }}>
				<div className={styles.sidebarPanelTitle}>
					<div>模型实体选择</div>
					<div>
						<div className={styles['actions']}>
							<Button size='small' type={selectedEntityList.length ? 'primary' : ''}  onClick={onSave}>
								保 存
							</Button>
						</div>
					</div>
				</div>
				<div className={styles.ct}>
					{loading ? <Loading /> : (
						entityList?.length
							? entityList.map(entity => {
									const defaultSelected = data.domainModels.some(({ id }) => entity.id === id);
									const selected = selectedEntityList.some(({ id}) => entity.id === id);
									
									return (
										<div
											key={entity.id}
											className={`${styles.item} ${selected || defaultSelected ? styles.selected : ''} ${defaultSelected ? styles.defaultSelected : ''}`}
											onClick={() => onItemClick({
												...entity,
												domainFileId: domainFile.id,
												domainFileName: domainFile.name
											})}
										>
											<input type="checkbox" />
											<div>{entity.name}</div>
										</div>
									);
								})
							: <div className={styles.empty}>暂无可添加的领域模型实体</div>
					)}
				</div>
			</div>
	  ) : null,
	  document.body
  );
};

export default DomainPanel;
