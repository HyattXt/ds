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

import { reactive, h } from 'vue'
import { NEllipsis, NIcon } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import {
  FolderOutlined,
  DatabaseOutlined,
  DesktopOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
  LogoutOutlined,
  PartitionOutlined,
  SettingOutlined,
  FileSearchOutlined,
  RobotOutlined,
  AppstoreOutlined,
  UsergroupAddOutlined,
  UserAddOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  ControlOutlined,
  SlackOutlined,
  EnvironmentOutlined,
  KeyOutlined,
  SafetyOutlined,
  GroupOutlined,
  ContainerOutlined,
  ApartmentOutlined,
  BarsOutlined,
  CloudServerOutlined,
  BarChartOutlined,
  ProjectOutlined,
  FormOutlined,
  RadarChartOutlined,
  VerifiedOutlined, UnorderedListOutlined, TagsOutlined, AppstoreTwotone
} from '@vicons/antd'
import {SecurityFilled, DesignServicesFilled, PlaylistAddCheckTwotone} from '@vicons/material'
import { RuleDraft, UserAvatarFilled, UserMultiple} from '@vicons/carbon'
import { TextBulletListSquareEdit24Regular, DocumentBulletListClock20Regular, MyLocation16Filled, EditSettings24Regular} from '@vicons/fluent'
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/store/user/user'
import { timezoneList } from '@/common/timezone'
import type { UserInfoRes } from '@/service/modules/users/types'
import { useProjectStore } from "@/store/route/project";

export function useDataList() {
  const { t } = useI18n()
  const userStore = useUserStore()
  const ProjectStore = useProjectStore()

  const renderIcon = (icon: any) => {
    return () => h(NIcon, null, { default: () => h(icon) })
  }

  const localesOptions = [
    {
      label: 'English',
      key: 'en_US'
    },
    {
      label: '中文',
      key: 'zh_CN'
    }
  ]

  const timezoneOptions = () =>
    timezoneList.map((item) => ({ label: item, value: item }))

  const state = reactive({
    isShowSide: false,
    localesOptions,
    timezoneOptions: timezoneOptions(),
    userDropdownOptions: [],
    menuOptions: [],
    headerMenuOptions: [],
    iconMenuOptions: [],
    sideMenuOptions: []
  })

  const changeMenuOption = (state: any) => {
    const projectCode = ProjectStore.getCurrentProject
    state.menuOptions = [
      {
        label: () => h(NEllipsis, null, { default: () => t('menu.home') }),
        key: 'home',
      },
      {
        label: () => h(NEllipsis, null, { default: () => t('menu.project') }),
        key: 'projects',
        children: [
          {
            label: t('menu.workflow'),
            key: 'workflow',
            icon: renderIcon(PartitionOutlined),
            children: [
              {
                label: t('menu.workflow_relation'),
                key: `/projects/${projectCode}/workflow/relation`
              }
            ]
          }
        ]
      },
      {
        label: () => h(NEllipsis, null, { default: () => t('menu.resources') }),
        key: 'resource',
        icon: renderIcon(FolderOutlined),
        children: [
          {
            label: t('menu.file_manage'),
            key: '/resource/file-manage',
            icon: renderIcon(FileSearchOutlined)
          },
          {
            label: t('menu.udf_manage'),
            key: 'udf-manage',
            icon: renderIcon(RobotOutlined),
            children: [
              {
                label: t('menu.resource_manage'),
                key: '/resource/resource-manage'
              },
              {
                label: t('menu.function_manage'),
                key: '/resource/function-manage'
              }
            ]
          },
          {
            label: t('menu.task_group_manage'),
            key: 'task-group-manage',
            icon: renderIcon(GroupOutlined),
            children: [
              {
                label: t('menu.task_group_option'),
                key: '/resource/task-group-option'
              },
              {
                label: t('menu.task_group_queue'),
                key: '/resource/task-group-queue'
              }
            ]
          },
          {
            label: t('menu.resource_plan'),
            key: '/resource/resource-plan',
            icon: renderIcon(DesignServicesFilled)
          }
        ]
      },
      {
        label: () => h(NEllipsis, null, { default: () => t('menu.data_quality') }),
        key: 'data-quality',
        icon: renderIcon(ContainerOutlined),
        children: [
          {
            label: t('menu.task_result'),
            key: '/data-quality/task-result',
            icon: renderIcon(ApartmentOutlined)
          },
          {
            label: t('menu.rule'),
            key: '/data-quality/rule',
            icon: renderIcon(BarsOutlined)
          }
        ]
      },
      {
        label: () =>
          h(NEllipsis, null, { default: () => t('menu.datasource') }),
        key: 'datasource',
        icon: renderIcon(DatabaseOutlined),
        children: []
      },
      {
        label: () => h(NEllipsis, null, { default: () => t('menu.monitor') }),
        key: 'monitor',
        icon: renderIcon(DesktopOutlined),
        children: [
          {
            label: t('menu.service_manage'),
            key: 'service-manage',
            icon: renderIcon(AppstoreOutlined),
            children: [
              {
                label: t('menu.master'),
                key: '/monitor/master'
              },
              {
                label: t('menu.worker'),
                key: '/monitor/worker'
              },
              {
                label: t('menu.db'),
                key: '/monitor/db'
              }
            ]
          },
          {
            label: t('menu.statistical_manage'),
            key: 'statistical-manage',
            icon: renderIcon(AppstoreOutlined),
            children: [
              {
                label: t('menu.statistics'),
                key: '/monitor/statistics'
              },
              {
                label: t('menu.audit_log'),
                key: '/monitor/audit-log'
              }
            ]
          }
        ]
      },
      {
        label: () => h(NEllipsis, null, { default: () => t('menu.security') }),
        key: 'security',
        icon: renderIcon(SafetyCertificateOutlined),
        children:
          (userStore.getUserInfo as UserInfoRes).userType === 'ADMIN_USER'
            ? [
                {
                  label: t('menu.tenant_manage'),
                  key: '/security/tenant-manage',
                  icon: renderIcon(UsergroupAddOutlined)
                },
                {
                  label: t('menu.user_manage'),
                  key: '/security/user-manage',
                  icon: renderIcon(UserAddOutlined)
                },
                {
                  label: t('menu.alarm_group_manage'),
                  key: '/security/alarm-group-manage',
                  icon: renderIcon(WarningOutlined)
                },
                {
                  label: t('menu.alarm_instance_manage'),
                  key: '/security/alarm-instance-manage',
                  icon: renderIcon(InfoCircleOutlined)
                },
                {
                  label: t('menu.desensitization_manage'),
                  key: 'desensitization',
                  icon: renderIcon(SecurityFilled),
                  children: [
                    {
                      label: t('menu.desensitization_rule'),
                      key: '/security/desensitization/rule-manage'
                    },
                    {
                      label: t('menu.secret_key_manage'),
                      key: '/security/desensitization/secret-key-manage'
                    },
                    {
                      label: t('menu.desensitization_list'),
                      key: '/security/desensitization/list-manage'
                    }
                  ]
                },
                {
                  label: t('menu.worker_group_manage'),
                  key: '/security/worker-group-manage',
                  icon: renderIcon(ControlOutlined)
                },
                {
                  label: t('menu.yarn_queue_manage'),
                  key: '/security/yarn-queue-manage',
                  icon: renderIcon(SlackOutlined)
                },
                {
                  label: t('menu.environment_manage'),
                  key: '/security/environment-manage',
                  icon: renderIcon(EnvironmentOutlined)
                },
                {
                  label: t('menu.k8s_namespace_manage'),
                  key: '/security/k8s-namespace-manage',
                  icon: renderIcon(CloudServerOutlined)
                },
                {
                  label: t('menu.token_manage'),
                  key: '/security/token-manage',
                  icon: renderIcon(SafetyOutlined)
                },
                {
                  label: t('menu.license_manage'),
                  key: '/security/license-manage',
                  icon: renderIcon(VerifiedOutlined)
                }
              ]
            : [
                {
                  label: t('menu.token_manage'),
                  key: '/security/token-manage',
                  icon: renderIcon(SafetyOutlined)
                }
              ]
      },
      {
        label: () => h(NEllipsis, null, { default: () => t('menu.devops') }),
        key: 'devops',
        children: [
          {
            label: t('menu.devops_overview'),
            key: `/devops/${projectCode}/devops_overview`,
            icon: renderIcon(BarsOutlined)
          },
          {
            label: t('menu.devops_task'),
            key: 'devops_task',
            icon: renderIcon(SettingOutlined),
            children: [
              {
                label: t('menu.workflow_definition'),
                key: `/devops/${projectCode}/workflow-definition`
              },
              {
                label: t('menu.workflow_instance'),
                key: `/devops/${projectCode}/workflow/instances`
              },
              {
                label: t('menu.task_instance'),
                key: `/devops/${projectCode}/task/instances`
              }
            ]
          },
          {
            label: t('menu.devops_rest'),
            key: 'devops_rest',
            icon: renderIcon(BarsOutlined),
            children: [
              {
                label: t('menu.api_manager'),
                key: '/devops/service/api-manager'
              },
              {
                label: t('menu.rest_manager'),
                key: '/devops/rest/rest-manager'
              }
            ]
          },
          {
            label: t('menu.alarm_instance_manage'),
            key: '/devops/security/alarm-instance-manage',
            icon: renderIcon(InfoCircleOutlined)
          }
        ]
      },
      {
        label: () => h(NEllipsis, null, { default: () => t('menu.api') }),
        key: 'service',
        children: [
          {
            label: t('menu.api_dev'),
            key: '/service/api-dev',
            icon: renderIcon(ApartmentOutlined)
          },
          {
            label: t('menu.api_manager'),
            key: '/service/api-manager',
            icon: renderIcon(BarsOutlined)
          }
        ]
      },
      {
        label: () => h(NEllipsis, null, { default: () => t('menu.data_assets') }),
        key: 'data-assets',
        children: [
          {
            label: t('menu.assets'),
            key: '/data-assets/assets',
            icon: renderIcon(BarChartOutlined)
          },
          {
            label: t('menu.assets_catalog'),
            key: '/data-assets/assets-catalog',
            icon: renderIcon(BarsOutlined)
          },
          {
            label: t('menu.assets_query'),
            key: '/data-assets/assets-query',
            icon: () =>
              h(NIcon, null, {
                default: () =>
                  h(
                    'svg',
                    {
                      t: '1690188010748',
                      class: 'icon',
                      viewBox: '0 0 1024 1024',
                      version: '1.1',
                      xmlns: 'http://www.w3.org/2000/svg',
                      id: 'mx_n_1690188010750',
                      width: '150',
                      height: '150'
                    },
                    [
                      h('path', {
                        d: 'M1014.9 935.6l-32.3-32.3c26.1-35.7 41.5-79.7 41.5-127.3 0-88-52.6-163.6-128-197.3V242c0-39.6-23.4-76.6-64-108.2C753.6 72.8 611 32 448 32S142.4 72.8 64 133.8C23.4 165.4 0 202.4 0 242v476c0 116 200.6 210 448 210 67.7 0 131.8-7 189.3-19.6C676.8 959.3 738.6 992 808 992c48.6 0 93.5-16.1 129.6-43.2l32.1 32.1c6.2 6.3 14.4 9.4 22.6 9.4s16.4-3.1 22.6-9.4c12.5-12.5 12.5-32.8 0-45.3zM158.4 151.5c36.5-17.1 79.4-30.6 127.7-40.2C337.2 101.1 391.7 96 448 96s110.8 5.1 161.9 15.3c48.3 9.6 91.2 23.1 127.7 40.2 58.2 27.3 94.4 62 94.4 90.5s-36.2 63.3-94.4 90.5c-36.5 17.1-79.4 30.6-127.7 40.2C558.8 382.9 504.3 388 448 388s-110.8-5.1-161.9-15.3c-48.3-9.6-91.2-23.1-127.7-40.2C100.2 305.3 64 270.6 64 242s36.2-63.3 94.4-90.5zM64 350.2c78.4 61 221 101.8 384 101.8s305.6-40.8 384-101.8V398c0 28.6-36.2 63.3-94.4 90.5-36.5 17.1-79.4 30.6-127.7 40.2C558.8 538.9 504.3 544 448 544s-110.8-5.1-161.9-15.3c-48.3-9.6-91.2-23.1-127.7-40.2C100.2 461.3 64 426.6 64 398v-47.8zM448 864c-56.3 0-110.8-5.1-161.9-15.3-48.3-9.6-91.2-23.1-127.7-40.2C100.2 781.3 64 746.6 64 718v-51.8c78.4 61 221 101.8 384 101.8 50.7 0 99.4-4 144.8-11.2-0.6 6.3-0.8 12.7-0.8 19.2 0 25.9 4.5 50.7 12.9 73.7C555.2 859.2 502.5 864 448 864z m162.4-175.4c-0.2 0-0.3 0.1-0.5 0.1C558.8 698.9 504.3 704 448 704s-110.8-5.1-161.9-15.3c-48.3-9.6-91.2-23.1-127.7-40.2C100.2 621.3 64 586.6 64 558v-51.8c78.4 61 221 101.8 384 101.8s305.6-40.8 384-101.8V558c0 1.1-0.1 2.2-0.2 3.3-7.8-0.9-15.8-1.3-23.8-1.3-88.2 0-164 52.9-197.6 128.6z m305.1 194.9C886.8 912.2 848.6 928 808 928c-37.7 0-73.3-13.6-101.2-38.6-2.2-1.9-4.3-3.9-6.3-6-14.2-14.2-25.3-30.8-32.8-48.8C660 816.3 656 796.5 656 776c0-11.2 1.2-22.2 3.5-32.8 6.2-28.1 20.2-53.8 41-74.6 2.7-2.7 5.5-5.3 8.4-7.8 19.5-16.8 42.6-28.2 67.5-33.5 10.3-2.2 20.9-3.3 31.7-3.3 32 0 62.5 9.8 88 28 6.9 4.9 13.4 10.4 19.5 16.5C944.2 697.2 960 735.4 960 776s-15.8 78.8-44.5 107.5z'
                      })
                    ]
                  )
              })
          },
          {
            label: t('menu.assets_classify'),
            key: '/data-assets/assets-classify',
            icon: renderIcon(FormOutlined)
          },
          {
            label: t('menu.index_center'),
            key: '/data-assets/index-center',
            icon: renderIcon(RadarChartOutlined)
          },
          {
            label: t('menu.data_standard'),
            key: 'data-standard',
            icon: renderIcon(RuleDraft),
            children: [
              {
                label: t('menu.data_statistic'),
                key: '/data-assets/data-standard/data-statistic'
              },
              {
                label: t('menu.standard_list'),
                key: '/data-assets/data-standard/standard-list'
              },
              {
                label: t('menu.model_list'),
                key: '/data-assets/data-standard/model-list'
              }
            ]
          }
        ]
      },
      {
        label: () => h(NEllipsis, null, { default: () => t('menu.data_business') }),
        key: 'data-business',
        children: [
          {
            label: t('menu.data_property'),
            key: '/data-business/property',
            icon: renderIcon(UnorderedListOutlined)
          },
          {
            label: t('menu.data_dataTags'),
            key: '/data-business/dataTags',
            icon: renderIcon(TagsOutlined)
          },
          {
            label: t('menu.data_userGroup'),
            key: '/data-business/userGroup',
            icon: renderIcon(UserMultiple)
          },
          {
            label: t('menu.data_customAnalyse'),
            key: '/data-business/customAnalyse',
            icon: renderIcon(AppstoreTwotone)
          },
          {
            label: t('menu.data_userPortrayal'),
            key: '/data-business/userPortrayal',
            icon: renderIcon(UserAvatarFilled)
          }
        ]
      },
      {
        label: () => h(NEllipsis, null, { default: () => t('menu.project_manager') }),
        key: 'project',
        icon: renderIcon(ProjectOutlined),
        children: [
          {
            label: t('menu.project_manager'),
            key: '/project/project-manager',
            icon: renderIcon(ProjectOutlined)
          }
        ]
      },
      {
        label: () => h(NEllipsis, null, { default: () => t('menu.data_examine') }),
        key: 'data-examine',
        icon: renderIcon(TextBulletListSquareEdit24Regular),
        children: [
          {
            label: t('menu.examine_list'),
            key: '/data-examine/examine-list',
            icon: renderIcon(BarsOutlined)
          },
          {
            label: t('menu.my_examine'),
            key: '/data-examine/my-examine',
            icon: renderIcon(DocumentBulletListClock20Regular)
          },
          {
            label: t('menu.already_examine'),
            key: '/data-examine/already-examine',
            icon: renderIcon(PlaylistAddCheckTwotone)
          },
          {
            label: t('menu.my_approval'),
            key: '/data-examine/my-approval',
            icon: renderIcon(MyLocation16Filled)
          },
          {
            label: t('menu.approve_set'),
            key: '/data-examine/approve-set',
            icon: renderIcon(EditSettings24Regular)
          }
        ]
      }
    ]
    let keyToHidden = new Set()
    window.webConfig.SHOW_DATA_ASSETS ? null : keyToHidden.add('data-assets')
    !!window.webConfig.VITE_APP_PROD_ASSETS_QUERY_URL ? null : keyToHidden.add('/data-assets/assets-query')
    window.webConfig.SHOW_BUSINESS ? null : keyToHidden.add('data-business')
    window.webConfig.SHOW_API ? null : keyToHidden.add('/devops/service/api-manager').add('/service/api-manager').add('service')

    function deleteItemsWithKey(options: any, condition: any) {
      for (let i = options.length - 1; i >= 0; i--) {
        const option = options[i];
        if (condition(option.key)) {
          options.splice(i, 1);
        }
        if (option.children) {
          deleteItemsWithKey(option.children, condition);
        }
      }
    }

    function isKeyMatch(key: any) {
      return keyToHidden.has(key);
    }

    deleteItemsWithKey(state.menuOptions, isKeyMatch);

  }

  const changeHeaderMenuOptions = (state: any) => {
    state.headerMenuOptions = state.menuOptions.filter((x: any) => !x.icon).map(
      (item: { label: string; key: string; icon: any }) => {
        return {
          label: item.label,
          key: item.key,
        }
      }
    )
  }
  const changeIconMenuOptions = (state: any) => {
    state.iconMenuOptions = state.menuOptions.filter((item: any) => !!item.icon).map(
      (item: { label: string; key: string; icon: any, children: any }) => {
        return {
          label: () =>
            h(
              RouterLink,
              {
                to: {
                  path: '/' + item.key,
                }
              },
            ),
          key: item.key,
          icon: item.icon,
          children: [
            {
              label: item.label,
              key: item.key,
            }
          ]
        }
      }
    )
  }
  const changeUserDropdown = (state: any) => {
    state.userDropdownOptions = [
      {
        label: t('user_dropdown.profile'),
        key: 'profile',
        icon: renderIcon(UserOutlined)
      },
      {
        label: t('user_dropdown.password'),
        key: 'password',
        icon: renderIcon(KeyOutlined)
      },
      {
        label: t('user_dropdown.logout'),
        key: 'logout',
        icon: renderIcon(LogoutOutlined)
      }
    ]
  }

  return {
    state,
    changeHeaderMenuOptions,
    changeIconMenuOptions,
    changeMenuOption,
    changeUserDropdown
  }
}
