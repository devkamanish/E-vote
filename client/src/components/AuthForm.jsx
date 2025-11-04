import React, { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

export default function AuthForm({ setUser }) {
  const [isRegister, setIsRegister] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    number: "",
    state: "",
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const data = await api(endpoint, { method: "POST", body: form });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setMsg("Success!");
      navigate("/vote");
    } catch (err) {
      setMsg(err?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
      <h3 className="text-2xl font-semibold text-center text-blue-600 mb-4">
        {isRegister ? "Create Account" : "Login"}
      </h3>
      <form onSubmit={submit} className="space-y-3">
        {isRegister && (
          <>
            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              value={form.name}
              className="input"
            />
            <input
              name="number"
              placeholder="Phone Number"
              onChange={handleChange}
              value={form.number}
              className="input"
            />
            <input
              name="state"
              placeholder="State"
              onChange={handleChange}
              value={form.state}
              className="input"
            />
          </>
        )}
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={form.email}
          className="input"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          value={form.password}
          className="input"
        />

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        {isRegister ? (
          <>
            Already have an account?{" "}
            <button
              onClick={() => setIsRegister(false)}
              className="text-blue-600 underline"
            >
              Login
            </button>
          </>
        ) : (
          <>
            Don’t have an account?{" "}
            <button
              onClick={() => setIsRegister(true)}
              className="text-blue-600 underline"
            >
              Register
            </button>
          </>
        )}
      </p>

      {msg && (
        <div className="mt-4 p-2 text-center bg-blue-50 text-blue-700 rounded-md">
          {msg}
        </div>
      )}
    </div>
  );
}
