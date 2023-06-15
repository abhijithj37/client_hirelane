import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
  Navigate,
  
} from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useDispatch, useSelector } from "react-redux";
import Register from "./pages/SeekerPages/Register";
import EmployerSignUp from "./pages/EmployerPages/EmployerSignUp";
import EmployerLogin from "./pages/EmployerPages/EmplyerLogin";
import Dashboard from "./pages/EmployerPages/employer";
import Home from "./pages/SeekerPages/Home";
import Login from "./pages/SeekerPages/Login";
import { useEffect, useState } from "react";
import { verifyEmployer, verifySeeker } from "./Utils/api";
import { setEmployer } from "./app/features/employerSlice";
import { setSeeker } from "./app/features/seekerSlice";
import CreateNewPost from "./pages/EmployerPages/CreateNewPost";
import PostedJobs from "./pages/EmployerPages/PostedJobs";
import EmployerJobDetails from "./pages/EmployerPages/EmployerJobDetails";
import EditJob from "./pages/EmployerPages/EditJob";
import Resume from "./pages/SeekerPages/Resume";
import BuildResume from "./pages/SeekerPages/BuildResume";
import Apply from "./pages/SeekerPages/Apply";
import MyJobs from "./pages/SeekerPages/MyJobs";   
import EmployerApplication from "./pages/EmployerPages/EmployerApplication";
import ApplicationDetails from "./pages/EmployerPages/ApplicationDetails";
 import EmployerChat from "./pages/EmployerPages/EmployerChat";
import Messages from "./pages/SeekerPages/Chat";
import JobDetails from "./pages/SeekerPages/JobDetails";
import Applicants from "./pages/EmployerPages/Applicants";
import CandidateInfo from "./pages/EmployerPages/CandidateInfo";
import Interviews from "./pages/EmployerPages/Interviews";
import InterviewDetails from "./pages/EmployerPages/InterviewDetails";
import EmpInterviewPage from "./pages/EmployerPages/Start-meet";
import Join from "./pages/SeekerPages/JoinMeet";
import EmpMeet from "./pages/EmployerPages/Emp-Meet";
import { SocketProvider, useSocket } from "./Context/SocketProvider";
import Meet from "./pages/SeekerPages/Meet";
import UserNotifications from "./pages/SeekerPages/UserNotifications";
import EmployerNotifications from "./pages/EmployerPages/EmployerNotifications";


function App() {
  const socket=useSocket()
  const dispatch=useDispatch();
  const [loading,setLoading]=useState(false);
  const { seeker } =useSelector((state)=>state.seeker);
  const { employer } =useSelector((state)=>state.employer);

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([verifyEmployer(), verifySeeker()])
      .then(([employer, jobSeeker]) => {
        if (employer && employer.status === "fulfilled") {
          if(employer.value.blocked){
           dispatch(setEmployer(null));
          }else{
          dispatch(setEmployer(employer.value));
          socket?.emit('connect-user',employer.value?._id)

          }
         }
        if (jobSeeker && jobSeeker.status === "fulfilled") {
          if(jobSeeker.value.blocked){
            dispatch(setSeeker(null));

          }else{
            dispatch(setSeeker(jobSeeker.value));
           }
 
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        if (error.message === "Unauthorized") {
          console.log(error);
        }
      });
      return ()=>{
      socket?.disconnect()
      }
  }, [dispatch,socket]);

  

  const router = createBrowserRouter(
    createRoutesFromElements(
      
      <Route>

        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={seeker ? <Navigate to={"/"} /> : <Login />}
        />
        <Route
          path="/signup"
          element={seeker ? <Navigate to={"/"} /> : <Register />}
        />
        <Route
          path="/profile"
          element={seeker ? <BuildResume /> : <Navigate to={"/login"} />}
        ></Route>
        <Route path="/myjobs" element={seeker?<MyJobs />: <Navigate to={"/login"} />}></Route>
        <Route path="/meet/:id" element={seeker?<Meet />:<Navigate to={'/join'}/>}></Route>

        <Route
          path="/resume"
          element={
            seeker && seeker.modified ? (
              <Resume />
            ) : (
              <Navigate to={"/profile"} />
            )
          }
        ></Route>
        <Route path="/jobDetails/:id" element={<JobDetails />}></Route>
        <Route path="/messages" element={seeker?<Messages />: <Navigate to={"/login"} />}></Route>
        <Route path="/notifications" element={seeker?<UserNotifications />:<Navigate to={"/login"} />}></Route>

        <Route path="/apply/:id" element={<Apply />}></Route>
        <Route path="/join" element={seeker?<Join />: <Navigate to={"/login"} />}></Route>

        <Route
          path="/employerSignup"
          element={
          employer?<Navigate to={"/employer"} />:<EmployerSignUp/>
          }
        />
        <Route
          path="/employerLogin" 
          element={employer ? <Navigate to={"/employer"} /> : <EmployerLogin />}
        ></Route>
        <Route
          path="/employer"
          element={
            employer ? <Dashboard /> : <Navigate to="/employerLogin" replace />
          }
        >

          <Route index element={<PostedJobs />}></Route>
          <Route path="postJob" element={<CreateNewPost />}></Route>
          <Route path="jobDetails/:id" element={<EmployerJobDetails />}></Route>
          <Route path="editJob/:id" element={<EditJob />}></Route>
          <Route
            path="employerapplications"
            element={<EmployerApplication />}
          ></Route>
          <Route
            path="applicationdetails/:id"
            element={<ApplicationDetails />}
          ></Route>
          <Route path="employerChat" element={<EmployerChat />}></Route>
          <Route path="candidates" element={<Applicants />}></Route>
          <Route path="candidateInfo/:id" element={<CandidateInfo />}></Route>
          <Route path="interviews" element={<Interviews />}></Route>
          <Route path="emp-notifications" element={<EmployerNotifications/>}/>
          <Route
            path="interviewDetails/:id"
            element={<InterviewDetails />}
          ></Route>
          </Route>
        <Route
          path="/start-meet"
          element={
          employer ? <EmpInterviewPage /> : <Navigate to={"/employerLogin"} />
          }
        ></Route>
        <Route
          path="/emp-meet/:id"
          element={employer?<EmpMeet/>:<Navigate to={"/employerLogin"}/>}
        ></Route>

      </Route> 
    )
  );
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="App">
        <SocketProvider>
        {loading ? <div></div> : <RouterProvider router={router} />}
        </SocketProvider>
      </div>
    </LocalizationProvider>
  )
}

export default App;
