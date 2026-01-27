<template>
  <div class="account-list">
    <div class="page-header">
      <h3>账户列表</h3>
    </div>

    <!-- 全局筛选与搜索区 -->
    <el-card class="filter-card">
      <el-form :inline="true" :model="filters" class="filter-form">
        <!-- 关键词搜索 -->
        <el-form-item label="关键词搜索">
          <el-input 
            v-model="filters.keyword" 
            placeholder="请输入代理商名称/ID、商户名称/ID、银行名称、账号" 
            style="width: 250px;"
            clearable
          ></el-input>
        </el-form-item>

        <!-- 账户归属筛选 -->
        <el-form-item label="账户归属">
          <el-select v-model="filters.accountOwnership" placeholder="全部" style="width: 150px;" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="代理商自用" value="agent_self"></el-option>
            <el-option label="分配给商户" value="assigned_to_merchant"></el-option>
          </el-select>
        </el-form-item>

        <!-- 账户状态筛选 -->
        <el-form-item label="账户状态">
          <el-select v-model="filters.accountStatus" placeholder="全部" style="width: 120px;" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="正常" value="active"></el-option>
            <el-option label="冻结" value="frozen"></el-option>
            <el-option label="审核中" value="pending"></el-option>
            <el-option label="审核失败" value="rejected"></el-option>
          </el-select>
        </el-form-item>

        <!-- VA审核状态筛选 -->
        <el-form-item label="VA审核状态">
          <el-select v-model="filters.vaStatus" placeholder="全部" style="width: 120px;" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="已批准" value="approved"></el-option>
            <el-option label="待审核" value="pending"></el-option>
            <el-option label="拒绝" value="rejected"></el-option>
          </el-select>
        </el-form-item>

        <!-- 账户币种/类型筛选 -->
        <el-form-item label="账户类型">
          <el-select v-model="filters.accountType" placeholder="全部" style="width: 150px;" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="美金账户" value="usd_account"></el-option>
            <el-option label="欧元账户" value="eur_account"></el-option>
            <el-option label="港元账户" value="hkd_account"></el-option>
            <el-option label="离岸人民币账户" value="offshore_cny"></el-option>
          </el-select>
        </el-form-item>

        <!-- 租户筛选 -->
        <el-form-item label="租户">
          <el-select v-model="filters.tenant" placeholder="全部租户" style="width: 150px;" clearable>
            <el-option label="全部租户" value=""></el-option>
            <el-option label="租户A" value="TNT001"></el-option>
            <el-option label="租户B" value="TNT002"></el-option>
            <el-option label="租户C" value="TNT003"></el-option>
          </el-select>
        </el-form-item>

        <!-- 操作按钮 -->
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 账户列表区 -->
    <div class="table-header">
      <el-button type="primary" @click="handleAddAccount">新增账户</el-button>
    </div>
    <el-table 
      :data="accountData" 
      style="width: 100%" 
      stripe
    >
      <!-- 账户标识 -->
      <el-table-column prop="accountNumber" label="账号" width="200">
        <template #default="{ row }">
          {{ maskAccountNumber(row.accountNumber) }}
        </template>
      </el-table-column>

      <!-- 归属信息 -->
      <el-table-column label="归属信息" width="250">
        <template #default="{ row }">
          <div class="info-group">
            <div class="info-item"><strong>{{ row.accountName }}</strong></div>
            <div class="info-item">
              <el-tag :type="getOwnershipTagType(row.accountOwnership)">
                {{ getOwnershipLabel(row.accountOwnership) }}
              </el-tag>
            </div>
            <div class="info-item">代理商: {{ row.agentName }}</div>
            <div class="info-item" v-if="row.merchantName">商户: {{ row.merchantName }}</div>
          </div>
        </template>
      </el-table-column>

      <!-- 账户详情 -->
      <el-table-column label="账户详情" width="250">
        <template #default="{ row }">
          <div class="info-group">
            <div class="info-item">银行: {{ row.bankName }}</div>
            <div class="info-item">
              <el-tag type="info">{{ row.currency }}</el-tag>
            </div>
            <div class="info-item">
              <el-tag :type="getAccountCategoryTagType(row.accountCategory)">
                {{ row.accountCategory }}
              </el-tag>
            </div>
          </div>
        </template>
      </el-table-column>

      <!-- 状态信息 -->
      <el-table-column label="状态信息" width="200">
        <template #default="{ row }">
          <div class="info-group">
            <div class="info-item">
              <el-tag :type="getStatusTagType(row.accountStatus)">
                {{ getStatusLabel(row.accountStatus) }}
              </el-tag>
            </div>
            <div class="info-item">
              <el-tag :type="getVaStatusTagType(row.vaStatus)">
                {{ getVaStatusLabel(row.vaStatus) }}
              </el-tag>
            </div>
          </div>
        </template>
      </el-table-column>

      <!-- 时间信息 -->
      <el-table-column label="时间信息" width="200">
        <template #default="{ row }">
          <div class="info-group">
            <div class="info-item">创建: {{ formatDate(row.createTime) }}</div>
            <div class="info-item">最后活动: {{ formatDate(row.lastActivityTime) }}</div>
          </div>
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click.stop="handleViewDetails(row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 批量操作与分页 -->
    <div class="footer-actions">
      <el-button @click="handleBatchExport">批量导出</el-button>
      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
      ></el-pagination>
    </div>

    <!-- 详情侧滑面板 -->
    <el-drawer
      v-model="detailDrawerVisible"
      size="60%"
      :title="`账户详情 - ${selectedAccount.accountNumber}`"
      direction="rtl"
      :before-close="handleCloseDetail"
    >
      <div class="drawer-content">
        <el-descriptions :column="1" border :label-width="150">
          <el-descriptions-item label="账号">{{ selectedAccount.accountNumber }}</el-descriptions-item>
          <el-descriptions-item label="账户名称">{{ selectedAccount.accountName }}</el-descriptions-item>
          <el-descriptions-item label="账户归属">
            <el-tag :type="getOwnershipTagType(selectedAccount.accountOwnership)">
              {{ getOwnershipLabel(selectedAccount.accountOwnership) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="所属代理商">{{ selectedAccount.agentName }}</el-descriptions-item>
          <el-descriptions-item label="所属商户" v-if="selectedAccount.merchantName">
            {{ selectedAccount.merchantName }}
          </el-descriptions-item>
          <el-descriptions-item label="开户银行">{{ selectedAccount.bankName }}</el-descriptions-item>
          <el-descriptions-item label="账户币种">
            <el-tag type="info">{{ selectedAccount.currency }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="账户状态">
            <el-tag :type="getStatusTagType(selectedAccount.accountStatus)">
              {{ getStatusLabel(selectedAccount.accountStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="审核状态">
            <el-tag :type="getVaStatusTagType(selectedAccount.vaStatus)">
              {{ getVaStatusLabel(selectedAccount.vaStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ formatDate(selectedAccount.createTime) }}</el-descriptions-item>
          <el-descriptions-item label="最后活动时间">{{ formatDate(selectedAccount.lastActivityTime) }}</el-descriptions-item>
          <el-descriptions-item label="账户类别">
            <el-tag :type="getAccountCategoryTagType(selectedAccount.accountCategory)">
              {{ selectedAccount.accountCategory }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="账户类型">{{ getAccountTypeLabel(selectedAccount.accountType) }}</el-descriptions-item>
          <el-descriptions-item label="租户">{{ selectedAccount.tenantName }}</el-descriptions-item>
          <el-descriptions-item label="备注">{{ selectedAccount.remark || '无' }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-drawer>

    <!-- 账户类型选择弹窗 -->
    <el-dialog
      v-model="showAccountTypeSelection"
      title="选择账户类型"
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="account-type-selection">
        <p style="text-align: center; margin-bottom: 30px;">请选择要创建的账户类型</p>
        <div class="type-options">
          <el-button 
            type="primary" 
            plain 
            size="large"
            @click="selectAccountType('VA账户')"
            style="width: 150px; margin: 0 10px;"
          >
            VA账户
          </el-button>
          <el-button 
            type="success" 
            plain 
            size="large"
            @click="selectAccountType('虚拟账户')"
            style="width: 150px; margin: 0 10px;"
          >
            虚拟账户
          </el-button>
          <el-button 
            type="warning" 
            plain 
            size="large"
            @click="selectAccountType('VCC卡')"
            style="width: 150px; margin: 0 10px;"
          >
            VCC卡
          </el-button>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelSelectAccountType">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'AccountList',
  data() {
    return {
      // 筛选条件
      filters: {
        keyword: '',
        accountOwnership: '',
        accountStatus: '',
        vaStatus: '',
        accountType: '',
        tenant: ''
      },
      // 账户数据
      accountData: [
        {
          id: 'ACC001',
          accountNumber: '6222021234567890123',
          accountName: 'FORTUNE_BANK_USD',
          accountOwnership: 'agent_self',
          agentName: '北京代理商有限公司',
          merchantName: '',
          bankName: '福兴银行',
          currency: 'USD',
          accountStatus: 'active',
          vaStatus: 'approved',
          accountCategory: 'VA账户',
          createTime: '2024-01-15 10:30:00',
          lastActivityTime: '2024-01-18 14:20:30',
          accountType: 'usd_account',
          tenantName: '租户A',
          remark: '主要美元收款账户'
        },
        {
          id: 'ACC002',
          accountNumber: '6225021234567890456',
          accountName: 'DEUTSCHE_BANK_EUR',
          accountOwnership: 'assigned_to_merchant',
          agentName: '上海拓展服务商',
          merchantName: '北京商贸有限公司',
          bankName: '德意志银行',
          currency: 'EUR',
          accountStatus: 'active',
          vaStatus: 'pending',
          accountCategory: '虚拟账户',
          createTime: '2024-02-20 09:15:22',
          lastActivityTime: '2024-02-20 09:15:22',
          accountType: 'eur_account',
          tenantName: '租户B',
          remark: '欧元收款专用账户'
        },
        {
          id: 'ACC003',
          accountNumber: '6221021234567890678',
          accountName: 'HSBC_HKD',
          accountOwnership: 'agent_self',
          agentName: '广州合作伙伴',
          merchantName: '',
          bankName: '汇丰银行',
          currency: 'HKD',
          accountStatus: 'frozen',
          vaStatus: 'rejected',
          accountCategory: 'VCC卡',
          createTime: '2024-03-10 16:45:10',
          lastActivityTime: '2024-03-12 11:30:45',
          accountType: 'hkd_account',
          tenantName: '租户C',
          remark: '港币收款账户'
        },
        {
          id: 'ACC004',
          accountNumber: '6228481234567890345',
          accountName: 'BANK_OF_CHINA_CNY',
          accountOwnership: 'assigned_to_merchant',
          agentName: '深圳渠道商',
          merchantName: '上海贸易集团',
          bankName: '中国银行',
          currency: 'CNY',
          accountStatus: 'pending',
          vaStatus: 'approved',
          accountCategory: 'VA账户',
          createTime: '2024-04-05 13:20:30',
          lastActivityTime: '2024-04-05 13:20:30',
          accountType: 'offshore_cny',
          tenantName: '租户A',
          remark: '离岸人民币账户'
        },
        {
          id: 'ACC005',
          accountNumber: '6217001234567890123',
          accountName: 'FORTUNE_BANK_USD',
          accountOwnership: 'agent_self',
          agentName: '杭州分销商',
          merchantName: '',
          bankName: '福兴银行',
          currency: 'USD',
          accountStatus: 'active',
          vaStatus: 'approved',
          accountCategory: '虚拟账户',
          createTime: '2024-05-12 08:45:20',
          lastActivityTime: '2024-05-15 10:15:30',
          accountType: 'usd_account',
          tenantName: '租户E',
          remark: '备用美元账户'
        }
      ],
      // 分页信息
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 5
      },
      // 详情抽屉
      detailDrawerVisible: false,
      selectedAccount: {},
      // 账户类型选择弹窗
      showAccountTypeSelection: false,
      selectedAccountTypeForCreation: ''
    };
  },
  methods: {
    // 处理搜索
    handleSearch() {
      console.log('搜索条件:', this.filters);
      // 这里可以实现实际的搜索逻辑
    },
    // 重置筛选条件
    handleReset() {
      this.filters = {
        keyword: '',
        accountOwnership: '',
        accountStatus: '',
        vaStatus: '',
        accountType: '',
        tenant: ''
      };
    },
    // 导出功能
    handleExport() {
      this.$message.success('正在导出账户数据...');
    },
    // 批量导出
    handleBatchExport() {
      this.$message.success('正在批量导出账户数据...');
    },

    // 查看详情
    handleViewDetails(row) {
      this.selectedAccount = row;
      this.detailDrawerVisible = true;
    },
    // 关闭详情抽屉
    handleCloseDetail() {
      this.detailDrawerVisible = false;
    },
    
    // 新增账户
    handleAddAccount() {
      this.showAccountTypeSelection = true;
    },
    
    // 选择账户类型
    selectAccountType(type) {
      this.selectedAccountTypeForCreation = type;
      this.showAccountTypeSelection = false;
      
      // 根据选择的账户类型跳转到相应页面
      if (type === 'VA账户') {
        this.$router.push('/main/account/management');
      } else {
        // 对于其他账户类型，可以跳转到不同的创建页面或者显示不同的表单
        this.$message.info(`${type} 功能暂未开放`);
      }
    },
    
    // 取消选择账户类型
    cancelSelectAccountType() {
      this.showAccountTypeSelection = false;
    },
    // 分页大小变化
    handleSizeChange(val) {
      this.pagination.pageSize = val;
    },
    // 当前页变化
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
    },
    // 格式化日期
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
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
    // 账号脱敏显示
    maskAccountNumber(accountNumber) {
      if (!accountNumber || accountNumber.length < 8) return accountNumber;
      const start = accountNumber.substring(0, 4);
      const end = accountNumber.substring(accountNumber.length - 4);
      return `${start}****${end}`;
    },
    // 获取账户归属标签类型
    getOwnershipTagType(ownership) {
      const tagTypes = {
        'agent_self': 'primary',
        'assigned_to_merchant': 'success'
      };
      return tagTypes[ownership] || 'info';
    },
    // 获取账户归属标签文本
    getOwnershipLabel(ownership) {
      const labels = {
        'agent_self': '代理商自用',
        'assigned_to_merchant': '分配给商户'
      };
      return labels[ownership] || ownership;
    },
    // 获取账户状态标签类型
    getStatusTagType(status) {
      const tagTypes = {
        'active': 'success',
        'frozen': 'danger',
        'pending': 'warning',
        'rejected': 'info'
      };
      return tagTypes[status] || 'info';
    },
    // 获取账户状态标签文本
    getStatusLabel(status) {
      const labels = {
        'active': '正常',
        'frozen': '冻结',
        'pending': '审核中',
        'rejected': '审核失败'
      };
      return labels[status] || status;
    },
    // 获取VA审核状态标签类型
    getVaStatusTagType(vaStatus) {
      const tagTypes = {
        'approved': 'success',
        'pending': 'warning',
        'rejected': 'danger'
      };
      return tagTypes[vaStatus] || 'info';
    },
    // 获取VA审核状态标签文本
    getVaStatusLabel(vaStatus) {
      const labels = {
        'approved': '已批准',
        'pending': '待审核',
        'rejected': '拒绝'
      };
      return labels[vaStatus] || vaStatus;
    },
    // 获取账户类型标签文本
    getAccountTypeLabel(accountType) {
      const labels = {
        'usd_account': '美金账户',
        'eur_account': '欧元账户',
        'hkd_account': '港元账户',
        'offshore_cny': '离岸人民币账户'
      };
      return labels[accountType] || accountType;
    },
    
    // 获取账户类别标签类型
    getAccountCategoryTagType(category) {
      const tagTypes = {
        'VA账户': 'primary',
        '虚拟账户': 'success',
        'VCC卡': 'warning'
      };
      return tagTypes[category] || 'info';
    }
  }
};
</script>

<style scoped>
.account-list {
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

.table-header {
  margin-bottom: 15px;
  display: flex;
  justify-content: flex-start;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
}

.filter-form .el-form-item {
  margin-right: 20px;
  margin-bottom: 10px;
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

.footer-actions {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination {
  text-align: right;
}

.drawer-content {
  padding: 20px;
}
</style>