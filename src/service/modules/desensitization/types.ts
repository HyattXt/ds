/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the License); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

interface pageReq {
  pageNum?: number
  pageSize?: number
}

interface EncryptionReq extends pageReq {
  encryptionAlgorithmName: string
  encryptionAlgorithmType: string
}

interface DesensitizationRulesListReq extends pageReq {
  desensitizationMethod: string
  desensitizationRuleName: string
}

interface DesensitizationRulesInsertReq extends DesensitizationRulesListReq {
  concealingCharacters: string,
  concealingNumber1: string,
  concealingNumber2: string,
  fieldCharacteristics: string,
  effectiveStatus: number,
  concealingType?: string,
  concealingTypeChild?: string,
  id?: number
}

interface effectiveStatusReq {
  id: number,
  effectiveStatus: boolean
}

interface DataLedgerListReq extends pageReq {
  tableName: string,
  tableNotes: string,
  effectiveStatus: string
}

interface DataLedgerItemReq {
  fieldName: string,
  fieldComment: string,
  bindingType: string,
  bindingRuleId: string,
  bindingRuleName: string
}

interface DataLedgerReq {
  id?: number,
  tableName: string,
  tableNotes: string,
  effectiveStatus: number,
  dataSourceType: string,
  dataSource: number,
  dataSecurityDataLedgerFields: DataLedgerItemReq[]
}

export { EncryptionReq, DesensitizationRulesListReq, DesensitizationRulesInsertReq, effectiveStatusReq, DataLedgerListReq, DataLedgerReq }
