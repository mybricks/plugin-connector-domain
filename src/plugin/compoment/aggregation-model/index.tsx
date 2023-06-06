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
	style: CSSProperties;
	panelVisible: number;
	onClose(): void;
	updateService(action: string, entity: any): void;
}
const tabList = [
	{ name: '查询', key: 'SELECT' },
	{ name: '新增', key: 'CREATE' },
	{ name: '更新', key: 'UPDATE' },
	{ name: '删除', key: 'DELETE' }
];

const AggregationModel: FC<AggregationModelProps> = props => {
	const { panelVisible, style, onClose, updateService } = props;
	const [activeTab, setActiveTab] = useState('SELECT');
	const [title, setTitle] = useState('');
	const [formModelMap, setFormModelMap] = useState<Record<string, Record<string, any>>>({
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
	});
	
	const onSave = useCallback(() => {
		let select = {
			"input": encodeURIComponent(
				exampleSQLParamsFunc
					.replace('__serviceId__', 'E__ZPWG')
					.replace('__fileId__', '436111218683973')
					.replace('__action__', 'SELECT')
			),
			"output": encodeURIComponent(`export default function (result, { method, url, params, data, headers }) { return result; }`),
			"inputSchema": {
				"type": "object",
				"properties": {
					"keyword": {
						"type": "string"
					},
					"fields": {
						"type": "array",
						"items": {
							"type": "object",
							"properties": {
								"name": {
									"type": "string"
								}
							}
						}
					},
					"orders": {
						"type": "array",
						"items": {
							"type": "object",
							"properties": {
								"fieldName": {
									"type": "string"
								},
								"order": {
									"type": "string"
								}
							}
						}
					},
					"page": {
						"type": "object",
						"properties": {
							"pageNum": {
								"type": "number"
							},
							"pageSize": {
								"type": "number"
							}
						}
					}
				}
			},
			"title": "用户表的查询接口",
			"method": "POST",
			"type": "aggregation-model",
			"outputSchema": {
				"type": "object",
				"properties": {
					"code": {
						"type": "number"
					},
					"data": {
						"type": "object",
						"properties": {
							"dataSource": {
								"type": "array",
								"items": {
									"type": "object",
									"properties": {
										"id": {
											"type": "number"
										},
										"用户名": {
											"type": "string"
										},
										"头像": {
											"type": "string"
										},
										"性别": {
											"type": "enum"
										},
										"等级": {
											"type": "object",
											"properties": {
												"id": {
													"type": "number"
												},
												"名称": {
													"type": "string"
												},
												"更新时间字符串": {
													"type": "string"
												},
												"创建时间": {
													"type": "string"
												}
											}
										},
										"创建者": {
											"type": "object",
											"properties": {
												"id": {
													"type": "number"
												},
												"名称": {
													"type": "string"
												}
											}
										},
										"更新者": {
											"type": "object",
											"properties": {
												"id": {
													"type": "number"
												},
												"名称": {
													"type": "string"
												}
											}
										},
										"附件": {
											"type": "string"
										},
										"字段0": {
											"type": "string"
										}
									}
								}
							},
							"total": {
								"type": "number"
							},
							"pageNum": {
								"type": "number"
							},
							"pageSize": {
								"type": "number"
							}
						}
					},
					"msg": {
						"type": "string"
					}
				}
			},
			"resultSchema": {
				"type": "object",
				"properties": {
					"code": {
						"type": "number"
					},
					"data": {
						"type": "object",
						"properties": {
							"dataSource": {
								"type": "array",
								"items": {
									"type": "object",
									"properties": {
										"id": {
											"type": "number"
										},
										"用户名": {
											"type": "string"
										},
										"头像": {
											"type": "string"
										},
										"性别": {
											"type": "enum"
										},
										"等级": {
											"type": "object",
											"properties": {
												"id": {
													"type": "number"
												},
												"名称": {
													"type": "string"
												},
												"更新时间字符串": {
													"type": "string"
												},
												"创建时间": {
													"type": "string"
												}
											}
										},
										"创建者": {
											"type": "object",
											"properties": {
												"id": {
													"type": "number"
												},
												"名称": {
													"type": "string"
												}
											}
										},
										"更新者": {
											"type": "object",
											"properties": {
												"id": {
													"type": "number"
												},
												"名称": {
													"type": "string"
												}
											}
										},
										"附件": {
											"type": "string"
										},
										"字段0": {
											"type": "string"
										}
									}
								}
							},
							"total": {
								"type": "number"
							},
							"pageNum": {
								"type": "number"
							},
							"pageSize": {
								"type": "number"
							}
						}
					},
					"msg": {
						"type": "string"
					}
				}
			},
			"domainServiceMap": {
				"serviceId": "E_PDCOJ",
				"fileId": 523
			},
			"params": {
				"type": "root",
				"name": "root",
				"children": [
					{
						"id": "u_ejznmt",
						"name": "keyword",
						"type": "string"
					}
				]
			},
			"path": "/api/system/domain/run",
		};
		updateService('create', {
			id: uuid(),
			title,
			type: 'aggregation-model',
			query: {
				SELECT: { ...select, script: getScript(select) },
				entity: {
					"id": "E__ZPWG",
					"isOpen": true,
					"name": "用户表",
					"createTime": 1684309269790,
					"updateTime": 1685432580629,
					"fieldAry": [
						{
							"id": "F_KXBUQ",
							"isPrimaryKey": true,
							"name": "id",
							"desc": "主键",
							"dbType": "bigint",
							"bizType": "number",
							"typeLabel": "数字",
							"enumValues": []
						},
						{
							"id": "F_P4G_T",
							"isPrivate": true,
							"name": "_STATUS_DELETED",
							"desc": "是否已删除",
							"dbType": "int",
							"bizType": "number",
							"typeLabel": "数字"
						},
						{
							"id": "F_QMHB_",
							"isPrivate": true,
							"name": "_CREATE_USER_ID",
							"desc": "创建者ID",
							"dbType": "varchar",
							"bizType": "string",
							"typeLabel": "字符"
						},
						{
							"id": "F__RROS",
							"isPrivate": true,
							"name": "_CREATE_TIME",
							"desc": "创建时间",
							"dbType": "bigint",
							"bizType": "datetime",
							"typeLabel": "日期时间"
						},
						{
							"id": "F_TY3OC",
							"isPrivate": true,
							"name": "_UPDATE_USER_ID",
							"desc": "更新者ID",
							"dbType": "varchar",
							"bizType": "int",
							"typeLabel": "数字"
						},
						{
							"id": "F_UOVOU",
							"isPrivate": true,
							"name": "_UPDATE_TIME",
							"desc": "最后更新时间",
							"dbType": "bigint",
							"bizType": "datetime",
							"typeLabel": "日期时间"
						},
						{
							"id": "F_RGPTV",
							"name": "用户名称",
							"dbType": "varchar",
							"bizType": "string",
							"typeLabel": "字符",
							"enumValues": []
						},
						{
							"id": "F_TZKKY",
							"name": "年龄",
							"dbType": "varchar",
							"bizType": "string",
							"typeLabel": "字符",
							"enumValues": []
						},
						{
							"id": "F_LYRK1",
							"name": "简介",
							"dbType": "mediumtext",
							"bizType": "string",
							"typeLabel": "长文本",
							"enumValues": []
						},
						{
							"id": "F_LRV6P",
							"name": "性别",
							"dbType": "varchar",
							"bizType": "enum",
							"typeLabel": "枚举",
							"enumValues": [
								"女",
								"男"
							]
						},
						{
							"id": "F_JVFIM",
							"name": "创建日期",
							"dbType": "bigint",
							"bizType": "datetime",
							"typeLabel": "日期时间",
							"enumValues": [],
							"showFormat": "yyyy-MM-DD HH:mm:ss",
							"defaultValueWhenCreate": "$currentTime"
						},
						{
							"id": "F_3HQFC",
							"name": "更新日期",
							"dbType": "bigint",
							"bizType": "datetime",
							"typeLabel": "日期时间",
							"enumValues": [],
							"showFormat": "yyyy-MM-DD HH:mm:ss",
							"defaultValueWhenCreate": null
						},
						{
							"id": "F_F3R8A",
							"name": "爱好",
							"dbType": "varchar",
							"bizType": "mapping",
							"typeLabel": "计算字段",
							"enumValues": [],
							"relationEntityId": "E_KNOAC",
							"mapping": {
								"condition": "-1",
								"fieldJoiner": ",",
								"entity": {
									"id": "E_KNOAC",
									"isOpen": true,
									"name": "爱好表",
									"createTime": 1684996632012,
									"updateTime": 1685432392418,
									"updated": true,
									"field": {
										"id": "F_MQTCB",
										"isPrimaryKey": true,
										"name": "id",
										"desc": "主键",
										"dbType": "bigint",
										"bizType": "number",
										"typeLabel": "数字",
										"enumValues": []
									},
									"fieldAry": [
										{
											"id": "F_MQTCB",
											"isPrimaryKey": true,
											"name": "id",
											"desc": "主键",
											"dbType": "bigint",
											"bizType": "number",
											"typeLabel": "数字",
											"enumValues": []
										},
										{
											"id": "F_SHL4Y",
											"name": "用户ID",
											"dbType": "bigint",
											"bizType": "relation",
											"typeLabel": "关联到其他表",
											"enumValues": [],
											"relationEntityId": "E__ZPWG",
											"mapping": {
												"condition": "",
												"fieldJoiner": ",",
												"entity": {
													"id": "E__ZPWG",
													"isOpen": true,
													"name": "用户表",
													"createTime": 1684309269790,
													"updateTime": 1685007309376,
													"updated": true,
													"field": {
														"id": "F_KXBUQ",
														"isPrimaryKey": true,
														"name": "id",
														"desc": "主键",
														"dbType": "bigint",
														"bizType": "number",
														"typeLabel": "数字",
														"enumValues": []
													},
													"fieldAry": [
														{
															"id": "F_RGPTV",
															"name": "用户名称",
															"dbType": "varchar",
															"bizType": "string",
															"typeLabel": "字符",
															"enumValues": []
														},
														{
															"id": "F_TZKKY",
															"name": "年龄",
															"dbType": "varchar",
															"bizType": "string",
															"typeLabel": "字符",
															"enumValues": []
														},
														{
															"id": "F_LYRK1",
															"name": "简介",
															"dbType": "mediumtext",
															"bizType": "string",
															"typeLabel": "长文本",
															"enumValues": []
														}
													]
												},
												"type": "primary",
												"desc": "用户表 的 用户名称,年龄,简介"
											}
										},
										{
											"id": "F_F1IF_",
											"name": "字段0",
											"dbType": "varchar",
											"bizType": "string",
											"typeLabel": "字符",
											"enumValues": []
										}
									]
								},
								"type": "foreigner",
								"desc": "爱好表 的 id,用户ID,字段0"
							}
						}
					]
				},
			},
			createTime: Date.now(),
			updateTime: Date.now(),
		});
		onClose();
	}, [title]);
	
	return ReactDOM.createPortal(
	  panelVisible & AGGREGATION_MODEL_VISIBLE ? (
		  <div className={styles.sidebarPanelEdit} data-id="plugin-panel" style={{ ...style, left: 361 }}>
			  <div className={styles.sidebarPanelTitle}>
				  <div>聚合模型</div>
				  <div>
					  <Button size='small' type="primary"  onClick={onSave}>
						  保 存
					  </Button>
				  </div>
			  </div>
			  <div className={styles.item}>
				  <label>模型名称</label>
				  <div className={`${styles.editor} ${styles.textEdt}`} style={{ marginRight: '12px' }}>
					  <input
						  type="text"
						  placeholder="模型名称"
						  defaultValue={title}
						  onChange={(e) => setTitle(e.target.value)}
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
					  <Select formModel={formModelMap.SELECT} onChange={() => {}} />
				  ) : null}
			  </div>
		  </div>
	  ) : null,
	  document.body
  );
};

export default AggregationModel;
