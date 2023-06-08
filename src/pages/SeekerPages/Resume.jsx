import React from "react";
import {
  Container,
  Grid,
  Typography,
   Paper,
  Avatar,
  Box,
  Divider,
  Stack,
  IconButton
} from "@mui/material";

import Header from "../../Components/userComponents/Header";
import { useSelector } from "react-redux";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import EmailIcon from "@mui/icons-material/Email";
import DateRangeIcon from "@mui/icons-material/DateRange";
import EditIcon from '@mui/icons-material/Edit';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";



    function Resume() {
    const navigate=useNavigate()
    const { seeker } = useSelector((state) => state.seeker);


    const downloadPdf = () => {
        const input = document.getElementById("resume");
        html2canvas(input).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF();
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          pdf.addImage(imgData,"PNG",10,10,pdfWidth,pdfHeight);

          pdf.save("resume.pdf");

        });
      };
      

    return (
        <>
        <Header></Header>
        <Container  sx={{ paddingTop: 1 }} maxWidth="md">
            <Paper  elevation={3} sx={{ width: "100%", minHeight: "100vh" }}>
             <IconButton onClick={downloadPdf}><SaveAltIcon/></IconButton>
             <IconButton onClick={()=>navigate('/profile')} ><EditIcon/></IconButton>
            <div id="resume">

            <Grid container columnSpacing={3} padding={3}>
                {/* *********************************************ITEM 1**************************************************************** */}
                <Grid  item container border={0} lg={12}>
                <Grid item lg={2}>
                    {seeker.image!=="" ? (
                    <Avatar
                        sx={{ width: 100, height: 100 }}
                        src={`http://localhost:4001/image/${seeker.image}`}
                    ></Avatar>
                    ) : (
                    <Avatar
                        sx={{ width: 100, height: 100, bgcolor: "green" }}
                        variant="square"
                    >
                        <Typography variant="h4">{seeker.fName[0]}</Typography>
                    </Avatar>
                    )}
                </Grid>
                <Grid item lg={10}>
                    <Typography color={"primary"} variant="h4">
                    {seeker.fName} {seeker.lName}
                    </Typography>
                </Grid>
                </Grid>
                {/* *********************************************ITEM 2**************************************************************** */}

                <Grid item container marginTop={1} border={0} lg={12}>
                <Grid item lg={2}>
                    <Typography fontSize={"18px"} variant="h6">
                    Personal Information
                    </Typography>
                </Grid>
                <Grid item lg={10}>
                    <Box display={"flex"}>
                    <LocationOnIcon color="blue" fontSize="small" />
                    <Typography
                        letterSpacing={1}
                        sx={{ opacity: 0.9 }}
                        variant="body2"
                    >
                        {seeker.street},{seeker.city} {seeker.pinCode},
                        {seeker.country}
                    </Typography>
                    </Box>
                    <Box display={"flex"}>
                    <PhoneAndroidIcon fontSize="small" />
                    <Typography
                        letterSpacing={1}
                        sx={{ opacity: 0.9 }}
                        variant="body2"
                    >
                        {seeker.phoneNo}
                    </Typography>
                    </Box>
                    <Box display={"flex"}>
                    <EmailIcon fontSize="small" />
                    <Typography
                        letterSpacing={1}
                        sx={{ opacity: 0.9 }}
                        variant="body2"
                    >
                        {seeker.email}
                    </Typography>
                    </Box>
                    <Box sx={{color:"blue"}} marginTop={1.5}>
                    <Divider sx={{bgcolor:"blue"}} />
                    </Box>
                </Grid>
                </Grid>
                {/* *********************************************Grid Item 3**************************************************************** */}
                <Grid item container marginTop={1} border={0} lg={12}>
                <Grid item lg={2}>
                    <Typography letterSpacing={1} fontSize={"18px"} variant="h6">
                    Profile
                    </Typography>
                </Grid>
                <Grid item lg={10}>
                    <Box sx={{wordWrap:'break-word'}}>
                    <Typography color={"gray"} variant="body2">
                        {seeker.about}
                    </Typography>
                    </Box>

                    <Box sx={{ color: "blue" }} marginTop={1.5}>
                    <Divider sx={{ bgcolor: "blue" }} />
                    </Box>
                </Grid>
                </Grid>
                {/* ***********************************************************************************Grid Item 3**************************************************************** */}
                {seeker?.workExperience.map((exp,index)=>{
                    return (
                    <Grid item container marginTop={1} border={0} lg={12}>
                        { index===0?
                        <Grid item lg={2}>
                        <Typography letterSpacing={1} fontSize={"18px"} variant="h6">
                            Work Experience
                        </Typography>
                        </Grid>:<Grid item lg={2}>
                        
                        </Grid>}
                
                

                
                <Grid item lg={10}>
                    <Box>
                    <Typography color={"black"} fontSize={"16px"} variant="h6">
                        {exp.jobTitle}
                    </Typography>
                    </Box>
                    <Box>
                    <Typography color={"black"} fontSize={"14px"} variant="h5">
                        {exp.companyName}
                    </Typography>
                    </Box>
                    <Box display={"flex"}>
                    <DateRangeIcon sx={{ color: "gray" }} fontSize="small" />
                    <Typography color={"primary"} variant="body2">
                        {exp.from}  --  {exp.to}
                    </Typography>
                    </Box>
                    <Box sx={{wordWrap:'break-word'}}>
                    <Typography color={"gray"} variant="body2">
                        {exp.description}
                    </Typography>
                    </Box>
                {index>0&&<Box sx={{ color: "blue" }} marginTop={1.5}>
                    <Divider sx={{ bgcolor: "blue" }} />
                    </Box>}
                    
                </Grid>
                    

                </Grid>
                )
                    })}
                {/* ***********************************************************************************Grid Item 4**************************************************************** */}
                {seeker.education.map((ed,index)=>{
                return( 
                <Grid item container marginTop={1} border={0} lg={12}>
                    {index===0?<Grid item lg={2}>
                    <Typography letterSpacing={1} fontSize={"18px"} variant="h6">
                    Education
                    </Typography>
                </Grid>:<Grid item lg={2}>
                    
                </Grid>}
                

                
                <Grid item lg={10}>
                    <Stack
                    direction={"row"}
                    spacing={2}
                    divider={<Divider orientation="vertical" flexItem/>}
                    >
                    <Typography color={"black"} fontSize={"16px"} variant="h6">
                    {ed.fieldOfStudy}
                    </Typography>
                    <Typography
                        sx={{opacity:0.7}}
                        color={"black"}
                        fontSize={"16px"}
                        variant="h6"
                    >
                        {ed.institutionName}
                    </Typography>
                    </Stack>
                    <Box display={"flex"}>
                    <DateRangeIcon sx={{ color: "gray" }} fontSize="small" />
                    <Typography color={"primary"} variant="body2">
                        {ed.from}  -- {ed.to}
                    </Typography>
                    </Box>
                    <Box sx={{wordWrap:'break-word'}}>
                    <Typography color={"gray"} variant="body2">
                        {ed.description}
                    </Typography>
                    </Box>
                    {index>0&&<Box sx={{ color: "blue" }} marginTop={1.5}>
                    <Divider sx={{ bgcolor: "blue" }} />
                    </Box>}
                    
                </Grid>
                </Grid>
            )})}

                {/* ***********************************************************************************Grid Item 4**************************************************************** */}
                <Grid item container marginTop={1} border={0} lg={12}>
                <Grid item lg={2}>
                    <Typography letterSpacing={1} fontSize={"18px"} variant="h6">
                    Skills
                    </Typography>
                </Grid>
                <Grid item lg={10}>
                    <ul>
                        {seeker.skills.map((skill)=>{
                            return <li>{skill}</li>
                        })}
                    </ul>
                </Grid>
                </Grid>

                {/* *************************************************************************************Container Close**************************************************************** */}
            </Grid>
            </div>

            </Paper>
        </Container>
        </>
    );
    }

    export default Resume;
    

