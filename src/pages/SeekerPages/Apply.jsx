import React, { useEffect, useState } from "react";
import Header from "../../Components/userComponents/Header";
import {
  Container,
  Typography,
  Box,
  Grid,
  Divider,
  LinearProgress,
  Button,
  TextField,
  Modal,
  
  
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import server from "../../axios";
import { useDispatch, useSelector } from "react-redux";
import { setJobToApply } from "../../app/features/seekerSlice";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Worker } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import LogoIcon from "../../images/blueLogoIcon.png";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../Utils/firebase";

function Apply() {
  const dispatch = useDispatch();
  const { jobToApply, seeker } = useSelector((state) => state.seeker);
  const { id } = useParams();
  const [showContactForm, setShowContactForm] = useState(true);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showCvInfo, setShowCvInfo] = useState(false);
  const [progress, setProgress] = useState(15);
  const [pdf, setPdf] = useState(null);
  const [pdfErr, setPdfErr] = useState("");
  const [cvUrl, setCvUrl] = useState(seeker?.modified ? seeker?.cvUrl : null);
  const [showHireLaneCv, setShowHireLaneCv] = useState(seeker?.modified);
  const [fName, setFname] = useState(seeker?.fName);
  const [lName, setLname] = useState(seeker?.lName);
  const [phone, setPhone] = useState("");
  const [questions, setQuestions] = useState([]);
  const [errMesg,setErrMsg]=useState('')
  const [err,setErr]=useState(false)
  const navigate = useNavigate();
  useEffect(() => {
    if(!seeker) return navigate('/')
    server.get(`posts/getJob/${id}`).then(({ data }) => {
    dispatch(setJobToApply(data.job));
    });
  },[seeker]);

  const handlePdfChange = (e) => {
    setCvUrl(null);
    setShowHireLaneCv(false);
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setPdfErr("Invalid File Type");
        return;
      }
      if(selectedFile.size >10485760){
        setPdfErr(
        "File size is too large please select a file less than 10 MB"
        );
        return;
      }

      let reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = (e) => {
        setPdfErr("");
        setPdf(e.target.result);
      };
    }
  };

  const handleCvSection = async () => {
    if (!pdf && !cvUrl) return;
    if (pdf) {
      const fileRef = ref(
        storage,
        `cv/${seeker.fName}${seeker._id}myCV.pdf`
      );
      uploadBytes(fileRef, pdf,{ contentType: "application/pdf" }).then(() => {
        getDownloadURL(fileRef).then((url) =>{
        setCvUrl(url);
         
        });
      });
    }
    setShowCvInfo(false);
    setShowQuestions(true);
    setProgress(75);
  };
  const handleContactInfo=(e)=>{
    e.preventDefault();
     setShowContactForm(false);
    setShowCvInfo(true);
    setProgress(40);
  };
 
  const handleQuestions = (e) => {
    e.preventDefault();

    const data={
      fName,
      lName,
      phone,
      email:seeker?.email,
      questions,
      cvUrl,
      jobId:jobToApply._id,
      employerId:jobToApply.employerId,
      candidateId:seeker?._id,
      companyName:jobToApply.companyName,
      jobLocation:jobToApply.jobLocation,
      jobTitle:jobToApply.jobTitle,
      jobPostDate:jobToApply.createdAt,
      image:seeker?.image
    };
    server
      .post("/applications/apply", data, { withCredentials: true })
      .then(()=>{
        window.alert("Application Submitted Successfully");
        navigate("/");
      })
      .catch((err)=>{
      setErr(true)
      setErrMsg(err.response.data)

      });
  };
  const style = {
    position:"absolute",
    top:"50%",
    left:"50%",
    transform:"translate(-50%, -50%)",
    width:400,
    bgcolor:"background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };
  return(
    <div  
      style={{
      background:"linear-gradient(to right, white 50%, #fafafa 50%)",
      }}
    >
      {/* ******************************************************************ModalOpen************************************************************ */}
       <Modal 
        open={err}
        onClose={()=>setErr(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
 
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Can't apply !
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
           You {errMesg}
          </Typography>
          <Button sx={{marginTop:1}}  variant="contained" onClick={() =>{
            
            setErr(false)
            navigate('/')
            }}>return</Button>
        </Box>
      </Modal>
      <Header></Header>
      {jobToApply&&(
        <>
          <Container maxWidth="xl">
            <Grid width={"100%"} minHeight={"100vh"} container>
              <Grid
                borderColor={"green"}
                item
                container
                lg={6}
                xs={12}
                alignContent={"center"}
                justifyContent={"center"}
              >
                <Box paddingTop={2} width={"60%"} minHeight={"500px"}>
                  <Box width={"100%"}>
                    <LinearProgress
                      sx={{borderRadius:1}}
                      variant="determinate"
                      value={progress}
                    ></LinearProgress>
                  </Box>
                  
                  <Box marginTop={3}>
                    <Typography fontWeight={"500"} variant="h5">
                      {showContactForm
                        ? "Add your contact information"
                        : showCvInfo
                        ? "Add a CV for the employer"
                        : "Questions from the employer"}
                    </Typography>
                  </Box>
                  {/* *************************************************************************************************UploadCV****************************************** */}

                  {showCvInfo && (
                    <Box>
                      <Box
                        marginTop={3}
                        padding={2}
                        borderRadius={2}
                        width={"100%"}
                        border={1}
                        borderColor={"lightgray"}
                      >
                        <Box width={"100%"} display={"flex"}>
                          <Button
                            style={{ textTransform: "none" }}
                            fullWidth
                            startIcon={<UploadFileIcon />}
                            component="label"
                          >
                            <Typography fontSize={"1rem"} fontWeight={"700"}>
                              {pdf ? "Replace" : "Upload CV"}
                            </Typography>

                            <input
                              onChange={handlePdfChange}
                              hidden
                              accept=".pdf"
                              type="file"
                            />
                          </Button>
                          {pdf && (
                            <Typography color={"primary"}>
                              {" "}
                              <CheckCircleIcon />
                            </Typography>
                          )}
                        </Box>

                        {pdf && (
                          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                            <Viewer fileUrl={pdf} />
                          </Worker>
                        )}
                      </Box>
                      <Typography color={"error"}>{pdfErr}</Typography>
                      <Box width={"100%"}>
                        <Typography color={"gray"}>
                          _____________________________or_______________________________
                        </Typography>
                      </Box>
                      {!seeker?.modified ? (
                        <Box
                          marginTop={2}
                          padding={2}
                          borderRadius={2}
                          width={"100%"}
                          border={1}
                          borderColor={"lightgray"}
                        >
                          <Button
                            startIcon={<FileOpenIcon color="disabled" />}
                            fullWidth
                            style={{ textTransform: "none" }}
                            onClick={()=>navigate('/profile')}
                          >
                            <Typography fontWeight={"700"} fontSize={"1rem"}>
                              {" "}
                              Build your CV with hirelane
                            </Typography>
                          </Button>
                        </Box>
                      ) : (
                        <Box
                          marginTop={2}
                          padding={2}
                          borderRadius={2}
                          width={"100%"}
                          border={1}
                          borderColor={"lightgray"}
                        >
                          <Box
                            display={"flex"}
                            justifyContent={"space-between"}
                          >
                            <Button
                              onClick={() => {
                                setPdf(null);
                                setCvUrl(seeker.cvUrl);
                                setShowHireLaneCv(true);
                              }}
                              color="primary"
                              style={{ textTransform: "none" }}
                            >
                              <img
                                width={30}
                                height={30}
                                src={LogoIcon}
                                alt=""
                              />
                              <Typography fontWeight={"700"} fontSize={"1rem"}>
                                {" "}
                                Hirelane CV
                              </Typography>
                            </Button>
                            {showHireLaneCv && (
                              <Typography color={"primary"}>
                                <CheckCircleIcon />
                              </Typography>
                            )}
                          </Box>
                          {showHireLaneCv && seeker&& (
                            <>
                              <Box margin={1}>
                                <Divider />
                              </Box>

                              <Box>
                                <Typography
                                  lineHeight={1.5}
                                  fontSize={"18px"}
                                  fontWeight={500}
                                >
                                    {seeker?.fName + "" + seeker?.lName}
                                </Typography>
                                <Typography
                                  lineHeight={1.5}
                                  variant="body2"
                                  color={"gray"}
                                >
                                  {seeker?.email}
                                </Typography>
                                <Typography
                                  lineHeight={1.5}
                                  variant="body2"
                                  color={"gray"}
                                >
                                  {seeker?.phoneNo}
                                </Typography>
                                <Typography
                                  lineHeight={1.5}
                                  variant="body2"
                                  color={"gray"}
                                >
                                  {seeker?.city},{seeker?.country}
                                </Typography>
                                <Typography
                                  lineHeight={2}
                                  variant="body2"
                                  color={"#616161"}
                                >
                                  {seeker.workExperience[0].jobTitle},
                                  {seeker.workExperience[0].companyName}
                                </Typography>
                                <Typography
                                  lineHeight={1.5}
                                  variant="body2"
                                  color={"#616161"}
                                >
                                  {seeker.education[0].institutionName},
                                  {seeker.education[0].fieldOfStudy}......
                                </Typography>
                              </Box>
                            </>
                          )}
                        </Box>
                      )}

                      <Box
                        marginTop={3}
                        justifyContent={"space-between"}
                        display={"flex"}
                        width={"100%"}
                      >
                        <Button
                          variant="contained"
                          onClick={handleCvSection}
                          sx={{
                            textTransform: "none",
                            fontSize: "1rem",
                            fontWeight: "700",
                            borderRadius: 2,
                          }}
                        >
                          Continue
                        </Button>
                        <Button
                          onClick={() => {
                            setShowCvInfo(false);
                            setShowContactForm(true);
                            setProgress(15);
                          }}
                        >
                          Back
                        </Button>
                      </Box>
                    </Box>
                  )}
                  {/* *****************************************************************************Contact Info**************************************************************** */}
                  {showContactForm && (
                    <form onSubmit={handleContactInfo}>
                      <Box marginTop={1}>
                        <Box marginTop={1}>
                          <Typography fontWeight={550}>First Name</Typography>
                          <TextField
                            required
                            value={fName}
                            fullWidth
                            onChange={(e) => setFname(e.target.value)}
                          ></TextField>
                        </Box>
                        <Box marginTop={1}>
                          <Typography fontWeight={550}>Last Name</Typography>
                          <TextField
                            required
                            value={lName}
                            onChange={(e) => setLname(e.target.value)}
                            fullWidth
                          ></TextField>
                        </Box>
                        <Box marginTop={1}>
                          <Typography fontWeight={550}>Email</Typography>
                          <Typography>{seeker?.email}</Typography>
                        </Box>
                        <Box marginTop={1}>
                          <Typography fontWeight={550}>Phone</Typography>
                          <TextField
                            type={"number"}
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            fullWidth
                          ></TextField>
                        </Box>
                        <Box marginTop={2}>
                          <Button type={"submit"} variant="contained">
                            Continue
                          </Button>
                        </Box>
                      </Box>
                    </form>
                  )}
                  {/* ***************************************************************************************ScreeningQuestions****************************************************************** */}

                  {showQuestions && (
                    <Box marginTop={1}>
                      <form onSubmit={handleQuestions}>
                        {jobToApply?.screeningQuestions?.map((ques, index) => {
                          return (
                            <Box marginTop={2} key={index}>
                              <Typography>{ques.question}</Typography>

                              {ques.responseType === "yesNo" ? (
                                <TextField
                                  select
                                  required
                                  SelectProps={{
                                    native: true,
                                  }}
                                  defaultValue={''}
                                  onChange={(e) => {
                                    const answer = e.target.value;

                                    setQuestions((prev) => {
                                      const newQuestions = [...prev];
                                      newQuestions[index] = {
                                        question: ques.question,
                                        answer: answer,
                                      };
                                      return newQuestions;
                                    });
                                  }}
                                  fullWidth
                                >
                                  <option value={""}>Select an option</option>

                                  <option value={"Yes"}>Yes</option>
                                  <option value={"No"}>No</option>
                                </TextField>
                              ) : ques.responseType === "numeric" ? (
                                <TextField
                                  required
                                  fullWidth
                                  type="number"
                                  onChange={(e) => {
                                    const answer = e.target.value;
                                    setQuestions((prev) => {
                                      const newQuestions = [...prev];
                                      newQuestions[index] = {
                                        question: ques.question,
                                        answer: answer,
                                      };
                                      return newQuestions;
                                    });
                                  }}
                                ></TextField>
                              ) : (
                                <TextField
                                  required
                                  multiline
                                  fullWidth
                                  rows={2}
                                  label={"Enter your Answer"}
                                  onChange={(e) => {
                                    const answer = e.target.value;
                                    setQuestions((prev) => {
                                      const newQuestions = [...prev];
                                      newQuestions[index] = {
                                        question: ques.question,
                                        answer: answer,
                                      };
                                      return newQuestions;
                                    });
                                  }}
                                ></TextField>
                              )}
                            </Box>
                          );
                        })}
                      
                         <Box
                          display={"flex"}
                          justifyContent={"space-between"}
                          marginTop={2}
                        >
                          <Button type="submit" variant={"contained"}>
                            Submit
                          </Button>
                          <Button
                            onClick={(e) => {
                              setShowQuestions(false);
                              setShowCvInfo(true);
                              setProgress(40);
                            }}
                          >
                            Back
                          </Button>
                        </Box>
                      </form>
                    </Box>
                  )}
                </Box>
              </Grid>

              <Grid
                alignContent={"center"}
                borderColor={"red"}
                item
                container
                xs={12}
                lg={6}
                justifyContent={"center"}
              >
                <Box
                  sx={{
                    height: 500,
                    overflow: "auto",
                    boxShadow: "0px 3px 5px rgba(0,0,0,0.1)",
                    border: 1,
                    borderRadius: 2,
                    borderColor: "lightgray",
                    "&::-webkit-scrollbar": {
                      display: "none",
                    },
                  }}
                  maxWidth={"80%"}
                >
                  <Box
                    sx={{
                      position: "sticky",
                      top: 0,
                      backgroundColor: "white",
                      padding: 2,
                      boxShadow: "0px 3px 5px rgba(0,0,0,0.1)",
                    }}
                  >
                    <Typography variant="h6">{jobToApply.jobTitle}</Typography>
                    <Typography fontSize={18} color={"purple"}>
                      {jobToApply.companyName}
                    </Typography>
                    <Typography
                      marginTop={1}
                      color={"gray"}
                      variant="p"
                    ></Typography>
                    <Typography variant="body2" color={"gray"} marginTop={0}>
                      {jobToApply.jobLocation}
                    </Typography>
                    <Typography variant="h6">Full Job Description</Typography>
                  </Box>

                  <Box bgcolor={"white"} sx={{padding:2}}>
                    <Divider sx={{margin:0}}></Divider>
                    <Box padding={1} sx={{wordWrap:"break-word"}}>
                      <Typography sx={{color:"gray"}} variant="subtitle2">
                        {jobToApply.description}
                      </Typography>
                    </Box>
                    <Divider sx={{margin:0}}></Divider>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </>
      )}
    </div>
  );
}

export default Apply;
