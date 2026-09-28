import React from "react";

const HeroSection = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center relative bg-gradient-to-r from-red-700 to-black">
      
      <div className="absolute top-10 left-10 w-20 h-20 bg-red-500 rounded-full"></div>
      <div className="absolute top-10 right-10 w-20 h-20 bg-red-500 transform rotate-45"></div>
      <div className="absolute bottom-10 left-10 w-20 h-20 bg-red-500"></div>

       
      <h1 className="text-5xl md:text-6xl font-bold tracking-wide mb-4">
        <span className="text-pink-500">HackFusion 2024</span>
      </h1>
      <p className="text-xl md:text-2xl mb-6">
        Where <span className="text-red-500 font-bold">Ideas</span>,{" "}
        <span className="text-pink-500 font-bold">Code</span>, and{" "}
        <span className="text-blue-500 font-bold">Innovation</span> collide.
      </p>

      
      <a
        href="#event-details"
        className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 shadow-lg"
      >
        Explore the Rules
      </a>
    </div>
  );
};

export default HeroSection;
