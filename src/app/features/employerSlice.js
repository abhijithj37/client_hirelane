import { createSlice } from "@reduxjs/toolkit";
 
const initialState = {
  employer: null,
  postedJobs: null,
  jobDetails: null,
  application: null,
  employerApplications:[],
  jobApplications:[],
  chatUser:null,
  newMessage:"",
  myStream:null,
  notifications:[],
  unreadNotifications:[],
  updated:false
  
};

const employerSlice=createSlice({
  name:"employer",
  initialState,
  reducers:{
    setEmployer:(state, action) => {
    state.employer = action.payload;
    },

    setPostedJobs: (state, action) => {
    state.postedJobs = action.payload;
    },

    setEmpJobDetails: (state, action) => {
      state.jobDetails = action.payload;
    },

    setEmployerApplications: (state, action) => {
    state.employerApplications = action.payload;
    },
    setJobApplications:(state,action) => {
    state.jobApplications=action.payload;
    },
    setChatUser:(state,action)=>{
    state.chatUser=action.payload
    },
    setNewMessage:(state,action)=>{
      state.newMessage=action.payload
    },
    setEmpStream:(state,action)=>{
     state.myStream=action.payload
    },
    setEmployerNotifications:(state,action)=>{
      state.notifications=action.payload
    },
    setEmployerUnreadNotifications:(state,action)=>{
      state.unreadNotifications=action.payload
    },
    setUpdated:(state,action)=>{
      state.updated=action.payload
    }
  },
});
export default employerSlice.reducer;
export const {
  setEmployer,
  setPostedJobs,
  setEmpJobDetails,
  setEmployerApplications,
  setJobApplications,
  setChatUser,
  setNewMessage,
  setEmpStream,
  setEmployerNotifications,
  setEmployerUnreadNotifications,
  setUpdated
} =employerSlice.actions;
