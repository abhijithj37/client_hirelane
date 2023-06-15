import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  Grid,
  Avatar,
  Typography,
  Divider,
  Button,
  TextField,
  Box,
  Chip,
  IconButton,
  Paper,
  Stack,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";
import { AddCircle } from "@mui/icons-material";
import Header from "../../Components/userComponents/Header";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useSelector, useDispatch } from "react-redux";
import SchoolIcon from "@mui/icons-material/School";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import PsychologyIcon from "@mui/icons-material/Psychology";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import { setSeeker } from "../../app/features/seekerSlice";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import EmailIcon from "@mui/icons-material/Email";
import DateRangeIcon from "@mui/icons-material/DateRange";
import EditIcon from "@mui/icons-material/Edit";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../Utils/firebase";

function BuildResume() {
  const navigate = useNavigate();
  const { seeker } = useSelector((state) => state.seeker);
  const dispatch = useDispatch();
  const [fName, setFname] = useState(seeker.fName);
  const [lName, setLname] = useState(seeker.lName);
  const [phoneNo, setPhoneNo] = useState(seeker.phoneNo);
  const [street, setStreet] = useState(seeker.street);
  const [pinCode, setPinCode] = useState(seeker.pinCode);
  const [city, setCity] = useState(seeker.city);
  const [country, setCountry] = useState(seeker.country);
  const [about, setAbout] = useState(seeker.about);
  const [showEdit, setShowEdit] = useState(seeker.modified ? false : true);
  const [showCv, setShowCv] = useState(seeker.modified ? true : false);
  const [isLoading, setLoading] = useState(false);
  const [cvUrl, setCvUrl] = useState("");
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const cvRef = useRef(null);
  const [education, setEducation] = useState(
    seeker.education.length > 0
      ? seeker.education
      : [
          {
            institutionName: "",
            fieldOfStudy: "",
            description: "",
            from: "",
            to: "",
          },
        ]
  );
  const [image, setImage] = useState(seeker.image);
  const [imagePreview, setImagePreview] = useState("");
  const [workExperience, setWorkExperience] = useState(
    seeker.workExperience.length > 0
      ? seeker.workExperience
      : [
          {
            companyName: "",
            jobTitle: "",
            description: "",
            from: "",
            to: "",
          },
        ]
  );
  const [skills, setSkills] = useState(seeker.skills);
  const [skill, setSkill] = useState("");

  const addEducation = () => {
    setEducation([
      ...education,
      {
        institutionName: "",
        fieldOfStudy: "",
        description: "",
        from: "",
        to: "",
      },
    ]);
  };
  const addWorkExperience = () => {
    setWorkExperience([
      ...workExperience,
      {
        companyName: "",
        jobTitle: "",
        description: "",
        from: "",
        to: "",
      },
    ]);
  };

  const addSkills = (skill) => {
    if (skill === "") return;
    if (skills.includes(skill.trim())) return;
    setSkills([...skills, skill]);
    setSkill("");
  };

  const handleDeleteSkill = (index) => {
    setSkills(skills.filter((s, i) => i !== index));
  };

  const deleteEducation = (index) => {
    setEducation(education.filter((ed, i) => i !== index));
  };
  const deleteWorkExperience = (index) => {
    setWorkExperience(workExperience.filter((exp, i) => i !== index));
  };

  const handleInstitutionNameChange = (name, index) => {
    setEducation((prevEducation) => {
      const updatedEducation = [...prevEducation];
      updatedEducation[index] = {
        ...updatedEducation[index],
        institutionName: name,
      };
      return updatedEducation;
    });
  };
  const handleFeildOfStudyChange = (name, index) => {
    setEducation((prevEducation) => {
      const updatedEducation = [...prevEducation];
      updatedEducation[index] = {
        ...updatedEducation[index],
        fieldOfStudy: name,
      };
      return updatedEducation;
    });
  };

  const handleJobTitleChange = (title, index) => {
    setWorkExperience((prevExperience) => {
      const updatedExp = [...prevExperience];
      updatedExp[index] = { ...updatedExp[index], jobTitle: title };
      return updatedExp;
    });
  };
  const handleJobDescriptionChange = (des, index) => {
    setWorkExperience((prevExperience) => {
      const updatedExp = [...prevExperience];
      updatedExp[index] = { ...updatedExp[index], description: des };
      return updatedExp;
    });
  };
  const handleEducationDescriptionChange = (des, index) => {
    setEducation((prevEducation) => {
      const updatedEducation = [...prevEducation];
      updatedEducation[index] = {
        ...updatedEducation[index],
        description: des,
      };
      return updatedEducation;
    });
  };

  const handleCompanyNameChange = (name, index) => {
    setWorkExperience((prevExperience) => {
      const updatedExp = [...prevExperience];
      updatedExp[index] = { ...updatedExp[index], companyName: name };
      return updatedExp;
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleEducationDateChange = (e, index, field) => {
    const { value } = e.target;
    const updatedEducation = [...education];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    setEducation(updatedEducation);
  };

  const handleExperienceDateChange = (e, index, field) => {
    const { value } = e.target;
    const updateExperience = [...workExperience];
    updateExperience[index] = { ...updateExperience[index], [field]: value };
    setWorkExperience(updateExperience);
  };
  const generatePdf = () => {
    return new Promise((resolve, reject) => {
      const input = document.getElementById("resume");
      console.log(input, "the input");
      const pdf = new jsPDF();

      html2canvas(input)
        .then(async (canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);
          resolve(pdf);
        })
        .catch((err) => console.log(err));
    });
  };

  const downlodPdf = async () => {
    const pdf = await generatePdf();
    pdf.save(`${seeker.fName}${seeker.lName}CV.pdf`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setShowCv(true);
    setLoading(true);
  };

  useEffect(() => {
    (async () => {

      if(isLoading){
        const formBody = new FormData();
        const pdf = await generatePdf();
        const pdfBlob = pdf.output("blob");
        const fileRef = ref(storage,`cv/${seeker.fName}${seeker._id}CV.pdf`);
        await uploadBytes(fileRef, pdfBlob).catch((err) => console.log(err));
        const url = await getDownloadURL(fileRef).catch((err) =>
        console.log(err)
        );

        formBody.append("cvUrl", url);
        formBody.append("fName", fName);
        formBody.append("lName", lName);
        formBody.append("image", image);
        formBody.append("phoneNo", phoneNo);
        formBody.append("about", about);
        formBody.append("city", city);
        formBody.append("country", country);
        formBody.append("pinCode", pinCode);
        formBody.append("street", street);
        const data = {
          workExperience,
          education,
          skills,
          cvUrl,
        };

        formBody.append("data", JSON.stringify(data));
        axios
          .put("/seeker/updateProfile", formBody, {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
            data: data,
          })
          .then(({ data }) => {
            dispatch(setSeeker(data.seeker));
            setShowEdit(false);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err.message);
          });
      }
    })();
  }, [isLoading]);

  return (
    <>
      <Header></Header>
      {showEdit && (
        <Container maxWidth="md">
          <Backdrop
            open={isLoading}
            style={{
              zIndex: 9999,
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          >
            <CircularProgress color="inherit" />
            </Backdrop>

          {/****************************************************************************************************************************Main Container after Header*********************************************************************************************** */}

          <form onSubmit={handleSubmit}>
            <Grid
              container
              borderRadius={1}
              sx={{ borderColor: "lightgray" }}
              border={1}
              margin={1}
              spacing={2}
              paddingLeft={8}
            >
              {/**********************************************************************************Opening Grid Container******************************************************************** */}
              {/**********************************************************************************Grid ITem 1******************************************************************** */}
              <Grid
                item
                display={"flex"}
                justifyContent={"space-between"}
                color={"darkgray"}
                lg={12}
              >
              <Box display={"flex"}>
                  <PersonOutlineIcon fontSize="large" />
                  <Typography
                    marginTop={1}
                    marginLeft={1}
                    color={"#3f3f3f"}
                    fontSize={"18px"}
                    variant="h6"
                  >
                    {" "}
                    Personal Information
                  </Typography>
                </Box>
              </Grid>
              {/**********************************************************************************Grid ITem 1 Close******************************************************************** */}
              {/**********************************************************************************Grid ITem 2******************************************************************** */}

              <Grid container item lg={12}>
                <Grid item lg={2} border={0}>
                  {/* {imagePreview ? (
                    <Avatar
                      src={imagePreview}
                      sx={{ bgcolor: "green", width: 80, height: 80 }}
                    ></Avatar>
                  ) : seeker.image ? (
                    <Avatar
                      src={`https://fashionbytes.online/seeker/image/${image}`}
                      sx={{ bgcolor: "green", width: 80, height: 80 }}
                    ></Avatar>
                  ) : (
                    <Avatar sx={{ bgcolor: "green", width: 80, height: 80 }}>
                      {seeker.fName[0]}
                    </Avatar>
                  )}

                  <Button
                    size="small"
                    sx={{ marginTop: 1 }}
                    variant="contained"
                    component="label"
                  >
                    Change
                    <input
                      onChange={handleImageChange}
                      hidden
                      accept="image/*"
                      multiple
                      type="file"
                    />
                  </Button> */}
                </Grid>

                <Grid container item spacing={2} border={0} lg={10}>
                  <Grid item lg={5}>
                    <TextField
                      fullWidth
                      label="First Name"
                      type="text"
                      size="small"
                      value={fName}
                      onChange={(e) => setFname(e.target.value)}
                      required
                    />
                  </Grid>

                  <Grid item lg={5}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      type="text"
                      size="small"
                      value={lName}
                      onChange={(e) => setLname(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item lg={5}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      type="number"
                      size="small"
                      value={phoneNo}
                      onChange={(e) => setPhoneNo(e.target.value)}
                      required
                    />
                  </Grid>

                  <Grid item lg={5}>
                    <TextField
                      aria-readonly
                      fullWidth
                      label="Email"
                      value={seeker.email}
                      type="email"
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Grid>
              {/**********************************************************************************Grid ITem 2 closed******************************************************************** */}
              {/**********************************************************************************Grid ITem 3 Open******************************************************************** */}

              <Grid item container spacing={2} lg={12}>
                <Grid item lg={12}>
                  <Typography fontSize={"small"} color={"gray"}>
                    Address
                  </Typography>
                  <Divider></Divider>
                </Grid>
                <Grid item lg={5.2}>
                  <TextField
                    fullWidth
                    label="Street Address"
                    size={"small"}
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                  ></TextField>
                </Grid>
                <Grid item lg={5.2}>
                  <TextField
                    fullWidth
                    label="Postal Code"
                    size={"small"}
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                  ></TextField>
                </Grid>
                <Grid item lg={5.2}>
                  <TextField
                    fullWidth
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    label="City"
                    size={"small"}
                  ></TextField>
                </Grid>
                <Grid item lg={5.2}>
                  <TextField
                    fullWidth
                    label="Country"
                    size={"small"}
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  ></TextField>
                </Grid>
              </Grid>
              {/*******************************************************************************Grid item address 3 Closed*****************************************************************************/}
              <Grid item lg={12}>
                <Typography fontSize={"small"} color={"gray"}>
                  About
                </Typography>
                <Divider></Divider>
                <TextField
                  sx={{ width: "86%", marginTop: 1 }}
                  multiline
                  rows={3}
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                ></TextField>
              </Grid>
              {/*******************************************************************************Grid item about 4 Closed*****************************************************************************/}

              <Grid item display={"flex"} color={"darkgray"} lg={12}>
                <SchoolIcon fontSize="large" />
                <Typography
                  marginTop={1}
                  marginLeft={1}
                  color={"#3f3f3f"}
                  fontSize={"18px"}
                  variant="h6"
                >
                  {" "}
                  Education
                </Typography>
                <IconButton onClick={addEducation}>
                  <AddCircle />
                </IconButton>
              </Grid>
              {education.map((ed, index) => {
                return (
                  <Grid key={index} container spacing={1} item lg={12}>
                    {index !== 0 && (
                      <Grid item display={"flex"} lg={10}>
                        <Typography marginTop={1}>
                          Education # {index + 1}
                        </Typography>
                        <IconButton onClick={() => deleteEducation(index)}>
                          <DoDisturbOnIcon color="error" fontSize="small" />
                        </IconButton>
                        <Divider></Divider>
                      </Grid>
                    )}
                    <Grid item lg={5.2}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Institution Name"
                        value={ed.institutionName}
                        onChange={(e) =>
                          handleInstitutionNameChange(e.target.value, index)
                        }
                        required
                      ></TextField>
                    </Grid>
                    <Grid item lg={5.2}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Field Of Study"
                        value={ed.fieldOfStudy}
                        required
                        onChange={(e) =>
                          handleFeildOfStudyChange(e.target.value, index)
                        }
                      ></TextField>
                    </Grid>

                    <Grid item lg={10.4}>
                      <Typography fontSize={"small"} color={"gray"}>
                        Time Period
                      </Typography>
                      <Divider></Divider>
                    </Grid>
                    <Grid item lg={5.2}>
                      <TextField
                        onChange={(e) =>
                          handleEducationDateChange(e, index, "from")
                        }
                        value={ed.from}
                        required
                        helperText="From"
                        size="small"
                        fullWidth
                        type="date"
                      ></TextField>
                    </Grid>
                    <Grid item lg={5.2}>
                      <TextField
                        required
                        onChange={(e) =>
                          handleEducationDateChange(e, index, "to")
                        }
                        value={ed.to}
                        size="small"
                        helperText="To"
                        fullWidth
                        type="date"
                      ></TextField>
                    </Grid>
                    <Grid item lg={10.4}>
                      <TextField
                        fullWidth
                        label="Discription"
                        placeholder="About Your studies"
                        multiline
                        rows={2}
                        required
                        value={ed.description}
                        onChange={(e) =>
                          handleEducationDescriptionChange(
                            e.target.value,
                            index
                          )
                        }
                      ></TextField>
                    </Grid>
                  </Grid>
                );
              })}

              {/*******************************************************************************Grid ITEM 5 EDUCATION      CLOSED****************************************************************************************************/}
              {/*******************************************************************************Grid ITEM 6 workExperience Opened***********************************************************************************************/}
              <Grid
                item
                display={"flex"}
                justifyContent={"normal"}
                color={"darkgray"}
                lg={12}
              >
                <Box display={"flex"}>
                  <WorkHistoryIcon fontSize="large" />
                  <Typography
                    marginTop={1}
                    marginLeft={1}
                    color={"#3f3f3f"}
                    fontSize={"18px"}
                    variant="h6"
                  >
                    {" "}
                    Work-Experience
                  </Typography>
                </Box>
                <IconButton onClick={addWorkExperience}>
                  <AddCircle />
                </IconButton>
              </Grid>
              {workExperience.map((exp, index) => {
                return (
                  <Grid key={index} container spacing={1} item lg={12}>
                    {index !== 0 && (
                      <Grid item display={"flex"} lg={10}>
                        <Typography marginTop={1}>
                          Work Experience # {index + 1}
                        </Typography>
                        <IconButton onClick={() => deleteWorkExperience(index)}>
                          <DoDisturbOnIcon color="error" fontSize="small" />
                        </IconButton>
                        <Divider></Divider>
                      </Grid>
                    )}
                    <Grid item lg={5.2}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Company Name"
                        value={exp.companyName}
                        required
                        onChange={(e) =>
                          handleCompanyNameChange(e.target.value, index)
                        }
                      ></TextField>
                    </Grid>
                    <Grid item lg={5.2}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Job Title"
                        value={exp.jobTitle}
                        onChange={(e) =>
                          handleJobTitleChange(e.target.value, index)
                        }
                      />
                    </Grid>
                    <Grid item lg={10.4}>
                      <Typography fontSize={"small"} color={"gray"}>
                        Time Period
                      </Typography>
                      <Divider></Divider>
                    </Grid>
                    <Grid item lg={5.2}>
                      <TextField
                        onChange={(e) =>
                          handleExperienceDateChange(e, index, "from")
                        }
                        value={exp.from}
                        required
                        helperText="From"
                        size="small"
                        fullWidth
                        type="date"
                      ></TextField>
                    </Grid>
                    <Grid item lg={5.2}>
                      <TextField
                        onChange={(e) =>
                          handleExperienceDateChange(e, index, "to")
                        }
                        value={exp.to}
                        required
                        size="small"
                        helperText="To"
                        fullWidth
                        type="date"
                      ></TextField>
                    </Grid>
                    <Grid item lg={10.4}>
                      <TextField
                        fullWidth
                        label="Discription"
                        multiline
                        rows={2}
                        required
                        value={exp.description}
                        onChange={(e) =>
                          handleJobDescriptionChange(e.target.value, index)
                        }
                      ></TextField>
                    </Grid>
                  </Grid>
                );
              })}

              {/*******************************************************************************Grid Item WorkExperience Closed*****************************************************************************/}

              {/*******************************************************************************Grid Item skills Open*****************************************************************************/}

              <Grid item display={"flex"} color={"darkgray"} lg={12}>
                <PsychologyIcon fontSize="large" />
                <Typography
                  marginTop={1}
                  marginLeft={1}
                  color={"#3f3f3f"}
                  fontSize={"18px"}
                  variant="h6"
                >
                  {" "}
                  Skills
                </Typography>
              </Grid>
              <Grid item lg={12}>
                <TextField
                  size="small"
                  label="Add Your Skills"
                  onChange={(e) => setSkill(e.target.value)}
                ></TextField>
                <IconButton onClick={() => {
                  addSkills(skill)
                  setSkill('')
                  }}>
                  <AddIcon />
                </IconButton>
              </Grid>
              <Grid container rowGap={1} item lg={10}>
                {skills.map((skill, index) => {
                  return (
                    <Grid key={index} item lg={2}>
                      <Chip
                        label={skill}
                        color="success"
                        onDelete={() => handleDeleteSkill(index)}
                      />
                    </Grid>
                  );
                })}
              </Grid>
              <Grid item display={"flex"} justifyContent={"end"} lg={11}>
                <Button
                  sx={{ marginBottom: 1 }}
                  color="secondary"
                  variant="contained"
                  type="submit"
                >
                  Save
                </Button>
              </Grid>
            </Grid>
            {/*******************************************************************************Grid Container Closed*****************************************************************************/}
          </form>
        </Container>
      )}

      {/* ************************************************************************************************************************************************************************************************ */}

      {showCv && (
        <div style={{ display: "" }}>
          <Container sx={{ paddingTop: 1 }} maxWidth="md">
            {showProgress && (
              <Box sx={{ position: "relative", display: "inline-flex" }}>
                <CircularProgress variant="determinate" value={progress} />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    component={"div"}
                    color="text.secondary"
                  >
                    {progress}
                  </Typography>
                </Box>
              </Box>
            )}
            <Paper elevation={3} sx={{ width: "100%", minHeight: "100vh" }}>
              <IconButton onClick={downlodPdf}>
                <SaveAltIcon />
              </IconButton>
              <IconButton
                onClick={() => {
                  setShowCv(false);
                  setShowEdit(true);
                }}
              >
                <EditIcon />
              </IconButton>
              <div ref={cvRef} id="resume">
                <Grid container columnSpacing={3} padding={3}>
                  {/* *********************************************ITEM 1**************************************************************** */}
                  <Grid item container border={0} lg={12}>
                    <Grid item lg={2}>
                      {/* {seeker.image !== "" ? (
                        <Avatar
                          sx={{ width: 100, height: 100 }}
                          src={`https://fashionbytes.online/seeker/image/${seeker.image}`}
                        ></Avatar>
                      ) : (
                        <Avatar
                          sx={{ width: 100, height: 100, bgcolor: "green" }}
                          variant="square"
                        >
                          <Typography variant="h4">
                            {seeker.fName[0]}
                          </Typography>
                        </Avatar>
                      )} */}
                    </Grid>
                    <Grid item lg={10}>
                      <Typography color={"primary"} variant="h4">
                        {fName} {lName}
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
                          {street},{city} {pinCode},{country}
                        </Typography>
                      </Box>
                      <Box display={"flex"}>
                        <PhoneAndroidIcon fontSize="small" />
                        <Typography
                          letterSpacing={1}
                          sx={{ opacity: 0.9 }}
                          variant="body2"
                        >
                          {phoneNo}
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
                      <Box sx={{ color: "blue" }} marginTop={1.5}>
                        <Divider sx={{ bgcolor: "blue" }} />
                      </Box>
                    </Grid>
                  </Grid>
                  {/* *********************************************Grid Item 3**************************************************************** */}
                  <Grid item container marginTop={1} border={0} lg={12}>
                    <Grid item lg={2}>
                      <Typography
                        letterSpacing={1}
                        fontSize={"18px"}
                        variant="h6"
                      >
                        Profile
                      </Typography>
                    </Grid>
                    <Grid item lg={10}>
                      <Box sx={{ wordWrap: "break-word" }}>
                        <Typography color={"gray"} variant="body2">
                          {about}
                        </Typography>
                      </Box>

                      <Box sx={{ color: "blue" }} marginTop={1.5}>
                        <Divider sx={{ bgcolor: "blue" }} />
                      </Box>
                    </Grid>
                  </Grid>
                  {/* ***********************************************************************************Grid Item 3**************************************************************** */}
                  {workExperience.map((exp, index) => {
                    return (
                      <Grid item container marginTop={1} border={0} lg={12}>
                        {index === 0 ? (
                          <Grid item lg={2}>
                            <Typography
                              letterSpacing={1}
                              fontSize={"18px"}
                              variant="h6"
                            >
                              Work Experience
                            </Typography>
                          </Grid>
                        ) : (
                          <Grid item lg={2}></Grid>
                        )}

                        <Grid item lg={10}>
                          <Box>
                            <Typography
                              color={"black"}
                              fontSize={"16px"}
                              variant="h6"
                            >
                              {exp.jobTitle}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              color={"black"}
                              fontSize={"14px"}
                              variant="h5"
                            >
                              {exp.companyName}
                            </Typography>
                          </Box>
                          <Box display={"flex"}>
                            <DateRangeIcon
                              sx={{ color: "gray" }}
                              fontSize="small"
                            />
                            <Typography color={"primary"} variant="body2">
                              {exp.from} -- {exp.to}
                            </Typography>
                          </Box>
                          <Box sx={{ wordWrap: "break-word" }}>
                            <Typography color={"gray"} variant="body2">
                              {exp.description}
                            </Typography>
                          </Box>
                          {index > 0 && (
                            <Box sx={{ color: "blue" }} marginTop={1.5}>
                              <Divider sx={{ bgcolor: "blue" }} />
                            </Box>
                          )}
                        </Grid>
                      </Grid>
                    );
                  })}
                  {/* ***********************************************************************************Grid Item 4**************************************************************** */}
                  {education.map((ed, index) => {
                    return (
                      <Grid item container marginTop={1} border={0} lg={12}>
                        {index === 0 ? (
                          <Grid item lg={2}>
                            <Typography
                              letterSpacing={1}
                              fontSize={"18px"}
                              variant="h6"
                            >
                              Education
                            </Typography>
                          </Grid>
                        ) : (
                          <Grid item lg={2}></Grid>
                        )}

                        <Grid item lg={10}>
                          <Stack
                            direction={"row"}
                            spacing={2}
                            divider={
                              <Divider orientation="vertical" flexItem />
                            }
                          >
                            <Typography
                              color={"black"}
                              fontSize={"16px"}
                              variant="h6"
                            >
                              {ed.fieldOfStudy}
                            </Typography>
                            <Typography
                              sx={{ opacity: 0.7 }}
                              color={"black"}
                              fontSize={"16px"}
                              variant="h6"
                            >
                              {ed.institutionName}
                            </Typography>
                          </Stack>
                          <Box display={"flex"}>
                            <DateRangeIcon
                              sx={{ color: "gray" }}
                              fontSize="small"
                            />
                            <Typography color={"primary"} variant="body2">
                              {ed.from} -- {ed.to}
                            </Typography>
                          </Box>
                          <Box sx={{ wordWrap: "break-word" }}>
                            <Typography color={"gray"} variant="body2">
                              {ed.description}
                            </Typography>
                          </Box>
                          {index > 0 && (
                            <Box sx={{ color: "blue" }} marginTop={1.5}>
                              <Divider sx={{ bgcolor: "blue" }} />
                            </Box>
                          )}
                        </Grid>
                      </Grid>
                    );
                  })}

                  {/* ***********************************************************************************Grid Item 4**************************************************************** */}
                  <Grid item container marginTop={1} border={0} lg={12}>
                    <Grid item lg={2}>
                      <Typography
                        letterSpacing={1}
                        fontSize={"18px"}
                        variant="h6"
                      >
                        Skills
                      </Typography>
                    </Grid>
                    <Grid item lg={10}>
                      <ul>
                        {skills.map((skill) => {
                          return <li>{skill}</li>;
                        })}
                      </ul>
                    </Grid>
                  </Grid>

                  {/* *************************************************************************************Container Close**************************************************************** */}
                </Grid>
              </div>
            </Paper>
          </Container>
        </div>
      )}
      {/*********************************************************************************Main Container close*************************************************************************/}
    </>
  );
}
export default BuildResume;
