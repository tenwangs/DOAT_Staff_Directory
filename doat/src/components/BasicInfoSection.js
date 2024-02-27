import React, { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import editinfo from "../icons/icons8-edit-50.png";

const BasicInfoSection = ({ detail }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetail, setEditedDetail] = useState({
    EmployeeId: detail.EmployeeId,
    Name: detail.Name,
    Designation: detail.Designation,
    Division: detail.Division,
    Section: detail.Section,
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { user } = useAuthContext();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDetail((prevDetail) => ({
      ...prevDetail,
      [name]: value,
    }));
  };

  const handleSave = () => {
    const errors = {};
    if (!editedDetail.Name.trim()) {
      errors.Name = "Name is required";
    }
    if (!editedDetail.Designation.trim()) {
      errors.Designation = "Designation is required";
    }
    if (!editedDetail.Division.trim()) {
      errors.Division = "Division is required";
    }
    if (!editedDetail.Section.trim()) {
      errors.Section = "Section is required";
    }
    if (Object.keys(errors).length === 0) { // Only proceed if there are no errors
      fetch(`http://localhost:4000/api/details/updateInfo/${detail._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(editedDetail),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Updated detail:", data);
          setSuccessMessage("Training edited successfully");
          setGeneralError("");
          setFieldErrors({});
          setTimeout(() => {
            setSuccessMessage("");
            setIsEditing(false);
          }, 2000);
        })
        .catch((error) => {
          setGeneralError(error.message);
          console.error("Error:", error.message);
        });
    } else {
      setFieldErrors(errors);
    }
  };
  

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="mt-4 mb-8 bg-gray-200 p-8 rounded">
      {/* detail title */}
      <div className="flex justify-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 font-serif">
          Detail
        </h2>
      </div>
      {isEditing ? (
        // edit basic info form
        <form className="flex flex-col">
          {generalError && <p className="text-red-500 mb-2">{generalError}</p>}
          {successMessage && (
            <p className="text-green-500 mb-2">{successMessage}</p>
          )}
          <table className="w-full">
            <tbody>
              <tr>
                <td className="w-3/10 text-gray-700 font-mono">
                  <strong>Employee Id:</strong>
                </td>
                <td className="w-7/10 text-gray-700 font-mono">
                  <input
                    type="text"
                    name="EmployeeId"
                    value={editedDetail.EmployeeId}
                    onChange={handleInputChange}
                    disabled
                    className="w-11/12 ml-2 text-gray-800 border border-gray-300 px-2 py-1 rounded focus:outline-none focus:border-blue-500"
                  />
                </td>
              </tr>
              <tr>
                <td className="w-3/10 text-gray-700 font-mono">
                  <strong>Name:</strong>
                </td>
                <td className="w-7/10 text-gray-700 font-mono">
                  <input
                    type="text"
                    name="Name"
                    value={editedDetail.Name}
                    onChange={handleInputChange}
                    className={`w-11/12 ml-2 text-gray-800 border ${
                      fieldErrors.Name ? "border-red-500" : "border-gray-300"
                    } px-2 py-1 rounded focus:outline-none focus:border-blue-500`}
                  />
                  {fieldErrors.Name && (
                    <p className="text-red-500 mb-2">{fieldErrors.Name}</p>
                  )}
                </td>
              </tr>
              <tr>
                <td className="w-3/10 text-gray-700 font-mono">
                  <strong>Designation:</strong>
                </td>
                <td className="w-7/10 text-gray-700 font-mono">
                <input
                    type="text"
                    name="Designation"
                    value={editedDetail.Designation}
                    onChange={handleInputChange}
                    className={`w-11/12 ml-2 text-gray-800 border ${
                      fieldErrors.Designation ? "border-red-500" : "border-gray-300"
                    } px-2 py-1 rounded focus:outline-none focus:border-blue-500`}
                  />
                  {fieldErrors.Designation && (
                    <p className="text-red-500 mb-2">{fieldErrors.Designation}</p>
                  )}
                </td>
              </tr>
              <tr>
                <td className="w-3/10 text-gray-700 font-mono">
                  <strong>Division:</strong>
                </td>
                <td className="w-7/10 text-gray-700 font-mono">
                  <select
                    name="Division"
                    value={editedDetail.Division}
                    onChange={handleInputChange}
                    className={`w-11/12 ml-2 text-gray-800 border ${
                      fieldErrors.Division? "border-red-500" : "border-gray-300"
                    } px-2 py-1 rounded focus:outline-none focus:border-blue-500`}
                  >
                    <option value="">Select Division</option>
                    <option value="Air Navigation Service">
                      Air Navigation Service
                    </option>
                    <option value="Airport Management">
                      Airport Management
                    </option>
                    <option value="Airport Emergency and Security">
                      Airport Emergency and Security
                    </option>
                    <option value="Aerodrome Planning and Maintenance">
                      Aerodrome Planning and Maintenance
                    </option>
                  </select>
                  {fieldErrors.Division && (
                    <p className="text-red-500 mb-2">{fieldErrors.Division}</p>
                  )}
                </td>
              </tr>
              <tr>
                <td className="w-3/10 text-gray-700 font-mono">
                  <strong>Section:</strong>
                </td>
                <td className="w-7/10 text-gray-700 font-mono">
                  <select
                    name="Section"
                    value={editedDetail.Section}
                    onChange={handleInputChange}
                    className={`w-11/12 ml-2 text-gray-800 border ${
                      fieldErrors.Section ? "border-red-500" : "border-gray-300"
                    } px-2 py-1 rounded focus:outline-none focus:border-blue-500`}
                  >
                    <option value="">Select Section</option>
                    <option value="Air Traffic Control">
                      Air Traffic Control
                    </option>
                    <option value="CNS">CNS</option>
                    <option value="Aviation Security">Aviation Security</option>
                    <option value="Airport Emergency">Airport Emergency</option>
                    <option value="Bumthang Airport Management">
                      Bumthang Airport Management
                    </option>
                    <option value="Yonphula Airport Management">
                      Yonphula Airport Management
                    </option>
                    <option value="Gelephu Airport Management">
                      Gelephu Airport Management
                    </option>
                    <option value="Paro Airport Management">
                      Paro Airport Management
                    </option>
                  </select>
                  {fieldErrors.Section && (
                    <p className="text-red-500 mb-2">{fieldErrors.Section}</p>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={handleSave}
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
        // display basic info
        <div className="flex flex-col overflow-auto">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="w-3/10 text-gray-700 font-mono">
                  <strong>Employee ID:</strong>
                </td>
                <td className="w-7/10 text-gray-700 font-semibold font-mono">
                  {detail.EmployeeId}
                </td>
              </tr>
              <tr>
                <td className="w-3/10 text-gray-700 font-mono">
                  <strong>Name:</strong>
                </td>
                <td className="w-7/10 text-gray-700 font-mono">
                  {detail.Name}
                </td>
              </tr>
              <tr>
                <td className="w-3/10 text-gray-700 font-mono">
                  <strong>Designation:</strong>
                </td>
                <td className="w-7/10 text-gray-700 font-mono">
                  {detail.Designation}
                </td>
              </tr>
              <tr>
                <td className="w-3/10 text-gray-700 font-mono">
                  <strong>Division:</strong>
                </td>
                <td className="w-7/10 text-gray-700 font-mono">
                  {detail.Division}
                </td>
              </tr>
              <tr>
                <td className="w-3/10 text-gray-700 font-mono">
                  <strong>Section:</strong>
                </td>
                <td className="w-7/10 text-gray-700 font-mono">
                  {detail.Section}
                </td>
              </tr>
            </tbody>
          </table>
          {/* edit button */}
          <div className="flex justify-end mt-4">
            {user.email !== "kwangchuk@doat.gov.bt" &&
              user.email !== "sangay@doat.gov.bt" &&
              user.email !== "tgyelten@doat.gov.bt" &&
              user.email !== "nrinchen@doat.gov.bt" &&
              user.email !== "tdukpa@doat.gov.bt" && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-600 hover:text-blue-800 focus:outline-none border rounded px-2 py-1 transition duration-300 ease-in-out hover:bg-blue-300"
                  title="Edit Training"
                >
                  <img
                    src={editinfo}
                    alt="Edit Basic Info"
                    className="w-6 h-6"
                  />
                </button>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicInfoSection;
