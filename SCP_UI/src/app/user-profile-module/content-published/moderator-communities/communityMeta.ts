export const Actions: Object[] = [
    {
        name: 'view',
        visible: true,
        icon: true,
        style:{
            class:'bi bi-eye'
        }
    },
    {
        name: 'edit',
        visible: true,
        icon: true,
        style:{
            class:'bi bi-pencil-square'
        }
    },
    {
        name: 'delete',
        visible: true,
        icon: true,
        style:{
            class:'bi bi-trash'
        }
    }
    
]
export const CommunityMeta: Object[] = [
    {
        seq: 1,
        name: 'Community Name',
        visible: true,
        dataKey: 'title',
        type:'link',
        isSort:true,
        sort:true
    },
    {
        seq: 2,
        name: 'Role',
        visible: true,
        dataKey: 'role',
        type:'text',
        isSort:true,
        sort:true
    },
    {
        seq: 3,
        name: 'Date Created',
        visible: true,
        dataKey: 'createdDate',
        type:'text',
        isSort:true,
        sort:true
    },
    {
        seq: 4,
        name: 'Date Joined',
        visible: true,
        dataKey: 'emailId',
        type:'text',
        isSort:true,
        sort:true
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