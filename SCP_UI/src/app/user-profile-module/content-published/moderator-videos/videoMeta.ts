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
export const VideoMeta: Object[] = [
    {
        seq: 1,
        name: 'Video Title',
        visible: true,
        dataKey: 'title',
        type:'link',
        isSort:true,
        sort:true
    },
    {
        seq: 2,
        name: 'Published Date',
        visible: true,
        dataKey: 'createdDate',
        type:'text',
        isSort:true,
        sort:true
    },
    {
        seq: 3,
        name: 'Views',
        visible: true,
        dataKey: 'views',
        type:'text',
        isSort:true,
        sort:true
    },
    {
        seq: 4,
        name: 'Likes',
        visible: true,
        dataKey: 'likes',
        type:'text',
        isSort:true,
        sort:true
    },
    {
        seq: 5,
        name: 'Favourites',
        visible: true,
        dataKey: 'Fav',
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