<template>
  <div class="sp-te-relation-detail">
    <div class="page-header">
      <el-page-header 
        @back="goBack"
        content="SP/TE代理关系详情"
      />
    </div>
    
    <el-card class="detail-card">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="SP名称">SP代理商A</el-descriptions-item>
        <el-descriptions-item label="SP标识">SP001</el-descriptions-item>
        <el-descriptions-item label="租户名称">租户A</el-descriptions-item>
        <el-descriptions-item label="租户标识">TNT001</el-descriptions-item>
        <el-descriptions-item label="SP/TE是否同名">
          <el-tag type="success">是</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="代理产品">
          <div v-for="product in products" :key="product.id" class="product-item">
            <el-tag size="small" style="margin-right: 5px; margin-bottom: 5px;">{{ product.name }}</el-tag>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag type="success">激活</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">2024-01-15</el-descriptions-item>
        <el-descriptions-item label="最后更新时间">2024-01-15</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="relation-history-card" style="margin-top: 20px;">
      <template #header>
        <div class="card-header">
          <span>关系变更历史</span>
        </div>
      </template>
      <el-table :data="relationHistory" style="width: 100%">
        <el-table-column prop="changeDate" label="变更时间" width="180"></el-table-column>
        <el-table-column prop="changeType" label="变更类型" width="120"></el-table-column>
        <el-table-column prop="beforeChange" label="变更前" width="200"></el-table-column>
        <el-table-column prop="afterChange" label="变更后" width="200"></el-table-column>
        <el-table-column prop="operator" label="操作人" width="120"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'SpTeRelationDetail',
  data() {
    return {
      products: [
        { id: 'PROD001', name: '国际交易分佣产品' },
        { id: 'PROD002', name: '汇率返点产品' }
      ],
      relationHistory: [
        {
          changeDate: '2024-01-15 10:30:00',
          changeType: '新建关系',
          beforeChange: '-',
          afterChange: '建立SP/TE代理关系',
          operator: 'admin',
          remark: '初始建立代理关系'
        },
        {
          changeDate: '2024-02-20 14:22:00',
          changeType: '产品变更',
          beforeChange: '国际交易分佣产品',
          afterChange: '国际交易分佣产品+汇率返点产品',
          operator: 'system',
          remark: '新增代理产品'
        },
        {
          changeDate: '2024-03-10 09:15:00',
          changeType: '状态变更',
          beforeChange: '未激活',
          afterChange: '激活',
          operator: 'admin',
          remark: '激活代理关系'
        }
      ]
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.sp-te-relation-detail {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
}

.detail-card {
  margin-top: 20px;
}

.relation-history-card {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-item {
  display: inline-block;
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>