import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Schedule from "./pages/Schedule";
import RegistrationForm from "./pages/RegistrationForm";
import { BackgroundGradientAnimation } from "./components/ui/background-gradient-animation";
import Sponsor from "./pages/Sponsor";
import Contact from "./pages/Contact";
import SplashScreen from "./components/SplashScreen";
import FirebaseStats from "./pages/FirebaseStats";
// import MaleParticipantsOutsideCampus from "./pages/Male";
import CountDown from "./pages/CountDown";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Receipt from './pages/Receipt';

function App() {
  const [splashScreen, setSplashScreen] = useState(true);
  const handleSplashEnd = () => {
    setSplashScreen(false);
  };
  return (
    <Router>
       {splashScreen ?
        <SplashScreen onEnd={handleSplashEnd} />
        : 
        <BackgroundGradientAnimation>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/registration" element={<RegistrationForm/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/sponsors" element={<Sponsor/>} />
            <Route path="/schedule" element={<Schedule/>} />
            <Route path="/contact" element={<Contact/>} />
            <Route path="/admin" element={<FirebaseStats/>} />
            <Route path="/receipt" element={<Receipt />} />
            <Route path="/CountDown" element={<CountDown/>}/>
          </Routes>
        </BackgroundGradientAnimation>
      }
    </Router>
  );
}

export default App;
