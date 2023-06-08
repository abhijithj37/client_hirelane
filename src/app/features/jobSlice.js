import {createSlice} from '@reduxjs/toolkit'

const initialState=
{
    posts:[],
    postId:null,
    jobDetails:null,
    isLoading:false,
    error:null
    
}
const postSlice=createSlice({
    name:'posts',
    initialState,
    reducers:{
        setPosts:(state,action)=>{
        state.posts=action.payload 
        },
        setPostId:(state,action)=>{ 
         state.postId=action.payload
        },
        setJobDetails:(state,action)=>{
        state.jobDetails=action.payload
    }
}
})

export default postSlice.reducer
export const{setPosts,setPostId,setJobDetails}=postSlice.actions