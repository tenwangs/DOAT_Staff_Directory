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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDetail((prevDetail) => ({
      ...prevDetail,
      [name]: value
    }));
  };
  const {user} = useAuthContext()

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
      })
      .catch((error) => {
        console.error("Error updating detail:", error);
      });
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="mb-8 bg-gray-100 p-8 rounded ">
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
          <div className="flex justify-between">
            <strong className="text-gray-700 font-mono">Designation:</strong>
            <input
              type="text"
              name="Designation"
              value={editedDetail.Designation}
              onChange={handleInputChange}
              className="text-gray-800 ml-4 border border-gray-300 px-2 py-1 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex justify-between mb-1">
            <strong className="text-gray-700 font-mono">Division:</strong>
            <input
              type="text"
              name="Division"
              value={editedDetail.Division}
              onChange={handleInputChange}
              className="text-gray-800 ml-4 border border-gray-300 px-2 py-1 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex justify-between mb-1">
            <strong className="text-gray-700 ">Section:</strong>
            <input
              type="text"
              name="Section"
              value={editedDetail.Section}
              onChange={handleInputChange}
              className="text-gray-800 ml-4 border border-gray-300 px-2 py-1 rounded focus:outline-none focus:border-blue-500"
            />
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
        <div className="flex flex-col mb-2">
           <div className="flex justify-between mb-1">
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
    </div>
  );
};

export default BasicInfoSection;
