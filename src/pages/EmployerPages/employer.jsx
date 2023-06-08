import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
 import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MessageIcon from "@mui/icons-material/Message";
import {MainListItems} from "../../Components/EmployerComponents/listItems";
import empLogo from "../../images/employerLogo.png";
import {useSelector} from "react-redux";
import BusinessIcon from "@mui/icons-material/Business";
import { Outlet, useNavigate } from "react-router-dom";
   
const drawerWidth = 240;

const AppBar = styled(MuiAppBar,{
shouldForwardProp:(prop)=>prop!=="open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
  easing: theme.transitions.easing.sharp,
  duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp:(prop) =>prop!=="open",
})(({theme,open})=>({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width:drawerWidth,
    transition: theme.transitions.create("width",{
      easing:theme.transitions.easing.sharp,
      duration:theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width",{
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width:theme.spacing(7),
      [theme.breakpoints.up("sm")]:{
      width:theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme();

function DashboardContent() {
   const [open, setOpen] = React.useState(true);
   const toggleDrawer = () => {
    setOpen(!open);
  };

 

  const { employer,unreadNotifications } = useSelector((state) => state.employer);
  const navigate=useNavigate()

   
        
  
  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{display:"flex"}}>
        <CssBaseline />
        <AppBar
          sx={{backgroundColor:"primary"}}
          position="absolute"
          open={open}
        >
          <Toolbar
            sx={{
            pr:"24px", //keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
              marginRight: "36px",
              ...(open && {display:"none"}),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{flexGrow:1}}
            >      
              <img width={100} src={empLogo} alt="" />
            </Typography>
            <Typography>
              {employer && (
                <>       
                  <IconButton color="inherit">
                    <BusinessIcon />
                  </IconButton>
                  {employer.email}
                </>        
              )}         
            </Typography>
            <IconButton onClick={()=>navigate('emp-notifications')} color="inherit">
              <Badge badgeContent={unreadNotifications?.length} color="secondary">
                <NotificationsIcon />
              </Badge>        
            </IconButton>           
            <IconButton onClick={()=>navigate('employerChat')} color="inherit">
                 <MessageIcon />
             </IconButton>         
          </Toolbar>         
        </AppBar>          


        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <MainListItems/>
            <Divider sx={{ my: 1 }} />
           </List>
        </Drawer>
         <Outlet/>
      </Box>
    </ThemeProvider>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
