import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { ref, onValue } from "firebase/database";

const FirebaseStats = () => {
  const [stats, setStats] = useState({
    totalTeams: 0,
    totalMembers: 0,
    totalBoys: 0,
    totalGirls: 0,
    outOfCampus: 0,
    outOfMaharashtra: 0,
    teams: {},
  });

  useEffect(() => {
    const userRef = ref(db, "user2");
    onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        let totalTeams = Object.keys(data).length;
        let totalMembers = 0;
        let totalBoys = 0;
        let totalGirls = 0;
        let outOfCampus = 0;
        let outOfMaharashtra = 0;
        let teams = {};

        Object.entries(data).forEach(([teamId, teamData]) => {
          let teamMembers = 0;
          let teamBoys = 0;
          let teamGirls = 0;
          let teamOutOfCampus = 0;
          let college = teamData.college;
          let city = teamData.city;

          const validCampusNames = [
            "SGGSIE&T, Nanded",
            "SGGS, Nanded",
            "Shri Guru Gobind Singhji College of Engineering and Technology, Nanded",
            "Shri Guru Gobind Singhji Institute of Engineering &Technology",
            "SGGSIE&T , Nanded",
            "SGGS",
            "SGGSEI&T",
            "Shri Guru Gobind Singhji Institute of Engineering and Technology, Vishnupuri, Nanded",
            "Shri guru gobind sing ji institute of technology nanded",
            "Shri guru gobind singhji institute of engineering and technology",
            "Shri guru gobind singhji institute of engineering and technology ,vishnupuri ,nanded",
            "Shri Guru Gobind Singhji Institute of Engineering & Technology, Nanded",
            "Shri Guru Gobind Singhji Institute Of Engineering And Technology Vishnupuri Nanded",
            "Shri Guru Gobind Singhji Institute of Engineering and Technology",
            "Shri guru gobind singhji institute of engineering and technology vishnupuri nanded",
            "Shri Guru Gobind Singhji Institute of Engineering and Technology Nanded",
            "Shree guru Gobind Singhji institute of engineering and technology",
            "Shri Guru Gobind Singhji Institute of Engineering and Technology, Nanded",
            "shri guru gobind singhji institute of engineering and technology",
            "Shri Guru Gobind Singh ji Institute of Engineering & Technology and technology vishnupuri nanded",
            "shri guru govind singhji institute of engineering and technology,Nanded",
            "SGGS,Nanded",
            "Sggs"
          ];

          if (!validCampusNames.includes(college)) {
            outOfCampus++;
            teamOutOfCampus++;
          }

          if (city && city !== "Maharashtra") {
            outOfMaharashtra++;
          }

          ["lead", "m1", "m2", "m3"].forEach((key) => {
            if (teamData[`${key}Name`]) {
              totalMembers++;
              teamMembers++;
              if (teamData[`${key}Gender`] === "M") {
                totalBoys++;
                teamBoys++;
              } else if (teamData[`${key}Gender`] === "F") {
                totalGirls++;
                teamGirls++;
              }
            }
          });

          teams[teamId] = {
            teamName: teamData.teamName,
            teamMembers,
            teamBoys,
            teamGirls,
            teamOutOfCampus,
            teamCollege: teamData.college,
            teamCity: teamData.city,
          };
        });

        setStats({
          totalTeams,
          totalMembers,
          totalBoys,
          totalGirls,
          outOfCampus,
          outOfMaharashtra,
          teams,
        });
      }
    });
  }, []);

  return (
    <div className="absolute z-50 w-full h-full hide overflow-scroll p-10 bg-white ">
      <h2 className="text-2xl text-center font-bold mb-6 font-squid tracking-wider">HackFusion Statistics</h2>
      <div className="mb-4">
        <p className="font-outfit">Total Teams: {stats.totalTeams}</p>
        <p className="font-outfit">Total Members: {stats.totalMembers}</p>
        <p className="font-outfit">Total Boys: {stats.totalBoys}</p>
        <p className="font-outfit">Total Girls: {stats.totalGirls}</p>
        <p className="font-outfit">Teams Out of Campus: {stats.outOfCampus}</p>
        {/* <p className="font-outfit">Teams from Out of Maharashtra: {stats.outOfMaharashtra}</p> */}
      </div>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2 font-outfit">Team Name</th>
            <th className="border border-gray-300 px-4 py-2 font-outfit">Total Members</th>
            <th className="border border-gray-300 px-4 py-2 font-outfit">Boys</th>
            <th className="border border-gray-300 px-4 py-2 font-outfit">Girls</th>
            <th className="border border-gray-300 px-4 py-2 font-outfit">Out of Campus</th>
            <th className="border border-gray-300 px-4 py-2 font-outfit">College</th>
            <th className="border border-gray-300 px-4 py-2 font-outfit">City</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(stats.teams).map(([teamId, team]) => (
            <tr key={teamId} className="text-center border-t">
              <td className="border border-gray-300 px-4 py-2 font-outfit">{team.teamName}</td>
              <td className="border border-gray-300 px-4 py-2 font-outfit">{team.teamMembers}</td>
              <td className="border border-gray-300 px-4 py-2 font-outfit">{team.teamBoys}</td>
              <td className="border border-gray-300 px-4 py-2 font-outfit">{team.teamGirls}</td>
              <td className="border border-gray-300 px-4 py-2 font-outfit">{team.teamOutOfCampus ? "Yes" : "No"}</td>
              <td className="border border-gray-300 px-4 py-2 font-outfit">{team.teamCollege}</td>
              <td className="border border-gray-300 px-4 py-2 font-outfit">{team.teamCity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FirebaseStats;
