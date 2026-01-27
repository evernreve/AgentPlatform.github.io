<template>
  <div class="agent-product-config">
    <div class="page-header">
      <h3>代理商产品配置</h3>
    </div>
    
    <el-card class="filter-card">
      <el-form :inline="true" :model="filters" class="filter-form">
        <el-form-item label="租户">
          <el-select v-model="filters.tenantId" placeholder="请选择租户" style="width: 150px;">
            <el-option label="租户A" value="TNT001"></el-option>
            <el-option label="租户B" value="TNT002"></el-option>
            <el-option label="租户C" value="TNT003"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="代理商">
          <el-select v-model="filters.agentId" placeholder="请选择代理商" style="width: 200px;">
            <el-option label="北京代理商有限公司" value="AGT001"></el-option>
            <el-option label="上海拓展服务商" value="AGT002"></el-option>
            <el-option label="广州合作伙伴" value="AGT003"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品类型">
          <el-select v-model="filters.productType" placeholder="请选择产品类型" style="width: 200px;">
            <el-option label="交易分佣产品" value="commission"></el-option>
            <el-option label="汇率返点产品" value="rebate"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="product-config-card">
      <template #header>
        <div class="card-header">
          <span>产品配置</span>
          <el-button type="primary" size="small" @click="handleAssignProduct">分配产品</el-button>
        </div>
      </template>
      
      <el-table :data="assignedProducts" style="width: 100%" stripe>
        <el-table-column prop="tenantName" label="租户名称" width="150"></el-table-column>
        <el-table-column prop="agentName" label="代理商名称" width="200"></el-table-column>
        <el-table-column prop="productName" label="产品名称" width="200"></el-table-column>
        <el-table-column prop="productType" label="产品类型" width="150">
          <template #default="{ row }">
            <el-tag :type="row.productType === 'commission' ? 'success' : 'warning'">
              {{ row.productType === 'commission' ? '交易分佣' : '汇率返点' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="productLevel" label="产品等级" width="150"></el-table-column>
        <el-table-column prop="signDate" label="产品签约日期" width="150"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '生效中' : '已失效' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleUnassign(row)">取消分配</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AgentProductConfig',
  data() {
    return {
      filters: {
        tenantId: '',
        agentId: '',
        productType: ''
      },
      assignedProducts: [
        { tenantName: '租户A', agentName: '北京代理商有限公司', productName: '国际交易分佣产品', productType: 'commission', productLevel: '高级版', signDate: '2024-01-15', status: 'active' },
        { tenantName: '租户A', agentName: '北京代理商有限公司', productName: '汇率返点产品A', productType: 'rebate', productLevel: '标准版', signDate: '2024-02-20', status: 'active' },
        { tenantName: '租户B', agentName: '上海拓展服务商', productName: '跨境支付分佣', productType: 'commission', productLevel: '基础版', signDate: '2024-03-10', status: 'active' },
        { tenantName: '租户C', agentName: '广州合作伙伴', productName: '国际汇款产品', productType: 'rebate', productLevel: '专业版', signDate: '2024-04-12', status: 'active' }
      ]
    };
  },
  methods: {
    handleSearch() {
      console.log('搜索条件:', this.filters);
    },
    handleReset() {
      this.filters = { tenantId: '', agentId: '', productType: '' };
    },
    handleAssignProduct() {
      this.$prompt('请选择要分配的产品:', '产品分配', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '产品不能为空'
      }).then(({ value }) => {
        this.assignedProducts.push({
          tenantName: this.filters.tenantId ? this.filters.tenantId.replace('TNT', '租户') : '租户A',
          agentName: this.filters.agentId ? this.filters.agentId.replace('AGT', '代理商') : '新代理商',
          productName: value,
          productType: 'commission',
          productLevel: '标准版',
          signDate: new Date().toISOString().split('T')[0],
          status: 'active'
        });
        this.$message.success('产品分配成功！');
      });
    },
    handleEdit(row) {
      this.$prompt('修改产品等级:', '编辑产品', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: row.productLevel
      }).then(({ value }) => {
        row.productLevel = value;
        this.$message.success('更新成功！');
      });
    },
    handleUnassign(row) {
      this.$confirm(`确认取消分配产品 ${row.productName}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.assignedProducts.findIndex(item => item.productName === row.productName);
        if (index > -1) {
          this.assignedProducts.splice(index, 1);
        }
        this.$message.success('取消分配成功');
      });
    }
  }
};
</script>

<style scoped>
.agent-product-config {
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

.product-config-card {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>