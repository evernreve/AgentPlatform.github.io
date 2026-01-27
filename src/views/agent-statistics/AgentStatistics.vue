<template>
  <div class="agent-statistics">
    <div class="page-header">
      <h3>代理商业务数据统计</h3>
    </div>
    
    <el-card class="filter-card">
      <el-form :inline="true" :model="filters" class="filter-form">
        <el-form-item label="租户">
          <el-select v-model="filters.tenantId" placeholder="请选择租户" style="width: 150px;">
            <el-option label="全部租户" value=""></el-option>
            <el-option label="租户A" value="TNT001"></el-option>
            <el-option label="租户B" value="TNT002"></el-option>
            <el-option label="租户C" value="TNT003"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="统计周期">
          <el-date-picker
            v-model="filters.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="代理商">
          <el-select v-model="filters.agentId" placeholder="请选择代理商" style="width: 200px;">
            <el-option label="全部代理商" value=""></el-option>
            <el-option label="北京代理商有限公司" value="AGT001"></el-option>
            <el-option label="上海拓展服务商" value="AGT002"></el-option>
            <el-option label="广州合作伙伴" value="AGT003"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务线">
          <el-select v-model="filters.businessLine" placeholder="请选择业务线" style="width: 150px;">
            <el-option label="全部" value=""></el-option>
            <el-option label="外贸收款" value="foreign_trade"></el-option>
            <el-option label="平台收款" value="platform_payment"></el-option>
            <el-option label="其他" value="other"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据概览卡片 -->
    <el-row :gutter="20" class="overview-cards">
      <el-col :span="6">
        <el-card class="overview-card">
          <div class="card-content">
            <div class="card-title">总交易笔数</div>
            <div class="card-value">{{ overview.totalTransactions }}</div>
            <div class="card-trend">
              <el-icon :class="overview.transactionGrowth >= 0 ? 'text-up' : 'text-down'">
                <CaretTop v-if="overview.transactionGrowth >= 0" />
                <CaretBottom v-else />
              </el-icon>
              <span :class="overview.transactionGrowth >= 0 ? 'up' : 'down'">
                {{ Math.abs(overview.transactionGrowth) }}%
              </span>
              <span class="compared-text">较上期</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="overview-card">
          <div class="card-content">
            <div class="card-title">总交易金额</div>
            <div class="card-value">¥{{ overview.totalAmount }}</div>
            <div class="card-trend">
              <el-icon :class="overview.amountGrowth >= 0 ? 'text-up' : 'text-down'">
                <CaretTop v-if="overview.amountGrowth >= 0" />
                <CaretBottom v-else />
              </el-icon>
              <span :class="overview.amountGrowth >= 0 ? 'up' : 'down'">
                {{ Math.abs(overview.amountGrowth) }}%
              </span>
              <span class="compared-text">较上期</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="overview-card">
          <div class="card-content">
            <div class="card-title">拓展商户数</div>
            <div class="card-value">{{ overview.merchantCount }}</div>
            <div class="card-trend">
              <el-icon :class="overview.merchantGrowth >= 0 ? 'text-up' : 'text-down'">
                <CaretTop v-if="overview.merchantGrowth >= 0" />
                <CaretBottom v-else />
              </el-icon>
              <span :class="overview.merchantGrowth >= 0 ? 'up' : 'down'">
                {{ Math.abs(overview.merchantGrowth) }}%
              </span>
              <span class="compared-text">较上期</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="overview-card">
          <div class="card-content">
            <div class="card-title">活跃代理商</div>
            <div class="card-value">{{ overview.activeAgents }}</div>
            <div class="card-trend">
              <el-icon :class="overview.agentGrowth >= 0 ? 'text-up' : 'text-down'">
                <CaretTop v-if="overview.agentGrowth >= 0" />
                <CaretBottom v-else />
              </el-icon>
              <span :class="overview.agentGrowth >= 0 ? 'up' : 'down'">
                {{ Math.abs(overview.agentGrowth) }}%
              </span>
              <span class="compared-text">较上期</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-card class="chart-card">
      <template #header>
        <div class="chart-header">
          <span>交易趋势图表</span>
        </div>
      </template>
      <div id="transaction-chart" style="height: 400px;"></div>
    </el-card>

    <!-- 详细数据表格 -->
    <el-card class="data-table-card" style="margin-top: 20px;">
      <el-table :data="statisticsData" style="width: 100%" stripe>
        <el-table-column prop="tenantName" label="租户名称" width="120"></el-table-column>
        <el-table-column prop="date" label="日期" width="120"></el-table-column>
        <el-table-column prop="agentName" label="代理商" width="200"></el-table-column>
        <el-table-column prop="merchantName" label="商户" width="200"></el-table-column>
        <el-table-column prop="businessLine" label="业务线" width="120">
          <template #default="{ row }">
            <el-tag :type="getBusinessLineType(row.businessLine)">
              {{ getBusinessLineLabel(row.businessLine) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="transactionCount" label="交易笔数" width="120"></el-table-column>
        <el-table-column prop="transactionAmount" label="交易金额" width="120"></el-table-column>
        <el-table-column prop="commissionAmount" label="佣金收入" width="120"></el-table-column>
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
        style="margin-top: 20px; text-align: right;"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { CaretTop, CaretBottom } from '@element-plus/icons-vue';

export default {
  name: 'AgentStatistics',
  components: {
    CaretTop,
    CaretBottom
  },
  data() {
    return {
      filters: {
        tenantId: '',
        dateRange: ['', ''],
        agentId: '',
        businessLine: ''
      },
      overview: {
        totalTransactions: '12,450',
        transactionGrowth: 12.5,
        totalAmount: '2,450,000',
        amountGrowth: 8.3,
        merchantCount: 320,
        merchantGrowth: 5.2,
        activeAgents: 45,
        agentGrowth: 3.1
      },
      statisticsData: [
        { tenantName: '租户A', date: '2024-01-15', agentName: '北京代理商有限公司', merchantName: '北京商贸有限公司', businessLine: 'foreign_trade', transactionCount: 125, transactionAmount: '25,000', commissionAmount: '1,250' },
        { tenantName: '租户B', date: '2024-01-15', agentName: '上海拓展服务商', merchantName: '上海贸易集团', businessLine: 'platform_payment', transactionCount: 89, transactionAmount: '18,000', commissionAmount: '900' },
        { tenantName: '租户C', date: '2024-01-16', agentName: '广州合作伙伴', merchantName: '广州电商企业', businessLine: 'foreign_trade', transactionCount: 210, transactionAmount: '42,000', commissionAmount: '2,100' },
        { tenantName: '租户A', date: '2024-01-16', agentName: '北京代理商有限公司', merchantName: '北京零售连锁', businessLine: 'platform_payment', transactionCount: 76, transactionAmount: '15,200', commissionAmount: '760' },
        { tenantName: '租户B', date: '2024-01-17', agentName: '上海拓展服务商', merchantName: '深圳科技公司', businessLine: 'foreign_trade', transactionCount: 156, transactionAmount: '31,200', commissionAmount: '1,560' }
      ],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 5
      }
    };
  },
  mounted() {
    // 初始化图表
    this.initChart();
  },
  methods: {
    initChart() {
      // 这里会初始化ECharts图表
      // 由于没有引入ECharts库，暂时留空
      console.log("图表初始化");
    },
    handleSearch() {
      console.log('搜索条件:', this.filters);
      this.$message.success('查询完成');
    },
    handleReset() {
      this.filters = { tenantId: '', dateRange: ['', ''], agentId: '', businessLine: '' };
    },
    getBusinessLineLabel(businessLine) {
      const labels = {
        foreign_trade: '外贸收款',
        platform_payment: '平台收款',
        other: '其他'
      };
      return labels[businessLine] || businessLine;
    },
    getBusinessLineType(businessLine) {
      const types = {
        foreign_trade: 'primary',
        platform_payment: 'success',
        other: 'info'
      };
      return types[businessLine] || 'info';
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
    }
  },
  watch: {
    'filters.dateRange'() {
      // 当日期范围变化时重新查询数据
      this.handleSearch();
    }
  }
};
</script>

<style scoped>
.agent-statistics {
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

.overview-cards {
  margin-bottom: 20px;
}

.overview-card {
  text-align: center;
}

.card-content {
  padding: 10px;
}

.card-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.card-trend {
  font-size: 12px;
}

.text-up {
  color: #f56c6c;
}

.text-down {
  color: #67c23a;
}

.up {
  color: #f56c6c;
}

.down {
  color: #67c23a;
}

.compared-text {
  color: #999;
}

.chart-card {
  margin-bottom: 20px;
}

.chart-header {
  font-weight: bold;
}

.data-table-card {
  
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>