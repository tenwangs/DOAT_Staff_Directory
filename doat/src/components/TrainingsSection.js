import React, { useState } from "react";
import AddATrainingForm from "./AddATrainingForm";
import { useAuthContext } from "../hooks/useAuthContext";

const TrainingsSection = ({ detail, handleDeleteTraining }) => {
  const [editedTrainingIndex, setEditedTrainingIndex] = useState(null);
  const [editedTraining, setEditedTraining] = useState({
    Title: "",
    StartDate: "",
    EndDate: "",
    Country: "",
    Funding: "",
    reportFile: null,
    certificate: null,
  });
  const [showAddTraining, setShowAddTraining] = useState(false);
  const { user } = useAuthContext();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTraining((prevTraining) => ({ ...prevTraining, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;
    setEditedTraining((prevTraining) => ({
      ...prevTraining,
      [name]: file,
    }));
  };

  const handleSave = async (employeeId, trainingId) => {
    try {
      if (editedTraining.StartDate > editedTraining.EndDate) {
        throw new Error("Start date must be before end date");
      }
      const formData = new FormData();
      formData.append("Title", editedTraining.Title);
      formData.append("StartDate", editedTraining.StartDate);
      formData.append("EndDate", editedTraining.EndDate);
      formData.append("Country", editedTraining.Country);
      formData.append("Funding", editedTraining.Funding);
      if (editedTraining.reportFile) {
        formData.append("reportFile", editedTraining.reportFile);
      }
      if (editedTraining.certificate) {
        formData.append("certificate", editedTraining.certificate);
      }
      const response = await fetch(
        `http://localhost:4000/api/details/updateTraining/${employeeId}?trainingId=${trainingId}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${user.token}` },
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update training");
      }
      setEditedTrainingIndex(null);
      setEditedTraining({
        Title: "",
        StartDate: "",
        EndDate: "",
        Country: "",
        Funding: "",
        reportFile: null,
        certificate: null,
      });
    } catch (error) {
      console.error("Error updating training:", error.message);
    }
  };

  const handleCancel = () => {
    setEditedTrainingIndex(null);
    setEditedTraining({
      Title: "",
      StartDate: "",
      EndDate: "",
      Country: "",
      Funding: "",
      reportFile: null,
      certificate: null,
    });
    setShowAddTraining(false);
  };

  const toggleAddTraining = () => {
    setShowAddTraining(!showAddTraining);
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationInMilliseconds = end - start;
    const durationInDays =
      1 + Math.ceil(durationInMilliseconds / (1000 * 60 * 60 * 24));
    return durationInDays;
  };

  const handleDownload = async (employeeId, trainingId, file, name) => {
    try {
      const queryString = new URLSearchParams({ trainingId, file }).toString();
      const url = `http://localhost:4000/api/details/download/${employeeId}?${queryString}`;
      const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!response.ok) {
        throw new Error("Failed to download file");
      }
      let filename = getFileNameAfterDoubleHyphen(name);
     
      console.log("Filename:", filename);
      const blob = await response.blob();
      const downloadLink = document.createElement("a");
      const objectUrl = URL.createObjectURL(blob);
      downloadLink.href = objectUrl;
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  function getFileNameAfterDoubleHyphen(filename) {
    if (!filename) return "unknown file";
    const parts = filename.split("--");
    return parts.length > 1 ? parts.slice(1).join("--") : filename;
  }

  const renderDurationText = (days) => {
    return days === 1 ? "day" : "days";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
    
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Trainings</h3>
      {detail.Trainings.map((training, index) => (
        <div key={index} className="mb-4 border rounded p-4">
          {editedTrainingIndex === index ? (
            <form className="flex flex-col">
              <input
                type="text"
                name="Title"
                value={editedTraining.Title}
                onChange={handleInputChange}
                placeholder="Title"
                className="text-gray-800 mb-2 border border-gray-300 px-2 py-1 rounded focus:outline-none focus:border-blue-500"
              />
              <input
                type="date"
                name="StartDate"
                value={editedTraining.StartDate}
                onChange={handleInputChange}
                placeholder="Start Date"
                className="text-gray-800 mb-2 border border-gray-300 px-2 py-1 rounded focus:outline-none focus:border-blue-500"
              />
              <input
                type="date"
                name="EndDate"
                value={editedTraining.EndDate}
                onChange={handleInputChange}
                placeholder="End Date"
                className="text-gray-800 mb-2 border border-gray-300 px-2 py-1 rounded focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                name="Country"
                value={editedTraining.Country}
                onChange={handleInputChange}
                placeholder="Country"
                className="text-gray-800 mb-2 border border-gray-300 px-2 py-1 rounded focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                name="Funding"
                value={editedTraining.Funding}
                onChange={handleInputChange}
                placeholder="Funding"
                className="text-gray-800 mb-2 border border-gray-300 px-2 py-1 rounded focus:outline-none focus:border-blue-500"
              />
              <input
                type="file"
                name="reportFile"
                onChange={handleFileChange}
                placeholder="reportFile"
                className="text-gray-800 mb-2 border border-gray-300 px-2 py-1 rounded focus:outline-none focus:border-blue-500"
              />
              <input
                type="file"
                name="certificate"
                onChange={handleFileChange}
                placeholder="certificate"
                className="text-gray-800 mb-2 border border-gray-300 px-2 py-1 rounded focus:outline-none focus:border-blue-500"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSave(detail._id, training._id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded mr-2 focus:outline-none hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-400 text-gray-800 px-4 py-2 rounded focus:outline-none hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <p className="text-gray-700 mb-2">
                <strong>Title:</strong> {training.Title}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Start Date:</strong> {formatDate(training.StartDate)}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>End Date:</strong> {formatDate(training.EndDate)}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Duration:</strong>{" "}
                {calculateDuration(training.StartDate, training.EndDate)}{" "}
                {renderDurationText(
                  calculateDuration(training.StartDate, training.EndDate)
                )}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Country:</strong> {training.Country}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Funding:</strong> {training.Funding}
              </p>
              {training.reportFile && (
                <p className="text-gray-700 mb-2">
                  <strong>Report File:</strong>
                  {getFileNameAfterDoubleHyphen(training.reportFile)}
                  <button
                    onClick={() =>
                      handleDownload(detail._id, training._id, "reportFile", training.reportFile)
                    }
                  >
                    Download
                  </button>
                </p>
              )}
              {training.certificate && (
                <p className="text-gray-700 mb-2">
                  <strong>Certificate:</strong>
                  {getFileNameAfterDoubleHyphen(training.certificate)}
                  <button
                    onClick={() =>
                      handleDownload(detail._id, training._id, "certificate", training.certificate)
                    }
                  >
                    Download
                  </button>
                </p>
              )}
              <div className="flex justify-end">
                <button
                  onClick={() => handleDeleteTraining(training._id)}
                  className="text-red-600 hover:text-red-800 focus:outline-none border border-red-600 rounded px-2 py-1 mr-2 transition duration-300 ease-in-out hover:bg-red-200"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setEditedTrainingIndex(index);
                    setEditedTraining({
                      Title: training.Title,
                      StartDate: training.StartDate,
                      EndDate: training.EndDate,
                      Country: training.Country,
                      Funding: training.Funding,
                      reportFile: null,
                      certificate: null,
                    });
                  }}
                  className="text-blue-600 hover:text-blue-800 focus:outline-none border border-blue-600 rounded px-2 py-1 transition duration-300 ease-in-out hover:bg-blue-200"
                >
                  Edit
                </button>
              </div>
            </>
          )}
        </div>
      ))}
      {showAddTraining ? (
        <div>
          <AddATrainingForm onCancel={handleCancel} />
        </div>
      ) : (
        <button
          onClick={toggleAddTraining}
          className="text-green-600 hover:text-green-800 focus:outline-none border border-green-600 rounded px-2 py-1 transition duration-300 ease-in-out hover:bg-green-200"
        >
          Add Training
        </button>
      )}
    </div>
  );
};

export default TrainingsSection;
