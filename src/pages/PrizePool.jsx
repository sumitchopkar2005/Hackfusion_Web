import React from "react";

function PrizePool() {
  return (
    <div className="bg-gradient-to-r from-purple-800 via-purple-600 to-blue-500 text-white min-h-screen">
      <h2 className="text-3xl font-bold text-center py-10">Prize Pool</h2>
      <p className="text-center text-lg">
        Total Prize Worth: <span className="font-bold text-yellow-400">₹1,00,000</span>
      </p>
      <div className="flex justify-center mt-6">
        <ul className="space-y-4 text-center">
          <li>🥇 First Place: ₹50,000</li>
          <li>🥈 Second Place: ₹30,000</li>
          <li>🥉 Third Place: ₹20,000</li>
        </ul>
      </div>
    </div>
  );
}

export default PrizePool;

