export const Actions: Object[] = [
  {
    name: '',
    visible: true,
    type: 'actionToolTip',
    menuList: [
      { name: 'Accept', value: 'Accepted' },
      { name: 'Reject', value: 'Rejected' }
    ]
  }
];

export const ProjectRecivedMeta: Object[] = [
  {
    seq: 1,
    name: 'Team Lead',
    visible: true,
    dataKey: 'fullName',
    type: 'text',
    isSort: true,
    sort: true
  },
  {
    seq: 2,
    name: 'Members',
    visible: true,
    dataKey: 'memberCount',
    type: 'text',
    isSort: false,
    sort: false
  },
  {
    seq: 3,
    name: 'Resume',
    visible: true,
    dataKey: 'view',
    type: 'link',
    isSort: false,
    sort: false
  },
  {
    seq: 4,
    name: 'Status',
    visible: true,
    dataKey: 'status',
    type: 'text',
    isSort: true,
    sort: true,
    displayValue: (value: string) => (value === 'Applied' ? 'Pending' : value)
  },
  {
    seq: 5,
    name: 'Action',
    visible: true,
    dataKey: '',
    type: 'Action',
    action: Actions
  }
]; 