"use client";

import React, { useEffect, useState } from 'react';

const Countdown = () => {
  const calculateTimeLeft = () => {
    const difference = +new Date(`2024-06-30`) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <div className="countdown text-white text-4xl">
      <span>{timeLeft.days || '00'}</span> : <span>{timeLeft.hours || '00'}</span> : <span>{timeLeft.minutes || '00'}</span> : <span>{timeLeft.seconds || '00'}</span>
    </div>
  );
};

const Home = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-cover bg-center"  >
      <div className="text-center">
        <h1 className="text-6xl font-bold text-black mb-8">Coming Soon!</h1>
        <p className="text-2xl text-black mb-16">Our website will be live soon. Stay tuned!</p>
        <Countdown />
      </div>
    </div>
  );
};

export default Home;
