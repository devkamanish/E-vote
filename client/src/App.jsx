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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-white">
      <nav className="flex flex-wrap justify-between items-center p-4 bg-white shadow-md">
        <h1
          onClick={() => navigate("/")}
          className="text-xl font-bold text-blue-600 cursor-pointer"
        >
          🗳️ Voting App
        </h1>
        <div className="flex flex-wrap gap-3 items-center">
          {user ? (
            <>
              <button
                onClick={() => navigate("/vote")}
                className="text-sm md:text-base px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
              >
                Vote
              </button>
              {user.email === "bhoomikadewka@gmail.com" && (
                <button
                  onClick={() => navigate("/admin")}
                  className="text-sm md:text-base px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600"
                >
                  Admin
                </button>
              )}
              <button
                onClick={handleLogout}
                className="text-sm md:text-base px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="text-sm md:text-base px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
              >
                Sign Up / Login
              </Link>
              <Link
                to="/otp"
                className="text-sm md:text-base px-4 py-2 rounded-lg border border-blue-400 text-blue-600 hover:bg-blue-50"
              >
                OTP Login
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthForm setUser={setUser} />} />
          <Route path="/otp" element={<OtpForm setUser={setUser} />} />
          <Route path="/vote" element={<VoterPage user={user} />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
    </div>
  );
}

function Home() {
  return (
    <div className="text-center max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">
        Welcome to the Voting App
      </h2>
      <p className="text-gray-600">
        Sign up or log in to cast your vote for your preferred party. The admin
        can view all votes in real time.
      </p>
    </div>
  );
}

export default App;
