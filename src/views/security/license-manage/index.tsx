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

import { defineComponent, onMounted, toRefs, watch } from 'vue'
import {
  NButton,
  NCard,
  NDescriptions
} from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { useTable } from './use-table'
import LicenseModal from './components/license-modal'
import styles from './index.module.scss'

const licenseManager = defineComponent({
  name: 'license-manage',
  setup() {
    const { t } = useI18n()
    const { variables, getTableData } = useTable()

    const requestData = () => {
      getTableData()
    }

    const handleModalChange = () => {
      variables.showModalRef = true
    }

    const onCancelModal = () => {
      variables.showModalRef = false
    }

    const onConfirmModal = () => {
      variables.showModalRef = false
      requestData()
    }

    onMounted(() => {
      requestData()
    })

    return {
      t,
      ...toRefs(variables),
      requestData,
      onCancelModal,
      onConfirmModal,
      handleModalChange
    }
  },
  render() {
    const {
      t,
      requestData,
      onCancelModal,
      onConfirmModal,
      handleModalChange,
      loadingRef
    } = this

    return (
      <div>
        <NCard>
          <div class={styles['search-card']}>
            <div>
              <NButton
                size='small'
                type='primary'
                onClick={handleModalChange}
                class='btn-create-queue'
              >
                {t('security.license.change_license')}
              </NButton>
            </div>
          </div>
        </NCard>
        <NCard class={styles['table-card']}>
          <NDescriptions label-placement="left" title="License管理" column={1} size="large">
            <NDescriptions-item label="产品名称" label-style={{color: "#757575"}}>
              {this.tableData.productName}
            </NDescriptions-item>
            <NDescriptions-item label="产品版本" label-style={{color: "#757575"}}>
              {this.tableData.productVersion}
            </NDescriptions-item>
            <NDescriptions-item label="Mac地址" label-style={{color: "#757575"}}>
              {this.tableData.macAddr}
            </NDescriptions-item>
            <NDescriptions-item label="有效截止日期" label-style={{color: "#757575"}}>
              {this.tableData.licenseDate}
            </NDescriptions-item>
            <NDescriptions-item label="剩余有效天数" label-style={{color: "#757575"}}>
              {this.tableData.dayDiff}
            </NDescriptions-item>
        </NDescriptions>
        </NCard>
        <LicenseModal
          showModalRef={this.showModalRef}
          onCancelModal={onCancelModal}
          onConfirmModal={onConfirmModal}
        />
      </div>
    )
  }
})

export default licenseManager
