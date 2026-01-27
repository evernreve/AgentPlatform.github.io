<template>
  <div class="change-record">
    <div class="page-header">
      <h3>关系变更记录</h3>
    </div>
    
    <el-card class="filter-card">
      <el-form :inline="true" :model="filters" class="filter-form">
        <el-form-item label="批次号">
          <el-input v-model="filters.batchId" placeholder="请输入批次号" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="上传文件名称">
          <el-input v-model="filters.fileName" placeholder="请输入文件名称" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="上传的租户ID">
          <el-select v-model="filters.tenantId" placeholder="请选择租户" style="width: 150px;">
            <el-option label="全部租户" value=""></el-option>
            <el-option label="TNT001" value="TNT001"></el-option>
            <el-option label="TNT002" value="TNT002"></el-option>
            <el-option label="TNT003" value="TNT003"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传人">
          <el-input v-model="filters.uploadPerson" placeholder="请输入上传人" style="width: 120px;"></el-input>
        </el-form-item>
        <el-form-item label="上传时间">
          <el-date-picker
            v-model="filters.uploadTime"
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
    >
      <el-table-column prop="batchId" label="批次号" width="180"></el-table-column>
      <el-table-column prop="fileName" label="上传文件名称" width="200"></el-table-column>
      <el-table-column prop="tenantId" label="上传的租户ID" width="150"></el-table-column>
      <el-table-column prop="tenantName" label="上传的租户名称" width="150"></el-table-column>
      <el-table-column prop="uploadPerson" label="上传人" width="120"></el-table-column>
      <el-table-column prop="uploadTime" label="上传时间" width="150"></el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="handleViewDetails(row)">查看详情</el-button>
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
  </div>
</template>

<script>
export default {
  name: 'ChangeRecord',
  data() {
    return {
      filters: {
        batchId: '',
        fileName: '',
        tenantId: '',
        uploadPerson: '',
        uploadTime: ['', '']
      },
      changeData: [
        { 
          batchId: 'BATCH001', 
          fileName: 'agent_transfer_20240115.xlsx', 
          tenantId: 'TNT001', 
          tenantName: '租户A', 
          uploadPerson: 'admin', 
          uploadTime: '2024-01-15 10:30:25' 
        },
        { 
          batchId: 'BATCH002', 
          fileName: 'agent_transfer_20240116.xlsx', 
          tenantId: 'TNT002', 
          tenantName: '租户B', 
          uploadPerson: 'manager', 
          uploadTime: '2024-01-16 14:22:10' 
        },
        { 
          batchId: 'BATCH003', 
          fileName: 'agent_transfer_20240117.xlsx', 
          tenantId: 'TNT003', 
          tenantName: '租户C', 
          uploadPerson: 'admin', 
          uploadTime: '2024-01-17 09:15:45' 
        },
        { 
          batchId: 'BATCH004', 
          fileName: 'agent_transfer_20240118.xlsx', 
          tenantId: 'TNT001', 
          tenantName: '租户A', 
          uploadPerson: 'admin', 
          uploadTime: '2024-01-18 16:40:30' 
        }
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
      this.filters = { batchId: '', fileName: '', tenantId: '', uploadPerson: '', uploadTime: ['', ''] };
    },
    handleExport() {
      this.$message.success('正在导出变更记录...');
    },
    handleViewDetails(row) {
      // 跳转到关系变更明细页面，并将批次号传入搜索框
      this.$router.push({ 
        path: '/main/monitor/change-details', 
        query: { batchId: row.batchId } 
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
.change-record {
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