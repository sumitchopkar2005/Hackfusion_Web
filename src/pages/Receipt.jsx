import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function Receipt() {
  const [searchParams] = useSearchParams();
  const [receiptData, setReceiptData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const receiptRef = useRef(null);
  const navigate = useNavigate();

  // Get team_id from URL params
  const teamId = searchParams.get("team_id");

  useEffect(() => {
    if (!teamId) {
      setError("team_id missing in URL");
      setLoading(false);
      return;
    }

    // Fetch receipt data
    fetch(
      `https://swagserver.co.in/hackfusion/generate_receipt.php?team_id=${teamId}`
    )
      .then((res) => res.json())
      .then((json) => {
        if (!json.success) {
          setError(json.message);
          setLoading(false);
          return;
        }
        setReceiptData(json.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load receipt data");
        setLoading(false);
      });
  }, [teamId]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    // Convert "YYYY-MM-DD HH:mm:ss" → ISO
    const isoString = dateString.replace(" ", "T");

    const date = new Date(isoString);

    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const downloadPDF = async () => {
    const element = receiptRef.current;

    // 👉 Enable PDF mode
    element.classList.add("pdf-mode");

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff", // 🔥 important
      scrollY: -window.scrollY,
    });

    // 👉 Disable PDF mode (restore dark UI)
    element.classList.remove("pdf-mode");

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = 210;
    const pageHeight = 297;

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const y = imgHeight > pageHeight ? 0 : (pageHeight - imgHeight) / 2;

    pdf.addImage(imgData, "PNG", 0, y, imgWidth, imgHeight);
    pdf.save(`HackFusion_Receipt_${receiptData.team_name}.pdf`);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-30 min-h-screen flex items-center justify-center p-4 bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-300 text-lg">Loading receipt...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-30 min-h-screen flex items-center justify-center p-4 bg-gray-900">
        <div className="bg-gray-800/80 p-8 rounded-2xl shadow-2xl max-w-md border-4 border-red-500">
          <div className="text-center">
            <svg
              className="mx-auto h-16 w-16 text-red-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold mb-2 text-red-400">Error</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-30 overflow-y-auto pt-28 py-8 px-4 bg-gray-900">
      {/* Download Button */}
      <button
        onClick={downloadPDF}
        className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition transform hover:scale-105 mb-4"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        Download PDF Receipt
      </button>

      <div className="w-[1024px] mx-auto relative">
        <div
          className="bg-gray-800/80 rounded-2xl shadow-2xl p-6 md:p-8 border-4 border-yellow-500 relative overflow-hidden"
          ref={receiptRef}
        >
          {/* Decorative elements */}
          <div className="absolute -top-4 -left-4 w-16 h-16 bg-red-600 rounded-full opacity-30"></div>
          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-blue-600 rounded-full opacity-30"></div>

          {/* Header */}
          <div className="border-b-2 border-yellow-500 pb-6 mb-6 relative z-10">
            <div className="flex items-center justify-center md:justify-between gap-4">
              {/* Logo */}
              <img
                src="/logon.png"
                className="w-80 md:w-80"
                alt="HackFusion Logo"
              />

              {/* Text */}
              <div className="text-center md:text-right">
                <h1 className="text-3xl md:text-4xl font-bold text-yellow-400">
                  Payment Receipt
                </h1>
                <p className="text-gray-400 mt-1">
                  Official Registration Confirmation
                </p>
              </div>
            </div>
          </div>

          {/* Payment Info Section */}
          <div className="mb-6 bg-gray-700/50 rounded-xl p-4 md:p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Payment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800/70 p-3 rounded-lg">
                <span className="text-gray-400 text-sm">Order ID:</span>
                <p className="text-white font-semibold">
                  {receiptData.order_id}
                </p>
              </div>
              <div className="bg-gray-800/70 p-3 rounded-lg">
                <span className="text-gray-400 text-sm">UPI Reference:</span>
                <p className="text-white font-semibold">
                  {receiptData.payment_ref_no || "N/A"}
                </p>
              </div>
              <div className="bg-gray-800/70 p-3 rounded-lg">
                <span className="text-gray-400 text-sm">Registered At:</span>
                <p className="text-white font-semibold">
                  {formatDate(receiptData.registered_at)}
                </p>
              </div>
              <div className="bg-gray-800/70 p-3 rounded-lg">
                <span className="text-gray-400 text-sm">
                  Registration Status:
                </span>
                <p
                  className={`font-semibold ${
                    receiptData.registration_status === "confirmed"
                      ? "text-green-400"
                      : "text-blue-400"
                  }`}
                >
                  {receiptData.registration_status}
                </p>
              </div>
            </div>
          </div>

          {/* Team Details Section */}
          <div className="mb-6 bg-gray-700/50 rounded-xl p-4 md:p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Team Details
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-gray-600">
                    <th className="bg-gray-800/70 p-3 text-left text-gray-300 font-medium">
                      Team Name
                    </th>
                    <td className="p-3 text-white font-semibold">
                      {receiptData.team_name}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-600">
                    <th className="bg-gray-800/70 p-3 text-left text-gray-300 font-medium">
                      Theme
                    </th>
                    <td className="p-3 text-white">{receiptData.theme}</td>
                  </tr>
                  <tr className="border-b border-gray-600">
                    <th className="bg-gray-800/70 p-3 text-left text-gray-300 font-medium">
                      College
                    </th>
                    <td className="p-3 text-white">{receiptData.college}</td>
                  </tr>
                  <tr className="border-b border-gray-600">
                    <th className="bg-gray-800/70 p-3 text-left text-gray-300 font-medium">
                      City
                    </th>
                    <td className="p-3 text-white">{receiptData.city}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Team Members Section */}
          <div className="mb-6 bg-gray-700/50 rounded-xl p-4 md:p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              Team Members
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-800/70">
                    <th className="p-3 text-left text-gray-300 font-medium">
                      #
                    </th>
                    <th className="p-3 text-left text-gray-300 font-medium">
                      Name
                    </th>
                    <th className="p-3 text-left text-gray-300 font-medium">
                      Email
                    </th>
                    <th className="p-3 text-left text-gray-300 font-medium">
                      Mobile
                    </th>
                    <th className="p-3 text-left text-gray-300 font-medium">
                      Lead
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {receiptData.members.map((member, index) => (
                    <tr key={index} className="border-b border-gray-600">
                      <td className="p-3 text-white">{index + 1}</td>
                      <td className="p-3 text-white font-medium">
                        {member.name}
                      </td>
                      <td className="p-3 text-gray-300 text-sm">
                        {member.email}
                      </td>
                      <td className="p-3 text-gray-300">{member.mobile}</td>
                      <td className="p-3">
                        {member.is_lead == 1 ? (
                          <span className="px-2 py-1 bg-yellow-500 text-gray-900 rounded-full text-xs font-semibold">
                            Yes
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">No</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Hackathon Dates Section */}
<div className="mb-6 bg-gray-700/50 rounded-xl p-4 md:p-6">
  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
    <svg
      className="w-6 h-6 mr-2 text-yellow-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 7V3m8 4V3m-9 8h10m-11 9h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2z"
      />
    </svg>
    Hackathon Dates
  </h3>

  <div className="bg-gray-800/70 p-3 rounded-lg">
    <span className="text-gray-400 text-sm">Event Duration:</span>
    <p className="text-white font-semibold">
      27 February 2026 to 1 March 2026
    </p>
  </div>
</div>

          {/* Footer */}
          <div className="text-center mt-8 pt-6 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              This is a system generated receipt.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              © 2026 HackFusion. Gotta code &apos;em all!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Receipt;
