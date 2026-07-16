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
    }
]
export const ApprovalMeta: Object[] = [
    {
        seq: 1,
        name: 'Title',
        visible: true,
        dataKey: 'title',
        type:'text',
        isSort:true,
        sort:true
    },
    {
        seq: 2,
        name: 'Category',
        visible: true,
        dataKey: 'postType',
        type:'text',
        isSort:true,
        sort:true
    },
    {
        seq: 3,
        name: 'Taggings',
        visible: true,
        dataKey: 'taggings',
        type:'text',
        isSort:true,
        sort:true
    },
    {
        seq: 4,
        name: 'Contributor Name',
        visible: true,
        dataKey: 'name',
        type:'text',
        isSort:true,
        sort:true
    },
    {
        seq: 5,
        name: 'Contributor Role',
        visible: true,
        dataKey: 'role',
        type:'text',
        isSort:true,
        sort:true
    },
    {
        seq: 6,
        name: 'Action',
        visible: true,
        dataKey: '',
        type:'Action',
        action: Actions
    },
]