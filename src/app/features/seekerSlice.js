import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  seeker: null,
  isLoading: true,
  status: false,
  error: null,
  jobToApply: null,
  applications: [],
  chatUser: null,
  myStream: null,
  notifications:[],
  unreadNotifications:[]
};
const seekerSlice = createSlice({
  name: "seeker",
  initialState,
  reducers: {
    setSeeker: (state, action) => {
      state.seeker = action.payload;
      state.status = true;
    },
    setJobToApply: (state, action) => {
      state.jobToApply = action.payload;
    },
    setApplications: (state, action) => {
      state.applications = action.payload;
    },
    setChatEmployer: (state, action) => {
      state.chatUser = action.payload;
    },
    setMystream: (state, action) => {
      state.myStream = action.payload;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    setUnreadNotifications:(state,action)=>{
        state.unreadNotifications=action.payload
    }
  },
});
export default seekerSlice.reducer;
export const {
  setSeeker,
  setJobToApply,
  setApplications,
  setChatEmployer,
  setMystream,
  setNotifications,
  setUnreadNotifications
} = seekerSlice.actions;
