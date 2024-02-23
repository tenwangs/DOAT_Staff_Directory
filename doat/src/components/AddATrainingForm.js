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
    certificate: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTraining((prevTraining) => ({
      ...prevTraining,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;
    setNewTraining((prevTraining) => ({
      ...prevTraining,
      [name]: file
    }));
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("Title", newTraining.Title);
      formData.append("StartDate", newTraining.StartDate);
      formData.append("EndDate", newTraining.EndDate);
      formData.append("Country", newTraining.Country);
      formData.append("Funding", newTraining.Funding);
      formData.append("reportFile", newTraining.reportFile);
      formData.append("certificate", newTraining.certificate);

      const response = await fetch(`http://localhost:4000/api/details/addTraining/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`  
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to save training');
      }

      setNewTraining({
        Title: "",
        StartDate: "",
        EndDate: "",
        Country: "",
        Funding: "", 
        reportFile: null,
        certificate: null
      });

      onCancel();
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div className="mb-4 border rounded p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Add Training</h3>
      <form className="flex flex-col">
        <input
          type="text"
          name="Title"
          value={newTraining.Title}
          onChange={handleInputChange}
          placeholder="Title"
          className="text-gray-800 mb-2 border border-gray-300 px-2 py-1 rounded focus:outline-none focus:border-blue-500"
        />
        <input
          type="date"
          name="StartDate"
          value={newTraining.StartDate}
          onChange={handleInputChange}
          placeholder="Start Date"
          className="text-gray-800 mb-2 border border-gray-300 px-2 py-1 rounded focus:outline-none focus:border-blue-500"
        />
        <input
          type="date"
          name="EndDate"
          value={newTraining.EndDate}
          onChange={handleInputChange}
          placeholder="End Date"
          className="text-gray-800 mb-2 border border-gray-300 px-2 py-1 rounded focus:outline-none focus:border-blue-500"
        />
        <input
          type="text"
          name="Country"
          value={newTraining.Country}
          onChange={handleInputChange}
          placeholder="Country"
          className="text-gray-800 mb-2 border border-gray-300 px-2 py-1 rounded focus:outline-none focus:border-blue-500"
        />
        <input
          type="text"
          name="Funding"
          value={newTraining.Funding}
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
