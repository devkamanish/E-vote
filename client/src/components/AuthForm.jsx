import React, { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
  "Chandigarh", "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry"
];

export default function AuthForm({ setUser }) {
  const [isRegister, setIsRegister] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    number: "",
    state: "",
  });
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent non-numeric input for phone
    if (name === "number") {
      if (!/^\d*$/.test(value)) return; // only digits allowed
    }

    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};

    if (isRegister && !form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter a valid email address.";
    if (!form.password.trim()) newErrors.password = "Password is required.";

    if (isRegister) {
      if (!form.number.trim()) newErrors.number = "Phone number is required.";
      else if (!/^\d{10}$/.test(form.number))
        newErrors.number = "Phone number must be 10 digits.";

      if (!form.state.trim()) newErrors.state = "State is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    if (!validateForm()) return;

    setLoading(true);
    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const data = await api(endpoint, { method: "POST", body: form });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      navigate("/vote");
    } catch (err) {
      setMsg(err?.message || "Error occurred. Please try again.");
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
            <div>
              <input
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                value={form.name}
                className="input w-full"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <input
                name="number"
                placeholder="Phone Number"
                onChange={handleChange}
                value={form.number}
                maxLength="10"
                className="input w-full"
              />
              {errors.number && (
                <p className="text-red-500 text-sm mt-1">{errors.number}</p>
              )}
            </div>

            <div>
              <select
                name="state"
                onChange={handleChange}
                value={form.state}
                className="input w-full"
              >
                <option value="">Select State</option>
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
              {errors.state && (
                <p className="text-red-500 text-sm mt-1">{errors.state}</p>
              )}
            </div>
          </>
        )}

        <div>
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={form.email}
            className="input w-full"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            value={form.password}
            className="input w-full"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={loading}
        >
          {loading
            ? "Please wait..."
            : isRegister
            ? "Register"
            : "Login"}
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


