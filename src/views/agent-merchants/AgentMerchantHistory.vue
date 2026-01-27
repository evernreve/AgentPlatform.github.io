<template>
  <div class="agent-merchant-history">
    <div class="page-header">
      <h3>代理商商户关联变更记录</h3>
    </div>
    
    <el-card class="filter-card">
      <el-form :inline="true" :model="filters" class="filter-form">
        <el-form-item label="租户">
          <el-select v-model="filters.tenantId" placeholder="请选择租户" style="width: 150px;">
            <el-option label="全部" value=""></el-option>
            <el-option label="租户A" value="TNT001"></el-option>
            <el-option label="租户B" value="TNT002"></el-option>
            <el-option label="租户C" value="TNT003"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="代理商">
          <el-select v-model="filters.agentId" placeholder="请选择代理商" style="width: 200px;">
            <el-option label="全部" value=""></el-option>
            <el-option label="北京代理商有限公司" value="AGT001"></el-option>
            <el-option label="上海拓展服务商" value="AGT002"></el-option>
            <el-option label="广州合作伙伴" value="AGT003"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商户">
          <el-input v-model="filters.merchantName" placeholder="请输入商户名称"></el-input>
        </el-form-item>
        <el-form-item label="变更类型">
          <el-select v-model="filters.changeType" placeholder="请选择变更类型">
            <el-option label="全部" value=""></el-option>
            <el-option label="新增关联" value="add"></el-option>
            <el-option label="解除关联" value="remove"></el-option>
            <el-option label="划转" value="transfer"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-table :data="historyRecords" style="width: 100%" stripe>
      <el-table-column prop="tenantName" label="租户名称" width="150"></el-table-column>
      <el-table-column prop="batchId" label="划转批次号" width="180"></el-table-column>
      <el-table-column prop="changeTime" label="变更时间" width="150"></el-table-column>
      <el-table-column prop="merchantName" label="商户名称" width="200"></el-table-column>
      <el-table-column prop="merchantId" label="商户ID" width="150"></el-table-column>
      <el-table-column prop="fromAgent" label="原代理商" width="200"></el-table-column>
      <el-table-column prop="toAgent" label="新代理商" width="200"></el-table-column>
      <el-table-column prop="changeType" label="变更类型" width="120">
        <template #default="{ row }">
          <el-tag :type="getChangeTypeTag(row.changeType)">
            {{ getChangeTypeLabel(row.changeType) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="operator" label="操作人" width="120"></el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button size="small" @click="handleViewDetail(row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.currentPage"
      :page-sizes="[10, 20, 50]"
      :page-size="pagination.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: 'AgentMerchantHistory',
  data() {
    return {
      filters: {
        tenantId: '',
        agentId: '',
        merchantName: '',
        changeType: ''
      },
      historyRecords: [
        { tenantName: '租户A', batchId: 'BATCH001', changeTime: '2024-01-15 10:30:25', merchantName: '北京商贸有限公司', merchantId: 'MCH001', fromAgent: '北京代理商有限公司', toAgent: '上海拓展服务商', changeType: 'transfer', operator: 'admin' },
        { tenantName: '租户B', batchId: 'BATCH002', changeTime: '2024-01-16 14:22:10', merchantName: '广州电商企业', merchantId: 'MCH003', fromAgent: '广州合作伙伴', toAgent: '北京代理商有限公司', changeType: 'transfer', operator: 'admin' },
        { tenantName: '租户C', batchId: 'BATCH003', changeTime: '2024-01-17 09:15:45', merchantName: '深圳科技公司', merchantId: 'MCH005', fromAgent: '上海拓展服务商', toAgent: '广州合作伙伴', changeType: 'transfer', operator: 'manager' },
        { tenantName: '租户A', batchId: 'BATCH004', changeTime: '2024-01-18 16:40:30', merchantName: '杭州制造企业', merchantId: 'MCH007', fromAgent: '无', toAgent: '北京代理商有限公司', changeType: 'add', operator: 'admin' }
      ],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 4
      }
    };
  },
  methods: {
    handleSearch() {
      console.log('搜索条件:', this.filters);
    },
    handleReset() {
      this.filters = { tenantId: '', agentId: '', merchantName: '', changeType: '' };
    },
    handleViewDetail(row) {
      this.$alert(`
        <div><strong>租户名称:</strong> ${row.tenantName}</div>
        <div><strong>划转批次号:</strong> ${row.batchId}</div>
        <div><strong>变更时间:</strong> ${row.changeTime}</div>
        <div><strong>商户名称:</strong> ${row.merchantName}</div>
        <div><strong>商户ID:</strong> ${row.merchantId}</div>
        <div><strong>原代理商:</strong> ${row.fromAgent}</div>
        <div><strong>新代理商:</strong> ${row.toAgent}</div>
        <div><strong>变更类型:</strong> ${this.getChangeTypeLabel(row.changeType)}</div>
        <div><strong>操作人:</strong> ${row.operator}</div>
      `, '变更详情', {
        dangerouslyUseHTMLString: true
      });
    },
    getChangeTypeLabel(changeType) {
      const labels = {
        add: '新增关联',
        remove: '解除关联',
        transfer: '划转'
      };
      return labels[changeType] || changeType;
    },
    getChangeTypeTag(changeType) {
      const tags = {
        add: 'success',
        remove: 'danger',
        transfer: 'warning'
      };
      return tags[changeType] || 'info';
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
    }
  }
};
</script>

<style scoped>
.agent-merchant-history {
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

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>