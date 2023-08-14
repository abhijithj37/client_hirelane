import React, { useEffect, useState } from "react";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import {
  Box,
  Container,
  Toolbar,
  Typography,
  Grid,
Button
} from "@mui/material";
import axios from "../../axios";
import { useSelector } from "react-redux";
import {  useNavigate } from "react-router-dom";

const Interviews = () => {
  const { employer } = useSelector((state) => state.employer);
  const navigate=useNavigate()
  const [tabValue, setTabValue] = useState("1");
  const [interviews, setInterviews] = useState([]);

  const tabChange = (e, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    axios
      .get(`applications/emp-interviews/${employer?._id}`, {
        withCredentials: true,
      })
      .then(({ data }) => {
        setInterviews(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: (theme) => theme.palette.common.white,
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
      }}
    >
      <Toolbar />
      {/* *****************************InterviewModal******************************************* */}

      {/***********************************************************************InterviewModal*******************************************************************************/}

      <Container>
        <Grid container rowGap={3} paddingTop={4} border={0}>
          <Grid item width={"100%"}>
            <Typography letterSpacing={1.7} fontWeight={700} variant="h4">
              Interviews
            </Typography>
          </Grid>
          {/* ******************************************************************************************************************************************************* */}

          <Grid item width={"100%"}>
            <Box sx={{ width: "100%", typography: "body1" }}>
              <TabContext value={tabValue}>
                <Box sx={{ borderBottom: 1, borderColor: "black" }}>
                  <TabList
                    onChange={tabChange}
                    aria-label="lab API tabs example"
                  >
                    <Tab label="Candidates" value="1" />
                    {/* <Tab label="Interviews" value="3" /> */}
                  </TabList>
                </Box>

                <TabPanel value="1">
                  <TableContainer component={Box}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Candidate</TableCell>
                          <TableCell align="left">Job title</TableCell>
                          <TableCell align="left">Interview Mode</TableCell>
                          <TableCell align="left">Date</TableCell>
                          <TableCell align="left">Time-Range</TableCell>
                          <TableCell align="left">Status</TableCell>
                          <TableCell align="left">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {interviews.map((element, index) => (
                          <TableRow
                            key={element._id}
                            sx={{
                              "&:last-child td,&:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              <Box display={"flex"}>
                                <Box marginLeft={1}>
                                  <Typography fontWeight={600}>
                                    {" "}
                                    {element.candidateName}
                                  </Typography>
                                  <Typography variant="body2" color={"gray"}>
                                    {" "}
                                    {element.candidateId}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell align="left">
                              <Typography fontWeight={500}>
                                {element.jobTitle}
                              </Typography>{" "}
                            </TableCell>
                            <TableCell align="left">
                              {element.interviewMode}
                            </TableCell>
                            <TableCell align="left">
                              {new Date(element.date).toLocaleDateString(
                                "en-US",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </TableCell>
                            <TableCell align="left">
                              {new Date(element.startTime).toLocaleTimeString()}{" "}
                              - {new Date(element.endTime).toLocaleTimeString()}
                            </TableCell>
                            <TableCell align="left">
                              <Box
                                borderRadius={1}
                                display={"flex"}
                                justifyContent={"center"}
                                alignItems={"center"}
                                bgcolor={
                                  element?.status === "Hired"
                                    ? "lightgreen"
                                    :element?.status === "Pending"? "blueviolet":'red'
                                }
                                maxWidth={80}
                                maxHeight={30}
                                padding={0.5}
                              >
                                <Typography
                                  fontWeight={600}
                                  variant="caption"
                                  color={"white"}
                                >
                                  {element?.status}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="left">
                              <Typography
                                component={Button}
                                sx={{ textDecoration: "none" }}
                                variant="body2"
                                color={"gray"}
                                onClick={()=>navigate(`/emp/interviewDetails/${element.applicationId}`)}
                              >
                                more...
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </TabPanel>
                <TabPanel value="2">
                   
                  Saved
                </TabPanel>
                <TabPanel value="3">Interviews</TabPanel>
              </TabContext>
            </Box>
          </Grid>
          {/* ********************************************************************************************************************************************************** */}
        </Grid>
      </Container>
    </Box>
  );
};

export default Interviews;
