import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { Badge, Link } from "@mui/material";
import Logo from "../../images/logo.png";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import Divider from "@mui/material/Divider";
 import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import axios from "../../axios";
import { useDispatch, useSelector } from "react-redux";
import { setSeeker, setUnreadNotifications } from "../../app/features/seekerSlice";
import {useNavigate } from "react-router-dom";
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatIcon from '@mui/icons-material/Chat';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import { useConnectUser } from "../../Utils/api";
  
function Header() {
   const { seeker } = useSelector((state) => state.seeker);
  const [anchorElNav,setAnchorElNav]=React.useState(null);
  const [anchorElUser, setAnchorElUser]=React.useState(null);
  const dispatch = useDispatch();
  const {unreadNotifications,notifications}=useSelector((state)=>state.seeker)
  const handleOpenNavMenu = (event) =>{
  setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
  setAnchorElUser(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleLogout = () => {
  const confirmed = window.confirm("Are You Sure Want to Logout");
  if (confirmed) {
      axios
      .post("/seeker/logout",seeker._id,{ withCredentials: true })
      .then(() => {
      dispatch(setSeeker(null));
      })
      .catch((error) => {
       console.log(error.message);
       });
    }
  };
  const navigate = useNavigate();

  const handleProfile=()=>{
  navigate('/profile')
  handleCloseNavMenu()
  
  }
useConnectUser()

React.useEffect(()=>{
dispatch(setUnreadNotifications(notifications?.filter((n)=>n.read===false)))
},[dispatch,notifications])
 
 


  return (


    <AppBar position="static" sx={{ background: "white" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="h5"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "black",
              textDecoration:"none",
            }}
          >
            <img width={100} src={Logo} alt="" />
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="black"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
              vertical:"bottom",
              horizontal:"left",
              }}
              keepMounted
              transformOrigin={{
              vertical:"top",
              horizontal:"left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
              display:{xs:"block",md:"none"},
              }}
            >
          
          <MenuItem  onClick={()=>{
            navigate('/')
            handleCloseNavMenu()}}>
                <Typography textAlign="center">Find Jobs</Typography>
              </MenuItem><MenuItem  onClick={handleCloseNavMenu}>
                <Typography textAlign="center">Company Review</Typography>
              </MenuItem>
        
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md:"none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr:2,
              display:{xs:"flex",md:"none"},
              flexGrow:1,
              fontFamily:"monospace",
              fontWeight:700,
              letterSpacing:".3rem",
              color:"black",
              textDecoration:"none",
            }}
          >
            <img width={100} src={Logo} alt=""/>
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs:"none", md: "flex" } }}>
            <Link
              component="button"
              variant="body2"
              underline="none"
              onClick={()=>{
                navigate('/')
                handleCloseNavMenu()
              }
                 }
              sx={{ my: 2, color: "black", display: "block" }}
            >
              Find Jobs
            </Link>
            {/* <Link
              component="button"
              variant="body2"
              underline="none"
              onClick={handleCloseNavMenu}
              sx={{ marginLeft: 2, color: "black", display: "block" }}
            >
            Company Review
            </Link> */}
          </Box>
          {seeker ? (
            <Box sx={{ flexGrow: 0.01 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Typography>{seeker?.email}</Typography>
                  {" "}
                </IconButton>
                
              </Tooltip>
             
              <IconButton onClick={()=>navigate('/messages')}>
                <ChatIcon/>
              </IconButton>
              <IconButton onClick={()=>navigate('/notifications')}>
                <Badge color="primary" badgeContent={unreadNotifications?.length}> 
                <NotificationsActiveIcon/>
                </Badge>
              </IconButton>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical:"top",
                  horizontal:"right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}  
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleProfile}>
                  <ManageAccountsIcon></ManageAccountsIcon>
                  <Typography textAlign="center">{"Profile"}</Typography>
                </MenuItem>      
                <MenuItem onClick={()=>navigate('/myjobs')}>
                  <FavoriteIcon/>
                  <Typography textAlign="center">{"My Jobs"}</Typography>
                </MenuItem>
                <MenuItem onClick={()=>navigate('/join')}>
                  <VideoCallIcon/>
                  <Typography textAlign="center">{"Join Meet"}</Typography>
                </MenuItem>
                 
                <MenuItem onClick={handleLogout}>
                  <PowerSettingsNewIcon></PowerSettingsNewIcon>
                  <Typography textAlign="center">
                    {" "}
                    {"Logout"}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseUserMenu}></MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box sx={{ flexGrow: 0.05, display: { xs: "none", md: "flex" } }}>
              <Button
                onClick={()=>navigate('/login')}
                variant="body1"
                underline="none"
                sx={{ my: 2, color: "blue", display: "block" }}
              >
                Sign In
              </Button>
            </Box>
          )}
          <Divider
            sx={{ marginRight: 2 }}
            orientation="vertical"
            variant="middle"
            flexItem
          />
          
          <Box sx={{ flexGrow: 0, display: { xs: "none", md: "flex" } }}>
            <Button
              target="_blank"
              component={Button}
              variant="body2"
              underline="none"
              onClick={() =>{
                navigate('/emp-login')

              }}
              sx={{ my:2,color:"black",display:"block" }}
            >
              Employers/Post Job

            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
