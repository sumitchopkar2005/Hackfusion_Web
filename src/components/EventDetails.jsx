import React from "react";

const EventDetails = () => {
  return (
    <div
      id="event-details"
      className="max-w-5xl mx-auto px-6 py-12 text-center md:text-left"
    >
      <h2 className="text-4xl md:text-5xl font-bold mb-6 text-red-500">
        Event Details
      </h2>
      <p className="text-lg leading-7 mb-8">
        HackFusion is the ultimate challenge for tech enthusiasts. Immerse
        yourself in innovation and compete with the brightest minds.
      </p>

      {/* Rules Section */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
        <h3 className="text-2xl font-bold text-pink-500 mb-4">Rules</h3>
        <ul className="list-disc list-inside space-y-2">
          <li>Team size: 1-4 participants</li>
          <li>Code submission deadline: 24 hours</li>
          <li>No plagiarism is allowed.</li>
          <li>Each team must register by the deadline.</li>
        </ul>
      </div>

      {/* Registration Link */}
      <a
        href="https://swagdevs.vercel.app/"
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full transition duration-300"
      >
        Register Now
      </a>
    </div>
  );
};

export default EventDetails;
