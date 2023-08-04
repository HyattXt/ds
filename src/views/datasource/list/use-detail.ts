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

import {reactive, ref} from 'vue'
import {
  queryDataSource,
  createDataSource,
  updateDataSource,
  connectDataSource,
  verifyDataSourceName
} from '@/service/modules/data-source'
import { useI18n } from 'vue-i18n'
import type { IDataSource } from './types'
import axios from "axios";

export function useDetail(getFieldsValue: Function) {
  const { t } = useI18n()
  const status = reactive({
    saving: false,
    testing: false,
    loading: false
  })

  const chat2DbId = ref()

  let chat2DB = {}

  let PREV_NAME: string

  const formatParams = (): IDataSource => {
    const values = getFieldsValue()
    return {
      ...values,
      other: values.other ? JSON.parse(values.other) : null
    }
  }

  const formatChat2DB = (type: string, object: { name: string, host: string, port: string ,userName: string, password: string, database: string }) => {
    chat2DB = {
      ssh: {
        use: false,
        hostName: "",
        port: "22",
        userName: "",
        localPort: "",
        authenticationType: "password",
        password: ""
      },
      driverConfig: {
        jdbcDriverClass: "",
        jdbcDriver: ""
      },
      alias: "",
      host: "",
      port: "",
      authenticationType: "1",
      user: "",
      password: "",
      database: "",
      url: "",
      extendInfo: [],
      connectionEnvType: "DAILY",
      type: "MYSQL"
    }
    switch (type) {
      case 'MYSQL':
        chat2DB.alias = object.name
        chat2DB.host = object.host
        chat2DB.port = object.port
        chat2DB.user = object.userName
        chat2DB.password = object.password
        chat2DB.database = object.database
        chat2DB.type = 'MYSQL'
        chat2DB.url = 'jdbc:mysql://' + object.host + ':' + object.port + '/' + object.database
        chat2DB.extendInfo = [
          // @ts-ignore
          {
            key: "zeroDateTimeBehavior",
            value: "convertToNull"
          }
        ]
        chat2DB.driverConfig = {
          jdbcDriverClass: "com.mysql.cj.jdbc.Driver",
          jdbcDriver: "mysql-connector-java-8.0.30.jar"
        }
        break;
      case 'ORACLE':
        chat2DB.alias = object.name
        chat2DB.host = object.host
        chat2DB.port = object.port
        chat2DB.user = object.userName
        chat2DB.password = object.password
        chat2DB.sid = object.database
        delete chat2DB.database
        chat2DB.type = 'ORACLE'
        chat2DB.driver = 'thin'
        chat2DB.url = 'jdbc:oracle:thin:@' + object.host + ':' + object.port + '/' + object.database
        chat2DB.extendInfo = []
        chat2DB.driverConfig = {
          jdbcDriverClass: "oracle.jdbc.driver.OracleDriver",
          jdbcDriver: "ojdbc8-19.3.0.0.jar,orai18n-19.3.0.0.jar"
        }
        break;
      case 'POSTGRESQL':
        chat2DB.alias = object.name
        chat2DB.host = object.host
        chat2DB.port = object.port
        chat2DB.user = object.userName
        chat2DB.password = object.password
        chat2DB.database = object.database
        chat2DB.type = 'POSTGRESQL'
        chat2DB.url = 'jdbc:postgresql://' + object.host + ':' + object.port + '/' + object.database
        chat2DB.extendInfo = []
        chat2DB.driverConfig = {
          jdbcDriverClass: "org.postgresql.Driver",
          jdbcDriver: "postgresql-42.5.1.jar"
        }
        break;
      case 'SQLSERVER':
        chat2DB.alias = object.name
        chat2DB.host = object.host
        chat2DB.port = object.port
        chat2DB.user = object.userName
        chat2DB.password = object.password
        chat2DB.instance = object.database
        chat2DB.type = 'SQLSERVER'
        chat2DB.url = 'jdbc:sqlserver://' + object.host + ':' + object.port
        chat2DB.extendInfo = [
          {
            "key": "encrypt",
            "value": "true"
          },
          {
            "key": "trustServerCertificate",
            "value": "true"
          },
          {
            "key": "integratedSecurity",
            "value": "false"
          },
          {
            "key": "Trusted_Connection",
            "value": "yes"
          }
        ]
        chat2DB.driverConfig = {
          jdbcDriverClass: "com.microsoft.sqlserver.jdbc.SQLServerDriver",
          jdbcDriver: "mssql-jdbc-11.2.1.jre17.jar"
        }
        break;
      default:
        break;
    }
  }

  const createChat2DB = () =>{
  const createChat2DB = import.meta.env.MODE === 'development'
      ? '/chat2db/api/connection/datasource/create'
      : window.webConfig.VITE_APP_PROD_ASSETS_QUERY_URL+'/chat2db/api/connection/datasource/create'
  axios
      .post(createChat2DB, chat2DB)
      .then(function (response) {
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  const updateChat2DB = (id : number) =>{
    const updateChat2DB = import.meta.env.MODE === 'development'
        ? '/chat2db/api/connection/datasource/update'
        : window.webConfig.VITE_APP_PROD_ASSETS_QUERY_URL+'/chat2db/api/connection/datasource/update'
    chat2DB.id = id
    axios
        .post(updateChat2DB, chat2DB)
        .then(function (response) {
        })
        .catch(function (error) {
          console.log(error)
        })
  }

  const findChat2DB = (name: string) => {
    chat2DbId.value = null
    const findChat2DB = import.meta.env.MODE === 'development'
        ? '/chat2db/api/connection/datasource/list?pageNo=1&pageSize=999'
        : window.webConfig.VITE_APP_PROD_ASSETS_QUERY_URL+'/chat2db/api/connection/datasource/list?pageNo=1&pageSize=999'
    axios
        .get(findChat2DB)
        .then(function (response) {
          let data = response.data.data.data
          for (let i = 0; i < data.length; i++) {
            if (data[i].alias === name) {
              chat2DbId.value = data[i].id;
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
  }

  const queryById = async (id: number) => {
    if (status.loading) return {}
    status.loading = true
    const dataSourceRes = await queryDataSource(id)
    findChat2DB(dataSourceRes.name)
    status.loading = false
    PREV_NAME = dataSourceRes.name
    return dataSourceRes
  }

  const testConnect = async () => {
    if (status.testing) return
    status.testing = true
    try {
      const res = await connectDataSource(formatParams())
      window.$message.success(
        res
          ? res.msg
          : `${t('datasource.test_connect')} ${t('datasource.success')}`
      )
      status.testing = false
    } catch (err) {
      status.testing = false
    }
  }

  const createOrUpdate = async (id?: number) => {
    const values = getFieldsValue()

    if (status.saving || !values.name) return false
    status.saving = true

    try {
      if (PREV_NAME !== values.name) {
        await verifyDataSourceName({ name: values.name })
      }
      formatChat2DB(formatParams().type,formatParams())
      id
        ? await updateDataSource(formatParams(), id)
        : await createDataSource(formatParams())
      !!chat2DbId.value
      ? updateChat2DB(chat2DbId.value)
      : createChat2DB()
      status.saving = false
      return true
    } catch (err) {
      status.saving = false
      return false
    }
  }

  return { status, queryById, testConnect, createOrUpdate }
}
