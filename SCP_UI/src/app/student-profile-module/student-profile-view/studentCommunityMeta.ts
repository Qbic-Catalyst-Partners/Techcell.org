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
export const StudentCommunityMeta: Object[] = [
    {
        seq: 1,
        name: 'Community Name',
        visible: true,
        dataKey: 'title',
        type:'text',
        isSort:false,
        sort:false
    },
    {
        seq: 2,
        name: 'Joined Date',
        visible: true,
        dataKey: 'joinedDate',
        type:'text',
        isSort:false,
        sort:false
    }
]