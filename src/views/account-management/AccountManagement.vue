<template>
  <div class="account-management">
    <div class="page-header">
      <h3>账户管理</h3>
    </div>

    <div class="account-container">
      <!-- 左侧账户类型选择区 -->
      <div class="account-types-panel">
        <h4>账户类型</h4>
        <ul class="account-type-list">
          <li 
            v-for="accountType in accountTypes" 
            :key="accountType.id"
            :class="{ 'active': selectedAccountType.id === accountType.id }"
            @click="selectAccountType(accountType)"
          >
            <div class="account-type-icon">
              <i :class="accountType.icon"></i>
            </div>
            <div class="account-type-info">
              <div class="account-type-name">{{ accountType.name }}</div>
              <div class="account-type-desc">{{ accountType.description }}</div>
            </div>
          </li>
        </ul>
      </div>

      <!-- 右侧账户详情展示与配置区 -->
      <div class="account-details-panel" v-if="selectedAccountType">
        <div class="account-header">
          <h4>{{ selectedAccountType.title }}</h4>
          <div class="account-attributes">
            <el-tag type="success">{{ selectedAccountType.attribute }}</el-tag>
          </div>
        </div>

        <!-- 账户详情部分 -->
        <div class="account-details">
          <div class="account-title">
            <h5>{{ selectedAccountType.fullTitle }}</h5>
          </div>

          <div class="account-limitations">
            <h6>账户限制：</h6>
            <ul>
              <li v-for="limitation in selectedAccountType.limitations" :key="limitation">{{ limitation }}</li>
            </ul>
          </div>

          <div class="support-info">
            <h6>支持信息：</h6>
            <div class="support-item">
              <label>支持收款币种：</label>
              <div class="currencies">
                <el-tag 
                  v-for="currency in selectedAccountType.supportedCurrencies" 
                  :key="currency"
                  type="info"
                  size="small"
                  style="margin-right: 5px;"
                >
                  {{ currency }}
                </el-tag>
              </div>
            </div>
            
            <div class="support-item">
              <label>买家付款地区：</label>
              <span>{{ selectedAccountType.paymentRegion }}</span>
            </div>
            
            <div class="support-item">
              <label>支持收款方式：</label>
              <span>{{ selectedAccountType.collectionMethods }}</span>
            </div>
            
            <div class="support-item">
              <label>账户开通时效：</label>
              <span>{{ selectedAccountType.openingTime }}</span>
            </div>
          </div>
        </div>

        <!-- 配置表单部分 -->
        <div class="account-config-form">
          <h5>账户配置</h5>
          <el-form 
            :model="accountForm" 
            :rules="formRules" 
            ref="accountFormRef" 
            label-width="120px"
            style="margin-top: 20px;"
          >
            <el-form-item label="账户归属" prop="ownership">
              <el-radio-group v-model="accountForm.ownership" disabled>
                <el-radio label="agent_account">代理商账户</el-radio>
              </el-radio-group>
              <div class="help-text">默认为代理商账户，不可修改</div>
            </el-form-item>

            <el-form-item label="账户名称" prop="accountName">
              <el-input 
                v-model="accountForm.accountName" 
                placeholder="请输入账户名称"
                readonly
              />
              <div class="help-text">
                账户名称默认按照银行要求生成，不允许修改
              </div>
            </el-form-item>

            <el-form-item label="结算周期" prop="settlementCycle">
              <el-select v-model="accountForm.settlementCycle" placeholder="请选择结算周期">
                <el-option label="T+1" value="T+1"></el-option>
                <el-option label="T+3" value="T+3"></el-option>
                <el-option label="周结" value="weekly"></el-option>
                <el-option label="月结" value="monthly"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="结算分成比例" prop="settlementRatio">
              <el-slider
                v-model="accountForm.settlementRatio"
                :min="0"
                :max="100"
                :step="1"
                show-input
                show-input-controls
                :format-tooltip="formatRatioTooltip"
              />
              <div class="help-text">
                当账户用于商户时，可预设代理商的佣金分成比例
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- 操作按钮区 -->
      <div class="operation-buttons" v-if="selectedAccountType">
        <el-button @click="handleBack">返回</el-button>
        <el-button type="primary" @click="handleCreateAccount">确认创建</el-button>
      </div>

      <!-- 状态提示与帮助 -->
      <div class="help-footer" v-if="selectedAccountType">
        <div class="help-text">
          如有任何问题，请联系您的客户经理
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AccountManagement',
  data() {
    return {
      // 账户类型列表
      accountTypes: [
        {
          id: 'usd_account',
          name: '美金账户',
          description: '美国本地收款账户',
          title: '美国·本地收款账户',
          fullTitle: '美国·本地收款账户 | 福兴银行',
          attribute: '多币种',
          limitations: [
            '不支持支票',
            '不支持ATM',
            '不支持现金存入'
          ],
          supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
          paymentRegion: '本地非制裁地区',
          collectionMethods: '美国WIRE/ACH',
          openingTime: 'T+2',
          icon: 'el-icon-wallet'
        },
        {
          id: 'eur_account',
          name: '欧元账户',
          description: '欧洲本地收款账户',
          title: '欧元·本地收款账户',
          fullTitle: '欧元·本地收款账户 | 德意志银行',
          attribute: '单币种',
          limitations: [
            '不支持支票',
            '不支持现金存入'
          ],
          supportedCurrencies: ['EUR'],
          paymentRegion: '欧盟地区',
          collectionMethods: 'SEPA/RT1',
          openingTime: 'T+1',
          icon: 'el-icon-money'
        },
        {
          id: 'hkd_account',
          name: '港元账户',
          description: '香港本地收款账户',
          title: '港元·本地收款账户',
          fullTitle: '港元·本地收款账户 | 汇丰银行',
          attribute: '多币种',
          limitations: [
            '不支持支票',
            '不支持现金存入'
          ],
          supportedCurrencies: ['HKD', 'USD', 'CNY', 'EUR', 'GBP'],
          paymentRegion: '亚太地区',
          collectionMethods: 'FPS/CHATS',
          openingTime: 'T+1',
          icon: 'el-icon-coin'
        },
        {
          id: 'offshore_cny',
          name: '离岸人民币账户',
          description: '离岸人民币收款账户',
          title: '离岸人民币·收款账户',
          fullTitle: '离岸人民币·收款账户 | 中银香港',
          attribute: '单币种',
          limitations: [
            '受外汇管制限制',
            '不支持现金存入'
          ],
          supportedCurrencies: ['CNY'],
          paymentRegion: '中国大陆及港澳台地区',
          collectionMethods: 'CNAPS',
          openingTime: 'T+3',
          icon: 'el-icon-bank-card'
        }
      ],
      selectedAccountType: null,
      accountForm: {
        ownership: 'agent_account',
        accountName: '',
        settlementCycle: 'T+1',
        settlementRatio: 0
      },
      formRules: {
        accountName: [
          { min: 3, max: 50, message: '账户名称长度应在3到50个字符之间', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    // 默认选中第一个账户类型
    if (this.accountTypes.length > 0) {
      this.selectedAccountType = this.accountTypes[0];
      // 初始化时生成默认账户名称
      this.generateDefaultAccountName();
    }
  },
  methods: {
    selectAccountType(accountType) {
      this.selectedAccountType = accountType;
      // 根据账户类型生成默认账户名称
      this.generateDefaultAccountName();
    },
    
    generateDefaultAccountName() {
      if (this.selectedAccountType) {
        // 根据银行要求生成默认账户名称
        const bankNames = {
          'usd_account': 'FORTUNE_BANK_USD',
          'eur_account': 'DEUTSCHE_BANK_EUR',
          'hkd_account': 'HSBC_HKD',
          'offshore_cny': 'BANK_OF_CHINA_CNY'
        };
        this.accountForm.accountName = bankNames[this.selectedAccountType.id] || 'DEFAULT_ACCOUNT';
      }
    },
    
    handleBack() {
      this.$router.go(-1); // 返回上一页
    },
    handleCreateAccount() {
      this.$refs.accountFormRef.validate((valid) => {
        if (valid) {
          this.$confirm('确认创建账户吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 这里可以实现创建账户的逻辑
            this.$message.success('账户创建成功！');
            console.log('创建账户信息:', {
              accountType: this.selectedAccountType,
              formData: this.accountForm
            });
          }).catch(() => {
            this.$message.info('已取消创建');
          });
        } else {
          this.$message.error('请填写必填项');
        }
      });
    },
    formatRatioTooltip(value) {
      return `代理商分成 ${value}%`;
    }
  }
};
</script>

<style scoped>
.account-management {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  height: 100%;
}

.page-header {
  margin-bottom: 20px;
}

.account-container {
  display: flex;
  height: calc(100vh - 150px);
}

.account-types-panel {
  width: 280px;
  border-right: 1px solid #ebeef5;
  padding-right: 20px;
  overflow-y: auto;
}

.account-types-panel h4 {
  margin: 0 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
  font-weight: 600;
}

.account-type-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.account-type-list li {
  padding: 12px 15px;
  border-radius: 4px;
  margin-bottom: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.3s;
}

.account-type-list li:hover {
  background-color: #f5f7fa;
}

.account-type-list li.active {
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  color: #1890ff;
}

.account-type-icon {
  margin-right: 10px;
  font-size: 16px;
}

.account-type-info {
  flex: 1;
}

.account-type-name {
  font-weight: 500;
  margin-bottom: 4px;
}

.account-type-desc {
  font-size: 12px;
  color: #909399;
}

.account-details-panel {
  flex: 1;
  padding: 0 20px;
  overflow-y: auto;
}

.account-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
}

.account-header h4 {
  margin: 0;
}

.account-details h5 {
  margin: 0 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
  font-weight: 600;
}

.account-title h5 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.account-limitations {
  margin: 20px 0;
}

.account-limitations h6 {
  margin: 0 0 10px 0;
  font-weight: 500;
  color: #606266;
}

.account-limitations ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.account-limitations li {
  padding: 4px 0;
  color: #909399;
}

.support-info {
  margin: 20px 0;
}

.support-info h6 {
  margin: 0 0 15px 0;
  font-weight: 500;
  color: #606266;
}

.support-item {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
}

.support-item label {
  width: 120px;
  font-weight: 500;
  color: #606266;
}

.account-config-form h5 {
  margin: 30px 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
  font-weight: 600;
}

.help-text {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.operation-buttons {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
}

.help-footer {
  position: fixed;
  bottom: 70px;
  right: 20px;
  left: 300px;
  padding: 10px 0;
  border-top: 1px solid #ebeef5;
  text-align: center;
  color: #909399;
  font-size: 12px;
}

@media (max-width: 768px) {
  .account-container {
    flex-direction: column;
    height: auto;
  }

  .account-types-panel {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #ebeef5;
    padding-right: 0;
    margin-bottom: 20px;
  }
}
</style>