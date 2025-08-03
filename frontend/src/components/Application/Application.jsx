import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../../main";

const Application = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState("");

  const { isAuthorized, user } = useContext(Context);
  const navigate = useNavigate();
  const { id } = useParams();

  // Redirect unauthorized users or Employers away
  useEffect(() => {
    if (!isAuthorized || (user && user.role === "Employer")) {
      navigate("/");
    }
  }, [isAuthorized, user, navigate]);

  // Handle file input changes with validation
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileError("");

    if (!file) {
      setResume(null);
      return;
    }

    // Update allowed types to common resume file formats
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setFileError("Please select a valid resume file (PDF, DOC, or DOCX)");
      setResume(null);
      return;
    }

    // Limit file size to 2MB
    if (file.size > 2 * 1024 * 1024) {
      setFileError("File size should be less than 2MB");
      setResume(null);
      return;
    }

    setResume(file);
  };

  // Submit application handler
  const handleApplication = async (event) => {
    event.preventDefault();

    // Basic client-side validation
    if (!name || !email || !phone || !address || !coverLetter) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!resume) {
      setFileError("Please upload your resume.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("coverLetter", coverLetter);
    formData.append("resume", resume);
    formData.append("jobId", id);

    try {
      // Use environment variable for backend base URL — make sure it's set in .env
      const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

      const { data } = await axios.post(
        `${BASE_URL}/api/v1/application/post`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Reset form on success
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setCoverLetter("");
      setResume(null);
      setFileError("");

      toast.success(data.message || "Application submitted successfully!");
      navigate("/job/getall");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again later.";

      toast.error(errorMessage);

      if (
        errorMessage.toLowerCase().includes("cloudinary") ||
        errorMessage.toLowerCase().includes("api_key")
      ) {
        toast.error(
          "File upload service is currently unavailable. Please try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="application">
      <div className="container">
        <h3>Application Form</h3>
        <form onSubmit={handleApplication} encType="multipart/form-data">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Your Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Your Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <textarea
            placeholder="Cover Letter..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            required
          />
          <div>
            <label
              htmlFor="resumeUpload"
              style={{ textAlign: "start", display: "block", fontSize: "20px" }}
            >
              Upload Resume
              <p
                style={{
                  color: "red",
                  fontSize: "12px",
                  margin: "5px 0 0 0",
                }}
              >
                (Supported formats: PDF, DOC, DOCX. Max size: 2MB)
              </p>
            </label>
            <input
              id="resumeUpload"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              style={{ width: "100%" }}
              required
            />
            {fileError && (
              <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                {fileError}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Submitting..." : "Send Application"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Application;
