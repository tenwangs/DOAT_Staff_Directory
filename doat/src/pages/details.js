import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import BasicInfoSection from "../components/BasicInfoSection";
import TrainingsSection from "../components/TrainingsSection";
import { useAuthContext } from "../hooks/useAuthContext";
import back from "../icons/icons8-return-50.png";

const DetailPage = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/details/${id}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch detail");
        }
        const detailData = await response.json();
        setLoading(false);
        setDetail(detailData);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    if (user) {
      fetchDetail();
    }
  }, [id, user]);

  const handleDeleteTraining = async (trainingId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/details/deleteTraining/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ trainingId }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete training");
      }
      const updatedTrainings = detail.Trainings.filter(
        (training) => training._id !== trainingId
      );
      setDetail((prevDetail) => ({
        ...prevDetail,
        Trainings: updatedTrainings,
      }));
    } catch (error) {
      console.error("Error deleting training:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen ">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto mt-8">
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md overflow-hidden p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-red-500">{error}</p>
          <Link
            to="/"
            className="text-blue-500 hover:text-blue-700 mt-4 inline-block"
          >
            Go back
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto mt-8 mb-8">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md overflow-hidden ">
        <div className="p-4">
          <BasicInfoSection detail={detail} />
          <TrainingsSection
            detail={detail}
            handleDeleteTraining={handleDeleteTraining}
          />
          <div className="flex justify-end mt-4 ">
            <Link
              to="/"
              className="border border-gray-300 rounded px-3 py-1 transition duration-300 ease-in-out hover:bg-gray-300"
              title="Back to List"
            >
              <img
                src={back}
                alt="Back to list"
                className="w-6 h-6"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
