import React, { useState, useEffect } from "react";

export default function CountDown() {
    const initialTime = 36 * 60 * 60; // 36 hours in seconds
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(true);

    useEffect(() => {
        let timer;
        if (isRunning && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isRunning, timeLeft]);

    const toggleTimer = () => {
        setIsRunning(!isRunning);
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    return (
        <div className="flex flex-col items-center mt-20 ">
            <h1 className="absolute z-50 font-squid drop-shadow-[0_0_10px_#ff69b4] text-white  text-7xl mb-48 font-bold ">Let's Play</h1>
            <div className="absolute z-50 w-full h-full flex flex-col items-center justify-center min-h-screen bg-transparent text-white">

                <img src="/master-mask.png" className="absolute z-30 opacity-60 h-3/4 w-auto" />
                <div className="absolute   flex items-center justify-center z-50 text-7xl  font-prize tracking-widest text-yellow-400  px-12 py-6">
                    {formatTime(timeLeft)}
                </div>
                {/* <button
                onClick={toggleTimer}
                className=" absolute z-50 mt-48 bg-opacity-50 flex items-center justify-center px-4 py-2 text-2xl font-prize tracking-wider  text-red-600 font-bold hover:bg-green-500 rounded-lg  outline-none cursor-pointer transition-all"
            >
                {isRunning ? "X" : "Resume"}
            </button> */}
            </div>
        </div>
    );
}
