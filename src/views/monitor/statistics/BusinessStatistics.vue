<template>
  <div class="business-statistics">
    <div class="page-header">
      <h3>代理商业务数据统计</h3>
    </div>
    
    <el-card class="filter-card">
      <el-form :inline="true" :model="filters" class="filter-form">
        <el-form-item label="租户ID">
          <el-select v-model="filters.tenantId" placeholder="请选择租户" style="width: 150px;">
            <el-option label="全部租户" value=""></el-option>
            <el-option label="TNT001" value="TNT001"></el-option>
            <el-option label="TNT002" value="TNT002"></el-option>
            <el-option label="TNT003" value="TNT003"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="代理商ID">
          <el-input v-model="filters.agentId" placeholder="请输入代理商ID" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="商户名称">
          <el-input v-model="filters.merchantName" placeholder="请输入商户名称" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="统计日期">
          <el-date-picker
            v-model="filters.statisticDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 240px;"
          >
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
      :data="statisticsData"
      style="width: 100%"
      stripe
      class="statistics-table"
    >
      <el-table-column prop="tenantId" label="租户ID" width="120"></el-table-column>
      <el-table-column prop="tenantName" label="租户名称" width="150"></el-table-column>
      <el-table-column prop="agentId" label="代理商ID" width="120"></el-table-column>
      <el-table-column prop="agentName" label="代理商名称" width="150"></el-table-column>
      <el-table-column prop="merchantName" label="商户名称" width="150"></el-table-column>
      <el-table-column prop="businessLine" label="商户开通业务线" width="150"></el-table-column>
      <el-table-column prop="foreignTradeVolume" label="外贸收款结汇交易量" width="160">
        <template #default="{ row }">
          <span>{{ formatCurrency(row.foreignTradeVolume) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="platformVolume" label="平台收款交易量" width="140">
        <template #default="{ row }">
          <span>{{ formatCurrency(row.platformVolume) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="statisticDate" label="统计日期" width="120"></el-table-column>
      <el-table-column prop="registerDate" label="商户注册日期" width="140"></el-table-column>
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
  </div>
</template>

<script>
export default {
  name: 'BusinessStatistics',
  data() {
    return {
      filters: {
        tenantId: '',
        agentId: '',
        merchantName: '',
        statisticDate: null
      },
      statisticsData: [
        {
          tenantId: 'TNT001',
          tenantName: '租户A',
          agentId: 'AGT001',
          agentName: '北京代理商有限公司',
          merchantName: '北京商贸有限公司',
          businessLine: '国际支付',
          foreignTradeVolume: 1250000.50,
          platformVolume: 890000.25,
          statisticDate: '2024-01',
          registerDate: '2023-12-15'
        },
        {
          tenantId: 'TNT001',
          tenantName: '租户A',
          agentId: 'AGT001',
          agentName: '北京代理商有限公司',
          merchantName: '北京零售连锁',
          businessLine: '跨境收款',
          foreignTradeVolume: 2100000.75,
          platformVolume: 1560000.50,
          statisticDate: '2024-01',
          registerDate: '2024-01-20'
        },
        {
          tenantId: 'TNT002',
          tenantName: '租户B',
          agentId: 'AGT002',
          agentName: '上海拓展服务商',
          merchantName: '上海贸易集团',
          businessLine: '外汇兑换',
          foreignTradeVolume: 3500000.00,
          platformVolume: 2200000.00,
          statisticDate: '2024-01',
          registerDate: '2023-11-10'
        },
        {
          tenantId: 'TNT003',
          tenantName: '租户C',
          agentId: 'AGT003',
          agentName: '广州合作伙伴',
          merchantName: '广州电商企业',
          businessLine: '国际汇款',
          foreignTradeVolume: 1800000.25,
          platformVolume: 1320000.75,
          statisticDate: '2024-01',
          registerDate: '2024-02-15'
        },
        {
          tenantId: 'TNT001',
          tenantName: '租户A',
          agentId: 'AGT004',
          agentName: '深圳渠道商',
          merchantName: '深圳科技公司',
          businessLine: '跨境电商支付',
          foreignTradeVolume: 2750000.80,
          platformVolume: 1980000.60,
          statisticDate: '2024-01',
          registerDate: '2024-03-05'
        }
      ],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 5
      }
    };
  },
  methods: {
    handleSearch() {
      console.log('搜索条件:', this.filters);
      // 这里可以实现搜索逻辑
    },
    handleReset() {
      this.filters = {
        tenantId: '',
        agentId: '',
        merchantName: '',
        statisticDate: null
      };
    },
    handleExport() {
      this.$message.success('正在导出数据...');
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
    },
    formatCurrency(value) {
      // 格式化货币显示
      return new Intl.NumberFormat('zh-CN', {
        style: 'currency',
        currency: 'CNY',
        minimumFractionDigits: 2
      }).format(value);
    }
  }
};
</script>

<style scoped>
.business-statistics {
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

.statistics-table {
  margin-top: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>