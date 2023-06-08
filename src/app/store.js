import { configureStore } from "@reduxjs/toolkit"
import employerSlice from "./features/employerSlice"
import seekerSlice from "./features/seekerSlice"
import jobSlice from "./features/jobSlice"
  const store=configureStore({
    reducer:{
        seeker:seekerSlice,
        employer:employerSlice,
        posts:jobSlice,
      }
 })
export default store  