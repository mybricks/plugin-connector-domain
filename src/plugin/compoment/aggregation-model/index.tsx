import React, {CSSProperties, FC, useCallback, useState} from 'react';
import ReactDOM from 'react-dom';
import Button from '../../../components/Button';
import {AGGREGATION_MODEL_VISIBLE, exampleParamsFunc, exampleResultFunc, NO_PANEL_VISIBLE} from '../../../constant';
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
			"input": "export%20default%20function%20(%7B%20params%2C%20data%2C%20headers%2C%20url%2C%20method%20%7D)%20%7B%0A%20%20const%20domainInfo%20%3D%20%7B%0A%20%20%20%20serviceId%3A%20'E_PDCOJ'%2C%0A%20%20%20%20fileId%3A%20'523'%0A%20%20%7D%0A%20%20const%20fields%20%3D%20(Array.isArray(data.fields)%20%26%26%20data.fields.length%20%3F%20data.fields%20%3A%20null)%20%7C%7C%20%5B%7B%22name%22%3A%22id%22%7D%2C%7B%22name%22%3A%22%E7%94%A8%E6%88%B7%E5%90%8D%22%7D%2C%7B%22name%22%3A%22%E5%A4%B4%E5%83%8F%22%7D%2C%7B%22name%22%3A%22%E6%80%A7%E5%88%AB%22%7D%2C%7B%22name%22%3A%22%E7%AD%89%E7%BA%A7%22%7D%2C%7B%22name%22%3A%22%E7%AD%89%E7%BA%A7.id%22%7D%2C%7B%22name%22%3A%22%E7%AD%89%E7%BA%A7.%E5%90%8D%E7%A7%B0%22%7D%2C%7B%22name%22%3A%22%E7%AD%89%E7%BA%A7.%E6%9B%B4%E6%96%B0%E6%97%B6%E9%97%B4%E5%AD%97%E7%AC%A6%E4%B8%B2%22%7D%2C%7B%22name%22%3A%22%E7%AD%89%E7%BA%A7.%E5%88%9B%E5%BB%BA%E6%97%B6%E9%97%B4%22%7D%2C%7B%22name%22%3A%22%E5%88%9B%E5%BB%BA%E8%80%85%22%7D%2C%7B%22name%22%3A%22%E5%88%9B%E5%BB%BA%E8%80%85.id%22%7D%2C%7B%22name%22%3A%22%E5%88%9B%E5%BB%BA%E8%80%85.%E5%90%8D%E7%A7%B0%22%7D%2C%7B%22name%22%3A%22%E6%9B%B4%E6%96%B0%E8%80%85%22%7D%2C%7B%22name%22%3A%22%E6%9B%B4%E6%96%B0%E8%80%85.id%22%7D%2C%7B%22name%22%3A%22%E6%9B%B4%E6%96%B0%E8%80%85.%E5%90%8D%E7%A7%B0%22%7D%2C%7B%22name%22%3A%22%E9%99%84%E4%BB%B6%22%7D%2C%7B%22name%22%3A%22%E5%AD%97%E6%AE%B50%22%7D%5D%3B%0A%20%20const%20query%20%3D%20data.keyword%20%3F%20fields.reduce((pre%2C%20item)%20%3D%3E%20%7B%0A%20%20%20%20return%20%7B%20...pre%2C%20%5Bitem.name%5D%3A%20%7B%20operator%3A%20'LIKE'%2C%20value%3A%20data.keyword%20%7D%20%7D%3B%0A%20%20%7D%2C%20%7B%7D)%20%3A%20undefined%3B%0A%20%20%0A%20%20%2F%2F%20%E8%AE%BE%E7%BD%AE%E8%AF%B7%E6%B1%82query%E3%80%81%E8%AF%B7%E6%B1%82%E4%BD%93%E3%80%81%E8%AF%B7%E6%B1%82%E5%A4%B4%0A%20%20return%20%7B%20params%2C%20data%3A%20%7B%0A%20%20%20%20params%3A%20%7B%0A%09%09%09...data%2C%0A%20%20%20%20%20%20query%2C%0A%09%09%09fields%2C%0A%09%09%09action%3A%20'SELECT'%0A%20%20%20%20%7D%2C%0A%20%20%20%20...domainInfo%2C%0A%20%20%7D%2C%20headers%2C%20url%2C%20method%20%7D%3B%0A%20%7D%0A",
			"output": "export%20default%20function%20(result%2C%20%7B%20method%2C%20url%2C%20params%2C%20data%2C%20headers%20%7D)%20%7B%0A%20%20%2F%2F%20return%20%7B%0A%20%20%2F%2F%20%20total%3A%20result.all%2C%0A%20%20%2F%2F%20%20dataSource%3A%20result.list.map(%7Bid%2C%20name%7D%20%3D%3E%20(%7B%0A%20%20%2F%2F%20%20%20%20%20value%3Aid%2C%20label%3A%20name%0A%20%20%2F%2F%20%20%7D))%0A%20%20%2F%2F%20%7D%0A%20%20return%20result%3B%0A%7D%0A",
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
				"serviceId": "E_PDCOJ_SELECT",
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
			content: {
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
