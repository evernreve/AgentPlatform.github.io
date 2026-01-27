<template>
  <div class="main-layout">
    <el-container>
      <!-- 左侧固定菜单栏 -->
      <el-aside width="200px" class="sidebar">
        <div class="logo">
          <h3>代理商全局监控</h3>
        </div>
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          router
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-sub-menu index="1">
            <template #title>
              <span>代理商全局监控</span>
            </template>
            <el-menu-item index="/main/agents/list">代理商列表</el-menu-item>
            <el-menu-item index="/main/agents/basic-list">平台入驻商户基本信息</el-menu-item>
            <el-menu-item index="/main/monitor/overview">代理商信息总览</el-menu-item>
            <el-menu-item index="/main/monitor/change-details">关系变更明细</el-menu-item>
            <el-menu-item index="/main/monitor/statistics">业务数据统计</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="2">
            <template #title>
              <span>基础信息管理</span>
            </template>
            <el-menu-item index="/main/monitor/sp-te-relations">SP/TE代理关系说明</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="3">
            <template #title>
              <span>合同签约档案</span>
            </template>
            <el-menu-item index="/main/monitor/contracts">合同签约档案</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="4">
            <template #title>
              <span>账户管理</span>
            </template>
            <el-menu-item index="/main/account/list">账户列表</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>

      <!-- 主内容区域（右侧） -->
      <el-main class="main-content">
        <router-view v-slot="{ Component }">
          <Suspense>
            <component :is="Component" />
          </Suspense>
        </router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'MainLayout',
  computed: {
    activeMenu() {
      // 确保路径匹配正确
      return this.$route.path;
    }
  },
  methods: {
    getPageTitle() {
      const routeMap = {
        '/main/agents/list': '代理商列表',
        '/main/monitor/overview': '代理商信息总览',
        '/main/monitor/contracts': '合同签约档案',
        '/main/monitor/change-details': '关系变更明细',
        '/main/monitor/statistics': '代理商业务数据统计',
        '/main/agents/list': '代理商列表',
        '/main/agents/basic-list': '平台入驻商户基本信息',
        '/main/monitor/sp-te-relations': 'SP/TE代理关系说明',
        '/main/account/management': '账户管理',
        '/main/account/list': '账户列表'
      };
      return routeMap[this.$route.path] || '代理商全局监控';
    }
  }
};
</script>

<style scoped>
.main-layout {
  height: 100vh;
}

.sidebar {
  background-color: #545c64;
  color: #fff;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  border-right: 1px solid #ddd;
}

.logo {
  padding: 20px 10px;
  text-align: center;
  border-bottom: 1px solid #444;
}

.sidebar-menu {
  border: none;
}

.main-content {
  background-color: #f0f2f5;
  padding: 20px;
  margin-left: 200px; /* 为左侧菜单留出空间 */
  height: 100vh;
  overflow-y: auto;
}
</style>