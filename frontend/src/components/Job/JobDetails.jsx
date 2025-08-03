import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const navigateTo = useNavigate();
  const { isAuthorized, user } = useContext(Context);

  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  // Redirect to login if not authorized
  useEffect(() => {
    if (!isAuthorized) {
      navigateTo("/login");
    }
  }, [isAuthorized, navigateTo]);

  // Fetch job details when id or BASE_URL changes
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/job/${id}`, {
          withCredentials: true,
        });
        setJob(res.data.job);
      } catch (error) {
        navigateTo("/notfound");
      }
    };

    if (id) fetchJob();
  }, [id, BASE_URL, navigateTo]);

  if (!job) {
    // You can render a loading indicator or nothing
    return <p>Loading job details...</p>;
  }

  return (
    <section className="jobDetail page">
      <div className="container">
        <h3>Job Details</h3>
        <div className="banner">
          <p>
            Title: <span>{job.title}</span>
          </p>
          <p>
            Category: <span>{job.category}</span>
          </p>
          <p>
            Country: <span>{job.country}</span>
          </p>
          <p>
            City: <span>{job.city}</span>
          </p>
          <p>
            Location: <span>{job.location}</span>
          </p>
          <p>
            Description: <span>{job.description}</span>
          </p>
          <p>
            Job Posted On: <span>{job.jobPostedOn}</span>
          </p>
          <p>
            Salary:{" "}
            {job.fixedSalary ? (
              <span>{job.fixedSalary}</span>
            ) : (
              <span>
                {job.salaryFrom} - {job.salaryTo}
              </span>
            )}
          </p>
          {user && user.role === "Employer" ? null : (
            <Link to={`/application/${job._id}`}>Apply Now</Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default JobDetails;
