import React, { useState, useContext } from "react";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const { isAuthorized, setIsAuthorized } = useContext(Context);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleLogin = async (e) => {
    e.preventDefault();

    if (Object.values(formData).some((val) => !val)) {
      toast.error("All fields are required.");
      return;
    }

    setLoading(true);

    try {
      const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

      const { data } = await axios.post(
        `${BASE_URL}/api/v1/user/login`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      toast.success(data.message || "Logged in successfully");
      setIsAuthorized(true);
      setFormData({ email: "", password: "", role: "" });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  if (isAuthorized) return <Navigate to="/" />;

  return (
    <section className="authPage">
      <div className="container">
        <div className="header">
          <img src="/careerconnect-black.png" alt="logo" />
          <h3>Login to your account</h3>
        </div>

        <form onSubmit={handleLogin}>
          {[
            {
              label: "Login As",
              name: "role",
              type: "select",
              icon: <FaRegUser />,
              options: ["Job Seeker", "Employer"],
            },
            {
              label: "Email Address",
              name: "email",
              type: "email",
              placeholder: "Enter your email",
              icon: <MdOutlineMailOutline />,
            },
            {
              label: "Password",
              name: "password",
              type: "password",
              placeholder: "Enter your password",
              icon: <RiLock2Fill />,
            },
          ].map(({ label, name, type, placeholder, icon, options }) => (
            <div key={name} className="inputTag">
              <label>{label}</label>
              <div>
                {type === "select" ? (
                  <select name={name} value={formData[name]} onChange={handleChange}>
                    <option value="">Select Role</option>
                    {options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    placeholder={placeholder}
                    onChange={handleChange}
                    autoComplete={type === "password" ? "current-password" : "on"}
                  />
                )}
                {icon}
              </div>
            </div>
          ))}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          <Link to="/register">Register Now</Link>
        </form>
      </div>

      <div className="banner">
        <img src="/login.png" alt="login" />
      </div>
    </section>
  );
};

export default Login;
