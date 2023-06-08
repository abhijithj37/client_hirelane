import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Toolbar,
  Grid,
  Typography,
  Avatar,
  Modal,
  Button,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

import axios from "../../axios";
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
import Paper from "@mui/material/Paper";
import { MoreHoriz } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useSelector } from "react-redux";
import { handleSendNotification } from "../../Utils/api";
import { useSocket } from "../../Context/SocketProvider";

function Applicants() {
  const { employer } = useSelector((state) => state.employer);
  const socket = useSocket();
  const [shortListed, setShortListed] = useState([]);
  const [tabValue, setTabValue] = useState("1");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [interviewMode, setInterviewMode] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const tabChange = (e, newValue) => {
    setTabValue(newValue);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOptionClick = (e,data) => {
    setSelectedCandidate(data);
    setAnchorEl(e.currentTarget);
  };

  // *****************************InterviewModal*******************************************

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setError("");
    setOpen(false);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 2,
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const handleUpdateStatus = (status) => {
    const data = {
      status,
      applicationId: selectedCandidate?._id,
      employerId: employer?._id,
    };

    axios
      .put("/applications/update-status", data, { withCredentials: true })
      .then(({ data }) => {
        window.alert(`Candidate Status updated`);
        setShortListed(data.filter((app) => app.status === "Shortlisted"));
        handleMenuClose();
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleSheduleInterview = (e) => {
    e.preventDefault();
    console.log(interviewMode);
    if (!startTime || !endTime) {
      return setError("Time Duration is required");
    }

    if (interviewMode === "") {
      return setError("Please Select an Interview Mode");
    }
 
    setError("");
    const data = {
      candidateId: selectedCandidate?.candidateId,
      candidateName: selectedCandidate?.fName + " " + selectedCandidate?.lName,
      companyName: selectedCandidate?.companyName,
      employerID: employer?._id,
      date,
      startTime,
      endTime,
      location,
      jobTitle: selectedCandidate?.jobTitle,
      interviewMode,
      applicationId: selectedCandidate?._id,
    };

    axios
      .post("/applications/interview", data, { withCredentials: true })
      .then(({ data }) => {
        const content = `Your interview for the position of ${
          selectedCandidate?.jobTitle
        } at ${selectedCandidate?.companyName} has been scheduled on ${new Date(
          date
        ).toLocaleDateString("en-us", {day:'numeric',month:'long',year:'numeric'})}`;
        handleUpdateStatus("Interview-Sheduled");
        handleSendNotification(
          selectedCandidate?.companyName,
          selectedCandidate?.candidateId,
          content,
          socket
        );
        handleClose();
        handleMenuClose();
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  //**********************************************************************************InterviewModal**********************************************************************************************************

  useEffect(() => {
    axios
      .get(`/applications/emp-applications`, { withCredentials: true })
      .then(({ data }) => {
        setShortListed(data.filter((app) => app.status === "Shortlisted"));
      })
      .catch((err) => {
        console.log(err.message);
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

      {selectedCandidate && (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} borderRadius={2}>
            <Box borderBottom={1} borderColor={"lightgray"}>
              <Typography variant="h5">Shedule Interview</Typography>
              <Typography>
                Candidate name :{" "}
                {selectedCandidate?.fName + " " + selectedCandidate?.lName}
              </Typography>

              <Typography>Job title : {selectedCandidate?.jobTitle}</Typography>
            </Box>
            <form onSubmit={handleSheduleInterview}>
              <Box marginTop={2}>
                <Typography color={"error"}>{error}</Typography>
                <Typography variant="body2" fontWeight={500} color={"gray"}>
                  Select a date
                </Typography>
                <TextField
                  margin="normal"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  type="date"
                  fullWidth
                />
              </Box>
              <Box marginTop={2}>
                <Typography
                  gutterBottom
                  variant="body2"
                  fontWeight={500}
                  color={"gray"}
                >
                  Time duration
                </Typography>
                <Box marginTop={1}>
                  <TimePicker
                    onChange={(newTime) => setStartTime(newTime)}
                    value={startTime}
                    sx={{ width: "100%" }}
                    label="Start time"
                  />

                  <TimePicker
                    sx={{ width: "100%", marginTop: 1 }}
                    label="End  time"
                    onChange={(newTime) => setEndTime(newTime)}
                    value={endTime}
                  />
                </Box>

                <Box marginTop={2}>
                  <Typography
                    gutterBottom
                    variant="body2"
                    fontWeight={500}
                    color={"gray"}
                  >
                    Interview Mode
                  </Typography>

                  <FormControl required component="fieldset">
                    <RadioGroup name="mode">
                      <FormControlLabel
                        value="video-Call"
                        defaultChecked
                        control={<Radio />}
                        label="Video Call"
                        onChange={(e) => setInterviewMode(e.target.value)}
                      />
                      <FormControlLabel
                        value="In-Person"
                        control={<Radio />}
                        label="In-Person"
                        onChange={(e) => setInterviewMode(e.target.value)}
                      />
                    </RadioGroup>
                  </FormControl>
                  {interviewMode === "In-Person" && (
                    <FormControl fullWidth>
                      <TextField
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                        name="location"
                        label="Location"
                      />
                    </FormControl>
                  )}
                </Box>
              </Box>

              <Box
                display={"flex"}
                justifyContent={"space-between"}
                marginTop={2}
              >
                <Button color="primary" variant="contained" type="submit">
                  Shedule
                </Button>
                <Button onClick={() => handleClose()}>Cancel</Button>
              </Box>
            </form>
          </Box>
        </Modal>
      )}

      {/***********************************************************************InterviewModal*******************************************************************************/}

      <Container>
        <Grid container rowGap={3} paddingTop={4} border={0}>
          <Grid item width={"100%"}>
            <Typography letterSpacing={1.7} fontWeight={700} variant="h4">
              Candidates
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
                    <Tab label="Shortlisted" value="1" />
                    <Tab label="Saved" value="2" />
                  </TabList>
                </Box>

                <TabPanel value="1">
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Candidate Name</TableCell>

                          <TableCell align="left">Job title</TableCell>
                          <TableCell align="left">Applied on</TableCell>
                          <TableCell align="left">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {shortListed.map((element, index) => (
                          <TableRow
                            key={element._id}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              <Box display={"flex"}>
                                <Avatar
                                  src={`http://localhost:4001/image/${element.image}`}
                                ></Avatar>
                                <Box marginLeft={1}>
                                  <Typography fontWeight={600}>
                                    {" "}
                                    {element.fName + " " + element.lName}
                                  </Typography>
                                  <Typography> {element.email}</Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell align="left">
                              {element.jobTitle}
                            </TableCell>
                            <TableCell align="left">
                              {new Date(element.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </TableCell>
                            <TableCell align="left">
                              <Box>
                                <IconButton
                                  aria-controls="options-menu"
                                  aria-haspopup="true"
                                  onClick={(e) => handleOptionClick(e, element)}
                                >
                                  <MoreHoriz />
                                </IconButton>
                                <Menu
                                  id="options-menu"
                                  anchorEl={anchorEl}
                                  open={Boolean(anchorEl)}
                                  onClose={handleMenuClose}
                                >
                                  <MenuItem
                                    onClick={() =>
                                      navigate(
                                        `/employer/candidateInfo/${selectedCandidate?._id}`
                                      )
                                    }
                                  >
                                    View Details
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() => {
                                      handleOpen();
                                    }}
                                  >
                                    {" "}
                                    Shedule interview
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() => {
                                      handleUpdateStatus("Applied");
                                    }}
                                  >
                                    Remove from shortlist
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() => {
                                      handleUpdateStatus("Rejected");
                                    }}
                                  >
                                    Reject candidate
                                  </MenuItem>
                                </Menu>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </TabPanel>
                <TabPanel value="2">
                  {/* <Box marginTop={2}>
                    <Typography
                      fontWeight={600}
                      sx={{ opacity: 0.7 }}
                      variant="h6"
                    >
                      Last 14 Days
                    </Typography>
                    <Divider sx={{ marginTop: 1 }} />
                  </Box> */}
                  Saved
                </TabPanel>
              </TabContext>
            </Box>
          </Grid>
          {/* ********************************************************************************************************************************************************** */}
        </Grid>
      </Container>
    </Box>
  );
}

export default Applicants;
