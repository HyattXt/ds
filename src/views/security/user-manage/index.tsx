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

import { defineComponent, toRefs } from 'vue'
import {
  NButton,
  NInput,
  NIcon,
  NDataTable,
  NForm, NGrid, NFormItemGi
} from 'naive-ui'
import UserDetailModal from './components/user-detail-modal'
import AuthorizeModal from './components/authorize-modal'
import { useI18n } from 'vue-i18n'
import { SearchOutlined } from '@vicons/antd'
import { useColumns } from './use-columns'
import { useTable } from './use-table'
import CrudForm from "@/components/cue/crud-form.vue";
import CrudHeader from "@/components/cue/crud-header.vue";
import CrudPageDs from "@/components/cue/crud-page-ds.vue";

const UsersManage = defineComponent({
  name: 'user-manage',
  setup() {
    const { t } = useI18n()
    const { state, changePage, changePageSize, updateList, onOperationClick } =
      useTable()
    const { columnsRef } = useColumns(onOperationClick)

    const onAddUser = () => {
      state.detailModalShow = true
      state.currentRecord = null
    }
    const onDetailModalCancel = () => {
      state.detailModalShow = false
    }
    const onAuthorizeModalCancel = () => {
      state.authorizeModalShow = false
    }

    return {
      t,
      columnsRef,
      ...toRefs(state),
      changePage,
      changePageSize,
      onAddUser,
      onUpdatedList: updateList,
      onDetailModalCancel,
      onAuthorizeModalCancel
    }
  },
  render() {
    return (
      <>
        <CrudForm>
          {{
            header: () => (
                <CrudHeader title="用户管理" addButton onAddEvent={this.onAddUser}/>
            ),
            condition: () => (
                <NForm showFeedback={false} label-placement="left" style="margin-bottom: 3px">
                  <NGrid cols="22" x-gap="16">
                    <NFormItemGi label="名称" span="4">
                      <NInput size='small' v-model:value={this.searchVal} clearable />
                    </NFormItemGi>
                    <NFormItemGi span="2">
                      <NButton size='small' color={'#0099CB'} type='primary' onClick={this.onUpdatedList} style={"padding: 0 15px 0 15px"}>
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
            ),
            table: () => (
                <NDataTable
                    columns={this.columnsRef.columns}
                    data={this.list}
                    loading={this.loading}
                    scrollX={this.columnsRef.tableWidth}
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
                    item-count={this.itemCount}
                    onPageChange={this.changePage}
                    onPageSizeChange={this.changePageSize}
                />
            )
          }}
        </CrudForm>
        <UserDetailModal
          show={this.detailModalShow}
          currentRecord={this.currentRecord}
          onCancel={this.onDetailModalCancel}
          onUpdate={this.onUpdatedList}
        />
        <AuthorizeModal
          show={this.authorizeModalShow}
          type={this.authorizeType}
          userId={this.currentRecord?.id}
          onCancel={this.onAuthorizeModalCancel}
        />
      </>
    )
  }
})

export default UsersManage
