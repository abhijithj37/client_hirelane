import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import { useDispatch} from "react-redux";
import { setEmployer } from "../../app/features/employerSlice";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import GroupsIcon from "@mui/icons-material/Groups";
import { useConnectEmployer } from "../../Utils/api";
 function MainListItems() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
     const handleLogout = () => {
    const confirmed = window.confirm("Are You Sure want to log out");

    if (confirmed) {
      axios
        .get("employer/logout", { withCredentials: true })
        .then(() => {
          dispatch(setEmployer(null));
          navigate("/emp-login");
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  }; 

  useConnectEmployer()

 


  return (
    <>
      <ListItemButton
        onClick={() => {
          navigate("postJob");
        }}
      >
        <ListItemIcon>
          <WorkOutlineIcon />
        </ListItemIcon>
        <ListItemText primary="Post a Job" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate(".")}>
        <ListItemIcon>
          <WorkHistoryIcon />
        </ListItemIcon>
        <ListItemText primary="Posted Jobs" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate("employerapplications")}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Applications" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate("interviews")}>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="interviews" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate("candidates")}>
        <ListItemIcon>
          <GroupsIcon />
        </ListItemIcon>
        <ListItemText primary="Candidates"></ListItemText>
      </ListItemButton>
      <ListItemButton onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Log Out"></ListItemText>
      </ListItemButton>
    </>
  );
}

//   function SecondaryListItems (){

//   return(
//     <React.Fragment>
//     {/* <ListSubheader component="div" inset>
//       Saved reports
//     </ListSubheader> */}

//     <ListItemButton>
//       <ListItemIcon>
//         <AssignmentIcon />
//       </ListItemIcon>
//       <ListItemText primary="" />
//     </ListItemButton>
//     <ListItemButton>
//       <ListItemIcon>
//         <AssignmentIcon />
//       </ListItemIcon>
//       <ListItemText primary="" />
//     </ListItemButton>
//   </React.Fragment>
//   )
// }

export { MainListItems };
