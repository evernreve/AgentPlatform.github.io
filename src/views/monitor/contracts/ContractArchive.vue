<template>
  <div class="contract-archive">
    <div class="page-header">
      <h3>合同签约档案</h3>
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
        <el-form-item label="代理商">
          <el-input v-model="filters.agentName" placeholder="请输入代理商名称" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="合同编号">
          <el-input v-model="filters.contractId" placeholder="请输入合同编号" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="合同类型">
          <el-select v-model="filters.contractType" placeholder="请选择合同类型" style="width: 120px;">
            <el-option label="全部" value=""></el-option>
            <el-option label="新签" value="新签"></el-option>
            <el-option label="续签" value="续签"></el-option>
            <el-option label="延期更换主体" value="延期更换主体"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="签约日期">
          <el-date-picker
            v-model="filters.signDate"
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
          <el-button type="primary" @click="handleAddContract">新增合同</el-button>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-table 
      :data="contractData" 
      style="width: 100%" 
      stripe 
      height="600"
      highlight-current-row
    >
      <el-table-column prop="tenantId" label="租户ID" width="120"></el-table-column>
      <el-table-column prop="tenantName" label="租户名称" width="120"></el-table-column>
      <el-table-column prop="contractId" label="合同编号" width="150"></el-table-column>
      <el-table-column prop="agentId" label="代理商ID" width="120"></el-table-column>
      <el-table-column prop="agentName" label="代理商名称" width="180"></el-table-column>
      <el-table-column prop="contractRelation" label="合同签约关系" width="150">
        <template #default="{ row }">
          <el-tag :type="getRelationTagType(row.contractRelation)">
            {{ getRelationLabel(row.contractRelation) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="contractType" label="合同类型" width="120">
        <template #default="{ row }">
          <el-tag :type="getTypeTagType(row.contractType)">
            {{ row.contractType }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="contractAttribute" label="合同属性" width="120">
        <template #default="{ row }">
          <el-tag :type="getAttributeTagType(row.contractAttribute)">
            {{ row.contractAttribute }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="signingSubject" label="签约主体" width="150"></el-table-column>
      <el-table-column prop="signDate" label="签约起始日期" width="150"></el-table-column>
      <el-table-column prop="expireDate" label="签约结束日期" width="150"></el-table-column>
      <el-table-column prop="effectiveDate" label="合同生效时间" width="150"></el-table-column>
      <el-table-column label="操作" width="220" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click.stop="handleEditContract(row)">编辑</el-button>
          <el-button size="small" @click.stop="handleViewContract(row)">查看合同</el-button>
          <el-button size="small" @click.stop="handleDownloadContract(row)">下载</el-button>
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

    <!-- 详情侧滑面板 -->
    <el-drawer
      v-model="detailDrawerVisible"
      size="50%"
      :title="`合同详情 - ${selectedContract.contractId}`"
      direction="rtl"
      :before-close="handleCloseDetail"
    >
      <div class="drawer-content">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="合同编号">{{ selectedContract.contractId }}</el-descriptions-item>
          <el-descriptions-item label="租户ID">{{ selectedContract.tenantId }}</el-descriptions-item>
          <el-descriptions-item label="租户名称">{{ selectedContract.tenantName }}</el-descriptions-item>
          <el-descriptions-item label="代理商ID">{{ selectedContract.agentId }}</el-descriptions-item>
          <el-descriptions-item label="代理商名称">{{ selectedContract.agentName }}</el-descriptions-item>
          <el-descriptions-item label="合同类型">
            <el-tag :type="getTypeTagType(selectedContract.contractType)">
              {{ selectedContract.contractType }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="合同属性">
            <el-tag :type="getAttributeTagType(selectedContract.contractAttribute)">
              {{ selectedContract.contractAttribute }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="合同签约关系">
            <el-tag :type="getRelationTagType(selectedContract.contractRelation)">
              {{ getRelationLabel(selectedContract.contractRelation) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="签约主体">{{ selectedContract.signingSubject }}</el-descriptions-item>
          <el-descriptions-item label="签约起始日期">{{ selectedContract.signDate }}</el-descriptions-item>
          <el-descriptions-item label="签约结束日期">{{ selectedContract.expireDate }}</el-descriptions-item>
          <el-descriptions-item label="合同生效时间">{{ selectedContract.effectiveDate }}</el-descriptions-item>
          <el-descriptions-item label="合同状态">
            <el-tag :type="selectedContract.status === 'active' ? 'success' : 'warning'">
              {{ selectedContract.status === 'active' ? '生效中' : '已过期' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="签约人">{{ selectedContract.signPerson }}</el-descriptions-item>
          <el-descriptions-item label="签约金额">{{ selectedContract.contractValue }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-drawer>

    <!-- 合同新增/编辑弹窗 -->
    <el-dialog
      :title="contractFormTitle"
      v-model="contractDialogVisible"
      width="60%"
      :before-close="handleCloseContractForm"
    >
      <el-form :model="contractForm" :rules="contractFormRules" ref="contractFormRef" label-width="140px">
        <el-form-item label="合同编号" prop="contractId">
          <el-input v-model="contractForm.contractId" :disabled="isEdit" placeholder="请输入合同编号"></el-input>
        </el-form-item>
        <el-form-item label="合同类型" prop="contractType">
          <el-select v-model="contractForm.contractType" placeholder="请选择合同类型" style="width: 100%;">
            <el-option label="新签" value="新签"></el-option>
            <el-option label="续签" value="续签"></el-option>
            <el-option label="延期更换主体" value="延期更换主体"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合同属性" prop="contractAttribute">
          <el-select v-model="contractForm.contractAttribute" placeholder="请选择合同属性" style="width: 100%;">
            <el-option label="新协议" value="新协议"></el-option>
            <el-option label="补充协议" value="补充协议"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合同签约关系" prop="contractRelation">
          <el-select v-model="contractForm.contractRelation" placeholder="请选择合同签约关系" @change="handleContractRelationChange" style="width: 100%;">
            <el-option label="租户" value="tenant"></el-option>
            <el-option label="租户代理商" value="tenant_agent"></el-option>
            <el-option label="代理商商户" value="agent_merchant"></el-option>
            <el-option label="租户商户" value="tenant_merchant"></el-option>
          </el-select>
        </el-form-item>
        <!-- 根据合同签约关系动态显示字段 -->
        <el-form-item label="租户ID" prop="tenantId" v-if="showTenantFields">
          <el-input v-model="contractForm.tenantId" placeholder="请输入租户ID"></el-input>
        </el-form-item>
        <el-form-item label="租户名称" prop="tenantName" v-if="showTenantFields">
          <el-input v-model="contractForm.tenantName" placeholder="请输入租户名称"></el-input>
        </el-form-item>
        <el-form-item label="代理商ID" prop="agentId" v-if="showAgentFields">
          <el-input v-model="contractForm.agentId" placeholder="请输入代理商ID"></el-input>
        </el-form-item>
        <el-form-item label="代理商名称" prop="agentName" v-if="showAgentFields">
          <el-input v-model="contractForm.agentName" placeholder="请输入代理商名称"></el-input>
        </el-form-item>
        <el-form-item label="商户ID" prop="merchantId" v-if="showMerchantFields">
          <el-input v-model="contractForm.merchantId" placeholder="请输入商户ID"></el-input>
        </el-form-item>
        <el-form-item label="商户名称" prop="merchantName" v-if="showMerchantFields">
          <el-input v-model="contractForm.merchantName" placeholder="请输入商户名称"></el-input>
        </el-form-item>
        <el-form-item label="签约主体" prop="signingSubject">
          <el-input v-model="contractForm.signingSubject" placeholder="请输入签约主体"></el-input>
        </el-form-item>
        <el-form-item label="签约金额" prop="contractValue">
          <el-input v-model="contractForm.contractValue" placeholder="请输入签约金额"></el-input>
        </el-form-item>
        <el-form-item label="签约起始日期" prop="signDate">
          <el-date-picker
            v-model="contractForm.signDate"
            type="date"
            placeholder="选择签约日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%;">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="合同生效时间" prop="effectiveDate">
          <el-date-picker
            v-model="contractForm.effectiveDate"
            type="date"
            placeholder="选择生效日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%;">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="签约结束日期" prop="expireDate">
          <el-date-picker
            v-model="contractForm.expireDate"
            type="date"
            placeholder="选择结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%;">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="签约人" prop="signPerson">
          <el-input v-model="contractForm.signPerson" placeholder="请输入签约人"></el-input>
        </el-form-item>
        <el-form-item label="合同状态" prop="status">
          <el-select v-model="contractForm.status" placeholder="请选择合同状态" style="width: 100%;">
            <el-option label="生效中" value="active"></el-option>
            <el-option label="已过期" value="expired"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCloseContractForm">取消</el-button>
          <el-button type="primary" @click="handleSubmitContract">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ContractArchive',
  data() {
    return {
      filters: {
        tenantId: '',
        agentName: '',
        contractId: '',
        contractType: '',
        signDate: ['', '']
      },
      contractData: [
        { 
          tenantId: 'TNT001', 
          tenantName: '租户A', 
          contractId: 'CT00120240115', 
          agentId: 'AGT001', 
          agentName: '北京代理商有限公司', 
          contractType: '新签', 
          contractRelation: 'tenant_agent',
          contractAttribute: '新协议',
          signingSubject: '北京商企科技有限公司', 
          signDate: '2024-01-15', 
          expireDate: '2025-01-14', 
          effectiveDate: '2024-01-15', 
          status: 'active', 
          signPerson: '张经理', 
          contractValue: '¥1,200,000' 
        },
        { 
          tenantId: 'TNT001', 
          tenantName: '租户A', 
          contractId: 'CT00220240220', 
          agentId: 'AGT001', 
          agentName: '北京代理商有限公司', 
          contractType: '续签', 
          contractRelation: 'agent_merchant',
          contractAttribute: '补充协议',
          signingSubject: '北京商企科技有限公司', 
          signDate: '2024-02-20', 
          expireDate: '2025-02-19', 
          effectiveDate: '2024-02-20', 
          status: 'active', 
          signPerson: '李经理', 
          contractValue: '¥800,000' 
        },
        { 
          tenantId: 'TNT002', 
          tenantName: '租户B', 
          contractId: 'CT00320240310', 
          agentId: 'AGT002', 
          agentName: '上海拓展服务商', 
          contractType: '延期更换主体', 
          contractRelation: 'tenant',
          contractAttribute: '新协议',
          signingSubject: '上海商务服务有限公司', 
          signDate: '2024-03-10', 
          expireDate: '2025-03-09', 
          effectiveDate: '2024-03-10', 
          status: 'active', 
          signPerson: '王经理', 
          contractValue: '¥1,500,000' 
        },
        { 
          tenantId: 'TNT003', 
          tenantName: '租户C', 
          contractId: 'CT00420240412', 
          agentId: 'AGT003', 
          agentName: '广州合作伙伴', 
          contractType: '其他', 
          contractRelation: 'tenant_merchant',
          contractAttribute: '补充协议',
          signingSubject: '广州商务咨询有限公司', 
          signDate: '2024-04-12', 
          expireDate: '2025-04-11', 
          effectiveDate: '2024-04-12', 
          status: 'active', 
          signPerson: '赵经理', 
          contractValue: '¥950,000' 
        }
      ],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 4
      },
      detailDrawerVisible: false,
      selectedContract: {},
      contractDialogVisible: false,
      contractFormTitle: '',
      isEdit: false,
      contractForm: {
        contractId: '',
        contractType: '',
        contractAttribute: '',
        contractRelation: '',
        tenantId: '',
        tenantName: '',
        agentId: '',
        agentName: '',
        merchantId: '',
        merchantName: '',
        signingSubject: '',
        signDate: '',
        effectiveDate: '',
        expireDate: '',
        status: '',
        signPerson: '',
        contractValue: ''
      },
      showTenantFields: true,
      showAgentFields: false,
      showMerchantFields: false,
      contractFormRules: {
        contractId: [
          { required: true, message: '请输入合同编号', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        contractType: [
          { required: true, message: '请选择合同类型', trigger: 'change' }
        ],
        contractAttribute: [
          { required: true, message: '请选择合同属性', trigger: 'change' }
        ],
        contractRelation: [
          { required: true, message: '请选择合同签约关系', trigger: 'change' }
        ],
        tenantId: [
          { required: true, message: '请输入租户ID', trigger: 'blur' }
        ],
        tenantName: [
          { required: true, message: '请输入租户名称', trigger: 'blur' }
        ],
        agentId: [
          { required: true, message: '请输入代理商ID', trigger: 'blur' }
        ],
        agentName: [
          { required: true, message: '请输入代理商名称', trigger: 'blur' }
        ],
        signingSubject: [
          { required: true, message: '请输入签约主体', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    handleSearch() {
      console.log('搜索条件:', this.filters);
    },
    handleReset() {
      this.filters = { tenantId: '', agentName: '', contractId: '', contractType: '', signDate: ['', ''] };
    },
    handleExport() {
      this.$message.success('正在导出合同数据...');
    },
    handleAddContract() {
      this.isEdit = false;
      this.contractFormTitle = '新增合同';
      this.resetContractForm();
      this.contractDialogVisible = true;
    },
    handleEditContract(row) {
      this.isEdit = true;
      this.contractFormTitle = '编辑合同';
      this.fillContractForm(row);
      this.contractDialogVisible = true;
    },
    handleViewContract(row) {
      this.selectedContract = row;
      this.detailDrawerVisible = true;
    },
    handleDownloadContract(row) {
      this.$message.info(`正在下载合同: ${row.contractId}`);
    },
    handleCloseDetail() {
      this.detailDrawerVisible = false;
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
    },
    handleContractRelationChange(value) {
      // 根据合同签约关系动态显示字段
      this.showTenantFields = false;
      this.showAgentFields = false;
      this.showMerchantFields = false;
      
      switch(value) {
        case 'tenant':
          this.showTenantFields = true;
          break;
        case 'tenant_agent':
          this.showTenantFields = true;
          this.showAgentFields = true;
          break;
        case 'agent_merchant':
          this.showAgentFields = true;
          this.showMerchantFields = true;
          break;
        case 'tenant_merchant':
          this.showTenantFields = true;
          this.showMerchantFields = true;
          break;
        default:
          this.showTenantFields = true;
      }
    },
    resetContractForm() {
      this.contractForm = {
        contractId: '',
        contractType: '',
        contractAttribute: '',
        contractRelation: '',
        tenantId: '',
        tenantName: '',
        agentId: '',
        agentName: '',
        merchantId: '',
        merchantName: '',
        signingSubject: '',
        signDate: '',
        effectiveDate: '',
        expireDate: '',
        status: '',
        signPerson: '',
        contractValue: ''
      };
      // 重置显示状态
      this.showTenantFields = true;
      this.showAgentFields = false;
      this.showMerchantFields = false;
    },
    fillContractForm(data) {
      this.contractForm = { ...data };
    },
    handleCloseContractForm() {
      this.contractDialogVisible = false;
      this.resetContractForm();
    },
    handleSubmitContract() {
      this.$refs.contractFormRef.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            // 更新现有合同
            const index = this.contractData.findIndex(item => item.contractId === this.contractForm.contractId);
            if (index !== -1) {
              this.contractData[index] = { ...this.contractForm };
              this.$message.success('合同更新成功');
            }
          } else {
            // 添加新合同
            const exists = this.contractData.some(item => item.contractId === this.contractForm.contractId);
            if (exists) {
              this.$message.error('合同编号已存在');
              return;
            }
            this.contractData.push({ ...this.contractForm });
            this.$message.success('合同新增成功');
          }
          this.handleCloseContractForm();
        } else {
          this.$message.error('请完善表单信息');
          return false;
        }
      });
    },
    getRelationTagType(relation) {
      const tagTypes = {
        'tenant': 'primary',
        'tenant_agent': 'success',
        'agent_merchant': 'warning',
        'tenant_merchant': 'danger'
      };
      return tagTypes[relation] || 'info';
    },
    getRelationLabel(relation) {
      const labels = {
        'tenant': '租户',
        'tenant_agent': '租户代理商',
        'agent_merchant': '代理商商户',
        'tenant_merchant': '租户商户'
      };
      return labels[relation] || relation;
    },
    getTypeTagType(type) {
      const tagTypes = {
        '新签': 'primary',
        '续签': 'success',
        '延期更换主体': 'warning',
        '其他': 'info'
      };
      return tagTypes[type] || 'info';
    },
    getAttributeTagType(attribute) {
      const tagTypes = {
        '新协议': 'primary',
        '补充协议': 'warning'
      };
      return tagTypes[attribute] || 'info';
    }
  }
};
</script>

<style scoped>
.contract-archive {
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

.drawer-content {
  padding: 20px;
}
</style>