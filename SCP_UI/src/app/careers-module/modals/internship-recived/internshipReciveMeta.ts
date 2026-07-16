export const Actions: Object[] = [
    {
        name: '',
        visible: true,
        type:'actionToolTip',
        menuList:[{'name':'Accept','value':'Accepted'},{'name':'Reject','value':'Rejected'}]
    },
]
export const InternshipRecivedMeta: Object[] = [
    {
        seq: 1,
        name: 'User name',
        visible: true,
        dataKey: 'fullName',
        type:'text',
        isSort:true,
        sort:true
    },
    {
        seq: 2,
        name: 'Resume',
        visible: true,
        dataKey: 'view',
        type:'link',
        isSort:false,
        sort:false
    },
    {
        seq: 3,
        name: 'Status',
        visible: true,
        dataKey: 'status',
        type:'text',
        isSort:true,
        sort:true,
        displayValue: (value: string) => value === 'Applied' ? 'Pending' : value
    },
    {
        seq: 4,
        name: 'Action',
        visible: true,
        dataKey: '',
        type:'Action',
        action: Actions
    },
]