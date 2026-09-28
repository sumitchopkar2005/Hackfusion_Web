import React, { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import cardBoard from "/cardboard.jpeg";
import logoblack from "/logoblack.png"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  ref as dbRef,
  set,
  query,
  orderByChild,
  equalTo,
  orderByKey,
  get,
} from "firebase/database";
import { db, storage } from "../Firebase";
import Footer from "../components/Footer";
import AOS from "aos"
import "aos/dist/aos.css"
import JSConfetti from 'js-confetti';
const RegistrationForm = () => {
  const [loading, setLoading] = useState(false);
  const [isTeamLeadSubmitted, setIsTeamLeadSubmitted] = useState(false);
  const [isTeamMemberSubmitted, setisTeamMemberSubmitted] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [next, setNext] = useState(false);
  const [file, setFile] = useState(null);
  const [cnfPassword, setCnfPassowrd] = useState("");
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [done, setDone] = useState(false);
  const [otpStruc, setOtpStruc] = useState({});
  const jsConfetti = new JSConfetti();
  const [formData, setFormData] = useState({
    leadMobile: "",
    leadName: "",
    leadEmail: "",
    leadGender: "",
    m1Mobile: "",
    m1Name: "",
    m1Email: "",
    m1Gender: "",
    m2Mobile: "",
    m2Name: "",
    m2Email: "",
    m2Gender: "",
    m3Mobile: "",
    m3Name: "",
    m3Email: "",
    m3Gender: "",
    city: "",
    college: "",
    teamName: "",
    abstract: "",
    password: "",
    paymentReferenceID: "",
  });

  const cart = {
    black: { L: 0, M: 0, S: 0, XL: 0 },
    maroon: { L: 0, M: 0, S: 0, XL: 0 },
    "navi blue": { L: 0, M: 0, S: 0, XL: 0 },
    "royal blue": { L: 0, M: 0, S: 0, XL: 0 },
    white: { L: 0, M: 0, S: 0, XL: 0 },
    yellow: { L: 0, M: 0, S: 0, XL: 0 },
  };

  const coupon = {
    lead: {
      "day 1 dinner": { msg: "", title: "day 1 dinner", type: "dinner" },
      "day 2 breakfast": {
        msg: "",
        title: "day 2 breakfast",
        type: "breakfast",
      },
      "day 2 dinner": { msg: "", title: "day 2 dinner", type: "dinner" },
      "day 2 lunch": { msg: "", title: "day 2 lunch", type: "lunch" },
      "day 3 breakfast": {
        msg: "",
        title: "day 3 breakfast",
        type: "breakfast",
      },
      "day 3 lunch": { msg: "", title: "day 3 lunch", type: "lunch" },
      goodies: { msg: "", title: "goodies", type: "goodies" },
    },
    m1: {
      "day 1 dinner": { msg: "", title: "day 1 dinner", type: "dinner" },
      "day 2 breakfast": {
        msg: "",
        title: "day 2 breakfast",
        type: "breakfast",
      },
      "day 2 dinner": { msg: "", title: "day 2 dinner", type: "dinner" },
      "day 2 lunch": { msg: "", title: "day 2 lunch", type: "lunch" },
      "day 3 breakfast": {
        msg: "",
        title: "day 3 breakfast",
        type: "breakfast",
      },
      "day 3 lunch": { msg: "", title: "day 3 lunch", type: "lunch" },
      goodies: { msg: "", title: "goodies", type: "goodies" },
    },
    m2: {
      "day 1 dinner": { msg: "", title: "day 1 dinner", type: "dinner" },
      "day 2 breakfast": {
        msg: "",
        title: "day 2 breakfast",
        type: "breakfast",
      },
      "day 2 dinner": { msg: "", title: "day 2 dinner", type: "dinner" },
      "day 2 lunch": { msg: "", title: "day 2 lunch", type: "lunch" },
      "day 3 breakfast": {
        msg: "",
        title: "day 3 breakfast",
        type: "breakfast",
      },
      "day 3 lunch": { msg: "", title: "day 3 lunch", type: "lunch" },
      goodies: { msg: "", title: "goodies", type: "goodies" },
    },
    m3: {
      "day 1 dinner": { msg: "", title: "day 1 dinner", type: "dinner" },
      "day 2 breakfast": {
        msg: "",
        title: "day 2 breakfast",
        type: "breakfast",
      },
      "day 2 dinner": { msg: "", title: "day 2 dinner", type: "dinner" },
      "day 2 lunch": { msg: "", title: "day 2 lunch", type: "lunch" },
      "day 3 breakfast": {
        msg: "",
        title: "day 3 breakfast",
        type: "breakfast",
      },
      "day 3 lunch": { msg: "", title: "day 3 lunch", type: "lunch" },
      goodies: { msg: "", title: "goodies", type: "goodies" },
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "paymentScreenShotLink") {
      setFile((prev) => e.target.files[0]);
    } else if (name === "cnfPassword") {
      setCnfPassowrd((prev) => e.target.value);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const doesExists = async (mob = null, teamName = null) => {
    const usersRef = dbRef(db, "user2");
    if (mob !== null) {
      try {
        const mobileQuery = query(usersRef, orderByKey(), equalTo(mob));
        const snapshot = await get(mobileQuery);
        if (snapshot.exists()) {
          return "Mob No";
        } else {
          if (teamName !== null) {
            try {
              const teamQuery = query(
                usersRef,
                orderByChild("teamName"),
                equalTo(teamName)
              );
              const snapshot = await get(teamQuery);
              if (snapshot.exists()) {
                return "Team Name";
              } else {
                return false;
              }
            } catch (error) {
              console.error("Error checking team name:", error);
              throw error;
            }
          }
        }
      } catch (error) {
        console.error("Error checking mobile number:", error);
        throw error;
      }
    }
  };
  const handleTeamLeadSubmit = async (e) => {
    e.preventDefault();
    setLoading((prev) => true);
    const check = await doesExists(formData.leadMobile, formData.teamName);

    if (check === "Mob No") {
      alert("Mobile No already registered!");
    } else if (check === "Team Name") {
      alert("Team Name already taken !");
    } else {

      setIsTeamLeadSubmitted((prev) => true);
    }
    setLoading((prev) => false);
  };
  const handleTeamMemberSubmit = (e) => {
    e.preventDefault();
    setLoading((prev) => true);
    setisTeamMemberSubmitted((prev) => true);
    setLoading((prev) => false);
  };
  const handleFinalSUbmit = async (e) => {
    e.preventDefault();
    setLoading((prev) => true);
    if (!formData.leadMobile || !file) {
      if (!formData.leadMobile) {
        alert("Team leader's mobile number is required!");
      } else {
        alert("Please select a file to upload.");
      }
      setLoading((prev) => false);
      return;
    }
    // File upload to Firebase Storage
    const fileRef = ref(
      storage,
      `hackFusion-2k25/${formData.leadMobile}/${file}`
    );
    try {
      const uploadTask = await uploadBytes(fileRef, file);

      // Get download URL
      const downloadURL = await getDownloadURL(uploadTask.ref);
      const dataToSave = {
        ...formData,
        paymentScreenShotLink: downloadURL,
        cart,
        coupon,
        status: "Pending",
      };

      // Save file URL and other data to Firebase Realtime Database
      const dataRef = dbRef(db, `user2/${formData.leadMobile}`);
      await set(dataRef, dataToSave);
      const data = new FormData();
      const message = `
     <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
    <h2 style="color: #0056b3;">Welcome to HackFusion 2.0 Hackathon!</h2>
    <p>Hi <strong>${formData.teamName}</strong>,</p>
    <p>Congratulations on successfully registering for <strong>HackFusion 2.0 Hackathon</strong>!</p>
    <p> We are thrilled to have you join this exciting journey of innovation and collaboration. </p>

    <h3 style="color: #0056b3;"> What is Next?</h3>
    <ol>
      <li stye="display:flex; flex-direction:column;>Join our official group chat further updates and to  ask queries: 
       <br/>
       <p>Link : ${"https://chat.whatsapp.com/L8zYJVSyhMA55noJZddywj"} </p>
       <br/>
       <p>Only Team Lead should Join Whatsapp Group</p>
      </li>
      <li stye="display:flex; flex-direction:column;>Download our official HackFusion App to access team DASHBOARD to stay updated with the schedule, resources, and announcements: 
        <br/>
        <p> App : ${"https://play.google.com/store/apps/details?id=com.swag.hackfusion2"}</p>
      </li>
      <li>Prepare to showcase your skills, learn, and have fun! </li>
    </ol>

    <p>If you have any questions, feel free to reach out to us at :
      <br/>
      <a href="mailto:swag@sggs.ac.in" style="color: #0056b3;">swag@sggs.ac.in</a>.
      <br/>
      <a href="mailto:gdg@sggs.ac.in" style="color: #0056b3;">gdg@sggs.ac.in</a>.
    </p>

    <p>Looking forward to seeing you at <strong>HackFusion 2.0</strong>! </p>

    <p>Best regards,</p>
    <p><strong>HackFusion 2.0 Team</strong></p>
  </div>
`.replace(/\r?\n/g, "");
      data.append("email_id", formData.leadEmail);
      data.append("subject", "Registration Successfull !");
      data.append("body", message);
      try {
        const response = await fetch(
          `https://sggsapp.co.in/api/send_email.php`,
          {
            method: "POST",
            body: data,
          }
        );
        const res = await response.json();
        if (res.Error === "200") {
          setFormData({
            leadMobile: "",
            leadName: "",
            leadEmail: "",
            leadGender: "",
            m1Mobile: "",
            m1Name: "",
            m1Email: "",
            m1Gender: "",
            m2Mobile: "",
            m2Name: "",
            m2Email: "",
            m2Gender: "",
            m3Mobile: "",
            m3Name: "",
            m3Email: "",
            m3Gender: "",
            city: "",
            college: "",
            teamName: "",
            abstract: "",
            password: "",
            paymentReferenceID: "",
          });
          setCnfPassowrd("");
          setFile(null);
          setDone(prev => true);
          jsConfetti.addConfetti();
          setLoading((prev) => false);
        }
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
      setLoading((prev) => false);
    }
  };

  const genrateOTP = () => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    return otp;
  };
  async function verifyOTP(email, enteredOtp) {
    setLoading((prev) => true);
    if (!otpStruc[email] || !otpStruc[email].otp) {
      setMsg("No OTP was sent to this email. Please try resending.");
      setLoading((prev) => false);
      return false;
    }

    // Use the `find` method to locate the OTP
    const validOtp = otpStruc[email].otp.find(
      (otp) => otp === Number(enteredOtp)
    );

    if (!validOtp) {
      setMsg("Invalid OTP. Please try again.");
      setLoading((prev) => false);
      return false;
    }

    // If a match is found, OTP is valid
    setMsg("OTP verified successfully!");
    setOtpVerified((prev) => true);
    setEmailVerified((prev) => true);
    setIsOtpSent((prev) => false);
    setOtpStruc((prev) => {
      const updated = { ...prev };
      // Clear the OTP array entirely
      updated[email].otp = [];

      return updated;
    });
    setLoading((prev) => false);
    return true;
  }

  async function validateEmail(email, resend = false) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setLoading((prev) => true);
    if (emailRegex.test(email)) {
      // Generate OTP and update the otpStruc state
      let otpCode = genrateOTP();
      setOtpStruc((prev) => {
        const updated = { ...prev };

        // Clear OTP if resend is true
        if (resend && updated[email]) {
          updated[email].otp = [];
        }

        // Initialize or update the otp structure
        if (!updated[email]) {
          updated[email] = { otp: [] };
        }
        updated[email].otp.push(otpCode);

        return updated;
      });

      // Prepare the email message
      const data = new FormData();
      const message = `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <h2 style="color: #0056b3;">Your One Time Password (OTP)</h2>
          <p>Hi,</p>
          <p>Thank you for initiating your registration for <strong>HackFusion 2.O</strong>. Please use the OTP below to verify your email address:</p>
          <p>Note: This OTP will be valid for only 60 seconds.</p>
          <div style="margin: 20px 0; text-align: center;">
            <span style="font-size: 24px; font-weight: bold; color: #0056b3; border: 1px solid #ccc; padding: 10px 20px; display: inline-block;">
              <strong>${otpCode}</strong>
            </span>
          </div>
          <p>If you did not request this OTP, please ignore this email or contact our support team.</p>
          <p>For any assistance, feel free to reach out to us at <a href="mailto:swag@sggs.ac.in" style="color: #0056b3;">swag@sggs.ac.in</a>.</p>
          <p>Best regards,</p>
          <p><strong>HackFusion 2.O Team</strong></p>
        </div>`.replace(/\r?\n/g, "");
      data.append("email_id", email);
      data.append("subject", "Verify Email");
      data.append("body", message);
      // Send the email
      try {
        const response = await fetch(
          `https://sggsapp.co.in/api/send_email.php`,
          {
            method: "POST",
            body: data,
          }
        );
        const res = await response.json();

        if (res.Message === "Mail sent") {
          setIsOtpSent(true);

          // Schedule OTP invalidation
          setTimeout(() => {
            setOtpStruc((prev) => {
              const updated = { ...prev };
              if (updated[email]?.otp) {
                updated[email].otp = [];
              }
              return updated;
            });
          }, 60000);

          setMsg("This OTP is valid for 60 sec. (Check SPAM folder)");
        } else {
          console.log(res.Message);
        }
      } catch (error) {
        console.error("Error sending email:", error);
      }
      setLoading((prev) => false);
    } else {
      console.log("Email format not supported!");
      setLoading((prev) => false);
    }
  }
  useEffect(() => {
    AOS.init();
  }, [])
  return (
    <>
      {done ?
        (
          <div className="flex flex-col items-center mt-32 absolute w-full z-30 justify-start h-full  hide overflow-scroll max-sm:mt-32" data-aos="fade-up-right">
            <div className="absolute hide flex flex-col justify-center items-center mt-10 lg:w-[550px] lg:h-[600px] md:w-[450px] sm:w-[400px] max-sm:w-[375px] overflow-y-scroll max-sm:mt-4 px-10 py-4 bg-opacity-20">
              <img
                src={cardBoard}
                className="rounded-md lg:w-[600px] lg:h-[700px] md:w-[550px] md:h-[600px] sm:w-[450px] sm:h-[550px] max-sm:px-6 max-sm:rounded-lg max-sm:h-[450px]"
              />
              <h1 className=" absolute mb-16 lg:text-lg font-squid tracking-wide max-sm:text-xs z-30"> Registration Sucessfull !!</h1>
              <h3 className="absolute lg:text-base font-outfit tracking-wide max-sm:text-xs z-30 "> (Check mail box for confirmation mail)</h3>
            </div>
          </div>
        )
        :
        (
          <div className="flex flex-col items-center mt-32 absolute w-full z-30 justify-start h-full  hide overflow-scroll max-sm:mt-32" data-aos="fade-up-right">
            <img
              src={cardBoard}
              className="rounded-md lg:w-[600px] lg:h-[700px] md:w-[550px] md:h-[600px] sm:w-[450px] sm:h-[550px] max-sm:px-6 max-sm:rounded-lg max-sm:h-[550px]"
            />

            <div className="absolute hide flex flex-col justify-start items-center mt-10 lg:w-[550px] lg:h-[600px] md:w-[450px] sm:w-[400px] max-sm:w-[375px] overflow-y-scroll max-sm:mt-4 px-10 py-4 bg-opacity-20">
              <img
                src={logoblack}
                className="lg:w-full md:w-[450px] sm:w-[350px] max-sm:w-[350px] max-sm:mb-4"
              />
              {

                !isTeamLeadSubmitted ? (
                  <>
                    {!emailVerified ? (
                      <span className="flex flex-col w-full mt-10">
                      <label
                        htmlFor="leadEmail"
                        className="font-squid text-base text-black mb-4"
                      >
                        Lead Email
                      </label>
                      <span className="flex flex-row gap-4 items-center">
                        {/* Input for the first email */}
                        <input
                          type="email"
                          required
                          className="bg-transparent w-full h-10 indent-1 border-2 border-fuchsia-300 placeholder:text-slate-200 font-outfit text-sm px-4 py-2 rounded-md focus:bg-neutral-400 focus:bg-opacity-50 focus:outline-none focus:border-emerald-500 transition-all ease-in-out"
                          autoComplete="true"
                          name="leadEmail"
                          value={formData.leadEmail}
                          onChange={handleChange}
                          placeholder="Enter Lead Email"
                        />
                      </span>
                    
                      <span className="flex flex-row gap-4 items-center mt-4">
                        {/* Input for confirming the email */}
                        <input
                          type="email"
                          required
                          className="bg-transparent w-full h-10 indent-1 border-2 border-fuchsia-300 placeholder:text-slate-200 font-outfit text-sm px-4 py-2 rounded-md focus:bg-neutral-400 focus:bg-opacity-50 focus:outline-none focus:border-emerald-500 transition-all ease-in-out"
                          name="confirmEmail"
                          value={formData.confirmEmail}
                          onChange={handleChange}
                          onPaste={(e) => e.preventDefault()} 
                          placeholder="Confirm Lead Email"
                        />
                      </span>
                    
                      {/* Display error if emails do not match */}
                      {formData.leadEmail &&
                        formData.confirmEmail &&
                        formData.leadEmail !== formData.confirmEmail && (
                          <p className="text-red-500 text-sm mt-2">Emails do not match</p>
                        )}
                    
                      <span className="flex flex-row gap-4 items-center mt-4">
                        {/* Verify button */}
                        {isOtpSent ? (
                          ""
                        ) : (
                          <button
                            className="bg-green-500 font-squid px-2 py-2 rounded-md disabled:bg-red-600 disabled:cursor-not-allowed hover:bg-green-400 text-sm text-black focus:bg-neutral-400 focus:bg-opacity-50"
                            disabled={
                              formData.leadEmail === "" ||
                              formData.confirmEmail === "" ||
                              formData.leadEmail !== formData.confirmEmail ||
                              isOtpSent ||
                              loading
                            }
                            onClick={() => validateEmail(formData.leadEmail)}
                          >
                            {loading ? "Wait..." : "Verify"}
                          </button>
                        )}
                      </span>
                    </span>
                    
                    ) : (
                      ""
                    )}
                    {isOtpSent ? (
                      <div className="flex flex-col justify-center items-center w-full">
                        <OtpInput
                          value={otp}
                          onChange={setOtp}
                          numInputs={4}
                          renderSeparator={
                            <span>
                              <hr className="bg-black border-2 border-black" />
                            </span>
                          }
                          renderInput={(props) => <input {...props} />}
                          containerStyle={"w-full mb-4 mt-5 otpContainer justify-center"}
                          inputStyle={
                            "otp border-2 border-fuchsia-300 bg-white focus:bg-neutral-400 focus:bg-opacity-50 focus:outline-none focus:border-emerald-500 transition-all ease-in-out"
                          }
                        />
                        <p className="text-black font-squid text-xs px-2 py-2">{msg}</p>
                        <span className="flex flex-row gap-4 w-full justify-center">

                          <button
                            className="bg-pink-500 font-squid px-2 py-2 rounded-md hover:bg-pink-400"
                            disabled={loading}
                            onClick={(e) => {
                              e.preventDefault();
                              verifyOTP(formData.leadEmail, otp);
                            }}
                          >
                            {loading ? "Wait..." : "Verify"}
                          </button>



                          <button
                            className="bg-orange-500 font-squid px-2 py-2 rounded-md hover:bg-orange-400"
                            disabled={loading}
                            onClick={(e) => {
                              e.preventDefault();
                              validateEmail(formData.leadEmail, true);
                            }}
                          >
                            {loading ? "Wait..." : "Resend"}
                          </button>

                        </span>
                      </div>
                    ) : (
                      ""
                    )}
                    {otpVerified ? (
                      <form
                        onSubmit={handleTeamLeadSubmit}
                        className="flex flex-col justify-center lg:w-full lg:h-[500px] md:h-[500px] sm:h-[500px] gap-5  overflow-y-scroll hide "
                      >
                        <h2 className="text-xl font-squid text-black ">
                          Team Lead Details
                        </h2>
                        <span>
                          <label
                            htmlFor="teamName"
                            className="font-squid text-base text-black mb-4"
                          >
                            Team Name
                          </label>
                          <input
                            type="text"
                            required
                            className="bg-transparent w-full h-10 indent-1 border-2 border-fuchsia-300 placeholder:text-slate-200 font-outfit text-sm px-4 py-2 rounded-md focus:bg-neutral-400 focus:bg-opacity-50 focus:outline-none focus:border-emerald-500 transition-all ease-in-out"
                            autoComplete="true"
                            name="teamName"
                            value={formData.teamName}
                            onChange={handleChange}
                            placeholder="Team Name"
                          />
                        </span>
                        <span>
                          <label
                            htmlFor="leadName"
                            className="font-squid text-base text-black mb-4"
                          >
                            Lead Name
                          </label>
                          <input
                            type="text"
                            required
                            className="bg-transparent w-full h-10 indent-1 border-2 border-fuchsia-300 placeholder:text-slate-200 font-outfit text-sm px-4 py-2 rounded-md focus:bg-neutral-400 focus:bg-opacity-50 focus:outline-none focus:border-emerald-500 transition-all ease-in-out"
                            autoComplete="true"
                            name="leadName"
                            value={formData.leadName}
                            onChange={handleChange}
                            placeholder=" Lead Name"
                          />
                        </span>

                        <span>
                          <label
                            htmlFor="leadMobile"
                            className="font-squid text-base text-black mb-4"
                          >
                            Lead Contact
                          </label>
                          <input
                            type="text"
                            maxLength={10}
                            required
                            className="bg-transparent w-full h-10 indent-1 border-2 border-fuchsia-300  placeholder:text-slate-200 font-outfit text-sm px-4 py-2 rounded-md focus:bg-neutral-400 focus:bg-opacity-50 focus:outline-none focus:border-emerald-500 transition-all ease-in-out"
                            autoComplete="true"
                            name="leadMobile"
                            value={formData.leadMobile}
                            onChange={handleChange}
                            placeholder="Lead Mob No"
                          />
                        </span>
                        <span>
                          <label
                            htmlFor="leadGender"
                            className="font-squid text-base text-black mb-4"
                          >
                            Gender
                          </label>
                          <select
                            className="bg-transparent w-full h-10 indent-1 border-2 border-fuchsia-300   placeholder:text-slate-200 font-outfit px-4 py-2 rounded-md focus:bg-neutral-400 focus:bg-opacity-50 focus:outline-none focus:border-emerald-500 transition-all ease-in-out"
                            name="leadGender"
                            onChange={handleChange}
                            autoComplete="true"
                            value={formData.leadGender}
                            required
                          >
                            <option>Select Gender</option>
                            <option>M</option>
                            <option>F</option>
                          </select>
                        </span>
                        <button
                          type="submit"
                          className="px-4 py-2 mt-5 bg-emerald-500 text-black font-squid rounded-md hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-400"
                          disabled={!otpVerified}
                        >
                          Save and Next
                        </button>
                      </form>
                    ) : (
                      ""
                    )}
                  </>
                ) :
                  !next ? (
                    <div className="flex flex-col  items-center overflow-y-scroll hide lg:h-[600px] sm:h-[500px] max-sm:h-[450px]">
                      <h2 className="my-6 font-squid font-bold tracking-wider text-2xl max-sm:text-xl">Payment Details</h2>
                      <div className="mt-2 w-full flex flex-col justify-center items-center gap-10">
                        <span className="flex flex-row w-full">
                          <h3 className="font-squid  tracking-wider w-[185px] max-sm:text-xs">ACCOUNT NAME:</h3>
                          <p className="font-outfit tracking-wide font-bold  max-sm:text-xs text-gray-800">Prin Sggs College P G E D C</p>
                        </span>
                        <span className="flex flex-row w-full">
                          <h3 className="font-squid  tracking-wider  max-sm:text-xs">BANK NAME: </h3>
                          <p className="font-outfit tracking-wide font-bold max-sm:text-xs text-gray-800">&ensp; STATE OF BANK OF INDIA</p>
                        </span>
                        <span className="flex flex-row w-full">
                          <h3 className="font-squid  tracking-wider max-sm:text-xs "> ACCOUNT NO: </h3>
                          <p className="font-outfit tracking-wide font-bold max-sm:text-xs text-gray-800">&ensp; 11265870493</p>
                        </span>
                        <span className="flex flex-row w-full">
                          <h3 className="font-squid  tracking-wider max-sm:text-xs">IFS CODE: </h3>
                          <p className="font-outfit tracking-wide font-bold max-sm:text-xs text-gray-800">&ensp; SBIN0011651</p>
                        </span>
                        <span className="flex flex-row w-full">
                          <h3 className="font-squid  tracking-wider  max-sm:text-xs">BRANCH: </h3>
                          <p className="font-outfit tracking-wide font-bold max-sm:text-xs text-gray-800">&ensp; VISHNUPURI</p>
                        </span>
                        <span className="flex flex-row w-full items-center justify-between gap-10">
                          <span className="flex flex-row ">
                            <h3 className="font-squid  tracking-wider  max-sm:text-xs">AMOUNT: </h3>
                            <p className="font-outfit tracking-wide font-bold max-sm:text-xs text-gray-800">&ensp; ₹1000/- (Non-Refundable)</p>
                          </span>
                          <img src="/scroll.gif" className="h-[50px] w-auto cursor-pointer" />
                        </span>
                      </div>
                      <h3 className="mt-6 font-outfit tracking-wider text-center max-sm:text-xs">( Pay Registration Fees on deatils provided above and keep payment Screesnshot and reference No to move further !! )</h3>
                      <button
                        type="button"
                        className="px-4 py-2 mt-4 bg-green-600 rounded-md font-squid tracking-wide hover:bg-green-400"
                        onClick={async (e) => {
                          e.preventDefault();
                          setLoading(true); // Start the loading state

                          // Simulate an async operation (e.g., API call)
                          try {
                            // Example: Replace this with your actual logic
                            await new Promise((resolve) => setTimeout(resolve, 2000));

                            setNext(true); // Proceed to the next state after the operation
                          } catch (error) {
                            console.error("An error occurred:", error);
                          } finally {
                            setLoading(false); // Reset the loading state
                          }
                        }}
                      >
                        {loading ? "Wait..." : "Proceed"}
                      </button>
                    </div>
                  ) : (
                    <>
                      {!isTeamMemberSubmitted ? (
                        loading ? (
                          <h1 className="font-squid">"Loading..."</h1>
                        ) : (
                          <form
                            className="flex flex-col lg:w-full lg:h-[500px] gap-5 md:h-[470px] max-sm:h-[450px] overflow-y-scroll hide"
                            onSubmit={handleTeamMemberSubmit}
                          >
                            <h2 className="text-xl font-squid">Team Members Details</h2>
                            <span>
                              <label
                                htmlFor="m1Name"
                                className="font-squid text-base text-black mb-4"
                              >
                                Member 1 Name
                              </label>
                              <input
                                type="text"
                                required
                                className="bg-transparent w-full h-10 indent-1 border-2 border-fuchsia-300 placeholder:text-slate-200 font-outfit  text-sm px-4 py-2 rounded-md focus:bg-neutral-400 focus:bg-opacity-50 focus:outline-none focus:border-emerald-500 transition-all ease-in-out"
                                autoComplete="true"
                                name="m1Name"
                                value={formData.m1Name}
                                onChange={handleChange}
                                placeholder="Member 1 Name"
                              />
                            </span>
                            <span>
                              <label
                                htmlFor="m1Email"
                                className="font-squid text-base text-black mb-4"
                              >
                                Member 1 Email
                              </label>
                              <input
                                type="email"
                                required
                                className="bg-transparent w-full h-10 indent-1 border-2 border-fuchsia-300 placeholder:text-slate-200 font-outfit text-sm px-4 py-2 rounded-md focus:bg-neutral-400 focus:bg-opacity-50 focus:outline-none focus:border-emerald-500 transition-all ease-in-out"
                                autoComplete="true"
                                name="m1Email"
                                value={formData.m1Email}
                                onChange={handleChange}
                                placeholder="Member 1 Email"
                              />
                            </span>
                            <span>
                              <label
                                htmlFor="m1Mobile"
                                className="font-squid text-base text-black mb-4"
                              >
                                Member 1 Mobile
                              </label>
                              <input
                                type="text"
                                required
                                maxLength={10}
                                className="bg-transparent w-full h-10 indent-1 border-2 border-fuchsia-300 placeholder:text-slate-200 font-outfit  text-sm px-4 py-2 rounded-md focus:bg-neutral-400 focus:bg-opacity-50 focus:outline-none focus:border-emerald-500 transition-all ease-in-out"
                                autoComplete="true"
                                name="m1Mobile"
                                value={formData.m1Mobile}
                                onChange={handleChange}
                                placeholder="Member 1 Mobile"
                              />
                            </span>
                            <span>
                              <label
                                htmlFor="m1Gender"
                                className="font-squid text-base text-black mb-4"
                              >
                                Member 1 Gender
                              </label>
                              <select
                                className="bg-transparent w-full h-10 indent-1 border-2 border-fuchsia-300   placeholder:text-slate-200 font-outfit px-4 py-2 rounded-md focus:bg-neutral-400 focus:bg-opacity-50 focus:outline-none focus:border-emerald-500 transition-all ease-in-out"
                                name="m1Gender"
                                onChange={handleChange}
                                autoComplete="true"
                                value={formData.m1Gender}
                                required
                              >
                                <option></option>
                                <option>M</option>
                                <option>F</option>
                              </select>
                            </span>
                            <span>
                              <label
                                htmlFor="m2Name"
                                className="font-squid text-base text-black mb-4"
                              >
                                Member 2 Name
                              </label>
                              <input
                                type="text"
                                required
                                className="bg-transparent w-full h-10 indent-1 border-2 border-fuchsia-300 placeholder:text-slate-200 font-outfit  text-sm px-4 py-2 rounded-md focus:bg-neutral-400 focus:bg-opacity-50 focus:outline-none focus:border-emerald-500 transition-all ease-in-out"
                                autoComplete="true"
                                name="m2Name"
                                value={formData.m2Name}
                                onChange={handleChange}
                                placeholder="Member 2 Name"
                              />
                            </span>
                            <span>
                              <label
                                htmlFor="m2Email"
                                className="font-squid text-base text-black mb-4"
                              >
                                Member 2 Email
                              </label>
                              <input
                                type="email"
                                required
                                className="bg-transparent w-full h-10 indent-1 border-2 border-fuchsia-300 placeholder:text-slate-200 font-outfit text-sm px-4 py-2 rounded-md focus:bg-neutral-400 focus:bg-opacity-50 focus:outline-none focus:border-emerald-500 transition-all ease-in-out"
                                autoComplete="true"
                                name="m2Email"
                                value={formData.m2Email}
                                onChange={handleChange}
                                placeholder="Member 2 Email"
                              />
                            </span>
                            <span>
                              <label
                                htmlFor="m2Mobile"
                                className="font-squid text-base text-black mb-4"
                              >
                                Member 2 Mobile
                              </label>
                              <input
                                type="text"
                                required
                                maxLength={10}
                                className="bg-transparent w-full h-10 indent-1 border-2 border-fuchsia-300 placeholder:text-slate-200 font-outfit text-sm px-4 py-2 rounded-md focus:bg-neutral-400 focus:bg-opacity-50 focus:outline-none focus:border-emerald-500 transition-all ease-in-out"
                                autoComplete="true"
                                name="m2Mobile"
                                value={formData.m2Mobile}
                                onChange={handleChange}
                                placeholder="Member 2 Mobile"
                              />
                            </span>
                            <span>
                              <label
                                htmlFor="m2Gender"
                                className="font-squid text-base text-black mb-4"
                              >
                                Member 2 Gender
                              </label>
                              <select
                                className="bg-transparent w-full h-10 indent-1 border-2 border-fuchsia-300   placeholder:text-slate-200 font-outfit px-4 py-2 rounded-md focus:bg-neutral-400 focus:bg-opacity-50 focus:outline-none focus:border-emerald-500 transition-all ease-in-out"
                                name="m2Gender"
                                onChange={handleChange}
                                autoComplete="true"
                                value={formData.m2Gender}
                                required
                              >
                                <option></option>
                                <option>M</option>
                                <option>F</option>
                              </select>
                            </span>
                            <span>
                              <label
                                htmlFor="m3Name"
                                className="font-squid text-base text-black mb-4"
                              >
                                Member 3 Name <p className="text-xs font-outfit text-gray-800 tracking-wide font-bold my-2">(Leave Empty if Team Size 3)</p>
                              </label>
                              <input
                                type="text"

                                className="bg-transparent w-full h-10 indent-1 border-2 border-fuchsia-300 placeholder:text-slate-200 font-outfit text-sm px-4 py-2 rounded-md focus:bg-neutral-400 focus:bg-opacity-50 focus:outline-none focus:border-emerald-500 transition-all ease-in-out"
                                autoComplete="true"
                                name="m3Name"
                                value={formData.m3Name}
                                onChange={handleChange}
                                placeholder="Member 3 Name"
                              />
                            </span>
                            <span>
                              <label
                                htmlFor="m3Email"
                                className="font-squid text-base text-black mb-4"
                              >
                                Member 3 Email <p className="text-xs font-outfit text-gray-800 tracking-wide font-bold my-2">(Leave Empty if Team Size 3)</p>
                              </label>
                              <input
                                type="email"

                                className="bg-transparent w-full h-10 indent-1 border-2 border-fuchsia-300 placeholder:text-slate-200 font-outfit text-sm px-4 py-2 rounded-md focus:bg-neutral-400 focus:bg-opacity-50 focus:outline-none focus:border-emerald-500 transition-all ease-in-out"
                                autoComplete="true"
                                name="m3Email"
                                value={formData.m3Email}
                                onChange={handleChange}
                                placeholder="Member 3 Email"
                              />
                            </span>
                            <span>
                              <label
                                htmlFor="m3Mobile"
                                className="font-squid text-base text-black mb-4"
                              >
                                Member 3 Mobile <p className="text-xs font-outfit text-gray-800 tracking-wide font-bold my-2">(Leave Empty if Team Size 3)</p>
                              </label>
                              <input
                                type="text"

                                maxLength={10}
                                className="bg-transparent w-full h-10 indent-1 border-2 border-fuchsia-300 placeholder:text-slate-200 font-outfit text-sm px-4 py-2 rounded-md focus:bg-neutral-400 focus:bg-opacity-50 focus:outline-none focus:border-emerald-500 transition-all ease-in-out"
                                autoComplete="true"
                                name="m3Mobile"
                                value={formData.m3Mobile}
                                onChange={handleChange}
                                placeholder="Member 3 Mobile"
                              />
                            </span>
                            <span>
                              <label
                                htmlFor="m3Gender"
                                className="font-squid text-base text-black mb-4"
                              >
                                Member 3 Gender <p className="text-xs font-outfit text-gray-800 tracking-wide font-bold my-2">(Leave Empty if Team Size 3)</p>
                              </label>
                              <select
                                className="bg-transparent w-full h-10 indent-1 border-2 border-fuchsia-300   placeholder:text-slate-200 font-outfit px-4 py-2 rounded-md focus:bg-neutral-400 focus:bg-opacity-50 focus:outline-none focus:border-emerald-500 transition-all ease-in-out"
                                name="m3Gender"
                                onChange={handleChange}
                                autoComplete="true"
                                value={formData.m3Gender}
                              >
                                <option></option>
                                <option>M</option>
                                <option>F</option>
                              </select>
                            </span>

                            <button
                              type="submit"
                              className="font-squid px-4 py-2 bg-green-500 text-black  rounded-md hover:bg-green-600"
                            >
                              Save and Next
                            </button>
                          </form>
                        )
                      ) : loading ? (
                        <div className="w-full h-full flex items-center justify-center ">
                          <iframe src="/loading.gif" className="h-[500px] w-auto hide"></iframe>
                        </div>
                      ) : (
                        <form
                          className="flex flex-col  lg:w-full lg:h-[500px] md:h-[470px] max-sm:h-[450px] gap-5  overflow-y-scroll hide"
                          onSubmit={handleFinalSUbmit}
                        >
                          <span>
                            <label
                              htmlFor="password"
                              className="font-squid text-base text-black mb-4"
                            >
                              Password
                            </label>
                            <input
                              type="text"
                              required
                              className="bg-transparent w-full h-10 indent-1 border-2 border-fuchsia-300 placeholder:text-slate-200 font-outfit text-sm px-4 py-2 rounded-md focus:bg-neutral-400 focus:bg-opacity-50 focus:outline-none focus:border-emerald-500 transition-all ease-in-out"
                              autoComplete="true"
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              placeholder="Set Password"
                            />
                          </span>
                          <span>
                            <label
                              htmlFor="cnfPassword"
                              className="font-squid text-base text-black mb-4"
                            >
                              Confirm Password
                              <p className="text-red-600 font-squid text-sm">
                                {formData.password !== cnfPassword
                                  ? "Passwords Don't Match"
                                  : ""}
                              </p>
                            </label>
                            <input
                              type="text"
                              required
                              className="bg-transparent w-full h-10 indent-1 border-2 border-fuchsia-300 placeholder:text-slate-200 font-outfit text-sm px-4 py-2 rounded-md focus:bg-neutral-400 focus:bg-opacity-50 focus:outline-none focus:border-emerald-500 transition-all ease-in-out"
                              autoComplete="true"
                              name="cnfPassword"
                              value={cnfPassword}
                              onChange={handleChange}
                              placeholder="Confirm Password"
                            />
                          </span>
                          <span>
                            <label
                              htmlFor="city"
                              className="font-squid text-base text-black mb-4"
                            >
                              City
                            </label>
                            <input
                              type="text"
                              required
                              className="bg-transparent w-full h-10 indent-1 border-2 border-fuchsia-300 placeholder:text-slate-200 font-outfit text-sm px-4 py-2 rounded-md focus:bg-neutral-400 focus:bg-opacity-50 focus:outline-none focus:border-emerald-500 transition-all ease-in-out"
                              autoComplete="true"
                              name="city"
                              value={formData.city}
                              onChange={handleChange}
                              placeholder="City"
                            />
                          </span>
                          <span>
                            <label
                              htmlFor="college"
                              className="font-squid text-base text-black mb-4"
                            >
                              College
                            </label>
                            <input
                              type="text"
                              required
                              className="bg-transparent w-full h-10 indent-1 border-2 border-fuchsia-300 placeholder:text-slate-200 font-outfit text-sm px-4 py-2 rounded-md focus:bg-neutral-400 focus:bg-opacity-50 focus:outline-none focus:border-emerald-500 transition-all ease-in-out"
                              autoComplete="true"
                              name="college"
                              value={formData.college}
                              onChange={handleChange}
                              placeholder="College"
                            />
                          </span>
                          <span>
                            <label
                              htmlFor="paymentReferenceID"
                              className="font-squid text-base text-black mb-4"
                            >
                              Payment Reference ID / UTR Number
                            </label>
                            <input
                              type="text"
                              required
                              className="bg-transparent w-full h-10 indent-1 border-2 border-fuchsia-300 placeholder:text-slate-200 font-outfit text-sm px-4 py-2 rounded-md focus:bg-neutral-400 focus:bg-opacity-50 focus:outline-none focus:border-emerald-500 transition-all ease-in-out"
                              autoComplete="true"
                              name="paymentReferenceID"
                              value={formData.paymentReferenceID}
                              onChange={handleChange}
                              placeholder="Payment Reference ID"
                            />
                          </span>
                          <span>
                            <label
                              htmlFor="paymentScreenShotLink"
                              className="font-squid text-base text-black mb-4"
                            >
                              Payment Screenshot/ PDF
                            </label>
                            <input
                              type="file"
                              required
                              className="bg-transparent w-full h-10 indent-1 border-2 border-fuchsia-300 placeholder:text-slate-200 font-outfit text-sm px-4 py-2 rounded-md focus:bg-neutral-400 focus:bg-opacity-50 focus:outline-none focus:border-emerald-500 transition-all ease-in-out"
                              autoComplete="true"
                              name="paymentScreenShotLink"
                              onChange={handleChange}
                            />
                          </span>


                          <button
                            type="submit"
                            className="font-squid px-4 py-2 bg-green-500 text-black  rounded-md hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-red-500"
                            disabled={formData.password !== cnfPassword || loading}
                          >
                            {loading ? "Wait..." : "Register"}
                          </button>

                        </form>
                      )}
                    </>
                  )


              }
            </div>
          </div>)}
      <Footer />
    </>
  );
};

export default RegistrationForm;
