import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import trisqc from "/trisqc.png"
import AOS from "aos"
import "aos/dist/aos.css"
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
 
  useEffect(()=>{
    AOS.init();
  },[]) 

  return (
    <>
  <div className={`relative z-[9000]  text-white py-4 w-full h-fit  `} data-aos="fade-down" id="abc">
      <div className="container sm:backdrop-blur-3xl mx-auto sm:w-3/4 flex flex-wrap rounded-2xl justify-between items-center px-4 sm:px-6 lg:px-8">
        {/* Logo Section */}

        {/* Navigation Links for Larger Screens */}
        <ul className="hidden  justify-center w-full py-2  ml-7 items-center sm:flex space-x-6">
          <li>
            <Link to="" className="hover:text-pink-400 cursor-pointer transition font-squid">Home</Link>
          </li>
          <li>
            <Link to="/sponsors" className="hover:text-pink-400 cursor-pointer transition font-squid">Sponsors</Link>
          </li>
          <img src={trisqc} className="w-auto h-[45px] " />
          <li>
            <Link to="/schedule" className="hover:text-pink-400 cursor-pointer transition font-squid">Schedule</Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-pink-400 cursor-pointer transition font-squid">Contact</Link>
          </li>
        </ul>

        {/* Hamburger Menu for Smaller Screens */}
        <div className="sm:hidden ">
          <button
            id="menu-button"
            className="text-white focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              // Close Icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // Hamburger Icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Dropdown Menu for Small Screens */}
      {menuOpen && (
  <div className="flex flex-col absolute z-[9999] space-y-2 text-center  bg-black/75 p-4 top-16 left-0 w-full sm:hidden">
          <Link
            to="/"
            className="hover:text-pink-400 font-squid cursor-pointer transition"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/sponsors"
            className="hover:text-pink-400 font-squid cursor-pointer transition"
            onClick={() => setMenuOpen(false)}
          >
            Sponsors
          </Link>
          <Link
            to="/schedule"
            className="hover:text-pink-400 font-squid cursor-pointer transition"
            onClick={() => setMenuOpen(false)}
          >
            Schedule
          </Link>
          <Link
            to="/contact"
            className="hover:text-pink-400 font-squid cursor-pointer transition"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </Link>
        </div>

      )}
    </div>
    {menuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-md z-[8999]"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
    </>
  );
}

export default Navbar;