/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {onMounted, reactive, ref, watch} from 'vue'
import type {IJsonItem} from '../types'
import {useMessage} from "naive-ui";
import styles from "../index.module.scss";
import jsPlumb from 'jsplumb'
import axios from "axios";
import { querySqlColum } from '@/service/modules/task-definition'

export function useColumnJsplumb(
  model: { [field: string]: any },
  params: {
    leftField?: string
    rightField?: string
    leftDataList?: string
    rightDataList?: string
  } = {}
): IJsonItem[] {

    const message = useMessage()
    const jsplumb = jsPlumb.jsPlumb
    const SecondDevQueryUrl = import.meta.env.MODE === 'development'
        ? import.meta.env.VITE_APP_DEV_API_URL
        : window.webConfig.VITE_APP_PROD_API_URL
    let plumbins = null // 缓存实例化的jsplumb对象
    let connection = []
    let connectionList = [] //手动维护一个关系
    let info = {}

    const state = reactive({
        formRef: ref()
    })
    const formSource = ref({
        id: 1,
        type: 0,
        tableName: ''
    })
    const formTarget = ref({
        id: 1,
        type: 0,
        tableName: ''
    })
    const formSql = ref({
        sql: ''
    })

    const leftData= ref([]);
    const rightData = ref([])

    function execute() {
        Disassociate()
        init()
        let getCol = SecondDevQueryUrl + '/HDataApi/apiService/getColumnsByTable'
        formTarget.value.id = model['dataTarget']
        formTarget.value.type = parseInt(model['dtType'].replace('MYSQL', 0).replace('ORACLE', 5).replace('SQLSERVER', 6))
        formTarget.value.tableName = model['dtType'] == 'ORACLE' || model['dtType'] == 'SQLSERVER' ? model['targetDatabase'] + '.' + model['targetTable'] : model['targetTable']
        if ( (model['executeMode'] == 0 ? !!model['sourceTable'] : !!model['sql']) && !!model['targetTable'] )
        {
            axios
                .post(getCol, formTarget.value)
                .then(async function (response) {

                    if (response.data.status == 0) {
                        message.error(response.data.error)
                    } else {
                        rightData.value = response.data.data.map(item => {
                                let res = {
                                    id: '',
                                    label: '',
                                    type: ''
                                }
                                res.id = 'T' + model['dtType'] + model['dataTarget'] + item.TABLE_NAME
                                res.label = item.TABLE_NAME
                                res.type = item.COLUMN_TYPE
                                return res
                            }
                        )
                    }
                    if (model['executeMode'] == 0) {
                        formSource.value.id = model['dataSource']
                        formSource.value.type = parseInt(model['dsType'].replace('MYSQL', 0).replace('ORACLE', 5).replace('SQLSERVER', 6))
                        formSource.value.tableName = model['dsType'] == 'ORACLE' || model['dsType'] == 'SQLSERVER' ? model['sourceDatabase'] + '.' + model['sourceTable'] : model['sourceTable']
                        axios
                            .post(getCol, formSource.value)
                            .then(function (response) {

                                if (response.data.status == 0) {
                                    message.error(response.data.error)
                                } else {
                                    leftData.value = response.data.data.map(item => {
                                            let res = {
                                                id: '',
                                                label: '',
                                                type: ''
                                            }
                                            res.id = 'S' + model['dsType'] + model['dataSource'] + item.TABLE_NAME
                                            res.label = item.TABLE_NAME
                                            res.type = item.COLUMN_TYPE
                                            return res
                                        }
                                    )
                                }
                                setTimeout(() => {
                                    leftData.value.forEach((item, index) => {
                                        initNode(item.id, "source");
                                    });
                                    rightData.value.forEach((item, index) => {
                                        initNode(item.id, "target");
                                    });
                                    model[params.leftDataList] = leftData.value
                                    model[params.rightDataList] = rightData.value
                                }, 1)
                            })
                            .catch(function (error) {
                                message.error(error)
                            })
                    } else {
                        formSql.value.sql = model['sql']
                        const res = await querySqlColum(formSql.value)

                        leftData.value = res.map((item: any) => {
                                let res = {
                                    id: '',
                                    label: '',
                                    type: ''
                                }
                                res.id = 'S' + model['dsType'] + model['dataSource'] + item.TABLE_NAME
                                res.label = item.TABLE_NAME
                                res.type = item.COLUMN_TYPE
                                return res
                            }
                        )
                        setTimeout(() => {
                            leftData.value.forEach((item, index) => {
                                initNode(item.id, "source");
                            });
                            rightData.value.forEach((item, index) => {
                                initNode(item.id, "target");
                            });
                            model[params.leftDataList] = leftData.value
                            model[params.rightDataList] = rightData.value
                        }, 1)
                    }
                })
                .catch(function (error) {
                    message.error(error)
                })
        }else message.error('必须填写表名或查询语句以获取字段！')
    }

    function init()  {
        //   初始化实例
        jsplumb.ready(() => {
            plumbins = jsplumb.getInstance({
                Container: "plumbContent", // 选择器id
                Connector: ["Straight",
                    {
                        curviness: 70,
                        //stub: [40, 60],
                        gap: 8,
                        cornerRadius: 5,
                        alwaysRespectStubs: true,
                    },], //直线连接
                ConnectionOverlays: [
                    ['Arrow', {
                        location: 1,
                        visible: true,
                        width: 8,
                        length: 8,
                        id: 'ARROW',
                    }],
                ]
            });
            // 双击删除连线
            plumbins.bind("dblclick", (connection, originalEvent) => {
                plumbins.deleteConnection(connection);
                getConnetion()
            });
            plumbins.bind("connection", (conn, originEvent) => {
                // 数据存入
                getConnetion()
            });
            plumbins.batch(() => {
                leftData.value.forEach((item, index) => {
                    initNode(item.id, "source");
                });
                rightData.value.forEach((item, index) => {
                    initNode(item.id, "target");
                });
            });
            // 添加列表支持滚动
            // plumbins.addList(leftBottom);
            // plumbins.addList(rightBottom);
        });
        window.addEventListener("resize", repaintPlumb);
    }

    function initNode(id: string, type: string) {
        // 初始化点使其可以连接
        const ins = plumbins;
        const elements = document.getElementById(id);
        if (type === "source") {
            ins.makeSource(elements, {
                // 锚点
                cssClass: styles.sourcePoint,
                anchor: [1, 0.5, 0, 0],
                allowLoopback: false,
                maxConnections: 1, //一对一就把maxConnections设置为1，一对多就设置为-1
                //   锚点样式
                /*paintStyle: {
                    fill: "skyblue",
                    strokeWidth: 3,
                    radius: 5,
                },*/
                paintStyle: {
                    stroke: '#00cdea',
                    fill: '#FFF',
                    radius: 4,
                    strokeWidth: 2,
                },
                hoverPaintStyle: {
                    stroke: '#00cdea',
                    fill: '#00cdea',
                },
                //   连线样式
                connectorStyle: {
                    strokeWidth: 2,
                    stroke: '#b4bdc5',
                    joinstyle: 'round',
                    outlineStroke: 'transparent',
                    outlineWidth: 2,
                },
                connectorHoverStyle: {
                    // strokeWidth: 2,
                    stroke: '#216477',
                },
            });
        } else {
            ins.makeTarget(elements, {
                anchor: [0, 0.5, 1, 0], // 锚点
                //   锚点样式
                // paintStyle: {
                //   strokeWidth: 2,
                //   radius: 20,
                // },
                allowLoopback: false,
                maxConnections: 1, //一对一就把maxConnections设置为1，一对多就设置为-1
                paintStyle: {
                    stroke: '#00cdea',
                    fill: '#FFF',
                    radius: 4,
                    strokeWidth: 2,
                },
                hoverPaintStyle: {
                    stroke: '#00cdea',
                    fill: '#00cdea',
                }
            });
        }
    }

    function repaintPlumb() {
        plumbins.repaintEverything();
    }

    function Disassociate() {
        let activities = plumbins.getConnections();
        activities.forEach((activeitem, index) => {
            plumbins.deleteConnection(activeitem)
        })
        getConnetion()
    }

    function Sameline() {
        let activities = plumbins.getConnections();
        activities.forEach((activeitem, index) => {
            plumbins.deleteConnection(activeitem)
        })
        leftData.value.forEach((item, index) => {
            let obj = {};
            obj.source = item.id;
            //initNode(item.id, "source");
            if (rightData.value.length > index) {
                obj.target = rightData.value[index].id;
                //initNode(obj.source, "source");
                //initNode(obj.target, "target");
                plumbins.connect(obj);
            }
        });
        getConnetion()
    }

    function Samename()  {
        let activities = plumbins.getConnections();
        activities.forEach((activeitem, index) => {
            plumbins.deleteConnection(activeitem)
        })
        leftData.value.forEach((item, index) => {
            let obj = {};
            obj.source = item.id;
            let target = rightData.value.filter(ritem => ritem.label.toLowerCase() == item.label.toLowerCase());
            if (target.length > 0) {
                obj.target = target[0].id;
                //initNode(obj.source, "source");
                //initNode(obj.target, "target");
                plumbins.connect(obj);
            }
        });
        getConnetion()
    }

    // 保存连线关系
    function getConnetion()  {
        let connections = plumbins.getConnections();
        let readColumn = []
        let writerColumn = []
        if(!!model[params.leftDataList])
        {
            let sortData = model[params.leftDataList].map(item=>item.label)
            connections.sort((a, b) => {
            return sortData.indexOf(a.sourceId.replace('S' + model['dsType'] + model['dataSource'], '')) - sortData.indexOf(b.sourceId.replace('S' + model['dsType'] + model['dataSource'], ''));
            })
        }
        for (var i in connections) {
            // connections 是线数据数组
            //info[connections[i].sourceId] = connections[i].targetId;
            readColumn.push(connections[i].sourceId.replace('S' + model['dsType'] + model['dataSource'], ''))
            writerColumn.push(connections[i].targetId.replace('T' + model['dtType'] + model['dataTarget'], ''))
        }
        model[params.leftField]  = readColumn
        model[params.rightField]  = writerColumn
    }

    watch(
        () => [model.leftData,model.leftData],
        () => {
            leftData.value = model['leftData']
            rightData.value = model['rightData']
        }
    )

    onMounted(() => {
        setTimeout(()=>{
            init();
            let leftList = model['leftList']
            let rightList = model['rightList']
            leftList.forEach((item, index) => {
                let obj = {};
                obj.source = 'S' + model['dsType'] + model['dataSource'] + item;
                obj.target = 'T' + model['dtType'] + model['dataTarget'] + rightList[index]
                //initNode(obj.source, "source");
                //initNode(obj.target, "target");
                plumbins.connect(obj);
            })
        },1)
    })

  return [
     {
       type: 'button',
       span: 2,
       props: {
           'onClick': execute,
           type:'info',
           size: 'small',
           class : styles.button
       },
       childProps: {
           default: ()=> {return model['executeMode'] == 1 ? '解析SQL' : '获取字段'}
       },
     },
     {
         type: 'button',
         span: 2,
         props: {
              'onClick': Sameline,
              type:'info',
              size: 'small',
              class : styles.button
          },
          childProps: {
              default: ()=> {return '同行关联'}
          },
      },
     {
         type: 'button',
         span: 2,
         props: {
             'onClick': Samename,
             type:'info',
             size: 'small',
             class : styles.button
         },
         childProps: {
             default: ()=> {return '同名关联'}
         },
     },
     {
          type: 'button',
          span: 2,
          props: {
              'onClick': Disassociate,
              type:'info',
              size: 'small',
              class : styles.button
          },
          childProps: {
              default: ()=> {return '取消关联'}
          },
      },
    {
      type: 'column-jsplumb',
      field: leftData,
      fieldRight: rightData,
    },
    {
        type: 'input',
        field: params.leftField,
        span: 0
    },
    {
        type: 'input',
        field: params.rightField,
        span: 0
    },
    {
        type: 'input',
        field: params.leftDataList,
        span: 0
    },
    {
        type: 'input',
        field: params.rightDataList,
        span: 0
    },
  ]
}
