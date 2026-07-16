export const Actions: Object[] = [
    {
        name: 'Approve',
        visible: true,
        type:'btn',
        style:{
            class:'approve'
        }
    },
    {
        name: 'Reject',
        visible: true,
        type:'btn',
        style:{
            class:'reject'
        }
    },
    
]
export const purchaseMeta: Object[] = [
    {
        seq: 1,
        name: 'Name',
        visible: true,
        dataKey: 'title',
        type:'link',
    },
    {
        seq: 2,
        name: 'Category',
        visible: true,
        dataKey: 'postType',
        type:'text',
    },
    {
        seq: 3,
        name: 'Date',
        visible: true,
        dataKey: 'name',
        type:'text',
    },
    {
        seq: 4,
        name: 'Invoice Number',
        visible: true,
        dataKey: 'role',
        type:'text',
    },
    // {
    //     seq: 6,
    //     name: 'Action',
    //     visible: true,
    //     dataKey: '',
    //     type:'Action',
    //     action: Actions
    // },
]