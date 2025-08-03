import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";

const Jobs = () => {
  const [jobs, setJobs] = useState({ jobs: [] }); // Adjust depending on API response shape
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    if (!isAuthorized) {
      navigateTo("/");
      return;
    }

    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/job/getall`, {
          withCredentials: true,
        });
        setJobs(res.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, [isAuthorized, navigateTo, BASE_URL]);

  return (
    <section className="jobs page">
      <div className="container">
        <h1>ALL AVAILABLE JOBS</h1>
        <div className="banner">
          {jobs.jobs && jobs.jobs.length > 0 ? (
            jobs.jobs.map((element) => (
              <div className="card" key={element._id}>
                <p>{element.title}</p>
                <p>{element.category}</p>
                <p>{element.country}</p>
                <Link to={`/job/${element._id}`}>Job Details</Link>
              </div>
            ))
          ) : (
            <p>No jobs available.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Jobs;
