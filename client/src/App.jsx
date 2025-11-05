import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import OtpForm from "./components/OtpForm";
import VoterPage from "./components/VoterPage";
import AdminPage from "./components/AdminPage";
import { api } from "./api";

function App() {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-blue-50 to-white">
      {/* Navbar */}
      <nav className="flex flex-wrap justify-between items-center p-4 bg-white shadow-md">
        <h1
          onClick={() => navigate("/")}
          className="text-xl md:text-2xl font-bold text-blue-600 cursor-pointer flex items-center gap-2"
        >
          🗳️ Voting App
        </h1>

        <div className="flex flex-wrap gap-3 items-center">
          {user ? (
            <>
              <button
                onClick={() => navigate("/vote")}
                className="text-sm md:text-base px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                Vote
              </button>
              {user.email === "bhoomikadewka@gmail.com" && (
                <button
                  onClick={() => navigate("/admin")}
                  className="text-sm md:text-base px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition"
                >
                  Admin
                </button>
              )}
              <button
                onClick={handleLogout}
                className="text-sm md:text-base px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="text-sm md:text-base px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                Sign Up / Login
              </Link>
              <Link
                to="/otp"
                className="text-sm md:text-base px-4 py-2 rounded-lg border border-blue-400 text-blue-600 hover:bg-blue-50 transition"
              >
                OTP Login
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <Routes>
          <Route path="/" element={<Home navigate={navigate} />} />
          <Route path="/auth" element={<AuthForm setUser={setUser} />} />
          <Route path="/otp" element={<OtpForm setUser={setUser} />} />
          <Route path="/vote" element={<VoterPage user={user} />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
    </div>
  );
}

/* Interactive Home Section */
function Home({ navigate }) {
  return (
    <div className="text-center max-w-3xl mx-auto bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-blue-100 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-300/30 via-transparent to-blue-500/20 blur-2xl"></div>

      <div className="relative z-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-blue-600 mb-3">
          Online Election
        </h2>
        <p className="text-lg text-blue-800 font-semibold mb-6">
          The Future of Voting Starts Here
        </p>

        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
            <img
              src="https://cdn-icons-png.flaticon.com/512/5532/5532973.png"
              alt="Voting illustration"
              className="relative z-10 w-40 h-40 object-contain mx-auto"
            />
          </div>
        </div>

        <p className="text-gray-700 mb-6">
          Securely cast your vote from anywhere in the world. With our advanced
          online voting system, authentication and transparency are guaranteed.
          Be part of the digital democracy revolution!
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate("/auth")}
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition transform hover:scale-105"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("/otp")}
            className="px-6 py-3 rounded-lg border border-blue-600 text-blue-700 font-semibold hover:bg-blue-50 transition transform hover:scale-105"
          >
            OTP Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
