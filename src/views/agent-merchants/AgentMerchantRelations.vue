<template>
  <div class="agent-merchant-relations">
    <div class="page-header">
      <h3>代理商商户关联关系列表</h3>
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
        <el-form-item label="商户">
          <el-input v-model="filters.merchantName" placeholder="请输入商户名称"></el-input>
        </el-form-item>
        <el-form-item label="关联状态">
          <el-select v-model="filters.relationStatus" placeholder="请选择状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="正常" value="active"></el-option>
            <el-option label="解绑" value="inactive"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-table :data="relations" style="width: 100%" stripe>
      <el-table-column prop="tenantName" label="租户名称" width="150"></el-table-column>
      <el-table-column prop="relationId" label="关联编号" width="180"></el-table-column>
      <el-table-column prop="agentName" label="代理商名称" width="200"></el-table-column>
      <el-table-column prop="merchantName" label="商户名称" width="200"></el-table-column>
      <el-table-column prop="merchantId" label="商户ID" width="150"></el-table-column>
      <el-table-column prop="relationType" label="关联类型" width="120">
        <template #default="{ row }">
          <el-tag :type="row.relationType === 'direct' ? 'success' : 'warning'">
            {{ row.relationType === 'direct' ? '直推' : '间推' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="关联时间" width="150"></el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
            {{ row.status === 'active' ? '正常' : '解绑' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button size="small" @click="handleViewDetail(row)">查看详情</el-button>
          <el-button size="small" type="danger" @click="handleUnbind(row)" v-if="row.status === 'active'">解绑</el-button>
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
  name: 'AgentMerchantRelations',
  data() {
    return {
      filters: {
        tenantId: '',
        agentId: '',
        merchantName: '',
        relationStatus: ''
      },
      relations: [
        { tenantName: '租户A', relationId: 'REL001', agentName: '北京代理商有限公司', merchantName: '北京商贸有限公司', merchantId: 'MCH001', relationType: 'direct', createTime: '2024-01-15', status: 'active' },
        { tenantName: '租户B', relationId: 'REL002', agentName: '上海拓展服务商', merchantName: '上海贸易集团', merchantId: 'MCH002', relationType: 'direct', createTime: '2024-02-20', status: 'active' },
        { tenantName: '租户C', relationId: 'REL003', agentName: '广州合作伙伴', merchantName: '广州电商企业', merchantId: 'MCH003', relationType: 'indirect', createTime: '2024-03-10', status: 'inactive' },
        { tenantName: '租户A', relationId: 'REL004', agentName: '北京代理商有限公司', merchantName: '北京零售连锁', merchantId: 'MCH004', relationType: 'direct', createTime: '2024-04-05', status: 'active' },
        { tenantName: '租户B', relationId: 'REL005', agentName: '上海拓展服务商', merchantName: '深圳科技公司', merchantId: 'MCH005', relationType: 'direct', createTime: '2024-04-12', status: 'active' }
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
    },
    handleReset() {
      this.filters = { tenantId: '', agentId: '', merchantName: '', relationStatus: '' };
    },
    handleViewDetail(row) {
      this.$alert(`
        <div><strong>租户名称:</strong> ${row.tenantName}</div>
        <div><strong>关联编号:</strong> ${row.relationId}</div>
        <div><strong>代理商名称:</strong> ${row.agentName}</div>
        <div><strong>商户名称:</strong> ${row.merchantName}</div>
        <div><strong>商户ID:</strong> ${row.merchantId}</div>
        <div><strong>关联类型:</strong> ${row.relationType === 'direct' ? '直推' : '间推'}</div>
        <div><strong>关联时间:</strong> ${row.createTime}</div>
        <div><strong>状态:</strong> ${row.status === 'active' ? '正常' : '解绑'}</div>
      `, '关联详情', {
        dangerouslyUseHTMLString: true
      });
    },
    handleUnbind(row) {
      this.$confirm(`确认解除 ${row.merchantName} 与 ${row.agentName} 的关联关系？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.status = 'inactive';
        this.$message.success('解绑成功');
      });
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
.agent-merchant-relations {
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