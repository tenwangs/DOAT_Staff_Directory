import React, { useState } from "react";
import AddATrainingForm from "./AddATrainingForm";
import { useAuthContext } from "../hooks/useAuthContext";
import edit from "../icons/icons8-edit-50.png";
import trash from "../icons/icons8-trash-can-50.png";
import download from "../icons/icons8-downloading-updates-50.png";
import search from "../icons/icons8-search-50.png";
import close from "../icons/icons8-close-50.png";
import add from "../icons/icons8-create-50.png";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useAuthContext();
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTraining((prevTraining) => ({
      ...prevTraining,
      [name]: value,
    }));
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
      const errors = {};
      if (!editedTraining.Title.trim()) {
        errors.Title = "Title is required";
      }
      if (!editedTraining.StartDate.trim()) {
        errors.StartDate = "Start Date is required";
      }
      if (!editedTraining.EndDate.trim()) {
        errors.EndDate = "End Date is required";
      }
      if (!editedTraining.Country.trim()) {
        errors.Country = "Country is required";
      }
      if (!editedTraining.Funding.trim()) {
        errors.Funding = "Funding is required";
      }
      if (
        new Date(editedTraining.StartDate) > new Date(editedTraining.EndDate)
      ) {
        errors.EndDate = "End Date must be after Start Date";
      }
      if (editedTraining.StartDate > editedTraining.EndDate) {
        throw new Error("Start date must be before end date");
      }
      const allowedFileTypesReport = [
        "image/jpeg",
        "image/png",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];
      const allowedFileTypesCertificate = [
        "image/jpeg",
        "image/png",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (
        editedTraining.reportFile &&
        !allowedFileTypesReport.includes(editedTraining.reportFile.type)
      ) {
        errors.reportFile =
          "Invalid file type for reportFile (supported file types: jpg, jpeg, png, pdf, doc, docx, xls, xlsx)";
      }
      if (
        editedTraining.certificate &&
        !allowedFileTypesCertificate.includes(editedTraining.certificate.type)
      ) {
        errors.certificate =
          "Invalid file type for certificate (supported file types: jpg, jpeg, png, pdf, doc, docx)";
      }

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        throw new Error("Validation failed");
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
      setEditedTraining({
        Title: "",
        StartDate: "",
        EndDate: "",
        Country: "",
        Funding: "",
        reportFile: null,
        certificate: null,
      });
      setSuccessMessage("Training edited successfully");
      setGeneralError("");
      setFieldErrors({});
      setTimeout(() => {
        setSuccessMessage("")
        setEditedTrainingIndex(null);
      }, 2000);
    } catch (error) {
      if (error.message !== "Validation failed") {
        setGeneralError(error.message);
      }
      console.error("Error:", error.message);
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
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const filteredTrainings = detail.Trainings.filter((training) => {
    const searchTermDate = new Date(searchTerm);
    const startDateFormatted = formatDate(training.StartDate);
    const endDateFormatted = formatDate(training.EndDate);
    const duration = calculateDuration(training.StartDate, training.EndDate);
    return (
      training.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      training.Country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      training.Funding.toLowerCase().includes(searchTerm.toLowerCase()) ||
      startDateFormatted.includes(searchTerm) ||
      endDateFormatted.includes(searchTerm) ||
      duration.toString().includes(searchTerm) ||
      (searchTermDate !== "Invalid Date" &&
        (startDateFormatted === formatDate(searchTermDate) ||
          endDateFormatted === formatDate(searchTermDate)))
    );
  });

  const handleSearchIconClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setIsExpanded(false);
  };

  return (
    <div className="mb-8 ">
      {/* training title */}
      <h3 className="text-lg font-bold font-serif text-blue-800 text-gray-800 mb-2 pl-40 ml-8">
        Trainings
      </h3>
      <div className="flex flex-col">
        {/* search bar */}
        <div className="flex items-start">
          <div className="mr-4">
            {isExpanded ? (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                <button
                  className="absolute right-0 top-0 bottom-0 px-2 bg-gray-200 rounded-r focus:outline-none "
                  onClick={handleClearSearch}
                >
                  <img src={close} alt="close" className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div>
                <button
                  className="bg-gray-200 rounded-full p-2 focus:outline-none transition duration-300 ease-in-out hover:bg-gray-300"
                  onClick={handleSearchIconClick}
                  title="Search Trainings"
                >
                  <img src={search} alt="search" className="h-6 w-6" />
                </button>
              </div>
            )}
          </div>
        </div>
        {/* add training */}
        <div className="flex items-end justify-end mt-4 mb-4">
          {showAddTraining ? (
            <div>
              <AddATrainingForm onCancel={handleCancel} />
            </div>
          ) : (
            <div>
              {user.email !== "kwangchuk@doat.gov.bt" &&
                user.email !== "sangay@doat.gov.bt" &&
                user.email !== "tgyelten@doat.gov.bt" &&
                user.email !== "nrinchen@doat.gov.bt" &&
                user.email !== "tdukpa@doat.gov.bt" && (
                  <button
                    onClick={toggleAddTraining}
                    className="text-green-600 hover:text-green-800 focus:outline-none border rounded px-2 py-1 transition duration-300 ease-in-out hover:bg-green-300"
                    title="Add Training"
                  >
                    <img src={add} alt="add" className="w-6 h-6" />
                  </button>
                )}
            </div>
          )}
        </div>
      </div>

      {filteredTrainings.map((training, index) => (
        <div key={index} className="mb-4 border rounded  bg-gray-100 p-4">
          {editedTrainingIndex === index ? (
            // edit training form
            <form className="flex flex-col">
              {generalError && (
                <p className="text-red-500 mb-2">{generalError}</p>
              )}
              {successMessage && (
                <p className="text-green-500 mb-2">{successMessage}</p>
              )}
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="w-3/10 font-mono">Title:</td>
                    <td className="w-7/10">
                      <input
                        type="text"
                        name="Title"
                        value={editedTraining.Title}
                        onChange={handleInputChange}
                        className={`w-full text-gray-800 border ${
                          fieldErrors.Title
                            ? "border-red-500"
                            : "border-gray-300"
                        } px-2 py-1 rounded focus:outline-none focus:border-blue-500`}
                      />
                      {fieldErrors.Title && (
                        <p className="text-red-500 mb-2">{fieldErrors.Title}</p>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-3/10 font-mono">Start Date:</td>
                    <td className="w-7/10">
                      <input
                        type="date"
                        name="StartDate"
                        value={editedTraining.StartDate}
                        onChange={handleInputChange}
                        className={`w-full text-gray-800 border ${
                          fieldErrors.StartDate
                            ? "border-red-500"
                            : "border-gray-300"
                        } px-2 py-1 rounded focus:outline-none focus:border-blue-500`}
                      />
                      {fieldErrors.StartDate && (
                        <p className="text-red-500 mb-2">
                          {fieldErrors.StartDate}
                        </p>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-3/10 font-mono">End Date:</td>
                    <td className="w-7/10">
                      <input
                        type="date"
                        name="EndDate"
                        value={editedTraining.EndDate}
                        onChange={handleInputChange}
                        className={`w-full text-gray-800 border ${
                          fieldErrors.EndDate
                            ? "border-red-500"
                            : "border-gray-300"
                        } px-2 py-1 rounded focus:outline-none focus:border-blue-500`}
                      />
                      {fieldErrors.EndDate && (
                        <p className="text-red-500 mb-2">
                          {fieldErrors.EndDate}
                        </p>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-3/10 font-mono">Country:</td>
                    <td className="w-7/10">
                      <input
                        type="text"
                        name="Country"
                        value={editedTraining.Country}
                        onChange={handleInputChange}
                        className={`w-full text-gray-800 border ${
                          fieldErrors.Country
                            ? "border-red-500"
                            : "border-gray-300"
                        } px-2 py-1 rounded focus:outline-none focus:border-blue-500`}
                      />
                      {fieldErrors.Country && (
                        <p className="text-red-500 mb-2">
                          {fieldErrors.Country}
                        </p>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-3/10 font-mono">Funding:</td>
                    <td className="w-7/10">
                      <input
                        type="text"
                        name="Funding"
                        value={editedTraining.Funding}
                        onChange={handleInputChange}
                        className={`w-full text-gray-800 border ${
                          fieldErrors.Funding
                            ? "border-red-500"
                            : "border-gray-300"
                        } px-2 py-1 rounded focus:outline-none focus:border-blue-500`}
                      />
                      {fieldErrors.Funding && (
                        <p className="text-red-500 mb-2">
                          {fieldErrors.Funding}
                        </p>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-3/10 font-mono">Report File:</td>
                    <td className="w-7/10">
                      <input
                        type="file"
                        name="reportFile"
                        onChange={handleFileChange}
                        className={`relative m-0 block w-full flex-auto rounded border bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200
                          ${
                            fieldErrors.reportFile
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                      />
                      {fieldErrors.reportFile && (
                        <p className="text-red-500 mb-2">
                          {fieldErrors.reportFile}
                        </p>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-3/10 font-mono">Certificate:</td>
                    <td className="w-7/10">
                      <input
                        type="file"
                        name="certificate"
                        onChange={handleFileChange}
                        className={`relative m-0 block w-full flex-auto rounded border bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200
                        ${
                          fieldErrors.certificate
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {fieldErrors.certificate && (
                        <p className="text-red-500 mb-2">
                          {fieldErrors.certificate}
                        </p>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="flex justify-end mt-4">
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
              {/* training list */}
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="w-3/10 text-gray-700 font-mono">
                      <strong>Title:</strong>
                    </td>
                    <td className="w-7/10 text-gray-700 font-mono">
                      {training.Title}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-3/10 text-gray-700 font-mono">
                      <strong>Start Date:</strong>
                    </td>
                    <td className="w-7/10 text-gray-700 font-mono">
                      {formatDate(training.StartDate)}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-3/10 text-gray-700 font-mono">
                      <strong>End Date:</strong>
                    </td>
                    <td className="w-7/10 text-gray-700 font-mono">
                      {formatDate(training.EndDate)}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-3/10 text-gray-700 font-mono">
                      <strong>Duration:</strong>
                    </td>
                    <td className="w-7/10 text-gray-700 font-mono">
                      {calculateDuration(training.StartDate, training.EndDate)}{" "}
                      {renderDurationText(
                        calculateDuration(training.StartDate, training.EndDate)
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-3/10 text-gray-700 font-mono">
                      <strong>Country:</strong>
                    </td>
                    <td className="w-7/10 text-gray-700 font-mono">
                      {training.Country}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-3/10 text-gray-700 font-mono">
                      <strong>Funding:</strong>
                    </td>
                    <td className="w-7/10 text-gray-700 font-mono">
                      {training.Funding}
                    </td>
                  </tr>
                  {training.reportFile && (
                    <tr>
                      <td className="w-3/10 text-gray-700 font-mono">
                        <strong>Report File:</strong>
                      </td>
                      <td className="w-7/10 text-gray-700 font-mono">
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                        >
                          {getFileNameAfterDoubleHyphen(training.reportFile)}
                          {/* download button */}
                          <button
                            onClick={() =>
                              handleDownload(
                                detail._id,
                                training._id,
                                "reportFile",
                                training.reportFile
                              )
                            }
                            style={{ marginLeft: "8px" }}
                            title="Download File"
                            className="rounded px-2 py-1 transition duration-300 ease-in-out hover:bg-gray-300"
                          >
                            <img
                              src={download}
                              alt="Download"
                              className="h-6 w-6"
                            />
                          </button>
                        </span>
                      </td>
                    </tr>
                  )}
                  {training.certificate && (
                    <tr>
                      <td className="w-3/10 text-gray-700 font-mono">
                        <strong>Certificate:</strong>
                      </td>
                      <td className="w-7/10 text-gray-700 font-mono">
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                        >
                          {getFileNameAfterDoubleHyphen(training.certificate)}
                          {/* download button */}
                          <button
                            onClick={() =>
                              handleDownload(
                                detail._id,
                                training._id,
                                "certificate",
                                training.certificate
                              )
                            }
                            style={{ marginLeft: "8px" }}
                            title="Download File"
                            className="rounded px-2 py-1 transition duration-300 ease-in-out hover:bg-gray-300"
                          >
                            <img
                              src={download}
                              alt="Download"
                              className="h-6 w-6"
                            />
                          </button>
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {/* delete and edit training buttons */}
              <div className="flex justify-end mt-2">
                {/* delete training button */}
                {user.email !== "kwangchuk@doat.gov.bt" &&
                  user.email !== "sangay@doat.gov.bt" &&
                  user.email !== "tgyelten@doat.gov.bt" &&
                  user.email !== "nrinchen@doat.gov.bt" &&
                  user.email !== "tdukpa@doat.gov.bt" && (
                    <button
                      onClick={() => handleDeleteTraining(training._id)}
                      className="text-red-600 hover:text-red-800 focus:outline-none border rounded px-2 py-1 mr-2 transition duration-300 ease-in-out hover:bg-red-300"
                      title="Delete Training"
                    >
                      <img src={trash} alt="Delete" className="h-6 w-6" />
                    </button>
                  )}
                {/* edit training button */}
                {user.email !== "kwangchuk@doat.gov.bt" &&
                  user.email !== "sangay@doat.gov.bt" &&
                  user.email !== "tgyelten@doat.gov.bt" &&
                  user.email !== "nrinchen@doat.gov.bt" &&
                  user.email !== "tdukpa@doat.gov.bt" && (
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
                      className="text-blue-600 hover:text-blue-800 focus:outline-none border rounded px-2 py-1 transition duration-300 ease-in-out hover:bg-blue-300"
                      title="Edit Training"
                    >
                      <img src={edit} alt="Edit" className="h-6 w-6" />
                    </button>
                  )}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default TrainingsSection;
