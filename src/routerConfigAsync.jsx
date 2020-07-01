// 以下文件格式为描述路由的协议格式
// 你可以调整 routerConfig 里的内容
// 变量名 routeAsync routerConfig 为检测关键字，请不要修改名称

import React from 'react';
import {
  DotChartOutlined,
  UserOutlined,
  SolutionOutlined,
  IssuesCloseOutlined,
  SettingOutlined,
  FontColorsOutlined,
  DeploymentUnitOutlined,
  HddOutlined,
  BorderOutlined,
  ClusterOutlined,
  BranchesOutlined,
  HomeFilled,
  SecurityScanFilled,
  TranslationOutlined,
  OrderedListOutlined,
  SnippetsOutlined,
  DatabaseOutlined
} from '@ant-design/icons';
import Lay from './Layout';
import NotFound from './pages/NotFound';
import {I18n} from 'h-react';

const Layout = [Lay, {theme: 'dark', primaryColor: '#3c4cc6', pathHideType: 'hidden'}];
const routerConfig = [
  /**
   * 路由
   * 参数
   *   path[ must ]
   *   name[ must ]
   *   component
   *   layout
   *   icon[ default::null ] see https://ant.design/components/icon-cn/
   *   hide[ default::false ]
   *   disabled[ default::false ]
   *   async[ default::routerAsync ]
   * must 参数 必须设置
   * 如果该路由使用过程中无需访问或者说仅仅作为children一个包容器，则 component 可不设置
   * hide === true 时不会在导航显示(注意 '/' 'sign' '*' 默认为hide且设定无效)
   */
  {
    path: '/',
    name: I18n('HOME'),
    layout: Layout,
    component: () => import('./pages/Home/Index'),
  },
  {
    path: '/index',
    name: I18n('HOME'),
    icon: <HomeFilled/>,
    children: [
      {
        path: '/index',
        name: I18n(['PROJECT', 'STATISTIC']),
        icon: <DotChartOutlined/>,
        layout: Layout,
        component: () => import('./pages/Home/Index'),
      },
      {
        path: '/account',
        name: I18n('ACCOUNT'),
        icon: <UserOutlined/>,
        layout: Layout,
        children: [
          {
            path: '/changeLoginName',
            name: I18n('USER_NAME'),
            layout: Layout,
            component: () => import('./pages/Home/AccountChangeLoginName'),
          },
          {
            path: '/changeLoginPwd',
            name: I18n('LOGIN_PASSWORD'),
            layout: Layout,
            component: () => import('./pages/Home/AccountChangeLoginPwd'),
          },
        ],
      },
    ],
  },
  {
    path: '/setting',
    name: I18n('SETTING'),
    icon: <SettingOutlined/>,
    children: [
      {
        path: '/i18n',
        name: I18n('TRANSLATE'),
        icon: <TranslationOutlined/>,
        layout: Layout,
        component: () => import('./pages/Setting/I18n'),
      },
      {
        path: '/log_file',
        name: I18n(['FILE', 'LOG']),
        icon: <SnippetsOutlined/>,
        layout: Layout,
        component: () => import('./pages/Setting/LogFile'),
      },
      {
        path: '/log_db',
        name: I18n(['DATABASE', 'LOG']),
        icon: <DatabaseOutlined/>,
        layout: Layout,
        component: () => import('./pages/Setting/LogDB'),
      },
    ],
  },
  // {
  //   path: '/user',
  //   name: I18n('USER'),
  //   icon: <SolutionOutlined/>,
  //   children: [
  //     {
  //       path: '/admin',
  //       name: I18n('ADMIN_MANAGE'),
  //       icon: <IssuesCloseOutlined/>,
  //       layout: Layout,
  //       component: () => import('./pages/User/Admin'),
  //     },
  //     {
  //       path: '/normal',
  //       name: I18n('NORMAL_MANAGE'),
  //       icon: <UserOutlined/>,
  //       layout: Layout,
  //       component: () => import('./pages/User/Doctor'),
  //     },
  //   ],
  // },
  // {
  //   path: '/system',
  //   name: I18n('SYSTEM'),
  //   icon: <SettingOutlined/>,
  //   children: [
  //     {
  //       path: '/authCode',
  //       name: I18n('AUTH_CODE'),
  //       icon: <FontColorsOutlined/>,
  //       layout: Layout,
  //       component: () => import('./pages/System/AuthCode'),
  //     },
  //     {
  //       path: '/external',
  //       name: I18n('THIRD_PLATFORM'),
  //       icon: <DeploymentUnitOutlined/>,
  //       layout: Layout,
  //       component: () => import('./pages/System/External'),
  //     },
  //     {
  //       path: '/externalLog',
  //       name: I18n('THIRD_PLATFORM_LOG'),
  //       icon: <SecurityScanFilled/>,
  //       layout: Layout,
  //       component: () => import('./pages/System/ExternalLog'),
  //     },
  //     {
  //       path: '/systemConfig',
  //       name: I18n('SYSTEM_CONFIG'),
  //       icon: <HddOutlined/>,
  //       layout: Layout,
  //       component: () => import('./pages/System/SystemConfig'),
  //     },
  //     {
  //       path: '/platform',
  //       name: I18n('PLATFORM_CONFIG'),
  //       icon: <BorderOutlined/>,
  //       layout: Layout,
  //       component: () => import('./pages/System/Platform'),
  //     },
  //     {
  //       path: '/permission',
  //       name: I18n('PERMISSION_CONFIG'),
  //       icon: <ClusterOutlined/>,
  //       layout: Layout,
  //       component: () => import('./pages/System/Permission'),
  //     },
  //     {
  //       path: '/path',
  //       name: I18n('LIMIT_PATH'),
  //       icon: <BranchesOutlined/>,
  //       layout: Layout,
  //       component: () => import('./pages/System/Path'),
  //     },
  //   ],
  // },
  // sign里面的所有路由不会出现在导航之中
  {
    path: '/sign',
    name: '无需认证',
    children: [
      {
        path: '/in',
        name: I18n('LOGIN'),
        component: () => import('./pages/Sign/UserLogin'),
      },
    ],
  },
  // 除上面外所有其他路由的指向 *
  {
    path: '*',
    component: NotFound,
    async: false,
  },
];

export default routerConfig;
