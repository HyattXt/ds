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

import { defineComponent, Ref, toRefs, onMounted, toRef, watch } from 'vue'
import {
  NIcon,
  NDataTable,
  NButton,
  NInput,
  NBreadcrumb,
  NBreadcrumbItem, NForm, NGrid, NFormItemGi
} from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { SearchOutlined } from '@vicons/antd'
import FolderModal from './components/folder-modal'
import UploadModal from './components/upload-modal'
import { useTable } from './use-table'
import CrudForm from "@/components/cue/crud-form.vue";
import CrudHeader from "@/components/cue/crud-header.vue";
import CrudPageDs from "@/components/cue/crud-page-ds.vue";

export default defineComponent({
  name: 'resource-manage',
  setup() {
    const { variables, createColumns, getTableData, goUdfManage, goBread } =
      useTable()

    const requestData = () => {
      getTableData({
        id: variables.id,
        pageSize: variables.pageSize,
        pageNo: variables.page,
        searchVal: variables.searchVal
      })
    }


    const onUpdatePage = (page: number) => {
      variables.page = page
      requestData()
    }

    const handleUpdateList = () => {
      requestData()
    }

    const handleChangePageSize = (pageSize: number) => {
      variables.page = 1
      variables.pageSize = pageSize
      requestData()
    }

    const handleSearch = () => {
      variables.page = 1
      requestData()
    }

    const handleShowModal = (showRef: Ref<Boolean>) => {
      showRef.value = true
    }

    const handleCreateFolder = () => {
      variables.row = {}
      handleShowModal(toRef(variables, 'folderShowRef'))
    }

    const handleUploadFile = () => {
      handleShowModal(toRef(variables, 'uploadShowRef'))
    }

    const handleBread = (index: number) => {
      let breadName = ''
      variables.breadList.forEach((item, i) => {
        if (i <= index) {
          breadName = breadName + '/' + item
        }
      })
      goBread(breadName)
    }

    watch(useI18n().locale, () => {
      createColumns(variables)
    })

    onMounted(() => {
      createColumns(variables)
      requestData()
    })

    return {
      goUdfManage,
      handleBread,
      requestData,
      handleSearch,
      handleUpdateList,
      handleCreateFolder,
      handleUploadFile,
      onUpdatePage,
      handleChangePageSize,
      ...toRefs(variables)
    }
  },
  render() {
    const { t } = useI18n()
    const { loadingRef } = this

    return (
      <>
        <CrudForm>
          {{
            header: () => (
                <CrudHeader title="资源管理" addButton defineButton buttonTitle={'上传UDF'} onAddEvent={this.handleCreateFolder} onClickEvent={this.handleUploadFile}/>
            ),
            condition: () => (
                <div style={'display: row'}>
                  <NForm showFeedback={false} label-placement="left" style="margin-bottom: 3px">
                    <NGrid cols="18" x-gap="16">
                      <NFormItemGi label="名称" span="3">
                        <NInput
                          size={'small'}
                          placeholder={t('resource.udf.enter_keyword_tips')}
                          v-model={[this.searchVal, 'value']}
                        />
                    </NFormItemGi>
                      <NFormItemGi span="2">
                        <NButton size='small' color={'#0099CB'} type='primary' onClick={this.handleSearch} style={"padding: 0 15px 0 15px"}>
                          <NIcon>
                            <SearchOutlined />
                          </NIcon>
                          <div style={"font-size: 12px"}>
                            查询
                          </div>
                        </NButton>
                    </NFormItemGi>
                  </NGrid>
                  </NForm>
                  <NBreadcrumb separator='>'>
                    {this.breadList.length>0 && (
                      <NBreadcrumbItem>
                        <NButton text onClick={() => this.goUdfManage()}>
                          {t('resource.udf.udf_resources')}
                        </NButton>
                      </NBreadcrumbItem>
                    )}
                    {this.breadList.map((item, index) => (
                        <NBreadcrumbItem>
                          <NButton
                              text
                              disabled={index === this.breadList.length - 1}
                              onClick={() => this.handleBread(index)}
                          >
                            {item}
                          </NButton>
                        </NBreadcrumbItem>
                    ))}
                  </NBreadcrumb>
                </div>
            ),
            table: () => (
                <NDataTable
                    loading={loadingRef}
                    columns={this.columns}
                    data={this.tableData}
                    scrollX={this.tableWidth}
                    bordered
                    flex-height
                    single-line={false}
                    class={"cue-table"}
                />
            ),
            page: () => (
                <CrudPageDs
                    page={this.page}
                    page-size={this.pageSize}
                    item-count={this.total}
                    onPageChange={this.onUpdatePage}
                    onPageSizeChange={this.handleChangePageSize}
                />
            )
          }}
        </CrudForm>
        <FolderModal
          v-model:row={this.row}
          v-model:show={this.folderShowRef}
          onUpdateList={this.handleUpdateList}
        />
        <UploadModal
          v-model:show={this.uploadShowRef}
          onUpdateList={this.handleUpdateList}
        />
      </>
    )
  }
})
