import { useEffect } from "react";
import { useState } from "react";
import Footer from "../components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";
function Schedule() {
  const [activeTab, setActiveTab] = useState("day1");
  useEffect(() => {
    AOS.init();
  }, []);
  const scheduleData = {
    day1: [
      {
        time: "20 December 2025",
        title: "Registration & Abstract Submission Starts",
        speaker: "",
        role: "",
        image: "/api/placeholder/80/80",
      },
      {
        time: "10 February 2026",
        title: "Registration & Abstract Submission Ends",
        speaker: "",
        role: "",
        image: "/api/placeholder/80/80",
      },
      {
        time: "12 February 2026",
        title: "Announcement of Selected Participants",
        speaker: "",
        role: "",
        image: "/api/placeholder/80/80",
      },
      {
        time: "27 February 2026",
        title: "Offline Hackathon Begins",
        speaker: "",
        role: "",
        image: "/api/placeholder/80/80",
      },
      // {
      //   time: "12.00 am",
      //   title: "Coffee/Tea Break",
      //   speaker: "",
      //   role: "",
      //   image: "/api/placeholder/80/80",
      // },
    ],
    // day2: [
    //   {
    //     time: "8.00am",
    //     title: "Breakfast & Coffee",
    //     speaker: "",
    //     role: "",
    //     image: "/api/placeholder/80/80",
    //   },
    //   {
    //     time: "9.00 am",
    //     title:
    //       '1st Evaluation", "Respective seats", "End of First Invigilation',
    //     speaker: "",
    //     role: "",
    //     image: "/api/placeholder/80/80",
    //   },
    //   {
    //     time: "12.00 pm",
    //     title: "Lunch Break",
    //     speaker: "",
    //     role: "",
    //     image: "/api/placeholder/80/80",
    //   },
    //   {
    //     time: "4.00 pm",
    //     title: "Game for all participants",
    //     speaker: "",
    //     role: "",
    //     image: "/api/placeholder/80/80",
    //   },
    //   {
    //     time: "5.00 pm",
    //     title: "2nd Evaluation",
    //     speaker: "",
    //     role: "",
    //     image: "/api/placeholder/80/80",
    //   },
    //   {
    //     time: "8.00 pm",
    //     title: 'Dinner Break", "End of Secod Invigilation',
    //     speaker: "",
    //     role: "",
    //     image: "/api/placeholder/80/80",
    //   },
    //   {
    //     time: "12.00 am",
    //     title: "Coffee/Tea Break",
    //     speaker: "",
    //     role: "",
    //     image: "/api/placeholder/80/80",
    //   },
    // ],
    // day3: [
    //   {
    //     time: "8.00 am",
    //     title: "Breakfast & Coffee/Tea",
    //     speaker: "",
    //     role: "",
    //     image: "/api/placeholder/80/80",
    //   },
    //   {
    //     time: "9.00 am",
    //     title: "Hackathon Ends",
    //     speaker: "",
    //     role: "",
    //     image: "/api/placeholder/80/80",
    //   },
    //   {
    //     time: "11.00 am",
    //     title: "Final evaluation (presentation to judges)",
    //     speaker: "",
    //     role: "",
    //     image: "/api/placeholder/80/80",
    //   },
    //   {
    //     time: "4.00 pm",
    //     title: "Award ceremony!!!",
    //     speaker: "",
    //     role: "",
    //     image: "/api/placeholder/80/80",
    //   },
    // ],
  };

  const tabs = [
    { id: "day1", label: "Day 1", date: "21 Feb, 2025" },
    { id: "day2", label: "Day 2", date: "22 Feb, 2025" },
    { id: "day3", label: "Day 3", date: "23 Feb, 2025" },
  ];
  return (
    <>
    
      <div className="flex justify-center text-center min-h-fit" data-aos="fade-down">
         <h1 className="text-4xl z-100 font-bold title-font mt- text-center text-white font-squid transition-all ease-in-out drop-shadow-[0_0_10px_#ff69b4] ">TimeLine</h1>
      </div>
      <div
        className="absolute z-30 inset-0 overflow-y-auto"
        data-aos="fade-up-left"
      >
                <div className="flex justify-center items-center min-h-screen">
          <div className=" container lg:mx-auto mt- max-sm:px-1">
            <div className="flex flex-col position-relative bg-opacity-90 rounded-2xl ">
              {/* <nav
                className="flex justify-center space-x-4 mb-8 tracking-wide font-outfit"
                role="tablist"
              >
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-1/3 text-center px-6 py-4 font-bold rounded-md shadow-md transition duration-300 ${
                      activeTab === tab.id
                        ? "bg-yellow-500 text-[#2a75bb]"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                  >
                    <h2 className="text-lg">{tab.label}</h2>
                    <p className="text-sm">{tab.date}</p>
                  </button>
                ))}
              </nav> */}

              <div className="tab-content ">
                <ul className="space-y-4 font-outfit tracking-wide ">
                  {scheduleData[activeTab].map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center min-w-64 justify-center gap-8 bg-gray-100 p-2 rounded-lg shadow-lg"
                    >
                      <h4 className="text-[#2a75bb] font-bold">{item.time}</h4>
                      <div className="flex-1 px-4 items-center justify-center">
                        <h3 className="text-lg font-bold mb-2 max-sm:text-sm">
                          {item.title}
                        </h3>
                        {item.speaker && (
                        <>
                          <span className="text-sm font-semibold">By {item.speaker}</span>
                          <p className="text-sm text-gray-600">{item.role}</p>
                        </>
                      )}
                         {item.description && (
                        <p className="text-sm text-gray-600">{item.description}</p>
                      )} 
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Schedule;
