<template>
  <div class="change-detail">
    <div class="page-header">
      <h3>关系变更明细</h3>
      <el-button type="primary" @click="goToChangeRecord">关系变更记录</el-button>
    </div>
    
    <el-card class="filter-card">
      <el-form :inline="true" :model="filters" class="filter-form">
        <el-form-item label="划转批次号">
          <el-input 
            v-model="filters.batchId" 
            placeholder="请输入划转批次号" 
            style="width: 150px;"
            :value="initialBatchId">
          </el-input>
        </el-form-item>
        <el-form-item label="租户">
          <el-select v-model="filters.tenantId" placeholder="请选择租户" style="width: 150px;">
            <el-option label="全部租户" value=""></el-option>
            <el-option label="租户A" value="TNT001"></el-option>
            <el-option label="租户B" value="TNT002"></el-option>
            <el-option label="租户C" value="TNT003"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="原代理商">
          <el-input v-model="filters.fromAgent" placeholder="请输入原代理商名称" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="新代理商">
          <el-input v-model="filters.toAgent" placeholder="请输入新代理商名称" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="商户">
          <el-input v-model="filters.merchantName" placeholder="请输入商户名称" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="划转时间">
          <el-date-picker
            v-model="filters.changeDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 240px;">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-table 
      :data="changeData" 
      style="width: 100%" 
      stripe 
      height="600"
      @row-click="handleRowClick"
      highlight-current-row
    >
      <el-table-column prop="tenantId" label="租户ID" width="120"></el-table-column>
      <el-table-column prop="tenantName" label="租户名称" width="120"></el-table-column>
      <el-table-column prop="batchId" label="划转批次号" width="180"></el-table-column>
      <el-table-column prop="changeTime" label="划转时间" width="150"></el-table-column>
      <el-table-column prop="effectiveTime" label="划转生效时间" width="150"></el-table-column>
      <el-table-column prop="merchantId" label="商户ID" width="150"></el-table-column>
      <el-table-column prop="merchantName" label="商户名称" width="180"></el-table-column>
      <el-table-column prop="fromAgent" label="原代理商" width="180"></el-table-column>
      <el-table-column prop="toAgent" label="新代理商" width="180"></el-table-column>
      <el-table-column prop="remark" label="备注" width="200"></el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click.stop="handleViewDetail(row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pagination.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
      style="margin-top: 20px; text-align: right;"
    ></el-pagination>

    <!-- 详情侧滑面板 -->
    <el-drawer
      v-model="detailDrawerVisible"
      size="50%"
      :title="`划转详情 - ${selectedChange.batchId}`"
      direction="rtl"
      :before-close="handleCloseDetail"
    >
      <div class="drawer-content">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="划转批次号">{{ selectedChange.batchId }}</el-descriptions-item>
          <el-descriptions-item label="租户ID">{{ selectedChange.tenantId }}</el-descriptions-item>
          <el-descriptions-item label="租户名称">{{ selectedChange.tenantName }}</el-descriptions-item>
          <el-descriptions-item label="划转时间">{{ selectedChange.changeTime }}</el-descriptions-item>
          <el-descriptions-item label="划转生效时间">{{ selectedChange.effectiveTime }}</el-descriptions-item>
          <el-descriptions-item label="商户ID">{{ selectedChange.merchantId }}</el-descriptions-item>
          <el-descriptions-item label="商户名称">{{ selectedChange.merchantName }}</el-descriptions-item>
          <el-descriptions-item label="原代理商">{{ selectedChange.fromAgent }}</el-descriptions-item>
          <el-descriptions-item label="新代理商">{{ selectedChange.toAgent }}</el-descriptions-item>
          <el-descriptions-item label="操作人">{{ selectedChange.operator }}</el-descriptions-item>
          <el-descriptions-item label="划转原因">{{ selectedChange.reason }}</el-descriptions-item>
          <el-descriptions-item label="备注">{{ selectedChange.remark }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'ChangeDetail',
  data() {
    return {
      initialBatchId: '', // 用于存储从URL参数传入的批次号
      filters: {
        batchId: '',
        tenantId: '',
        fromAgent: '',
        toAgent: '',
        merchantName: '',
        changeDate: ['', '']
      },
      changeData: [
        { 
          tenantId: 'TNT001', 
          tenantName: '租户A', 
          batchId: 'BATCH001', 
          changeTime: '2024-01-15 10:30:25', 
          effectiveTime: '2024-01-15 12:00:00', 
          merchantId: 'MCH001', 
          merchantName: '北京商贸有限公司', 
          fromAgent: '北京代理商有限公司', 
          toAgent: '上海拓展服务商', 
          operator: 'admin', 
          reason: '商户申请更换代理商', 
          remark: '商户希望获得更好的本地服务支持' 
        },
        { 
          tenantId: 'TNT002', 
          tenantName: '租户B', 
          batchId: 'BATCH002', 
          changeTime: '2024-01-16 14:22:10', 
          effectiveTime: '2024-01-16 16:00:00', 
          merchantId: 'MCH003', 
          merchantName: '广州电商企业', 
          fromAgent: '广州合作伙伴', 
          toAgent: '北京代理商有限公司', 
          operator: 'admin', 
          reason: '代理商协议调整', 
          remark: '因代理商绩效考核结果调整' 
        },
        { 
          tenantId: 'TNT003', 
          tenantName: '租户C', 
          batchId: 'BATCH003', 
          changeTime: '2024-01-17 09:15:45', 
          effectiveTime: '2024-01-17 10:00:00', 
          merchantId: 'MCH005', 
          merchantName: '深圳科技公司', 
          fromAgent: '上海拓展服务商', 
          toAgent: '广州合作伙伴', 
          operator: 'manager', 
          reason: '区域业务调整', 
          remark: '根据区域市场策略调整代理商分配' 
        },
        { 
          tenantId: 'TNT001', 
          tenantName: '租户A', 
          batchId: 'BATCH004', 
          changeTime: '2024-01-18 16:40:30', 
          effectiveTime: '2024-01-18 18:00:00', 
          merchantId: 'MCH007', 
          merchantName: '杭州制造企业', 
          fromAgent: '无', 
          toAgent: '北京代理商有限公司', 
          operator: 'admin', 
          reason: '新商户入驻', 
          remark: '新注册商户首次分配代理商' 
        }
      ],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 4
      },
      detailDrawerVisible: false,
      selectedChange: {}
    };
  },
  created() {
    // 从URL参数获取批次号并自动填充到搜索框
    this.initialBatchId = this.$route.query.batchId || '';
    this.filters.batchId = this.initialBatchId;
  },
  methods: {
    goToChangeRecord() {
      // 跳转到关系变更记录页面
      this.$router.push('/main/monitor/change-records');
    },
    handleSearch() {
      console.log('搜索条件:', this.filters);
    },
    handleReset() {
      this.filters = { 
        batchId: this.initialBatchId, // 保留从URL传入的批次号
        tenantId: '', 
        fromAgent: '', 
        toAgent: '', 
        merchantName: '', 
        changeDate: ['', ''] 
      };
    },
    handleExport() {
      this.$message.success('正在导出变更明细...');
    },
    handleRowClick(row) {
      this.selectedChange = row;
      this.detailDrawerVisible = true;
    },
    handleViewDetail(row) {
      this.selectedChange = row;
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
    }
  }
};
</script>

<style scoped>
.change-detail {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.drawer-content {
  padding: 20px;
}
</style>