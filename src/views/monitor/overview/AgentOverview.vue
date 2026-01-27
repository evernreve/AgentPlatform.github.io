<template>
  <div class="agent-overview">
    <div class="page-header">
      <h3>代理商信息总览</h3>
    </div>
    
    <el-card class="filter-card">
      <el-form :inline="true" :model="filters" class="filter-form">
        <el-form-item label="租户ID/名称">
          <el-select v-model="filters.tenantId" placeholder="请选择租户" style="width: 150px;">
            <el-option label="全部租户" value=""></el-option>
            <el-option label="租户A" value="TNT001"></el-option>
            <el-option label="租户B" value="TNT002"></el-option>
            <el-option label="租户C" value="TNT003"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="代理商账户号码/名称">
          <el-input v-model="filters.agentName" placeholder="请输入代理商名称" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="代理商状态">
          <el-select v-model="filters.agentStatus" placeholder="请选择状态" style="width: 120px;">
            <el-option label="全部" value=""></el-option>
            <el-option label="正常" value="active"></el-option>
            <el-option label="禁用" value="disabled"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="代理商类型">
          <el-select v-model="filters.agentType" placeholder="请选择代理商类型" style="width: 150px;">
            <el-option label="全部" value=""></el-option>
            <el-option label="友商" value="partner"></el-option>
            <el-option label="其他" value="other"></el-option>
            <el-option label="秘书公司" value="secretary"></el-option>
            <el-option label="外综服物" value="outsourcing"></el-option>
            <el-option label="流服务商" value="logistics"></el-option>
            <el-option label="财税公司" value="finance"></el-option>
            <el-option label="商家行业协会" value="association"></el-option>
            <el-option label="外贸服务商" value="trading"></el-option>
            <el-option label="培训机构" value="training"></el-option>
            <el-option label="广告服务商" value="advertising"></el-option>
            <el-option label="企业服务商" value="enterprise"></el-option>
            <el-option label="代运营" value="agency"></el-option>
            <el-option label="展会公司" value="exhibition"></el-option>
            <el-option label="建站" value="web"></el-option>
            <el-option label="跨境ERP服务商" value="erp"></el-option>
            <el-option label="亚马逊服务商" value="amazon"></el-option>
            <el-option label="其他服务商" value="otherservice"></el-option>
            <el-option label="报关平台公司" value="customs"></el-option>
            <el-option label="B2B服务商" value="b2bservice"></el-option>
            <el-option label="咨询服务商" value="consulting"></el-option>
            <el-option label="支付机构服务商" value="payment"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="代理商来源">
          <el-select v-model="filters.agentCategory" placeholder="请选择代理商来源" style="width: 150px;">
            <el-option label="全部" value=""></el-option>
            <el-option label="租户代理商" value="tenant_agent"></el-option>
            <el-option label="商户代理商" value="merchant_agent"></el-option>
          </el-select>
          <el-tooltip content="租户代理商指的是该代理商本身是一个租户但同时代理其他租户的产品进行对外推广；商户代理商指的就是租户自己名下的代理商进行自己可代理范围内的产品进行商户推广。" placement="top">
            <el-icon style="margin-left: 5px; color: #909399;"><i-ep-question-filled /></el-icon>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="签约主体类型">
          <el-select v-model="filters.contractSubjectType" placeholder="请选择签约主体类型" style="width: 120px;">
            <el-option label="全部" value=""></el-option>
            <el-option label="企业" value="enterprise"></el-option>
            <el-option label="个人" value="individual"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联的商户">
          <el-input v-model="filters.merchantName" placeholder="请输入商户名称" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="签约的产品">
          <el-select v-model="filters.productType" placeholder="请选择产品类型" style="width: 150px;">
            <el-option label="全部" value=""></el-option>
            <el-option label="交易分佣产品" value="commission"></el-option>
            <el-option label="汇率返点产品" value="rebate"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合同类型">
          <el-select v-model="filters.contractType" placeholder="请选择合同类型" style="width: 120px;">
            <el-option label="全部" value=""></el-option>
            <el-option label="新签" value="新签"></el-option>
            <el-option label="续签" value="续签"></el-option>
            <el-option label="延期更换主体" value="延期更换主体"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 列表视图 -->
    <el-table
      :data="agentData"
      style="width: 100%"
      stripe
      class="agent-list-table"
    >
      <el-table-column label="租户信息" width="180">
        <template #default="{ row }">
          <div class="info-group">
            <div class="tenant-info">
              <div class="tenant-name">{{ row.tenantName }}</div>
              <div class="tenant-id">租户ID: {{ row.tenantId }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column label="代理商信息" width="180">
        <template #default="{ row }">
          <div class="info-group">
            <div class="agent-info">
              <div class="agent-name">{{ row.agentName }}</div>
              <div class="agent-id">代理商ID: {{ row.agentId }}</div>
              <div class="entity-name">{{ row.entityName }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column label="管理员信息" width="200">
        <template #default="{ row }">
          <div class="info-group">
            <div class="info-item">姓名: {{ row.adminName || '未设置' }}</div>
            <div class="info-item">邮箱: {{ row.adminEmail || '未设置' }}</div>
            <div class="info-item">手机: {{ row.adminPhone || '未设置' }}</div>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column label="租户代理商签约信息" width="200">
        <template #default="{ row }">
          <div class="info-group">
            <div class="info-item">合同: {{ row.latestContractId }}</div>
            <div class="info-item">签约时间: {{ row.contractSignDate }}</div>
            <div class="info-item">合同类型: {{ row.contractType }}</div>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column label="产品信息" width="180">
        <template #default="{ row }">
          <div class="info-group">
            <div class="info-item">产品: {{ row.productName }}</div>
            <div class="info-item">等级: {{ getProductLevel(row.productLevel) }}</div>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column label="状态" width="200">
        <template #default="{ row }">
          <div class="info-group">
            <div class="info-item">代：{{ row.agentActivationStatus === 'active' ? '已激活' : '未激活' }}</div>
            <div class="info-item">关联商户数：{{ getMerchantCount(row.merchants) }}</div>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column width="150">
        <template #header>
          <div style="display: flex; align-items: center;">
            代理商来源
            <el-tooltip content="租户代理商指的是该代理商本身是一个租户但同时代理其他租户的产品进行对外推广；商户代理商指的就是租户自己名下的代理商进行自己可代理范围内的产品进行商户推广。" placement="top">
              <el-icon style="margin-left: 5px; color: #909399;"><i-ep-question-filled /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <template #default="{ row }">
          <div class="info-group">
            <div class="info-item" :style="{ backgroundColor: row.agentCategory === 'merchant_agent' ? '#fff8dc' : '#e6f7ff', padding: '2px 6px', borderRadius: '4px' }">{{ getAgentCategoryLabel(row.agentCategory) }}</div>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <div class="table-actions">
            <el-button size="small" type="primary" @click.stop="handleViewDetails(row)">查看详情</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    
    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.currentPage"
      :page-sizes="[8, 12, 20, 32]"
      :page-size="pagination.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
      style="margin-top: 20px; text-align: right;"
    ></el-pagination>

    <!-- 详情侧滑面板 -->
    <el-drawer
      v-model="detailDrawerVisible"
      size="60%"
      :title="`代理商详情 - ${selectedAgent.agentName}`"
      direction="rtl"
      :before-close="handleCloseDetail"
    >
      <div class="drawer-content">
        <el-tabs v-model="activeTab" class="detail-tabs">
          <el-tab-pane label="基本信息" name="basic">
            <el-descriptions :column="1" border :label-width="150">
              <el-descriptions-item label="租户ID">{{ selectedAgent.tenantId }}</el-descriptions-item>
              <el-descriptions-item label="租户名称">{{ selectedAgent.tenantName }}</el-descriptions-item>
              <el-descriptions-item label="代理商账户号码">{{ selectedAgent.agentId }}</el-descriptions-item>
              <el-descriptions-item label="代理商全称">{{ selectedAgent.agentName }}</el-descriptions-item>
              <el-descriptions-item label="实体ID">{{ selectedAgent.entityId }}</el-descriptions-item>
              <el-descriptions-item label="实体名称">{{ selectedAgent.entityName }}</el-descriptions-item>
              <el-descriptions-item label="状态">
                <el-tag :type="selectedAgent.status === 'active' ? 'success' : 'danger'">
                  {{ selectedAgent.status === 'active' ? '正常' : '禁用' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="签约主体类型">
                <el-tag :type="selectedAgent.contractSubjectType === 'enterprise' ? 'primary' : 'success'">
                  {{ selectedAgent.contractSubjectType === 'enterprise' ? '企业' : '个人' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="代理商类型">{{ selectedAgent.agentType }}</el-descriptions-item>
              <el-descriptions-item label="审核来源">{{ selectedAgent.reviewSource }}</el-descriptions-item>
              <el-descriptions-item label="审核人">{{ selectedAgent.reviewer }}</el-descriptions-item>
              <el-descriptions-item label="代理商标签">
                <el-tag 
                  v-for="tag in selectedAgent.agentTags" 
                  :key="tag" 
                  style="margin-right: 5px;"
                  type="info"
                >
                  {{ tag }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="管理员姓名">{{ selectedAgent.adminName || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="管理员邮箱">{{ selectedAgent.adminEmail || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="管理员手机">{{ selectedAgent.adminPhone || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="代理商激活状态">
                <el-tag :type="selectedAgent.agentActivationStatus === 'active' ? 'success' : 'warning'">
                  代：{{ selectedAgent.agentActivationStatus === 'active' ? '已激活' : '未激活' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="关联商户数">
                <el-tag type="info">
                  关联商户数：{{ getMerchantCount(selectedAgent.merchants) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="结算日期">{{ selectedAgent.settlementDate || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="结算币种">{{ selectedAgent.settlementCurrency || '未设置' }}</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
          
          <el-tab-pane label="KYC信息" name="kyc">
            <div class="kyc-section">
              <h4>KYC个人信息</h4>
              <el-descriptions :column="1" border :label-width="150">
                <el-descriptions-item label="姓名">{{ selectedAgent.kycName || '未填写' }}</el-descriptions-item>
                <el-descriptions-item label="证件类型">{{ selectedAgent.kycDocumentType || '未填写' }}</el-descriptions-item>
                <el-descriptions-item label="证件号码">{{ selectedAgent.kycIdNumber || '未填写' }}</el-descriptions-item>
                <el-descriptions-item label="联系电话">{{ selectedAgent.kycContactPhone || '未填写' }}</el-descriptions-item>
                <el-descriptions-item label="联系地址">{{ selectedAgent.kycContactAddress || '未填写' }}</el-descriptions-item>
                <el-descriptions-item label="域名">{{ selectedAgent.kycDomain || '未填写' }}</el-descriptions-item>
                <el-descriptions-item label="备案号">{{ selectedAgent.kycIcp || '未填写' }}</el-descriptions-item>
                <el-descriptions-item label="类型">{{ selectedAgent.kycType || '未填写' }}</el-descriptions-item>
              </el-descriptions>
            </div>
            <div class="kyb-section">
              <h4>企业信息</h4>
              <el-descriptions :column="1" border :label-width="150">
                <el-descriptions-item label="域名">{{ selectedAgent.kybDomain || '未填写' }}</el-descriptions-item>
                <el-descriptions-item label="备案号">{{ selectedAgent.kybIcp || '未填写' }}</el-descriptions-item>
                <el-descriptions-item label="企业名称中文">{{ selectedAgent.kybChineseName || '未填写' }}</el-descriptions-item>
                <el-descriptions-item label="企业名称英文">{{ selectedAgent.kybEnglishName || '未填写' }}</el-descriptions-item>
                <el-descriptions-item label="品牌中文名">{{ selectedAgent.kybBrandChinese || '未填写' }}</el-descriptions-item>
                <el-descriptions-item label="品牌英文名">{{ selectedAgent.kybBrandEnglish || '未填写' }}</el-descriptions-item>
                <el-descriptions-item label="中文地址">{{ selectedAgent.kybChineseAddress || '未填写' }}</el-descriptions-item>
                <el-descriptions-item label="英文地址">{{ selectedAgent.kybEnglishAddress || '未填写' }}</el-descriptions-item>
                <el-descriptions-item label="统一社会信用代码">{{ selectedAgent.kybUnifiedCode || '未填写' }}</el-descriptions-item>
              </el-descriptions>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="结算信息" name="settlement">
            <el-descriptions :column="1" border :label-width="150">
              <el-descriptions-item label="结算币种">{{ selectedAgent.settlementCurrency || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="结算日期">{{ selectedAgent.settlementDate || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="结算周期">{{ selectedAgent.settlementPeriod || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="结算方式">{{ selectedAgent.settlementMethod || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="结算账户">{{ selectedAgent.settlementAccount || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="结算状态">{{ selectedAgent.settlementStatus || '未设置' }}</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
          
          <el-tab-pane label="收款账户" name="accounts">
            <el-table :data="selectedAgent.accounts" style="width: 100%" stripe>
              <el-table-column prop="bankName" label="开户银行" width="150"></el-table-column>
              <el-table-column prop="accountNumber" label="账号" width="200"></el-table-column>
              <el-table-column prop="accountName" label="账户名" width="150"></el-table-column>
              <el-table-column prop="accountType" label="账号类型" width="120">
                <template #default="{ row }">
                  <el-tag :type="row.accountType === 'VA账号' ? 'primary' : row.accountType === 'VCC卡' ? 'success' : 'warning'">
                    {{ row.accountType || '数币账号' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="accountStatus" label="账号状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="row.accountStatus === '已绑卡' ? 'success' : 'warning'">
                    {{ row.accountStatus || '已解绑' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="currency" label="币种" width="100"></el-table-column>
              <el-table-column prop="vaStatus" label="审核状态" width="120">
                <template #default="{ row }">
                  <el-tag :type="row.vaStatus === 'approved' ? 'success' : row.vaStatus === 'pending' ? 'warning' : 'danger'">
                    {{ row.vaStatus === 'approved' ? '已批准' : row.vaStatus === 'pending' ? '待审核' : '拒绝' }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          
          <el-tab-pane label="推广工具" name="promotion">
            <div class="promotion-tools">
              <h4>生成推广链接</h4>
              <div class="link-generator">
                <el-input 
                  v-model="promotionLink" 
                  readonly 
                  placeholder="推广链接将在此显示"
                  style="width: 70%; margin-right: 10px;"
                ></el-input>
                <el-button type="primary" @click="generatePromotionLink">生成链接</el-button>
                <el-button @click="copyPromotionLink">复制</el-button>
              </div>
              
              <div class="link-options" style="margin-top: 20px;">
                <h5>链接选项</h5>
                <el-form :model="linkOptions" label-width="100px">
                  <el-form-item label="有效期">
                    <el-select v-model="linkOptions.validity" placeholder="选择有效期">
                      <el-option label="24小时" value="24h"></el-option>
                      <el-option label="7天" value="7d"></el-option>
                      <el-option label="30天" value="30d"></el-option>
                      <el-option label="永久有效" value="permanent"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="限制次数">
                    <el-input-number v-model="linkOptions.limit" :min="0" :max="10000"></el-input-number>
                  </el-form-item>
                  <el-form-item label="跟踪标签">
                    <el-input v-model="linkOptions.tag" placeholder="可选的跟踪标签"></el-input>
                  </el-form-item>
                </el-form>
              </div>
              
              <div class="history-links" style="margin-top: 30px;">
                <h5>历史生成链接</h5>
                <el-table 
                  :data="selectedAgent.historyLinks || []" 
                  style="width: 100%" 
                  stripe
                  :show-header="false"
                >
                  <el-table-column prop="link" label="链接" min-width="300">
                    <template #default="{ row }">
                      <div class="history-link-item" style="display: flex; align-items: center;">
                        <el-input 
                          v-model="row.link" 
                          readonly 
                          size="small"
                          style="flex: 1; margin-right: 5px;"
                        ></el-input>
                        <el-button 
                          size="small" 
                          icon="el-icon-copy-document"
                          @click="copyHistoryLink(row.link)"
                        >
                        </el-button>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="createTime" label="创建时间" width="150">
                    <template #default="{ row }">
                      <span>{{ formatDate(row.createTime) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="status" label="状态" width="100">
                    <template #default="{ row }">
                      <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
                        {{ row.status === 'active' ? '有效' : '已过期' }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="options" label="链接选项" min-width="200">
                    <template #default="{ row }">
                      <div>
                        <el-tag size="small" v-if="row.options.validity">有效期: {{ getValidityText(row.options.validity) }}</el-tag>
                        <el-tag size="small" v-if="row.options.limit && row.options.limit > 0">限制次数: {{ row.options.limit }}</el-tag>
                        <el-tag size="small" v-if="row.options.tag">标签: {{ row.options.tag }}</el-tag>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="合同信息" name="contracts">
            <el-table :data="selectedAgent.contracts" style="width: 100%" stripe>
              <el-table-column prop="contractId" label="合同编号" width="180"></el-table-column>
              <el-table-column prop="contractType" label="合同类型" width="120">
                <template #default="{ row }">
                  <el-tag :type="getContractTypeTagType(row.contractType)">
                    {{ row.contractType }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="contractAttribute" label="合同属性" width="120">
                <template #default="{ row }">
                  <el-tag :type="getContractAttributeTagType(row.contractAttribute)">
                    {{ row.contractAttribute }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="contractRelation" label="合同关系" width="120">
                <template #default="{ row }">
                  <el-tag :type="getContractRelationTagType(row.contractRelation)">
                    {{ getContractRelationLabel(row.contractRelation) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="signDate" label="签约日期" width="120"></el-table-column>
              <el-table-column prop="effectiveDate" label="生效日期" width="120"></el-table-column>
              <el-table-column prop="expireDate" label="到期日期" width="120"></el-table-column>
              <el-table-column prop="status" label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="row.status === 'active' ? 'success' : 'warning'">
                    {{ row.status === 'active' ? '生效中' : '已过期' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120">
                <template #default="{ row }">
                  <el-button size="small" @click="downloadContract(row)">下载合同</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          
          <el-tab-pane label="产品开通信息" name="products">
            <el-table :data="selectedAgent.products" style="width: 100%" stripe>
              <el-table-column prop="productName" label="产品名称" width="200"></el-table-column>
              <el-table-column prop="productType" label="产品类型" width="150">
                <template #default="{ row }">
                  <el-tag :type="row.productType === 'commission' ? 'success' : 'warning'">
                    {{ row.productType === 'commission' ? '交易分佣' : '汇率返点' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="productLevel" label="产品等级" width="120"></el-table-column>
              <el-table-column prop="signDate" label="签约日期" width="120"></el-table-column>
              <el-table-column prop="billingMethod" label="计费方式" width="120"></el-table-column>
              <el-table-column prop="feeRate" label="费率" width="100"></el-table-column>
              <el-table-column prop="settlementCycle" label="结算周期" width="100"></el-table-column>
              <el-table-column prop="currency" label="币种" width="80"></el-table-column>
              <el-table-column prop="serviceFee" label="服务费" width="120"></el-table-column>
              <el-table-column prop="status" label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="row.status === 'active' ? 'success' : 'warning'">
                    {{ row.status === 'active' ? '生效中' : '已失效' }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          
          <el-tab-pane label="商户关联信息" name="merchants">
            <el-table :data="selectedAgent.merchants" style="width: 100%" stripe>
              <el-table-column prop="merchantId" label="商户ID" width="150"></el-table-column>
              <el-table-column prop="merchantName" label="商户名称" width="200"></el-table-column>
              <el-table-column prop="relationTime" label="关联时间" width="150"></el-table-column>
              <el-table-column prop="effectTime" label="生效时间" width="150"></el-table-column>
              <el-table-column prop="unbindTime" label="解除关联时间" width="150"></el-table-column>
              <el-table-column prop="status" label="关联状态" width="120">
                <template #default="{ row }">
                  <el-tag :type="row.status === 'active' ? 'success' : 'warning'">
                    {{ row.status === 'active' ? '正常' : '已解绑' }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { QuestionFilled } from '@element-plus/icons-vue';

export default {
  components: {
    QuestionFilled,
  },
  name: 'AgentOverview',
  data() {
    return {
      filters: {
        tenantId: '',
        agentName: '',
        agentStatus: '',
        agentType: '',
        agentCategory: '',
        contractSubjectType: '',
        merchantName: '',
        productType: '',
        contractType: ''
      },
      agentData: [
        { 
          tenantId: 'TNT001', 
          tenantName: '租户A', 
          agentId: 'AGT001', 
          agentName: '北京代理商有限公司', 
          entityName: '北京商企科技',
          entityId: 'ENT001',
          status: 'active', 
          contractSubjectType: 'enterprise', 
          agentType: '友商', 
          agentCategory: 'tenant_agent',
          productName: '国际交易分佣产品', 
          productLevel: 'N级',
          latestContractId: 'CT00120240115',
          contractSignDate: '2024-01-15',
          contractType: '新签',
          adminName: '张经理',
          adminEmail: 'zhang@example.com',
          adminPhone: '13800138001',
          agentActivationStatus: 'active',
          merchantActivationStatus: 'active',
          settlementDate: '每月15日',
          settlementCurrency: 'CNY',
          kycIdNumber: '110101199001011234',
          kycName: '张三',
          kycLicenseNumber: '91110000123456789X',
          kycCompanyName: '北京商企科技有限公司',
          kycType: '法人',
          kycDocumentType: '身份证',
          kycContactPhone: '13800138001',
          kycContactAddress: '北京市朝阳区某某街道',
          kycDomain: 'www.example.com',
          kycIcp: '京ICP备12345678号',
          kybDomain: 'www.business.com',
          kybIcp: '京ICP备87654321号',
          kybChineseName: '北京商企科技有限公司',
          kybEnglishName: 'Beijing Business Tech Co., Ltd.',
          kybBrandChinese: '商企品牌',
          kybBrandEnglish: 'Business Brand',
          kybChineseAddress: '北京市朝阳区某某商业街123号',
          kybEnglishAddress: 'No.123, Commercial Street, Chaoyang District, Beijing',
          kybUnifiedCode: '91110000123456789X',
          accounts: [
            { bankName: '中国银行', accountNumber: '6222021234567890123', accountName: '北京商企科技', accountType: 'VA账号', currency: 'CNY', vaStatus: 'approved' },
            { bankName: '招商银行', accountNumber: '6225021234567890456', accountName: '北京商企科技', accountType: 'VCC卡', currency: 'USD', vaStatus: 'pending' }
          ],
          reviewSource: '自动审核',
          reviewer: 'system',
          agentTags: ['优质客户', '长期合作'],
          contracts: [
            { contractId: 'CT00120240115', contractType: '新签', contractAttribute: '新协议', contractRelation: 'tenant_agent', signDate: '2024-01-15', effectiveDate: '2024-01-15', expireDate: '2025-01-14', status: 'active', subject: '北京商企科技', content: '代理合同.pdf' },
            { contractId: 'CT00220240220', contractType: '续签', contractAttribute: '补充协议', contractRelation: 'tenant_agent', signDate: '2024-02-20', effectiveDate: '2024-02-20', expireDate: '2025-02-19', status: 'active', subject: '北京商企科技', content: '补充协议.pdf' }
          ],
          products: [
            { 
              productName: '国际交易分佣产品', 
              productType: 'commission', 
              productLevel: 'A级',
              signDate: '2024-01-15', 
              status: 'active',
              billingMethod: '比例',
              feeRate: '0.5%',
              settlementCycle: '月结',
              currency: 'CNY',
              serviceFee: '100元/月'
            },
            { 
              productName: '汇率返点产品A', 
              productType: 'rebate', 
              productLevel: 'A级',
              signDate: '2024-02-20', 
              status: 'active',
              billingMethod: '固定',
              feeRate: '2%',
              settlementCycle: '季结',
              currency: 'USD',
              serviceFee: '200元/季度'
            }
          ],
          merchants: [
            { merchantId: 'MCH001', merchantName: '北京商贸有限公司', relationTime: '2024-01-15', effectTime: '2024-01-16', unbindTime: '2024-12-31', status: 'active' },
            { merchantId: 'MCH002', merchantName: '北京零售连锁', relationTime: '2024-04-05', effectTime: '2024-04-06', unbindTime: '', status: 'active' }
          ],
          historyLinks: [
            {
              link: 'https://example.com/promo/AGT001?v=24h&l=100&t=campaign1',
              createTime: '2024-01-20 10:30:00',
              status: 'active',
              options: {
                validity: '24h',
                limit: 100,
                tag: 'campaign1'
              }
            },
            {
              link: 'https://example.com/promo/AGT001?v=7d&l=500&t=spring_sale',
              createTime: '2024-02-15 14:22:30',
              status: 'expired',
              options: {
                validity: '7d',
                limit: 500,
                tag: 'spring_sale'
              }
            },
            {
              link: 'https://example.com/promo/AGT001?v=30d&l=0&t=welcome',
              createTime: '2024-01-10 09:15:22',
              status: 'active',
              options: {
                validity: '30d',
                limit: 0,
                tag: 'welcome'
              }
            }
          ]
        },
        { 
          tenantId: 'TNT002', 
          tenantName: '租户B', 
          agentId: 'AGT002', 
          agentName: '上海拓展服务商', 
          entityName: '上海商务服务',
          entityId: 'ENT002',
          status: 'active', 
          contractSubjectType: 'enterprise', 
          agentType: '秘书公司', 
          agentCategory: 'merchant_agent',
          productName: '跨境支付分佣', 
          productLevel: 'S级',
          latestContractId: 'CT00320240310',
          contractSignDate: '2024-03-10',
          contractType: '续签',
          adminName: '李经理',
          adminEmail: 'li@example.com',
          adminPhone: '13900139002',
          agentActivationStatus: 'active',
          merchantActivationStatus: 'inactive',
          settlementDate: '每月20日',
          settlementCurrency: 'USD',
          kycIdNumber: '310101198502022345',
          kycName: '李四',
          kycLicenseNumber: '91310000987654321A',
          kycCompanyName: '上海商务服务有限公司',
          kycType: '法人',
          kycDocumentType: '身份证',
          kycContactPhone: '13900139002',
          kycContactAddress: '上海市浦东新区某某大道',
          kycDomain: 'www.shanghai.com',
          kycIcp: '沪ICP备12345678号',
          kybDomain: 'www.shbusiness.com',
          kybIcp: '沪ICP备87654321号',
          kybChineseName: '上海商务服务有限公司',
          kybEnglishName: 'Shanghai Business Service Co., Ltd.',
          kybBrandChinese: '沪上商务',
          kybBrandEnglish: 'Shanghai Business',
          kybChineseAddress: '上海市浦东新区某某金融中心456号',
          kybEnglishAddress: 'No.456, Financial Center, Pudong District, Shanghai',
          kybUnifiedCode: '91310000987654321A',
          accounts: [
            { bankName: '工商银行', accountNumber: '6212261234567890789', accountName: '上海商务服务', accountType: 'VA账号', currency: 'CNY', vaStatus: 'approved' }
          ],
          contracts: [
            { contractId: 'CT00320240310', contractType: '续签', contractAttribute: '新协议', contractRelation: 'agent_merchant', signDate: '2024-03-10', effectiveDate: '2024-03-10', expireDate: '2025-03-09', status: 'active', subject: '上海商务服务', content: '代理合同.pdf' }
          ],
          products: [
            { 
              productName: '跨境支付分佣', 
              productType: 'commission', 
              productLevel: 'N级',
              signDate: '2024-03-10', 
              status: 'active',
              billingMethod: '费用值',
              feeRate: '1.5%',
              settlementCycle: '月结',
              currency: 'CNY',
              serviceFee: '150元/月'
            }
          ],
          merchants: [
            { merchantId: 'MCH003', merchantName: '上海贸易集团', relationTime: '2024-02-20', effectTime: '2024-02-21', status: 'active' }
          ],
          historyLinks: [
            {
              link: 'https://example.com/promo/AGT002?v=30d&l=0&t=summer_promo',
              createTime: '2024-03-15 09:15:20',
              status: 'active',
              options: {
                validity: '30d',
                limit: 0,
                tag: 'summer_promo'
              }
            }
          ]
        },
        { 
          tenantId: 'TNT003', 
          tenantName: '租户C', 
          agentId: 'AGT003', 
          agentName: '广州合作伙伴', 
          entityName: '广州商务咨询',
          entityId: 'ENT003',
          status: 'active', 
          contractSubjectType: 'enterprise', 
          agentType: '物流服务商', 
          agentCategory: 'tenant_agent',
          productName: '国际汇款产品', 
          productLevel: 'N级',
          latestContractId: 'CT00420240412',
          contractSignDate: '2024-04-12',
          contractType: '延期更换主体',
          adminName: '王经理',
          adminEmail: 'wang@example.com',
          adminPhone: '13700137003',
          agentActivationStatus: 'inactive',
          merchantActivationStatus: 'inactive',
          settlementDate: '季度末',
          settlementCurrency: 'EUR',
          kycIdNumber: '440101198003033456',
          kycName: '王五',
          kycLicenseNumber: '91440000567891234B',
          kycCompanyName: '广州商务咨询有限公司',
          kycType: '法人',
          kycDocumentType: '身份证',
          kycContactPhone: '13700137003',
          kycContactAddress: '广州市天河区某某路',
          kycDomain: 'www.gzconsulting.com',
          kycIcp: '粤ICP备12345678号',
          kybDomain: 'www.gzbusiness.com',
          kybIcp: '粤ICP备87654321号',
          kybChineseName: '广州商务咨询有限公司',
          kybEnglishName: 'Guangzhou Business Consulting Co., Ltd.',
          kybBrandChinese: '穗咨品牌',
          kybBrandEnglish: 'Guangzhou Consulting',
          kybChineseAddress: '广州市天河区某某写字楼789号',
          kybEnglishAddress: 'No.789, Office Building, Tianhe District, Guangzhou',
          kybUnifiedCode: '91440000567891234B',
          accounts: [
            { bankName: '建设银行', accountNumber: '6227001234567890012', accountName: '广州商务咨询', accountType: '数币账号', currency: 'CNY', vaStatus: 'rejected' },
            { bankName: '农业银行', accountNumber: '6228481234567890345', accountName: '广州商务咨询', accountType: 'VA账号', currency: 'CNY', vaStatus: 'approved' }
          ],
          contracts: [
            { contractId: 'CT00420240412', contractType: '延期更换主体', contractAttribute: '新协议', contractRelation: 'tenant_merchant', signDate: '2024-04-12', effectiveDate: '2024-04-12', expireDate: '2025-04-11', status: 'active', subject: '广州商务咨询', content: '代理合同.pdf' }
          ],
          products: [
            { 
              productName: '国际汇款产品', 
              productType: 'rebate', 
              productLevel: 'A级',
              signDate: '2024-04-12', 
              status: 'active',
              billingMethod: '比例',
              feeRate: '1%',
              settlementCycle: '周结',
              currency: 'EUR',
              serviceFee: '300元/周'
            }
          ],
          merchants: [
            { merchantId: 'MCH004', merchantName: '广州电商企业', relationTime: '2024-03-10', effectTime: '2024-03-11', status: 'active' }
          ],
          historyLinks: [
            {
              link: 'https://example.com/promo/AGT003?v=permanent&l=1000&t=new_year',
              createTime: '2024-04-20 16:45:10',
              status: 'active',
              options: {
                validity: 'permanent',
                limit: 1000,
                tag: 'new_year'
              }
            },
            {
              link: 'https://example.com/promo/AGT003?v=7d&l=200&t=clearance',
              createTime: '2024-05-01 11:30:45',
              status: 'expired',
              options: {
                validity: '7d',
                limit: 200,
                tag: 'clearance'
              }
            }
          ]
        },
        { 
          tenantId: 'TNT001', 
          tenantName: '租户A', 
          agentId: 'AGT004', 
          agentName: '深圳渠道商', 
          entityName: '深圳创新科技',
          entityId: 'ENT004',
          status: 'disabled', 
          contractSubjectType: 'enterprise', 
          agentType: '友商', 
          agentCategory: 'tenant_agent',
          productName: '海外支付产品', 
          productLevel: 'N级',
          latestContractId: 'CT00520240505',
          contractSignDate: '2024-05-05',
          contractType: '其他',
          adminName: '赵经理',
          adminEmail: 'zhao@example.com',
          adminPhone: '13600136004',
          agentActivationStatus: 'inactive',
          merchantActivationStatus: 'inactive',
          settlementDate: '每月10日',
          settlementCurrency: 'CNY',
          kycIdNumber: '440300198504044567',
          kycName: '赵六',
          kycLicenseNumber: '914403007654321AB',
          kycCompanyName: '深圳创新科技有限公司',
          kycType: '法人',
          kycDocumentType: '身份证',
          kycContactPhone: '13600136004',
          kycContactAddress: '深圳市南山区某某科技园',
          kycDomain: 'www.sztech.com',
          kycIcp: '粤ICP备12345678号',
          kybDomain: 'www.szinnovation.com',
          kybIcp: '粤ICP备87654321号',
          kybChineseName: '深圳创新科技有限公司',
          kybEnglishName: 'Shenzhen Innovation Technology Co., Ltd.',
          kybBrandChinese: '深创品牌',
          kybBrandEnglish: 'Shenzhen Innovation',
          kybChineseAddress: '深圳市南山区高新科技园101号',
          kybEnglishAddress: 'No.101, High-tech Park, Nanshan District, Shenzhen',
          kybUnifiedCode: '914403007654321AB',
          accounts: [
            { bankName: '平安银行', accountNumber: '6221021234567890678', accountName: '深圳创新科技', accountType: 'VCC卡', currency: 'CNY', vaStatus: 'pending' }
          ],
          contracts: [
            { contractId: 'CT00520240505', contractType: '其他', contractAttribute: '补充协议', contractRelation: 'tenant', signDate: '2024-05-05', effectiveDate: '2024-05-05', expireDate: '2025-05-04', status: 'active', subject: '深圳创新科技', content: '代理合同.pdf' }
          ],
          products: [
            { 
              productName: '海外支付产品', 
              productType: 'commission', 
              productLevel: 'S+级',
              signDate: '2024-05-05', 
              status: 'active',
              billingMethod: '固定',
              feeRate: '2.5%',
              settlementCycle: '月结',
              currency: 'USD',
              serviceFee: '500元/月'
            }
          ],
          merchants: [
            { merchantId: 'MCH005', merchantName: '深圳科技公司', relationTime: '2024-05-15', effectTime: '2024-05-16', status: 'active' }
          ],
          historyLinks: [
            {
              link: 'https://example.com/promo/AGT004?v=30d&l=0&t=launch',
              createTime: '2024-05-20 13:20:30',
              status: 'active',
              options: {
                validity: '30d',
                limit: 0,
                tag: 'launch'
              }
            }
          ]
        },
        { 
          tenantId: 'TNT005', 
          tenantName: '租户E', 
          agentId: 'AGT005', 
          agentName: '杭州分销商', 
          entityName: '杭州电商服务',
          entityId: 'ENT005',
          status: 'active', 
          contractSubjectType: 'enterprise', 
          agentType: '跨境电商服务商', 
          agentCategory: 'tenant_agent',
          productName: '跨境电商支付产品', 
          productLevel: 'S级',
          latestContractId: 'CT00620240610',
          contractSignDate: '2024-06-10',
          contractType: '新签',
          adminName: '孙经理',
          adminEmail: 'sun@example.com',
          adminPhone: '13500135005',
          agentActivationStatus: 'active',
          merchantActivationStatus: 'active',
          settlementDate: '每月25日',
          settlementCurrency: 'USD',
          kycIdNumber: '330101198205055678',
          kycName: '孙七',
          kycLicenseNumber: '91330000876543210C',
          kycCompanyName: '杭州电商服务有限公司',
          kycType: '法人',
          kycDocumentType: '身份证',
          kycContactPhone: '13500135005',
          kycContactAddress: '杭州市西湖区某某科技园区',
          kycDomain: 'www.hzebiz.com',
          kycIcp: '浙ICP备12345678号',
          kybDomain: 'www.hzebusiness.com',
          kybIcp: '浙ICP备87654321号',
          kybChineseName: '杭州电商服务有限公司',
          kybEnglishName: 'Hangzhou E-commerce Service Co., Ltd.',
          kybBrandChinese: '杭电品牌',
          kybBrandEnglish: 'Hangzhou Ebiz',
          kybChineseAddress: '杭州市西湖区某某科技园区123号',
          kybEnglishAddress: 'No.123, Technology Park, Xihu District, Hangzhou',
          kybUnifiedCode: '91330000876543210C',
          accounts: [
            { bankName: '中信银行', accountNumber: '6217001234567890123', accountName: '杭州电商服务', accountType: 'VA账号', currency: 'CNY', vaStatus: 'approved' }
          ],
          contracts: [
            { contractId: 'CT00620240610', contractType: '新签', contractAttribute: '新协议', contractRelation: 'tenant_agent', signDate: '2024-06-10', effectiveDate: '2024-06-10', expireDate: '2025-06-09', status: 'active', subject: '杭州电商服务', content: '代理合同.pdf' }
          ],
          products: [
            { 
              productName: '跨境电商支付产品', 
              productType: 'commission', 
              productLevel: 'A级',
              signDate: '2024-06-10', 
              status: 'active',
              billingMethod: '比例',
              feeRate: '1.2%',
              settlementCycle: '月结',
              currency: 'USD',
              serviceFee: '200元/月'
            }
          ],
          merchants: [
            { merchantId: 'MCH006', merchantName: '杭州外贸公司', relationTime: '2024-06-15', effectTime: '2024-06-16', status: 'active' },
            { merchantId: 'MCH007', merchantName: '杭州进出口商', relationTime: '2024-07-01', effectTime: '2024-07-02', status: 'active' }
          ],
          historyLinks: [
            {
              link: 'https://example.com/promo/AGT005?v=30d&l=0&t=expo',
              createTime: '2024-06-20 10:15:30',
              status: 'active',
              options: {
                validity: '30d',
                limit: 0,
                tag: 'expo'
              }
            }
          ]
        },
        { 
          tenantId: 'TNT006', 
          tenantName: '租户F', 
          agentId: 'AGT006', 
          agentName: '成都服务商', 
          entityName: '成都网络技术',
          entityId: 'ENT006',
          status: 'active', 
          contractSubjectType: 'enterprise', 
          agentType: '技术服务商', 
          agentCategory: 'merchant_agent',
          productName: '技术服务产品', 
          productLevel: 'A级',
          latestContractId: 'CT00720240715',
          contractSignDate: '2024-07-15',
          contractType: '续签',
          adminName: '周经理',
          adminEmail: 'zhou@example.com',
          adminPhone: '13400134006',
          agentActivationStatus: 'active',
          merchantActivationStatus: 'inactive',
          settlementDate: '季度末',
          settlementCurrency: 'CNY',
          kycIdNumber: '510101198306066789',
          kycName: '周八',
          kycLicenseNumber: '91510000765432109D',
          kycCompanyName: '成都网络技术有限公司',
          kycType: '法人',
          kycDocumentType: '身份证',
          kycContactPhone: '13400134006',
          kycContactAddress: '成都市高新区某某软件园',
          kycDomain: 'www.cdnets.com',
          kycIcp: '川ICP备12345678号',
          kybDomain: 'www.cdnettech.com',
          kybIcp: '川ICP备87654321号',
          kybChineseName: '成都网络技术有限公司',
          kybEnglishName: 'Chengdu Network Technology Co., Ltd.',
          kybBrandChinese: '蓉网品牌',
          kybBrandEnglish: 'Chengdu Net',
          kybChineseAddress: '成都市高新区某某软件园456号',
          kybEnglishAddress: 'No.456, Software Park, High-tech Zone, Chengdu',
          kybUnifiedCode: '91510000765432109D',
          accounts: [
            { bankName: '浦发银行', accountNumber: '6222001234567890456', accountName: '成都网络技术', accountType: '数币账号', currency: 'CNY', vaStatus: 'pending' }
          ],
          contracts: [
            { contractId: 'CT00720240715', contractType: '续签', contractAttribute: '新协议', contractRelation: 'agent_merchant', signDate: '2024-07-15', effectiveDate: '2024-07-15', expireDate: '2025-07-14', status: 'active', subject: '成都网络技术', content: '代理合同.pdf' }
          ],
          products: [
            { 
              productName: '技术服务产品', 
              productType: 'rebate', 
              productLevel: 'S+级',
              signDate: '2024-07-15', 
              status: 'active',
              billingMethod: '固定',
              feeRate: '3%',
              settlementCycle: '季结',
              currency: 'CNY',
              serviceFee: '600元/季'
            }
          ],
          merchants: [
            { merchantId: 'MCH008', merchantName: '成都科技公司', relationTime: '2024-07-20', effectTime: '2024-07-21', status: 'active' }
          ],
          historyLinks: [
            {
              link: 'https://example.com/promo/AGT006?v=7d&l=500&t=techfair',
              createTime: '2024-07-20 14:30:25',
              status: 'active',
              options: {
                validity: '7d',
                limit: 500,
                tag: 'techfair'
              }
            }
          ]
        },
        { 
          tenantId: 'TNT007', 
          tenantName: '租户G', 
          agentId: 'AGT007', 
          agentName: '西安合作伙伴', 
          entityName: '西安商务咨询',
          entityId: 'ENT007',
          status: 'disabled', 
          contractSubjectType: 'enterprise', 
          agentType: '咨询服务商', 
          agentCategory: 'tenant_agent',
          productName: '咨询服务产品', 
          productLevel: 'S级',
          latestContractId: 'CT00820240820',
          contractSignDate: '2024-08-20',
          contractType: '新签',
          adminName: '吴经理',
          adminEmail: 'wu@example.com',
          adminPhone: '13300133007',
          agentActivationStatus: 'inactive',
          merchantActivationStatus: 'inactive',
          settlementDate: '每月10日',
          settlementCurrency: 'EUR',
          kycIdNumber: '610101198407077890',
          kycName: '吴九',
          kycLicenseNumber: '91610000654321098E',
          kycCompanyName: '西安商务咨询有限公司',
          kycType: '法人',
          kycDocumentType: '身份证',
          kycContactPhone: '13300133007',
          kycContactAddress: '西安市雁塔区某某商务中心',
          kycDomain: 'www.xazixun.com',
          kycIcp: '陕ICP备12345678号',
          kybDomain: 'www.xacommservice.com',
          kybIcp: '陕ICP备87654321号',
          kybChineseName: '西安商务咨询有限公司',
          kybEnglishName: 'xian Business Consulting Co., Ltd.',
          kybBrandChinese: '西咨品牌',
          kybBrandEnglish: 'Xian Consult',
          kybChineseAddress: '西安市雁塔区某某商务中心789号',
          kybEnglishAddress: 'No.789, Business Center, Yanta District, Xian',
          kybUnifiedCode: '91610000654321098E',
          accounts: [
            { bankName: '光大银行', accountNumber: '6226001234567890789', accountName: '西安商务咨询', accountType: 'VCC卡', currency: 'CNY', vaStatus: 'rejected' }
          ],
          contracts: [
            { contractId: 'CT00820240820', contractType: '新签', contractAttribute: '新协议', contractRelation: 'tenant_agent', signDate: '2024-08-20', effectiveDate: '2024-08-20', expireDate: '2025-08-19', status: 'active', subject: '西安商务咨询', content: '代理合同.pdf' }
          ],
          products: [
            { 
              productName: '咨询服务产品', 
              productType: 'commission', 
              productLevel: 'S级',
              signDate: '2024-08-20', 
              status: 'active',
              billingMethod: '比例',
              feeRate: '0.8%',
              settlementCycle: '月结',
              currency: 'EUR',
              serviceFee: '150元/月'
            }
          ],
          merchants: [
          ],
          historyLinks: [
            {
              link: 'https://example.com/promo/AGT007?v=14d&l=200&t=autumn',
              createTime: '2024-08-25 09:45:15',
              status: 'expired',
              options: {
                validity: '14d',
                limit: 200,
                tag: 'autumn'
              }
            }
          ]
        }
      ],
      pagination: {
        currentPage: 1,
        pageSize: 8,
        total: 7
      },
      detailDrawerVisible: false,
      selectedAgent: {},
      activeTab: 'basic',
      promotionLink: '',
      linkOptions: {
        validity: '7d',
        limit: 0,
        tag: ''
      }
    };
  },
  methods: {
    handleSearch() {
      console.log('搜索条件:', this.filters);
      // 这里可以实现实际的搜索逻辑
      // 根据筛选条件过滤数据
    },
    handleReset() {
      this.filters = { 
        tenantId: '', 
        agentName: '', 
        agentStatus: '', 
        agentType: '', 
        contractSubjectType: '', 
        merchantName: '', 
        productType: '' 
      };
    },
    handleExport() {
      this.$message.success('正在导出数据...');
    },
    handleCardClick(item) {
      this.selectedAgent = item;
      this.detailDrawerVisible = true;
    },
    handleViewDetails(item) {
      this.selectedAgent = item;
      this.detailDrawerVisible = true;
    },
    handleCloseDetail() {
      this.detailDrawerVisible = false;
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
    },
    handleRowClick(row) {
      this.handleViewDetails(row);
    },
    generatePromotionLink() {
      // 生成推广链接的模拟实现
      const baseUrl = `https://example.com/promo/${this.selectedAgent.agentId}`;
      const params = new URLSearchParams();
      
      if (this.linkOptions.validity) params.append('validity', this.linkOptions.validity);
      if (this.linkOptions.limit && this.linkOptions.limit > 0) params.append('limit', this.linkOptions.limit.toString());
      if (this.linkOptions.tag) params.append('tag', this.linkOptions.tag);
      
      this.promotionLink = `${baseUrl}?${params.toString()}`;
      this.$message.success('推广链接已生成');
    },
    copyPromotionLink() {
      if (!this.promotionLink) {
        this.$message.warning('请先生成推广链接');
        return;
      }
      
      navigator.clipboard.writeText(this.promotionLink).then(() => {
        this.$message.success('推广链接已复制到剪贴板');
      }).catch(() => {
        this.$message.error('复制失败，请手动复制');
      });
    },
    copyHistoryLink(link) {
      navigator.clipboard.writeText(link).then(() => {
        this.$message.success('历史链接已复制到剪贴板');
      }).catch(() => {
        this.$message.error('复制失败，请手动复制');
      });
    },
    formatDate(dateString) {
      // 如果是ISO字符串，转换为指定格式
      if (!dateString) return '';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // 如果不是有效的日期格式，直接返回原值
        return dateString;
      }
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    getValidityText(validity) {
      const validityMap = {
        '24h': '24小时',
        '7d': '7天',
        '30d': '30天',
        'permanent': '永久有效'
      };
      return validityMap[validity] || validity;
    },
    getMerchantCount(merchants) {
      return merchants.length;
    },
    getContractTypeTagType(type) {
      const tagTypes = {
        '新签': 'primary',
        '续签': 'success',
        '延期更换主体': 'warning',
        '其他': 'info'
      };
      return tagTypes[type] || 'info';
    },
    getContractRelationTagType(relation) {
      const tagTypes = {
        'tenant': 'primary',
        'tenant_agent': 'success',
        'agent_merchant': 'warning',
        'tenant_merchant': 'danger'
      };
      return tagTypes[relation] || 'info';
    },
    getContractRelationLabel(relation) {
      const labels = {
        'tenant': '租户',
        'tenant_agent': '租户代理商',
        'agent_merchant': '代理商商户',
        'tenant_merchant': '租户商户'
      };
      return labels[relation] || relation;
    },
    getContractAttributeTagType(attribute) {
      const tagTypes = {
        '新协议': 'primary',
        '补充协议': 'warning'
      };
      return tagTypes[attribute] || 'info';
    },
    downloadContract(contract) {
      this.$message.info(`正在下载合同: ${contract.contractId}`);
      // 这里可以实现实际的下载逻辑
      console.log('下载合同:', contract);
    },
    getProductLevel(level) {
      const levelMap = {
        'basic': 'N级',
        'standard': 'A级',
        'advanced': 'S级',
        'professional': 'S+级'
      };
      return levelMap[level] || level;
    },
    getAgentCategoryLabel(category) {
      const categoryMap = {
        'tenant_agent': '租户代理商',
        'merchant_agent': '商户代理商'
      };
      return categoryMap[category] || category;
    }
  }
};
</script>

<style scoped>
.agent-overview {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
}

.page-header {
  margin-bottom: 20px;
}

.filter-card {
  margin-bottom: 20px;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
}

.filter-form .el-form-item {
  margin-right: 20px;
  margin-bottom: 10px;
}

.card-container {
  margin: 0 -10px;
}

.card-col {
  padding: 10px;
}

.agent-card {
  cursor: pointer;
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.agent-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
}

.card-header {
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
  margin-bottom: 15px;
}

.tenant-info .tenant-name {
  font-weight: bold;
  font-size: 16px;
  color: #303133;
}

.tenant-info .tenant-id {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
}

.agent-info .agent-short-name {
  font-weight: bold;
  font-size: 16px;
  color: #303133;
  margin: 5px 0;
}

.agent-info .agent-id {
  font-size: 12px;
  color: #909399;
}

.agent-info .agent-full-name {
  font-size: 14px;
  color: #606266;
  margin-bottom: 5px;
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.info-item {
  font-size: 13px;
  color: #606266;
  line-height: 1.4;
}

.agent-list-table {
  margin-bottom: 20px;
}

.table-actions {
  display: flex;
  gap: 5px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.drawer-content {
  padding: 20px;
}

.detail-tabs {
  margin: -20px -20px 0 -20px;
}

.kyc-section,
.kyb-section {
  margin-bottom: 30px;
}

.kyc-section:last-child,
.kyb-section:last-child {
  margin-bottom: 0;
}

.kyc-section h4,
.kyb-section h4 {
  margin: 0 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  font-size: 16px;
  font-weight: bold;
}

.promotion-tools {
  padding: 20px 0;
}

.link-generator {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.history-links .el-table {
  margin-top: 10px;
}

.history-link-item {
  display: flex;
  align-items: center;
}

.history-link-item .el-input {
  flex: 1;
  margin-right: 5px;
}


</style>