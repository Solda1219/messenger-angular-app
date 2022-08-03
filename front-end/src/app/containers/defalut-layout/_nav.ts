import { INavData } from '@coreui/angular';

export const navItems = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-speedometer',
    role: -1,
  },
  {
    name: 'Account',
    icon: 'cil-user-follow',
    url: '/account',
    role:2,
    children:[
      {
        name: 'user',
        url:'/account/user',
        icon:'cil-triangle',
        role:2,
      },
      {
        name: 'admin',
        url:'/account/admin',
        icon:'cil-triangle',
        role:1,
      },
    ]
  },
  {
    name: 'Group',
    icon: 'fa fa-group',
    url: '/group',
    role:-1,
    children:[
      {
        name: 'Group Organize',
        url:'/group/organize',
        icon:'cil-triangle',
        role:-1,
      },
    ]
  },
];
