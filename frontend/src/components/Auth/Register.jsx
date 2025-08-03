import React, { useState, useContext } from "react";
import { FaRegUser, FaPencilAlt, FaPhoneAlt } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(formData).some((val) => !val)) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

      const { data } = await axios.post(`${BASE_URL}/api/v1/user/register`, formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      toast.success(data.message || "Registered successfully");
      setUser(data.user);
      setIsAuthorized(true);
      // Reset form after success
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "",
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed.");
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
          <h3>Create a new account</h3>
        </div>

        <form onSubmit={handleSubmit}>
          {[
            {
              label: "Register As",
              name: "role",
              type: "select",
              icon: <FaRegUser />,
              options: ["Employer", "Job Seeker"],
            },
            {
              label: "Name",
              name: "name",
              type: "text",
              placeholder: "Enter your name",
              icon: <FaPencilAlt />,
            },
            {
              label: "Email Address",
              name: "email",
              type: "email",
              placeholder: "Enter your email",
              icon: <MdOutlineMailOutline />,
            },
            {
              label: "Phone Number",
              name: "phone",
              type: "tel",
              placeholder: "Enter your phone",
              icon: <FaPhoneAlt />,
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
                  <select name={name} value={formData[name]} onChange={handleChange} required>
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
                    autoComplete={type === "password" ? "new-password" : "on"}
                    required
                  />
                )}
                {icon}
              </div>
            </div>
          ))}

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
          <Link to="/login">Login Now</Link>
        </form>
      </div>

      <div className="banner">
        <img src="/register.png" alt="register" />
      </div>
    </section>
  );
};

export default Register;
