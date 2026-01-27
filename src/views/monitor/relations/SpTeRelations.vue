<template>
  <div class="sp-te-relations">
    <div class="page-header">
      <h3>SP/TE代理关系说明</h3>
    </div>
    
    <el-card class="filter-card">
      <el-form :inline="true" :model="filters" class="filter-form">
        <el-form-item label="SP名称">
          <el-input 
            v-model="filters.spName" 
            placeholder="请输入SP名称" 
            style="width: 150px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="租户名称">
          <el-input 
            v-model="filters.tenantName" 
            placeholder="请输入租户名称" 
            style="width: 150px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="代理产品名称">
          <el-input 
            v-model="filters.productName" 
            placeholder="请输入代理产品名称" 
            style="width: 150px;"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-table 
      :data="spTeRelationList" 
      style="width: 100%" 
      stripe
    >
      <el-table-column prop="spName" label="SP名称" width="150"></el-table-column>
      <el-table-column prop="spIdentifier" label="SP标识" width="150"></el-table-column>
      <el-table-column prop="tenantName" label="租户名称" width="150"></el-table-column>
      <el-table-column prop="tenantIdentifier" label="租户标识" width="150"></el-table-column>
      <el-table-column prop="isSameName" label="SP/TE是否同名" width="120">
        <template #default="{ row }">
          <el-tag 
            :type="row.isSameName ? 'success' : 'info'"
            size="small"
          >
            {{ row.isSameName ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="products" label="代理产品" min-width="250">
        <template #default="{ row }">
          <div v-for="product in row.products" :key="product.id" class="product-item">
            <el-tag size="small" style="margin-right: 5px; margin-bottom: 5px;">{{ product.name }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag 
            :type="row.status === 'active' ? 'success' : 'warning'"
            size="small"
          >
            {{ row.status === 'active' ? '激活' : '未激活' }}
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
      :total="spTeRelationList.length"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: 'SpTeRelations',
  data() {
    return {
      filters: {
        spName: '',
        tenantName: '',
        productName: ''
      },
      spTeRelationList: [
        {
          spName: 'SP代理商A',
          spIdentifier: 'SP001',
          tenantName: '租户A',
          tenantIdentifier: 'TNT001',
          isSameName: true,
          products: [
            { id: 'PROD001', name: '国际交易分佣产品' },
            { id: 'PROD002', name: '汇率返点产品' }
          ],
          status: 'active',
          createdAt: '2024-01-15'
        },
        {
          spName: 'TE代理商B',
          spIdentifier: 'TE002',
          tenantName: '租户B',
          tenantIdentifier: 'TNT002',
          isSameName: false,
          products: [
            { id: 'PROD003', name: '汇率返点产品' }
          ],
          status: 'active',
          createdAt: '2024-02-20'
        },
        {
          spName: 'SP代理商C',
          spIdentifier: 'SP003',
          tenantName: '租户C',
          tenantIdentifier: 'TNT003',
          isSameName: true,
          products: [
            { id: 'PROD004', name: '跨境支付分佣' },
            { id: 'PROD005', name: '海外支付产品' },
            { id: 'PROD006', name: '跨境电商支付产品' }
          ],
          status: 'inactive',
          createdAt: '2024-03-10'
        },
        {
          spName: 'SP代理商D',
          spIdentifier: 'SP004',
          tenantName: '租户D',
          tenantIdentifier: 'TNT004',
          isSameName: false,
          products: [
            { id: 'PROD007', name: '海外支付产品' }
          ],
          status: 'active',
          createdAt: '2024-04-05'
        },
        {
          spName: 'TE代理商E',
          spIdentifier: 'TE005',
          tenantName: '租户E',
          tenantIdentifier: 'TNT005',
          isSameName: true,
          products: [
            { id: 'PROD008', name: '跨境电商支付产品' },
            { id: 'PROD009', name: '技术服务产品' }
          ],
          status: 'active',
          createdAt: '2024-05-12'
        },
        {
          spName: 'SP代理商F',
          spIdentifier: 'SP006',
          tenantName: '租户F',
          tenantIdentifier: 'TNT006',
          isSameName: false,
          products: [
            { id: 'PROD010', name: '技术服务产品' }
          ],
          status: 'inactive',
          createdAt: '2024-06-18'
        },
        {
          spName: 'TE代理商G',
          spIdentifier: 'TE007',
          tenantName: '租户G',
          tenantIdentifier: 'TNT007',
          isSameName: true,
          products: [
            { id: 'PROD011', name: '咨询服务产品' },
            { id: 'PROD012', name: '国际汇款产品' }
          ],
          status: 'active',
          createdAt: '2024-07-22'
        },
        {
          spName: 'SP代理商H',
          spIdentifier: 'SP008',
          tenantName: '租户H',
          tenantIdentifier: 'TNT008',
          isSameName: false,
          products: [
            { id: 'PROD013', name: '国际汇款产品' },
            { id: 'PROD014', name: '汇率返点产品' },
            { id: 'PROD015', name: '跨境电商支付产品' }
          ],
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
  mounted() {
    this.pagination.total = this.spTeRelationList.length;
  },
  methods: {
    handleViewDetails(row) {
      // 跳转到SP/TE关系详情页面
      this.$router.push(`/main/monitor/sp-te-relations/detail`);
    },
    handleSearch() {
      console.log('搜索条件:', this.filters);
      this.pagination.currentPage = 1; // 搜索后回到第一页
    },
    handleReset() {
      this.filters = { 
        spName: '', 
        tenantName: '', 
        productName: '' 
      };
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.pagination.currentPage = 1;
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
    }
  }
};
</script>

<style scoped>
.sp-te-relations {
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

.product-item {
  display: inline-block;
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>