import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Modal } from 'antd';
import { DOMAIN_PANEL_VISIBLE, exampleSQLParamsFunc, NO_PANEL_VISIBLE } from '../../../constant';
import { getScript } from '../../../script';
import { getPageSchemaByEntity, getSchemaByEntity, safeStringify, uuid } from '../../../utils';

import styles from './index.less';

interface DomainPanelProps {
	onClose(): void;
	sidebarContext: AnyType;
	panelVisible: number;
	updateService(action: string, entity: AnyType): void;
	data: AnyType;
}

interface Entity {
	id: string;
	name: string;
	isSystem: boolean;
	domainFileId: number;
	domainFileName: string;
	[key: string]: AnyType;
}

const errorSchema = {
	type: 'object',
	properties: {
		code: { type: 'number' },
		msg: { type: 'string' },
	},
};

const resultSchema = {
	type: 'object',
	properties: {
		code: { type: 'number' },
		data: { type: 'number' },
		msg: { type: 'string' },
	},
};

const markedKeymap = {
	successStatus: { path: ['code'], value: 1 },
	response: { path: ['data'] },
	error: { path: ['msg'] },
};

export const getDomainService = (id, entity) => {
	const input = exampleSQLParamsFunc
		.replace('__serviceId__', entity.id)
		.replace('__fileId__', String(entity.domainFileId));

	const getBaseOptions = (type: string) => {
		return {
			method: 'POST',
			type: 'domain',
			serviceId: entity.id + '_' + type,
			path: '/api/system/domain/run',
			input: encodeURIComponent(input.replace('__action__', type)),
			output: encodeURIComponent('export default function (result, { method, url, params, data, headers }) { return result; }'),
		};
	};

	return {
		id,
		type: 'domain',
		title: entity.name,
		query: {
			SELECT: {
				...getBaseOptions('SELECT'),
				title: entity.name + '的查询接口',
				outputSchema: getPageSchemaByEntity(entity),
				resultSchema: getPageSchemaByEntity(entity),
				markedKeymap: {
					successStatus: { path: ['code'], value: 1 },
					dataSource: { path: ['data', 'dataSource'] },
					total: { path: ['data', 'total'] },
					pageNum: { path: ['data', 'pageNum'] },
					pageSize: { path: ['data', 'pageSize'] },
					error: { path: ['msg'] },
				},
				pageInfo: {
					pageNumKey: 'pageNum',
					pageSizeKey: 'pageSize'
				},
				errorSchema,
				script: getScript({ ...getBaseOptions('SELECT'), modelType: 'domain' })
			},
			DELETE: {
				...getBaseOptions('DELETE'),
				title: entity.name + '的删除接口',
				outputSchema: resultSchema,
				resultSchema,
				errorSchema,
				markedKeymap,
				script: getScript({ ...getBaseOptions('DELETE'), modelType: 'domain' })
			},
			UPDATE: {
				...getBaseOptions('UPDATE'),
				title: entity.name + '的更新接口',
				outputSchema: resultSchema,
				errorSchema,
				resultSchema,
				markedKeymap,
				script: getScript({ ...getBaseOptions('UPDATE'), modelType: 'domain' })
			},
			INSERT: {
				...getBaseOptions('INSERT'),
				title: entity.name + '的新建接口',
				outputSchema: resultSchema,
				resultSchema,
				markedKeymap,
				errorSchema,
				script: getScript({ ...getBaseOptions('INSERT'), modelType: 'domain' })
			},
			SEARCH_BY_FIELD: {
				...getBaseOptions('SEARCH_BY_FIELD'),
				title: entity.name + '的关联字段检索接口',
				outputSchema: getSchemaByEntity(entity),
				resultSchema: getSchemaByEntity(entity),
				errorSchema,
				markedKeymap,
				script: getScript({ ...getBaseOptions('SEARCH_BY_FIELD'), modelType: 'domain' })
			},
			abilitySet: ['SELECT', 'DELETE', 'UPDATE', 'INSERT', 'SEARCH_BY_FIELD', 'PAGE'],
			entity,
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
const DomainIcon = (
	<svg viewBox="0 0 1024 1024" width="16" height="16">
		<path d="M512 230.4c-63.5136 0-115.2-51.6864-115.2-115.2s51.6864-115.2 115.2-115.2c63.5264 0 115.2 51.6864 115.2 115.2s-51.6736 115.2-115.2 115.2z m0-179.2c-35.2896 0-64 28.7104-64 64s28.7104 64 64 64 64-28.7104 64-64-28.7104-64-64-64zM512 1024c-63.5136 0-115.2-51.6736-115.2-115.2s51.6864-115.2 115.2-115.2c63.5264 0 115.2 51.6736 115.2 115.2s-51.6736 115.2-115.2 115.2z m0-179.2c-35.2896 0-64 28.7104-64 64s28.7104 64 64 64 64-28.7104 64-64-28.7104-64-64-64zM908.8 627.2c-63.5264 0-115.2-51.6736-115.2-115.2 0-63.5136 51.6736-115.2 115.2-115.2s115.2 51.6864 115.2 115.2c0 63.5264-51.6736 115.2-115.2 115.2z m0-179.2c-35.2896 0-64 28.7104-64 64s28.7104 64 64 64 64-28.7104 64-64-28.7104-64-64-64zM115.2 627.2c-63.5136 0-115.2-51.6736-115.2-115.2 0-63.5136 51.6864-115.2 115.2-115.2s115.2 51.6864 115.2 115.2c0 63.5264-51.6864 115.2-115.2 115.2z m0-179.2c-35.2896 0-64 28.7104-64 64s28.7104 64 64 64 64-28.7104 64-64-28.7104-64-64-64z" fill="#555555"></path><path d="M320.5376 219.392a25.6 25.6 0 0 1-13.184-47.5648 392.256 392.256 0 0 1 116.5184-46.6688 25.6 25.6 0 0 1 11.1488 49.984 341.5552 341.5552 0 0 0-101.3376 40.6016 25.6384 25.6384 0 0 1-13.1456 3.648zM703.4624 219.4048c-4.4928 0-9.024-1.1776-13.1456-3.6608a341.2736 341.2736 0 0 0-101.3248-40.6016 25.6256 25.6256 0 0 1-19.4176-30.5664 25.664 25.664 0 0 1 30.5664-19.4176 392.3968 392.3968 0 0 1 116.5312 46.6688 25.6128 25.6128 0 0 1-13.2096 47.5776zM429.4656 899.456c-1.8432 0-3.7248-0.2048-5.5936-0.6144a392.64 392.64 0 0 1-116.5184-46.656 25.6 25.6 0 0 1 26.3296-43.9296 341.2096 341.2096 0 0 0 101.3376 40.6016 25.6 25.6 0 0 1-5.5552 50.5984zM594.5344 899.456a25.6 25.6 0 0 1-5.5424-50.5856 341.1712 341.1712 0 0 0 101.3248-40.6144 25.6 25.6 0 1 1 26.3424 43.904 392.0256 392.0256 0 0 1-116.5312 46.6816 26.0864 26.0864 0 0 1-5.5936 0.6144zM150.1696 455.04a25.6256 25.6256 0 0 1-25.024-31.1808 391.808 391.808 0 0 1 46.6816-116.5184 25.6 25.6 0 0 1 43.904 26.3424 341.184 341.184 0 0 0-40.6144 101.3376 25.5872 25.5872 0 0 1-24.9472 20.0192zM193.8176 729.088c-8.704 0-17.1776-4.4288-21.9776-12.4288a392.1664 392.1664 0 0 1-46.6816-116.5312 25.6 25.6 0 0 1 49.984-11.1488 341.0304 341.0304 0 0 0 40.6144 101.3248 25.6 25.6 0 0 1-21.9392 38.784zM830.1952 729.088a25.5744 25.5744 0 0 1-21.9392-38.7584 341.2096 341.2096 0 0 0 40.6016-101.3248 25.6768 25.6768 0 0 1 30.5536-19.4304 25.6 25.6 0 0 1 19.4304 30.5536 392.512 392.512 0 0 1-46.656 116.5312 25.6256 25.6256 0 0 1-21.9904 12.4288zM873.8304 455.04a25.6128 25.6128 0 0 1-24.96-20.032 341.4912 341.4912 0 0 0-40.6016-101.3376 25.6128 25.6128 0 0 1 43.9296-26.3296 392.64 392.64 0 0 1 46.656 116.5184 25.6 25.6 0 0 1-25.024 31.1808z" fill="#555555"></path><path d="M231.424 913.0496a102.016 102.016 0 0 1-72.3712-29.9264l-18.176-18.176c-39.9104-39.9104-39.9104-104.832 0-144.7552l34.816-34.816a25.6 25.6 0 0 1 36.2112 36.1984l-34.816 34.816a51.2256 51.2256 0 0 0 0 72.3456l18.176 18.176a51.2256 51.2256 0 0 0 72.3456 0l34.816-34.8288a25.6 25.6 0 0 1 36.2112 36.1984l-34.816 34.8288a102.0928 102.0928 0 0 1-72.3968 29.9392zM830.1952 346.112a25.6 25.6 0 0 1-18.0992-43.712l34.8288-34.816a50.7648 50.7648 0 0 0 14.9632-36.16 50.8416 50.8416 0 0 0-14.9632-36.1856l-18.176-18.176a51.2256 51.2256 0 0 0-72.3456 0l-34.816 34.816a25.6 25.6 0 1 1-36.1984-36.2112l34.816-34.816c39.8976-39.9104 104.8448-39.9104 144.7552 0l18.176 18.176a101.6832 101.6832 0 0 1 29.9648 72.384 101.632 101.632 0 0 1-29.9648 72.3712l-34.8288 34.816a25.4848 25.4848 0 0 1-18.112 7.5136zM792.576 913.0624a101.952 101.952 0 0 1-72.3712-29.9392l-34.816-34.8288a25.6 25.6 0 1 1 36.1984-36.1984l34.816 34.8288c19.3024 19.3024 53.056 19.3024 72.3456 0l18.176-18.176c9.6512-9.6512 14.9632-22.5024 14.9632-36.1728s-5.312-26.5216-14.9632-36.1728l-34.8288-34.816a25.6 25.6 0 1 1 36.1984-36.1984l34.8288 34.816c39.9104 39.9104 39.9104 104.832 0 144.7552l-18.176 18.176a101.9904 101.9904 0 0 1-72.3712 29.9264zM193.792 346.112a25.472 25.472 0 0 1-18.0992-7.5008l-34.816-34.816c-19.328-19.3152-29.9648-45.0304-29.9648-72.3712s10.6496-53.056 29.9648-72.3712l18.176-18.1632c39.9104-39.8976 104.8576-39.8976 144.7424 0l34.816 34.816a25.6 25.6 0 1 1-36.1984 36.1984l-34.816-34.816a51.2256 51.2256 0 0 0-72.3456 0l-18.176 18.1632c-9.6512 9.6512-14.9632 22.4896-14.9632 36.1728s5.312 26.5216 14.9632 36.1728l34.816 34.816a25.6 25.6 0 0 1-18.0992 43.6992zM512 665.6c-84.6976 0-153.6-68.9024-153.6-153.6s68.9024-153.6 153.6-153.6 153.6 68.9024 153.6 153.6-68.9024 153.6-153.6 153.6z m0-256c-56.4608 0-102.4 45.9392-102.4 102.4s45.9392 102.4 102.4 102.4 102.4-45.9392 102.4-102.4-45.9392-102.4-102.4-102.4z"></path>
	</svg>
);
const DomainPanel: FC<DomainPanelProps> = props => {
	const { onClose, updateService, sidebarContext, panelVisible } = props;
	const [domainFile, setDomainFile] = useState(null);
	const [entityList, setEntityList] = useState<Entity[]>([]);
	const [selectedEntityList, setSelectedEntityList] = useState<Entity[]>([]);
	const domainFileRef = useRef(null);

	const onCancel = useCallback(() => {
		domainFileRef.current = null;
		setDomainFile(null);
		onClose?.();
	}, [onClose]);
	
	const onSave = useCallback(() => {
		setSelectedEntityList((entityList => {
			entityList.forEach(item => {
				updateService('create', getDomainService(item.id, { ...item, id: item.entityId }));
			});
			return [];
		}));

		onCancel();
	}, [onCancel]);
	
	const onItemClick = useCallback((item) => {
		setSelectedEntityList((preEntityList) => [...preEntityList, item]);
	}, []);
	
	const getBundle = useCallback((fileId: number) => {
		getDomainBundle(fileId).then(setEntityList);
	}, []);

	const cancelSelect = useCallback((selectedSQL) => {
		setSelectedEntityList(pre => pre.filter(item => item.id !== selectedSQL.id));
	}, []);
	
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
	
	return (
		<Modal
			wrapClassName="fangzhou-theme"
			visible={!!domainFile}
			className={styles.domainModal}
			title="模型实体选择"
			onCancel={onCancel}
			onOk={onSave}
			destroyOnClose
			width={800}
			cancelText="取消"
			okText="确定"
		>
			<div className={styles.domainContainer}>
				<div className={styles.leftPanel}>
					<div className={styles.header}>
						已选择领域接口列表:
					</div>
					<div className={styles.panelContent}>
						{
							selectedEntityList.length
								? selectedEntityList.map(sql => {
									return (
										<div key={sql.id} className={styles.sqlHttp}>
											{DomainIcon}
											<div className={styles.title}>{sql.name}</div>
											<div className={styles.operate}>
												<svg onClick={() => cancelSelect(sql)} viewBox="64 64 896 896" width="16" height="16" fill="currentColor">
													<path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"/>
												</svg>
											</div>
										</div>
									);
								})
								: <div className={styles.empty}>未添加领域模型实体</div>
						}
					</div>
				</div>
				<div className={styles.rightPanel}>
					<div className={styles.header}>
						来自于模型：{domainFile?.name}
					</div>
					<div className={styles.panelContent}>
						{
							entityList.length ? entityList.map((entity) => {
								return (
									<div
										key={entity.id}
										className={styles.sqlHttpItem}
										onClick={() => onItemClick({
											...entity,
											entityId: entity.id,
											id: uuid(),
											domainFileId: domainFile.id,
											domainFileName: domainFile.name
										})}
									>
										{DomainIcon}
										<div className={styles.title}>{entity.name}</div>
									</div>
								);
							}) : <div className={styles.empty}>暂无可添加的领域模型实体</div>
						}
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default DomainPanel;
