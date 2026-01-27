import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '@/layouts/main/MainLayout.vue';

const routes = [
  {
    path: '/',
    redirect: '/main/agents/list'
  },
  {
    path: '/main',
    component: MainLayout,
    children: [
      // 代理商全局监控
      {
        path: 'monitor/overview',
        name: 'AgentOverview',
        component: () => import('@/views/monitor/overview/AgentOverview.vue'),
        meta: { title: '代理商信息总览' }
      },
      {
        path: 'monitor/contracts',
        name: 'ContractArchive',
        component: () => import('@/views/monitor/contracts/ContractArchive.vue'),
        meta: { title: '合同签约档案' }
      },
      {
        path: 'monitor/change-records',
        name: 'ChangeRecord',
        component: () => import('@/views/monitor/change-records/ChangeRecord.vue'),
        meta: { title: '关系变更记录' }
      },
      {
        path: 'monitor/change-details',
        name: 'ChangeDetail',
        component: () => import('@/views/monitor/change-details/ChangeDetail.vue'),
        meta: { title: '关系变更明细' }
      },
      {
        path: 'monitor/statistics',
        name: 'BusinessStatistics',
        component: () => import('@/views/monitor/statistics/BusinessStatistics.vue'),
        meta: { title: '代理商业务数据统计' }
      },
      {
        path: 'monitor/sp-te-relations',
        name: 'SpTeRelations',
        component: () => import('@/views/monitor/relations/SpTeRelations.vue'),
        meta: { title: 'SP/TE代理关系说明' }
      },
      {
        path: 'monitor/sp-te-relations/detail',
        name: 'SpTeRelationDetail',
        component: () => import('@/views/monitor/relations/SpTeRelationDetail.vue'),
        meta: { title: 'SP/TE代理关系详情' }
      },
      {
        path: 'account/management',
        name: 'AccountManagement',
        component: () => import('@/views/account-management/AccountManagement.vue'),
        meta: { title: '账户管理' }
      },
      {
        path: 'account/list',
        name: 'AccountList',
        component: () => import('@/views/account-management/AccountList.vue'),
        meta: { title: '账户列表' }
      },
      {
        path: 'agents/list',
        name: 'AgentList',
        component: () => import('@/views/agents/AgentList.vue'),
        meta: { title: '代理商列表' }
      },
      {
        path: 'agents/basic-list',
        name: 'BasicAgentList',
        component: () => import('@/views/agents/BasicAgentList.vue'),
        meta: { title: '代理商基本信息列表' }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;