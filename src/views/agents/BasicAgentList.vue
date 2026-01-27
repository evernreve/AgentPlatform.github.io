<template>
  <div class="agent-basic-list">
    <div class="page-header">
      <h3>代理商信息管理</h3>
    </div>
    
    <el-card class="filter-card">
      <el-form :inline="true" :model="filters" class="filter-form">
        <el-form-item label="代理商名称">
          <el-input 
            v-model="filters.name" 
            placeholder="请输入代理商名称" 
            style="width: 150px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="管理员姓名">
          <el-input 
            v-model="filters.adminName" 
            placeholder="请输入管理员姓名" 
            style="width: 150px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="平台唯一ID">
          <el-input 
            v-model="filters.id" 
            placeholder="请输入平台唯一ID" 
            style="width: 150px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="代理商类型">
          <el-select v-model="filters.type" placeholder="请选择代理商类型" style="width: 120px;">
            <el-option label="全部" value=""></el-option>
            <el-option label="个人" value="personal"></el-option>
            <el-option label="企业" value="enterprise"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="代理商状态">
          <el-select v-model="filters.status" placeholder="请选择状态" style="width: 120px;">
            <el-option label="全部" value=""></el-option>
            <el-option label="活跃" value="active"></el-option>
            <el-option label="非活跃" value="inactive"></el-option>
            <el-option label="待审核" value="pending"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-table 
      :data="filteredAgentList" 
      style="width: 100%" 
      stripe
    >
      <el-table-column prop="id" label="平台唯一ID" width="150"></el-table-column>
      <el-table-column prop="name" label="代理商名称" width="200"></el-table-column>
      <el-table-column prop="adminName" label="管理员姓名" width="120"></el-table-column>
      <el-table-column prop="adminPhone" label="管理员联系方式" width="150"></el-table-column>
      <el-table-column prop="identity" label="所属身份" width="120">
        <template #default="{ row }">
          <el-tag 
            type="info"
            size="small"
          >
            代理商
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="代理商类型" width="120">
        <template #default="{ row }">
          <el-tag 
            :type="row.type === 'personal' ? 'primary' : 'success'"
            size="small"
          >
            {{ row.type === 'personal' ? '个人' : '企业' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="identifierType" label="标识类型" width="150"></el-table-column>
      <el-table-column prop="identifierValue" label="标识值" width="200">
        <template #default="{ row }">
          {{ maskIdentifier(row.identifierValue) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="代理商状态" width="120">
        <template #default="{ row }">
          <el-tag 
            :type="getStatusType(row.status)"
            size="small"
          >
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="150"></el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button 
            size="small" 
            type="primary" 
            @click="handleViewDetails(row)"
          >
            查看详情
          </el-button>
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
      :total="filteredAgentList.length"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: 'BasicAgentList',
  data() {
    return {
      filters: {
        id: '',
        name: '',
        adminName: '',
        type: '',
        status: ''
      },
      agentList: [
        {
          id: 'AGT001',
          name: '北京代理商有限公司',
          adminName: '张经理',
          adminPhone: '13800138001',
          identity: '代理商',
          type: 'enterprise',
          identifierType: '统一社会信用代码',
          identifierValue: '91110000123456789X',
          status: 'active',
          createdAt: '2024-01-15'
        },
        {
          id: 'AGT002',
          name: '上海拓展服务商',
          adminName: '李经理',
          adminPhone: '13900139002',
          identity: '代理商',
          type: 'enterprise',
          identifierType: '统一社会信用代码',
          identifierValue: '91310000987654321A',
          status: 'active',
          createdAt: '2024-02-20'
        },
        {
          id: 'AGT003',
          name: '广州合作伙伴',
          adminName: '王经理',
          adminPhone: '13700137003',
          identity: '代理商',
          type: 'enterprise',
          identifierType: '统一社会信用代码',
          identifierValue: '91440000567891234B',
          status: 'inactive',
          createdAt: '2024-03-10'
        },
        {
          id: 'AGT004',
          name: '深圳渠道商',
          adminName: '赵经理',
          adminPhone: '13600136004',
          identity: '代理商',
          type: 'enterprise',
          identifierType: '统一社会信用代码',
          identifierValue: '914403007654321AB',
          status: 'pending',
          createdAt: '2024-04-05'
        },
        {
          id: 'AGT005',
          name: '杭州分销商',
          adminName: '孙经理',
          adminPhone: '13500135005',
          identity: '代理商',
          type: 'enterprise',
          identifierType: '统一社会信用代码',
          identifierValue: '91330000876543210C',
          status: 'active',
          createdAt: '2024-05-12'
        },
        {
          id: 'AGT006',
          name: '成都服务商',
          adminName: '周经理',
          adminPhone: '13400134006',
          identity: '代理商',
          type: 'enterprise',
          identifierType: '统一社会信用代码',
          identifierValue: '91510000765432109D',
          status: 'active',
          createdAt: '2024-06-18'
        },
        {
          id: 'AGT007',
          name: '西安合作伙伴',
          adminName: '吴经理',
          adminPhone: '13300133007',
          identity: '代理商',
          type: 'personal',
          identifierType: '身份证',
          identifierValue: '610101198407077890',
          status: 'inactive',
          createdAt: '2024-07-22'
        },
        {
          id: 'AGT008',
          name: '南京代理商',
          adminName: '郑经理',
          adminPhone: '13200132008',
          identity: '代理商',
          type: 'personal',
          identifierType: '身份证',
          identifierValue: '320101198508088901',
          status: 'active',
          createdAt: '2024-08-30'
        }
      ],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  computed: {
    filteredAgentList() {
      let result = this.agentList;

      // 模糊搜索
      if (this.filters.id) {
        result = result.filter(agent => 
          agent.id.toLowerCase().includes(this.filters.id.toLowerCase())
        );
      }

      if (this.filters.name) {
        result = result.filter(agent => 
          agent.name.toLowerCase().includes(this.filters.name.toLowerCase())
        );
      }

      if (this.filters.adminName) {
        result = result.filter(agent => 
          agent.adminName.toLowerCase().includes(this.filters.adminName.toLowerCase())
        );
      }

      // 精确筛选
      if (this.filters.type) {
        result = result.filter(agent => 
          !this.filters.type || agent.type === this.filters.type
        );
      }

      if (this.filters.status) {
        result = result.filter(agent => 
          !this.filters.status || agent.status === this.filters.status
        );
      }

      return result;
    }
  },
  mounted() {
    this.pagination.total = this.filteredAgentList.length;
  },
  methods: {
    handleViewDetails(row) {
      // 跳转到代理商详情总览页面，传递租户ID参数
      // 注意：这里我们使用当前代理商的ID作为示例，实际应用中可能需要传递相关的租户ID
      this.$router.push(`/main/monitor/overview?agentId=${row.id}`);
    },

    handleSearch() {
      console.log('搜索条件:', this.filters);
      this.pagination.currentPage = 1; // 搜索后回到第一页
    },
    handleReset() {
      this.filters = { 
        id: '', 
        name: '', 
        adminName: '', 
        type: '', 
        status: '' 
      };
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.pagination.currentPage = 1;
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
    },
    maskIdentifier(identifier) {
      if (!identifier) return '';
      if (identifier.length <= 6) return identifier;
      
      // 显示前3位和后3位，中间用*代替
      return identifier.substring(0, 3) + '****' + identifier.substring(identifier.length - 3);
    },
    getStatusType(status) {
      switch (status) {
        case 'active':
          return 'success';
        case 'inactive':
          return 'danger';
        case 'pending':
          return 'warning';
        default:
          return 'info';
      }
    },
    getStatusText(status) {
      switch (status) {
        case 'active':
          return '活跃';
        case 'inactive':
          return '非活跃';
        case 'pending':
          return '待审核';
        default:
          return '未知';
      }
    }
  }
};
</script>

<style scoped>
.agent-basic-list {
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