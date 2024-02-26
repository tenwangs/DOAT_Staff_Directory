import React, { useState } from "react";
import { useAuthContext } from '../hooks/useAuthContext'

const BasicInfoSection = ({ detail }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetail, setEditedDetail] = useState({
    EmployeeId : detail.EmployeeId,
    Name: detail.Name,
    Designation: detail.Designation,
    Division: detail.Division,
    Section: detail.Section
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const {user} = useAuthContext();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDetail((prevDetail) => ({
      ...prevDetail,
      [name]: value
    }));
  };

  const handleSave = () => {
    fetch(`http://localhost:4000/api/details/updateInfo/${detail._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify(editedDetail)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Updated detail:", data);
        setIsEditing(false);
        setSuccessMessage("Detail updated successfully");
      })
      .catch((error) => {
        console.error("Error updating detail:", error);
        setErrorMessage("Error updating detail. Please try again later.");
      });
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="mb-8 bg-gray-200 p-8 rounded  ">
      <h2 className="text-xl font-semibold text-gray-800 font-serif pl-40 ml-6 mb-2">Detail</h2>
      {isEditing ? (
        <form className="flex flex-col mb-2">
          <div className="flex justify-between mb-1">
            <strong className="text-gray-700 font-mono">Employee ID:</strong>
            <input
              type="text"
              name="EmployeeId"
              value={editedDetail.EmployeeId}
              onChange={handleInputChange}
              disabled
              className="text-gray-800 ml-4 border border-gray-300 px-2 py-1 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex justify-between mb-1">
            <strong className="text-gray-700 font-mono">Name:</strong>
            <input
              type="text"
              name="Name"
              value={editedDetail.Name}
              onChange={handleInputChange}
              className="text-gray-800 ml-4 border border-gray-300 px-2 py-1 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex justify-between mb-1">
            <strong className="text-gray-700 font-mono">Designation:</strong>
            <select
              name="Designation"
              value={editedDetail.Designation}
              onChange={handleInputChange}
              className="text-gray-800 ml-4 border border-gray-300 px-2 py-1 rounded focus:outline-none focus:border-blue-500"
            >
              <option value="">Select Designation</option>
              <option value="Manager">Manager</option>
              <option value="Executive">Executive</option>
            </select>
          </div>
          <div className="flex justify-between mb-1">
            <strong className="text-gray-700 font-mono">Division:</strong>
            <select
              name="Division"
              value={editedDetail.Division}
              onChange={handleInputChange}
              className="text-gray-800 ml-4 border border-gray-300 px-2 py-1 rounded focus:outline-none focus:border-blue-500"
            >
              <option value="">Select Division</option>
              <option value="Air Navigation Service">Air Navigation Service</option>
              <option value="Airport Management">Airport Management</option>
              <option value="Airport Emergency and Security">Airport Emergency and Security</option>
              <option value="Aerodrome Planning and Maintenance">Aerodrome Planning and Maintenance</option>
            </select>
          </div>
          <div className="flex justify-between mb-1">
            <strong className="text-gray-700 font-mono">Section:</strong>
            <select
              name="Section"
              value={editedDetail.Section}
              onChange={handleInputChange}
              className="text-gray-800 ml-4 border border-gray-300 px-2 py-1 rounded focus:outline-none focus:border-blue-500"
            >
              <option value="">Select Section</option>
              <option value="Air Traffic Control">Air Traffic Control</option>
              <option value="CNS">CNS</option>
              <option value="Aviation Security">Aviation Security</option>
              <option value="Airport Emergency">Airport Emergency</option>
              <option value="Bumthang Airport Management">Bumthang Airport Management</option>
              <option value="Yonphula Airport Management">Yonphula Airport Management</option>
              <option value="Gelephu Airport Management">Gelephu Airport Management</option>
              <option value="Paro Airport Management">Paro Airport Management</option>
            </select>
          </div>
          <div className="mt-2">
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
        <div className="flex flex-col mb-2 overflow-auto">
           <div className="flex justify-between mb-1 ">
            <strong className="text-gray-700  font-semibold font-mono">Employee ID:</strong>
            <p className="text-gray-700 font-semibold font-mono ml-2 mr-8">{detail.EmployeeId}</p>
          </div>
          <div className="flex justify-between mb-1">
            <strong className="text-gray-700  font-semibold font-mono">Name:</strong>
            <p className="text-gray-700 font-mono ml-2 mr-4">{detail.Name}</p>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-700  font-semibold font-mono">Designation:</strong>
            <p className="text-gray-700  font-mono ml-2 mr-4">{detail.Designation}</p>
          </div>
          <div className="flex justify-between mb-1">
            <strong className="text-gray-700  font-semibold font-mono">Division:</strong>
            <p className="text-gray-700   font-mono ml-2 mr-4">{detail.Division}</p>
          </div>
          <div className="flex justify-between mb-1">
            <strong className="text-gray-700  font-semibold font-mono">Section:</strong>
            <p className="text-gray-700 font-mono ml-2 mr-4">{detail.Section}</p>
          </div>
          {user.email!== 'kwangchuk@doat.gov.bt' && user.email!== 'sangay@doat.gov.bt' && user.email!== 'tgyelten@doat.gov.bt' &&  user.email!== 'nrinchen@doat.gov.bt' && user.email!== 'tdukpa@doat.gov.bt' &&(<button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-800 focus:outline-none border border-blue-600 rounded px-2 py-1 mt-2 transition duration-300 ease-in-out hover:bg-blue-200"
          >
            Edit
          </button>)}
        </div>
      )}
      {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
      {successMessage && <p className="text-green-500 mb-2">{successMessage}</p>}
    </div>
  );
};

export default BasicInfoSection;
