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
import {ref, onMounted, watch, computed, h, onBeforeUnmount, onUpdated} from 'vue'
import { useI18n } from 'vue-i18n'
import {useCreateTable, useCustomParams, useDatasource, useColumnJsplumb} from '.'
import type { IJsonItem } from '../types'
import styles from "@/views/projects/task/components/node/index.module.scss";
import {cloneDeep, lowerCase} from "lodash";
import {queryTaskConnect} from "@/service/modules/task-definition";

export function useDataX(model: { [field: string]: any }): IJsonItem[] {
  const { t } = useI18n()

  const jobSpeedByteOptions: any[] = [
    {
      label: `0(${t('project.node.unlimited')})`,
      value: 0
    },
    {
      label: '1KB',
      value: 1024
    },
    {
      label: '10KB',
      value: 10240
    },
    {
      label: '50KB',
      value: 51200
    },
    {
      label: '100KB',
      value: 102400
    },
    {
      label: '512KB',
      value: 524288
    }
  ]
  const jobSpeedRecordOptions: any[] = [
    {
      label: `0(${t('project.node.unlimited')})`,
      value: 0
    },
    {
      label: '500',
      value: 500
    },
    {
      label: '1000',
      value: 1000
    },
    {
      label: '1500',
      value: 1500
    },
    {
      label: '2000',
      value: 2000
    },
    {
      label: '2500',
      value: 2500
    },
    {
      label: '3000',
      value: 3000
    }
  ]
  const memoryLimitOptions = [
    {
      label: '1G',
      value: 1
    },
    {
      label: '2G',
      value: 2
    },
    {
      label: '3G',
      value: 3
    },
    {
      label: '4G',
      value: 4
    }
  ]

  const sqlEditorSpan = ref(0)
  const jsonEditorSpan = ref(0)
  const datasourceSpan = ref(6)
  const destinationDatasourceSpan = ref(8)
  const otherStatementSpan = ref(22)
  const jobSpeedSpan = ref(6)
  const customParameterSpan = ref(0)
  const executeModeSpan = ref(12)
  const sourceTableSpan = ref(12)
  const sourceDatabaseSpan  = ref(0)
  const targetTableSpan = ref(12)
  const targetDatabaseSpan  = ref(0)
  const tagSpan = ref (12)
  const autoCreate = computed(() => (model.executeMode==0 ? 24 : 0))
  const autoCreSpanMiddle = computed(() => (model.executeMode==0 && model.autoCreate ? 6 : 0))
  const autoCreSpanShort = computed(() => (model.executeMode==0 && model.autoCreate ? 2 : 0))
  const autoCreSpanLong = computed(() => (model.executeMode==0 && model.autoCreate ? 24 : 0))
  const tips = computed(() => (model.dsType=='MYSQL' ? '表名' : '库名.表名'))
  const targetDataBasePlaceHolder = computed(()=> model.dtType=='ORACLE' ? t('project.node.datax_ora_tips') : t('project.node.datax_sql_tips'))
  const sourceDataBasePlaceHolder = computed(()=> model.dsType=='ORACLE' ? t('project.node.datax_ora_tips') : t('project.node.datax_sql_tips'))
  const sourceConnect = ref({
    jdbcUrl: '',
    password: '',
    user: '',
    database: ''
  })
  const targetConnect = ref({
    jdbcUrl: '',
    password: '',
    user: '',
    database: ''
  })

  const initConstants = () => {
    /*if (model.jsonConfig) {
      sqlEditorSpan.value = 0
      sourceTableSpan.value = 0
      sourceDatabaseSpan.value = 0
      targetTableSpan.value = 0
      targetDatabaseSpan.value = 0
      datasourceSpan.value = 0
      jsonEditorSpan.value = 24
      destinationDatasourceSpan.value = 0
      otherStatementSpan.value = 0
      jobSpeedSpan.value = 0
      customParameterSpan.value = 0
    } else {*/
      sqlEditorSpan.value = model.executeMode === '0' ? 0 : 24
      sourceTableSpan.value = model.executeMode=== '1' ? 0 : (model.dsType=='ORACLE' || model.dsType=='SQLSERVER'? 6: 12)
      sourceDatabaseSpan.value = model.executeMode === '0' && (model.dsType=='ORACLE' || model.dsType=='SQLSERVER') ? 6 : 0
      targetTableSpan.value = model.dtType=='ORACLE' || model.dtType=='SQLSERVER'? 6: 12
      targetDatabaseSpan.value = model.dtType=='ORACLE' || model.dtType=='SQLSERVER'? 6: 0
      datasourceSpan.value = 6
      jsonEditorSpan.value = model.jsonConfig ? 24 : 0
      destinationDatasourceSpan.value = 6
      otherStatementSpan.value = 22
      jobSpeedSpan.value = 6
      customParameterSpan.value = 0
    //}
  }

  const getConnect = (id: number, type: string)=>{
    queryTaskConnect(id).then(
        (res: any) => {
          if(type=='dataSource'){ sourceConnect.value = res } else { targetConnect.value = res }
        }
    )
  }

  const saveJson = () =>{
    if(model.executeMode == '0'){
      model.json = JSON.stringify({
        "job": {
          "content": [
            {
              "reader": {
                "name": lowerCase(['ORACLE','SQLSERVER','MYSQL','POSTGRESQL'].includes(model.dsType)? model.dsType : 'rdbms')+"reader",
                "parameter": {
                  "column":  model.leftList,
                  "connection": [
                    {
                      "jdbcUrl": [
                        sourceConnect.value.jdbcUrl
                      ],
                      "table": [
                        model.dsType=='ORACLE' || model.dsType=='SQLSERVER' ? model.sourceDatabase+'.'+model.sourceTable : model.sourceTable
                      ]
                    }
                  ],
                  "fetchSize": 1024,
                  "incrementColumn": "",
                  "incrementStrategy": "NONE",
                  "password": sourceConnect.value.password,
                  "splitPk": "",
                  "username": sourceConnect.value.user,
                  "where": ""
                }
              },
              "writer": {
                "name": lowerCase(['ORACLE','SQLSERVER','MYSQL','POSTGRESQL'].includes(model.dtType)? model.dtType : 'rdbms')+"writer",
                "parameter": {
                  "batchSize": 1024,
                  "column": model.rightList,
                  "connection": [
                    {
                      "jdbcUrl": targetConnect.value.jdbcUrl,
                      "table": [
                        model.dtType=='ORACLE' || model.dtType=='SQLSERVER' ? model.targetDatabase+'.'+model.targetTable : model.targetTable
                      ]
                    }
                  ],
                  "password": targetConnect.value.password,
                  "postSql": model.postStatements,
                  "preSql": model.preStatements,
                  "username": targetConnect.value.user
                }
              }
            }
          ],
          "setting": {
            "errorLimit": {
              "percentage": "0",
              "record": "0"
            },
            "speed": {
              "channel": "1",
              "byte": model.jobSpeedByte,
              "record": model.jobSpeedRecord
            }
          }
        }
      },null,4)}
    else
    {
      model.json = JSON.stringify({
        "job": {
          "content": [
            {
              "reader": {
                "name": lowerCase(['ORACLE','SQLSERVER','MYSQL','POSTGRESQL'].includes(model.dsType)? model.dsType : 'rdbms')+"reader",
                "parameter": {
                  "column":  model.leftList,
                  "connection": [
                    {
                      "jdbcUrl": [
                        sourceConnect.value.jdbcUrl
                      ],
                      "querySql": [
                        model.sql
                      ]
                    }
                  ],
                  "fetchSize": 1024,
                  "incrementColumn": "",
                  "incrementStrategy": "NONE",
                  "password": sourceConnect.value.password,
                  "splitPk": "",
                  "username": sourceConnect.value.user,
                  "where": ""
                }
              },
              "writer": {
                "name": lowerCase(['ORACLE','SQLSERVER','MYSQL','POSTGRESQL'].includes(model.dtType)? model.dtType : 'rdbms')+"writer",
                "parameter": {
                  "batchSize": 1024,
                  "column": model.rightList,
                  "connection": [
                    {
                      "jdbcUrl": targetConnect.value.jdbcUrl,
                      "table": [
                        model.dtType=='ORACLE' || model.dtType=='SQLSERVER' ? model.targetDatabase+'.'+model.targetTable : model.targetTable
                      ]
                    }
                  ],
                  "password": targetConnect.value.password,
                  "postSql": model.postStatements,
                  "preSql": model.preStatements,
                  "username": targetConnect.value.user
                }
              }
            }
          ],
          "setting": {
            "errorLimit": {
              "percentage": "0",
              "record": "0"
            },
            "speed": {
              "channel": "1",
              "byte": model.jobSpeedByte,
              "record": model.jobSpeedRecord
            }
          }
        }
      },null,4)
    }
  }

  onMounted(() => {
    initConstants()
  })

  watch(
    () => [model.executeMode],
    () => {
      initConstants()
    }
  )

  watch(
      () => [model.jsonConfig],
      () => {
        if(model.jsonConfig){
          jsonEditorSpan.value = 24
        }else {
          jsonEditorSpan.value = 0
          saveJson()
        }
      }
  )

  watch(
      () => [model.dataSource],
      () => {
        if(!!model.dataSource) getConnect(model.dataSource, 'dataSource')
      }
  )

  watch(
      () => [model.dataTarget],
      () => {
        if(!!model.dataTarget) getConnect(model.dataTarget, 'dataTarget')
      }
  )

  watch(
      () => [model.dsType],
      () => {
        sourceTableSpan.value = model.executeMode=== '1' ? 0 : ( model.dsType=='ORACLE' || model.dsType=='SQLSERVER'? 6: 12)
        sourceDatabaseSpan.value = model.executeMode === '0' && ( model.dsType=='ORACLE' || model.dsType=='SQLSERVER') ? 6 : 0
      }
  )

  watch(
      () => [model.dtType],
      () => {
        targetTableSpan.value = model.dtType=='ORACLE' || model.dtType=='SQLSERVER'? 6: 12
        targetDatabaseSpan.value = model.dtType=='ORACLE' || model.dtType=='SQLSERVER'? 6: 0
      }
  )

  watch(
      () => [model.leftList, model.rightList, sourceConnect.value, targetConnect.value],
      () => {
        if(!model.jsonConfig)saveJson()
      }
  )

  return [
    {
      type: 'custom',
      field: 'custom-title-source',
      span: tagSpan,
      widget: h(
          'div',
          { class: styles['field-title'] },
          t('project.node.data_source')
      )
    },
    {
      type: 'custom',
      field: 'custom-title-target',
      span: tagSpan,
      widget: h(
          'div',
          { class: styles['field-title'] },
          t('project.node.data_target')
      )
    },
    ...useDatasource(model, {
      typeField: 'dsType',
      sourceField: 'dataSource',
      span: datasourceSpan
    }),
    ...useDatasource(model, {
      typeField: 'dtType',
      sourceField: 'dataTarget',
      span: destinationDatasourceSpan
    }),
    {
      type: 'radio',
      field: 'executeMode',
      name: '读取方式',
      span: executeModeSpan,
      options: [{label:'表',value:'0'},{label:'查询',value:'1'}]
    },
    {
      type: 'input',
      field: 'targetDatabase',
      name: t('project.node.datax_target_database'),
      span: targetDatabaseSpan,
      props: {
        placeholder: targetDataBasePlaceHolder,
        onBlur: saveJson
      },
      validate: {
        trigger: ['input', 'blur'],
        required: true
      }
    },
    {
      type: 'input',
      field: 'targetTable',
      name: t('project.node.datax_target_table'),
      span: targetTableSpan,
      props: {
        placeholder: t('project.node.datax_target_table_tips'),
        onBlur: saveJson
      },
      validate: {
        trigger: ['input', 'blur'],
        required: true
      }
    },
    {
      type: 'input',
      field: 'sourceDatabase',
      name: t('project.node.datax_source_database'),
      span: sourceDatabaseSpan,
      props: {
        placeholder: sourceDataBasePlaceHolder,
        onBlur: saveJson
      },
      validate: {
        trigger: ['input', 'blur'],
        required: true
      }
    },
    {
      type: 'input',
      field: 'sourceTable',
      name: t('project.node.datax_source_table'),
      span: sourceTableSpan,
      props: {
        placeholder: t('project.node.datax_source_table'),
        onBlur: saveJson
      },
      validate: {
        trigger: ['input', 'blur'],
        required: true
      }
    },
    {
      type: 'switch',
      field: 'autoCreate',
      name: '自动建表',
      span: autoCreate
    },
    ...useCreateTable(model, {
      tableField: 'sourceTable',
      sqlField: 'tableSql',
      createField: 'createTable',
      tips: tips,
      spanMiddle: autoCreSpanMiddle,
      spanShort: autoCreSpanShort,
      spanLong: autoCreSpanLong
    }),
    {
      type: 'editor',
      field: 'sql',
      name: t('project.node.sql_statement'),
      span: sqlEditorSpan,
      validate: {
        trigger: ['input', 'trigger'],
        required: true,
        message: t('project.node.sql_empty_tips')
      }
    },
    {
      type: 'custom',
      field: 'custom-title-source',
      span: 24,
      widget: h(
          'div',
          { class: styles['field-title'] },
          '字段映射'
      )
    },
    ...useColumnJsplumb(model, {
      leftField: 'leftList',
      rightField: 'rightList',
      leftDataList: 'leftData',
      rightDataList: 'rightData'
    }),
    {
      type: 'multi-input',
      field: 'preStatements',
      name: t('project.node.datax_target_database_pre_sql'),
      span: otherStatementSpan,
      props: {
        placeholder: t('project.node.datax_non_query_sql_tips'),
        type: 'textarea',
        autosize: { minRows: 1 },
        onBlur: saveJson
      }
    },
    {
      type: 'multi-input',
      field: 'postStatements',
      name: t('project.node.datax_target_database_post_sql'),
      span: otherStatementSpan,
      props: {
        placeholder: t('project.node.datax_non_query_sql_tips'),
        type: 'textarea',
        autosize: { minRows: 1 },
        onBlur: saveJson
      }
    },
    {
      type: 'select',
      field: 'jobSpeedByte',
      name: t('project.node.datax_job_speed_byte'),
      span: jobSpeedSpan,
      options: jobSpeedByteOptions,
      value: 0,
      props: {
        onBlur: saveJson
      }
    },
    {
      type: 'select',
      field: 'jobSpeedRecord',
      name: t('project.node.datax_job_speed_record'),
      span: jobSpeedSpan,
      options: jobSpeedRecordOptions,
      value: 1000,
      props: {
        onBlur: saveJson
      }
    },
    {
      type: 'custom-parameters',
      field: 'localParams',
      name: t('project.node.custom_parameters'),
      span: customParameterSpan,
      children: [
        {
          type: 'input',
          field: 'prop',
          span: 10,
          props: {
            placeholder: t('project.node.prop_tips'),
            maxLength: 256
          },
          validate: {
            trigger: ['input', 'blur'],
            required: true,
            validator(validate: any, value: string) {
              if (!value) {
                return new Error(t('project.node.prop_tips'))
              }

              const sameItems = model.localParams.filter(
                (item: { prop: string }) => item.prop === value
              )

              if (sameItems.length > 1) {
                return new Error(t('project.node.prop_repeat'))
              }
            }
          }
        },
        {
          type: 'input',
          field: 'value',
          span: 10,
          props: {
            placeholder: t('project.node.value_tips'),
            maxLength: 256
          }
        }
      ]
    },
    {
      type: 'select',
      field: 'xms',
      name: t('project.node.datax_job_runtime_memory_xms'),
      span: 6,
      options: memoryLimitOptions,
      value: 1
    },
    {
      type: 'select',
      field: 'xmx',
      name: t('project.node.datax_job_runtime_memory_xmx'),
      span: 6,
      options: memoryLimitOptions,
      value: 1
    },
    {
      type: 'switch',
      field: 'jsonConfig',
      name: '脚本模式'
    },
    {
      type: 'editor',
      field: 'json',
      name: t('project.node.datax_json_template'),
      span: jsonEditorSpan,
      validate: {
        trigger: ['input', 'trigger'],
        required: true,
        message: t('project.node.sql_empty_tips')
      }
    }
  ]
}
