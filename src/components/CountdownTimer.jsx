import React, { useState, useEffect } from 'react';

const AnimatedNumber = ({ value, label }) => {
  const [animation, setAnimation] = useState('animate-none');

  useEffect(() => {
    setAnimation('animate-flip');
    const timer = setTimeout(() => setAnimation('animate-none'), 500);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="flex items-baseline">
      <span 
        className={`text-2xl sm:text-3xl md:text-4xl font-bold text-white-500 mr-1 sm:mr-2 transition-all duration-500 ${animation}`}
        style={{
          perspective: '1000px',
          display: 'inline-block',
          transformStyle: 'preserve-3d'
        }}
      >
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-xs sm:text-sm">{label}</span>
    </div>
  );
};

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(targetDate);
      const now = new Date();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex flex-wrap justify-center items-center space-x-2 sm:space-x-4 md:space-x-8 mt-4 sm:mt-6 font-squid">
      <style>
        {`
          @keyframes flip {
            0% {
              transform: rotateX(0deg);
            }
            50% {
              transform: rotateX(90deg);
            }
            100% {
              transform: rotateX(0deg);
            }
          }
          .animate-flip {
            animation: flip 0.6s ease-in-out;
          }
        `}
      </style>
      <AnimatedNumber 
        value={timeLeft.days} 
        label={timeLeft.days === 1 ? 'Day' : 'Days'} 
      />
      <AnimatedNumber 
        value={timeLeft.hours} 
        label="Hours" 
      />
      <AnimatedNumber 
        value={timeLeft.minutes} 
        label="Min" 
      />
      <AnimatedNumber 
        value={timeLeft.seconds} 
        label="Sec" 
      />
    </div>
  );
};

export default CountdownTimer;