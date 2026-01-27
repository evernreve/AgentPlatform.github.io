<template>
  <div class="agent-create">
    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <span>新增代理商</span>
        </div>
      </template>
      
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" style="max-width: 800px;">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="代理商全称" prop="name">
              <el-input v-model="form.name" placeholder="请输入代理商全称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="代理商简称" prop="shortName">
              <el-input v-model="form.shortName" placeholder="请输入代理商简称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="实体ID" prop="entityId">
              <el-input v-model="form.entityId" placeholder="请输入实体ID"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实体名称" prop="entityName">
              <el-input v-model="form.entityName" placeholder="请输入实体名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="代理商类型" prop="agentType">
              <el-select v-model="form.agentType" placeholder="请选择代理商类型" style="width: 100%;">
                <el-option label="一级代理商" value="level1"></el-option>
                <el-option label="二级代理商" value="level2"></el-option>
                <el-option label="三级代理商" value="level3"></el-option>
                <el-option label="普通代理商" value="normal"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="签约主体类型" prop="contractSubjectType">
              <el-radio-group v-model="form.contractSubjectType">
                <el-radio label="individual">个人</el-radio>
                <el-radio label="enterprise">企业</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="KYC信息">
          <el-tabs type="border-card">
            <el-tab-pane label="个人KYC">
              <el-form-item label="身份证号" prop="kycIdNumber">
                <el-input v-model="form.kycIdNumber" placeholder="请输入身份证号"></el-input>
              </el-form-item>
              <el-form-item label="姓名" prop="kycName">
                <el-input v-model="form.kycName" placeholder="请输入姓名"></el-input>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="企业KYC">
              <el-form-item label="营业执照号" prop="kycLicenseNumber">
                <el-input v-model="form.kycLicenseNumber" placeholder="请输入营业执照号"></el-input>
              </el-form-item>
              <el-form-item label="公司名称" prop="kycCompanyName">
                <el-input v-model="form.kycCompanyName" placeholder="请输入公司名称"></el-input>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </el-form-item>
        
        <el-form-item label="收款账户信息">
          <el-table :data="form.accounts" style="width: 100%">
            <el-table-column prop="bankName" label="开户银行" width="180"></el-table-column>
            <el-table-column prop="accountNumber" label="账号" width="200"></el-table-column>
            <el-table-column prop="accountName" label="账户名"></el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="{ $index }">
                <el-button size="small" type="danger" @click="removeAccount($index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button @click="addAccount" style="margin-top: 10px;">添加收款账户</el-button>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
          <el-button @click="$router.go(-1)">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AgentCreate',
  data() {
    return {
      form: {
        name: '',
        shortName: '',
        entityId: '',
        entityName: '',
        agentType: '',
        contractSubjectType: 'enterprise',
        kycIdNumber: '',
        kycName: '',
        kycLicenseNumber: '',
        kycCompanyName: '',
        accounts: []
      },
      rules: {
        name: [
          { required: true, message: '请输入代理商全称', trigger: 'blur' }
        ],
        shortName: [
          { required: true, message: '请输入代理商简称', trigger: 'blur' }
        ],
        agentType: [
          { required: true, message: '请选择代理商类型', trigger: 'change' }
        ]
      }
    };
  },
  methods: {
    submitForm() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          console.log('提交表单:', this.form);
          this.$message.success('代理商创建成功！');
          this.$router.push('/agents/list');
        } else {
          console.log('验证失败！');
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.formRef.resetFields();
      this.form.accounts = [];
    },
    addAccount() {
      this.form.accounts.push({
        bankName: '',
        accountNumber: '',
        accountName: ''
      });
    },
    removeAccount(index) {
      this.form.accounts.splice(index, 1);
    }
  }
};
</script>

<style scoped>
.agent-create {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
}

.form-card {
  max-width: 1000px;
}

.card-header {
  font-weight: bold;
}
</style>