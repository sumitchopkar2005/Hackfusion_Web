import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithFirebase } from "../services/firebaseDb";

function Login() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await loginWithFirebase(loginData.email, loginData.password);

      if (response.success) {
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem("authToken", response.data.token);

        alert("Login successful!");
        navigate("/dashboard");
      } else {
        setErrorMsg(response.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert("Forgot password functionality would go here");
  };

  const handleRegister = (e) => {
    e.preventDefault();
    navigate("/register");
  };

  return (
    <div className="fixed inset-0 z-30 min-h-screen flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        {/* Pokeball decoration */}
        <div className="absolute -bottom-20 -left-10 w-24 h-24">
          <div className="relative w-full h-full">
            <div className="absolute w-full h-full bg-white rounded-full border-4 border-black"></div>
            <div className="absolute top-1/2 w-full h-4 bg-black -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-white rounded-full border-4 border-black -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>

        <div className="bg-gray-800/80 rounded-2xl shadow-2xl p-8 relative overflow-hidden border-4 border-yellow-500">
          {/* Decorative elements */}
          <div className="absolute -top-4 -left-4 w-16 h-16 bg-red-600 rounded-full opacity-30"></div>
          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-blue-600 rounded-full opacity-30"></div>

          <div className="text-center mb-2 relative z-10">
            <img
              src="/logon.png"
              className="h-20 w-auto sm:h-12 md:h-auto md:w-[600px] mx-auto"
              alt="Logo"
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Member Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={loginData.email}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 placeholder-gray-400"
                  placeholder="ash.ketchum@pokemon.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={loginData.password}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 placeholder-gray-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={loginData.rememberMe}
                onChange={handleInputChange}
                className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 bg-gray-700 border-gray-600 rounded"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-gray-300 cursor-pointer"
              >
                Remember me
              </label>
            </div>

            {errorMsg && (
              <p className="text-red-400 text-sm text-center">{errorMsg}</p>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition transform hover:scale-105"
              >
                {loading ? "Logging in..." : (
                  <span className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      ></path>
                    </svg>
                    Login to Dashboard
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* <div className="mt-6 text-center">
            <a 
              href="#" 
              className="text-sm text-blue-400 hover:text-blue-300"
              onClick={handleForgotPassword}
            >
              Forgot your password?
            </a>
          </div> */}

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Not Registered yet?{" "}
              <a 
                href="#" 
                className="text-blue-400 hover:text-blue-300"
                onClick={handleRegister}
              >
                Register for a new account
              </a>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            © 2026 HackFusion. Gotta code &apos;em all!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
