import React from 'react'
import { AppBar } from "@mui/material";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import AdbIcon from "@mui/icons-material/Adb";
import Logo from "../../images/logo.png";
import Divider from "@mui/material/Divider";
function TopBar() {
  return (
    <AppBar position="static" sx={{ background: "white" }}>
    <Container maxWidth="xl">
      <Toolbar disableGutters>
        <AdbIcon sx={{ display:{ xs:"none",md:"flex"}, mr:1}} />
        
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
            textDecoration: "none",
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
            color="black"
          >
            <MenuIcon />
          </IconButton>
        </Box>
        <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />

        <Typography
          variant="h5"
          noWrap
          component="a"
          href=""
          sx={{
            mr: 2,
            display: { xs: "flex", md: "none" },
            flexGrow: 1,
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: ".3rem",
            color: "black",
            textDecoration: "none",
          }}
        >

          <img width={100} src={Logo} alt="" />
        </Typography>

        <Box
          sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
        ></Box>

        <Box sx={{ flexGrow: 0.0, display: { xs: "none", md: "flex" } }}>
          <Button
            variant="body1"
            underline="none"
            size="large"
            sx={{ my: 2, color: "gray", display: "block" }}
          >

            {new Date().toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </Button>
        </Box>

        <Divider
          sx={{ marginRight: 2 }}
          orientation="vertical"
          variant="middle"
          flexItem
        />

        <Box sx={{ flexGrow: 0, display: { xs: "none", md: "flex" } }}>
          <Box sx={{ my: 2, color: "black", display: "block" }}>
            {new Date().toLocaleTimeString()}
          </Box>
        </Box>
      </Toolbar>
    </Container>
  </AppBar>
  )
}

export default TopBar
