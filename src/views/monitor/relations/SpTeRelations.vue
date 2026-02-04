<template>
  <div class="sp-te-relations">
    <div class="page-header">
      <h3>代理关系说明</h3>
    </div>
    
    <el-card class="filter-card">
      <el-form :inline="true" :model="filters" class="filter-form">
        <el-form-item label="被代理方">
          <el-input 
            v-model="filters.spName" 
            placeholder="请输入被代理方" 
            style="width: 150px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="代理方名称">
          <el-input 
            v-model="filters.tenantName" 
            placeholder="请输入代理方名称" 
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
      <el-table-column prop="spName" label="被代理方" width="150"></el-table-column>
      <el-table-column prop="spIdentifier" label="被代理方标识" width="150"></el-table-column>
      <el-table-column prop="spIdentity" label="被代理方身份" width="150">
        <template #default="{ row }">
          <el-tag 
            :type="getIdentityTagType(row.spIdentity)"
            size="small"
          >
            {{ row.spIdentity }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="tenantName" label="代理方名称" width="150"></el-table-column>
      <el-table-column prop="tenantIdentifier" label="代理方标识" width="150"></el-table-column>
      <el-table-column prop="tenantIdentity" label="代理方身份" width="150">
        <template #default="{ row }">
          <el-tag 
            :type="getIdentityTagType(row.tenantIdentity)"
            size="small"
          >
            {{ row.tenantIdentity }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isSameName" label="是否同名" width="120">
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
          spName: 'IPL',
          spIdentifier: 'SP001',
          spIdentity: 'PP',
          tenantName: 'IPL',
          tenantIdentifier: 'TNT001',
          tenantIdentity: 'TP',
          isSameName: true,
          products: [
            { id: 'PROD001', name: '国际交易分佣产品' },
            { id: 'PROD002', name: '汇率返点产品' }
          ],
          status: 'active',
          createdAt: '2024-01-15'
        },
        {
          spName: 'IPL',
          spIdentifier: 'TE002',
          spIdentity: 'PP',
          tenantName: 'EX',
          tenantIdentifier: 'TNT002',
          tenantIdentity: 'SA',
          isSameName: false,
          products: [
            { id: 'PROD003', name: '汇率返点产品' }
          ],
          status: 'active',
          createdAt: '2024-02-20'
        },
        {
          spName: 'BB',
          spIdentifier: 'SP003',
          spIdentity: 'SA',
          tenantName: 'BB',
          tenantIdentifier: 'TNT003',
          tenantIdentity: 'TP',
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
          spName: 'EX',
          spIdentifier: 'SP004',
          spIdentity: 'AP',
          tenantName: 'KUN',
          tenantIdentifier: 'TNT004',
          tenantIdentity: 'TP',
          isSameName: false,
          products: [
            { id: 'PROD007', name: '海外支付产品' }
          ],
          status: 'active',
          createdAt: '2024-04-05'
        },
        {
          spName: 'PP2',
          spIdentifier: 'TE005',
          spIdentity: 'PP',
          tenantName: 'PP2',
          tenantIdentifier: 'TNT005',
          tenantIdentity: 'SA',
          isSameName: true,
          products: [
            { id: 'PROD008', name: '跨境电商支付产品' },
            { id: 'PROD009', name: '技术服务产品' }
          ],
          status: 'active',
          createdAt: '2024-05-12'
        },
        {
          spName: 'EX',
          spIdentifier: 'SP006',
          spIdentity: 'PP',
          tenantName: 'IPL',
          tenantIdentifier: 'TNT006',
          tenantIdentity: 'TP',
          isSameName: false,
          products: [
            { id: 'PROD010', name: '技术服务产品' }
          ],
          status: 'inactive',
          createdAt: '2024-06-18'
        },
        {
          spName: 'IPL',
          spIdentifier: 'TE007',
          spIdentity: 'SA',
          tenantName: 'IPL',
          tenantIdentifier: 'TNT007',
          tenantIdentity: 'TP',
          isSameName: true,
          products: [
            { id: 'PROD011', name: '咨询服务产品' },
            { id: 'PROD012', name: '国际汇款产品' }
          ],
          status: 'active',
          createdAt: '2024-07-22'
        },
        {
          spName: 'BB',
          spIdentifier: 'SP008',
          spIdentity: 'AP',
          tenantName: 'EX',
          tenantIdentifier: 'TNT008',
          tenantIdentity: 'SA',
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
    },
    getIdentityTagType(identity) {
      const typeMap = {
        'PP': 'primary',
        'TP': 'success',
        'AP': 'warning',
        'SA': 'info'
      };
      return typeMap[identity] || 'info';
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