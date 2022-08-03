import { INavData } from '@coreui/angular';

export const navItems = [
  {
    name: 'First Page',
    url: '/dashboard',
    icon: 'assets/theme/img/dots.png',
    role: -1,
    collapse:false,
  },
  {
    name: 'My Profile',
    icon: 'assets/theme/img/singleuser.png',
    url: '/myprofile',
    role:-1,
    collapse:false,
    children:[
      {
        name: 'Registration information',
        url:'/myprofile/profile',
        icon:'assets/theme/img/profile.png',
        role:-1,
      },
      {
        name: 'WebOffice Setting',
        url:'/myprofile/office-setting',
        icon:'assets/theme/img/meeting.png',
        role:-1,
      },
      {
        name: 'E-card Setting',
        url:'/myprofile/ecard-setting',
        icon:'assets/theme/img/meeting.png',
        role:-1,
      },
      {
        name: 'Address Book',
        url:'/myprofile/addressbook',
        icon:'assets/theme/img/book.png',
        role:-1,
      },
    ]
  },
  {
    name: 'Dept Manage',
    icon: 'assets/theme/img/tag.png',
    url: '/dept-manage',
    role:-1,
    collapse:false,
  },
  {
    name: 'User Manage',
    icon: 'assets/theme/img/user.png',
    url: '/user',
    role:-1,
    collapse:false,
  },
  {
    name: 'My calendar',
    url:'/calendarMeeting',
    icon:'assets/theme/img/video.png',
    role:-1,
  },
  {
    name: 'Video Conference',
    icon: 'assets/theme/img/video.png',
    collapse:false,
    role:-1,
    children:[
      {
        name: 'Instant meeting',
        url:'/video-conference/instantMeeting',
        icon:'assets/theme/img/rply.png',
        role:-1,
      },
      {
        name: 'Schedule Meeting',
        url:'/video-conference/sheduleMeeting',
        icon:'assets/theme/img/meeting.png',
        role:-1,
      },
      {
        name: 'Upcoming',
        url:'/video-conference/incoming',
        icon:'assets/theme/img/meeting.png',
        role:-1,
      },
      {
        name: 'History',
        url:'/video-conference/history',
        icon:'assets/theme/img/meeting.png',
        role:-1,
      },
    ]
  },
  {
    name: 'Multimedia message',
    icon: 'assets/theme/img/video.png',
    collapse:false,
    role:-1,
    children:[
      {
        name: 'message board',
        url:'/multi-message/message-board',
        icon:'assets/theme/img/rply.png',
        role:-1,
      },
      {
        name: 'Check message',
        url:'/multi-message/check-message',
        icon:'assets/theme/img/meeting.png',
        role:-1,
      },
    ]
  },
  {
    name: 'Cloud Storage',
    icon: 'assets/theme/img/cloud.png',
    url: '/cloud-storage',
    role:-1,
    collapse:false,
    children:[
      {
        name: 'Recording manage',
        url:'/cloud-storage/recording',
        icon:'assets/theme/img/rply.png',
        role:-1,
      },
      {
        name: 'Cloud Disk',
        url:'/cloud-storage/disk',
        icon:'assets/theme/img/meeting.png',
        role:-1,
      },
    ]
  },
  // {
  //   name: 'Knowledge Hub',
  //   icon: 'assets/theme/img/book.png',
  //   url: '/knowledge-hub',
  //   role:-1,
  //   collapse:false,
  //   children:[
  //     {
  //       name: 'Document Share',
  //       url:'/knowledge-hub/documentshare',
  //       icon:'assets/theme/img/book.png',
  //       role:-1,
  //     },
  //   ]
  // },
  {
    name: 'System manage',
    icon: 'assets/theme/img/settings.png',
    url: '/system-manage',
    role:-1,
    collapse:false,
    children:[
      {
        name: 'System Info',
        url:'/system-manage/sys-info',
        icon:'assets/theme/img/settings.png',
        role:-1,
      },
      {
        name: 'Server Status',
        url:'/system-manage/server-status',
        icon:'assets/theme/img/book.png',
        role:-1,
      },
      {
        name: 'Meeting Status',
        url:'/system-manage/meeting-status',
        icon:'assets/theme/img/meeting.png',
        role:-1,
      },
      {
        name: 'Messenger Status',
        url:'/system-manage/messenger-status',
        icon:'assets/theme/img/user.png',
        role:-1,
      },
    ]
  },
    {
    name: 'Learn',
    icon: 'assets/theme/img/settings.png',
    role:-1,
    collapse:false,
    children:[
      {
        name: 'Learn Record',
        url:'/learn/learn-Record',
        icon:'assets/theme/img/settings.png',
        role:-1,
      },
    ]
  },
  {
    name: 'Mail',
    icon: 'assets/theme/img/message.png',
    role:-1,
    collapse: false,
    // children:[
    //   {
    //     name: 'Write a mail',
    //     url: '',
    //     icon:'assets/theme/img/settings.png',
    //     role:-1,
    //   },
    //   {
    //     name: 'Send box',
    //     url:'/mail/sendbox',
    //     icon:'assets/theme/img/settings.png',
    //     role:-1,
    //   },
    //   {
    //     name: 'Receive box',
    //     url:'/mail/receivebox',
    //     icon:'assets/theme/img/settings.png',
    //     role:-1,
    //   },
    // ]
  },
];
