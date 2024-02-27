import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

const AddATrainingForm = ({ onCancel }) => {
  const { id } = useParams();
  const { user } = useAuthContext();

  const [newTraining, setNewTraining] = useState({
    Title: "",
    StartDate: "",
    EndDate: "",
    Country: "",
    Funding: "",
    reportFile: null,
    certificate: null,
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTraining((prevTraining) => ({
      ...prevTraining,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;
    setNewTraining((prevTraining) => ({
      ...prevTraining,
      [name]: file,
    }));
  };

  const handleSave = async () => {
    try {
      const errors = {};
      if (!newTraining.Title.trim()) {
        errors.Title = "Title is required";
      }
      if (!newTraining.StartDate.trim()) {
        errors.StartDate = "Start Date is required";
      }
      if (!newTraining.EndDate.trim()) {
        errors.EndDate = "End Date is required";
      }
      if (!newTraining.Country.trim()) {
        errors.Country = "Country is required";
      }
      if (!newTraining.Funding.trim()) {
        errors.Funding = "Funding is required";
      }
      if (new Date(newTraining.StartDate) > new Date(newTraining.EndDate)) {
        errors.EndDate = "End Date must be after Start Date";
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
        newTraining.reportFile &&
        !allowedFileTypesReport.includes(newTraining.reportFile.type)
      ) {
        errors.reportFile =
          "Invalid file type for reportFile (supported file types: jpg, jpeg, png, pdf, doc, docx, xls, xlsx)";
      }
      if (
        newTraining.certificate &&
        !allowedFileTypesCertificate.includes(newTraining.certificate.type)
      ) {
        errors.certificate =
          "Invalid file type for certificate (supported file types: jpg, jpeg, png, pdf, doc, docx)";
      }

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        throw new Error("Validation failed");
      }

      const formData = new FormData();
      formData.append("Title", newTraining.Title);
      formData.append("StartDate", newTraining.StartDate);
      formData.append("EndDate", newTraining.EndDate);
      formData.append("Country", newTraining.Country);
      formData.append("Funding", newTraining.Funding);
      formData.append("reportFile", newTraining.reportFile);
      formData.append("certificate", newTraining.certificate);

      const response = await fetch(
        `http://localhost:4000/api/details/addTraining/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save training");
      }

      setNewTraining({
        Title: "",
        StartDate: "",
        EndDate: "",
        Country: "",
        Funding: "",
        reportFile: null,
        certificate: null,
      });

      setSuccessMessage("Training added successfully");
      setGeneralError("");
      setFieldErrors({});
      setTimeout(() => {
        setSuccessMessage("")
        onCancel();
      }, 2000);
    } catch (error) {
      if (error.message !== "Validation failed") {
        setGeneralError(error.message);
      }
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="mb-4 border rounded p-4">
      <div className="flex justify-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 font-mono">
          Add Training
        </h3>
      </div>
      {/* add training form */}
      <form className="flex flex-col ">
        {generalError && <p className="text-red-500 mb-2">{generalError}</p>}
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
                  value={newTraining.Title}
                  onChange={handleInputChange}
                  className={`w-full text-gray-800 border ${
                    fieldErrors.Title ? "border-red-500" : "border-gray-300"
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
                  value={newTraining.StartDate}
                  onChange={handleInputChange}
                  placeholder="Start Date"
                  className={`w-full text-gray-800 border ${
                    fieldErrors.StartDate ? "border-red-500" : "border-gray-300"
                  } px-2 py-1 rounded focus:outline-none focus:border-blue-500`}
                />
                {fieldErrors.StartDate && (
                  <p className="text-red-500 mb-2">{fieldErrors.StartDate}</p>
                )}
              </td>
            </tr>
            <tr>
              <td className="w-3/10 font-mono">End Date:</td>
              <td className="w-7/10">
                <input
                  type="date"
                  name="EndDate"
                  value={newTraining.EndDate}
                  onChange={handleInputChange}
                  className={`w-full text-gray-800 border ${
                    fieldErrors.EndDate ? "border-red-500" : "border-gray-300"
                  } px-2 py-1 rounded focus:outline-none focus:border-blue-500`}
                />
                {fieldErrors.EndDate && (
                  <p className="text-red-500 mb-2">{fieldErrors.EndDate}</p>
                )}
              </td>
            </tr>
            <tr>
              <td className="w-3/10 font-mono">Country:</td>
              <td className="w-7/10">
                <input
                  type="text"
                  name="Country"
                  value={newTraining.Country}
                  onChange={handleInputChange}
                  className={`w-full text-gray-800 border ${
                    fieldErrors.Country ? "border-red-500" : "border-gray-300"
                  } px-2 py-1 rounded focus:outline-none focus:border-blue-500`}
                />
                {fieldErrors.Country && (
                  <p className="text-red-500 mb-2">{fieldErrors.Country}</p>
                )}
              </td>
            </tr>
            <tr>
              <td className="w-3/10 font-mono">Funding:</td>
              <td className="w-7/10">
                <input
                  type="text"
                  name="Funding"
                  value={newTraining.Funding}
                  onChange={handleInputChange}
                  className={`w-full text-gray-800 border ${
                    fieldErrors.Funding ? "border-red-500" : "border-gray-300"
                  } px-2 py-1 rounded focus:outline-none focus:border-blue-500`}
                />
                {fieldErrors.Funding && (
                  <p className="text-red-500 mb-2">{fieldErrors.Funding}</p>
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
                  <p className="text-red-500 mb-2">{fieldErrors.reportFile}</p>
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
                  <p className="text-red-500 mb-2">{fieldErrors.certificate}</p>
                )}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded mr-2 focus:outline-none hover:bg-green-700"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 text-gray-800 px-4 py-2 rounded focus:outline-none hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddATrainingForm;
