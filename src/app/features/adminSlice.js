import { createSlice } from "@reduxjs/toolkit";


const initialState={
    admin:null,
    isLoading:false,
    error:null
}

 const adminSlice=createSlice({
    name:'admin',
    initialState,
    reducers:{
        setAdmin:(state,action)=>{
            state.admin=action.payload
        }
    }
 })
 export default adminSlice.reducer
 export const {setAdmin}=adminSlice.actions