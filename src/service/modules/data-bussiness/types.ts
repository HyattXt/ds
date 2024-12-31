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

interface AuthorizationReq {
  userId: string,
  approvalUserType: number,
  approvalAuthorizationRemarks: string
}

interface ApprovalConfigReq {
  approvalArray: object[];
}

interface ApprovalListReq {
  pageNum: number,
  pageSize: number,
  approvalStatus: string,
  approvalType: string,
  userName: string,
  objName: string,
  applicationTimeStart: string,
  applicationTimeEnd: string,
  approvalTimeStart: string,
  approvalTimeEnd: string,
  approvalMenu: string
}

interface UpdateApprovalReq {
  id?: number,
  objNum: string,
  approvalType: number,
  approvalStatus: number,
  approvalOpinion: string
}

export { AuthorizationReq, ApprovalConfigReq, ApprovalListReq, UpdateApprovalReq }
