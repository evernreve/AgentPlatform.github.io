<template>
  <div class="agent-list">
    <div class="page-header">
      <h3>租户与代理商管理</h3>
      <el-button type="primary" @click="handleCreate">新增代理商</el-button>
    </div>
    
    <el-card class="filter-card">
      <el-form :inline="true" :model="filters" class="filter-form">
        <el-form-item label="租户名称">
          <el-input v-model="filters.tenantName" placeholder="请输入租户名称"></el-input>
        </el-form-item>
        <el-form-item label="代理商名称">
          <el-input v-model="filters.name" placeholder="请输入代理商名称"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.status" placeholder="请选择状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="正常" value="active"></el-option>
            <el-option label="禁用" value="disabled"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-table :data="agentList" style="width: 100%" stripe>
      <el-table-column prop="tenantName" label="租户名称" width="150"></el-table-column>
      <el-table-column prop="agentId" label="代理商ID" width="150"></el-table-column>
      <el-table-column prop="name" label="代理商名称" width="200"></el-table-column>
      <el-table-column prop="shortName" label="简称" width="150"></el-table-column>
      <el-table-column prop="entityId" label="实体ID" width="150"></el-table-column>
      <el-table-column prop="entityName" label="实体名称" width="200"></el-table-column>
      <el-table-column prop="contractSubjectType" label="签约主体类型" width="150">
        <template #default="{ row }">
          <el-tag :type="row.contractSubjectType === 'enterprise' ? 'primary' : 'success'">
            {{ row.contractSubjectType === 'enterprise' ? '企业' : '个人' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="agentType" label="代理商类型" width="150"></el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
            {{ row.status === 'active' ? '正常' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" :type="row.status === 'active' ? 'warning' : 'success'" @click="handleToggleStatus(row)">
            {{ row.status === 'active' ? '禁用' : '启用' }}
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
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
  name: 'AgentList',
  data() {
    return {
      filters: {
        tenantName: '',
        name: '',
        status: ''
      },
      agentList: [
        { tenantName: '租户A', agentId: 'AGT001', name: '北京代理商有限公司', shortName: '北京代理', entityId: 'ENT001', entityName: '北京商企科技', contractSubjectType: 'enterprise', agentType: '友商', status: 'active' },
        { tenantName: '租户B', agentId: 'AGT002', name: '上海拓展服务商', shortName: '上海拓展', entityId: 'ENT002', entityName: '上海商务服务', contractSubjectType: 'enterprise', agentType: '秘书公司', status: 'active' },
        { tenantName: '租户C', agentId: 'AGT003', name: '广州合作伙伴', shortName: '广州合作', entityId: 'ENT003', entityName: '广州商务咨询', contractSubjectType: 'enterprise', agentType: '物流服务商', status: 'disabled' },
        { tenantName: '租户A', agentId: 'AGT004', name: '深圳渠道商', shortName: '深圳渠道', entityId: 'ENT004', entityName: '深圳创新科技', contractSubjectType: 'enterprise', agentType: '友商', status: 'active' }
      ],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 4
      }
    };
  },
  methods: {
    handleCreate() {
      this.$router.push('/main/agents/create');
    },
    handleEdit(row) {
      this.$router.push(`/main/agents/edit/${row.agentId}`);
    },
    handleToggleStatus(row) {
      // 切换代理商状态
      row.status = row.status === 'active' ? 'disabled' : 'active';
      this.$message.success(`代理商${row.name}已${row.status === 'active' ? '启用' : '禁用'}`);
    },
    handleDelete(row) {
      this.$confirm(`确认删除代理商 ${row.name}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.agentList = this.agentList.filter(item => item.agentId !== row.agentId);
        this.$message.success('删除成功');
      });
    },
    handleSearch() {
      console.log('搜索条件:', this.filters);
    },
    handleReset() {
      this.filters = { tenantName: '', name: '', status: '' };
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
.agent-list {
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
</style>