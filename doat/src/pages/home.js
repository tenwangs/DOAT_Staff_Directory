import React, { useState } from "react";
import Select from "react-select";
import DetailsTable from "../components/DetailsTable";
import { useAuthContext } from "../hooks/useAuthContext";

function Home() {
  const [showModal, setShowModal] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState(null);
  const [division, setDivision] = useState(null);
  const [section, setSection] = useState(null);
  const { user } = useAuthContext();

  const designations = [
    { value: "Manager", label: "Manager" },
    { value: "Executive", label: "Executive" },
  ];

  const divisions = [
    { value: "Air Navigation Service", label: "Air Navigation Service" },
    { value: "Airport Management", label: "Airport Management" },
    {
      value: "Airport Emergency and Security",
      label: "Airport Emergency and Security",
    },
    {
      value: "Aerodrome Planning and Maintenance",
      label: "Aerodrome Planning and Maintenance",
    },
  ];

  const sections = [
    { value: "Air Traffic Control", label: "Air Traffic Control" },
    { value: "CNS", label: "CNS" },
    { value: "Aviation Security", label: "Aviation Security" },
    { value: "Airport Emergency", label: "Airport Emergency" },
    {
      value: "Bumthang Airport Management",
      label: "Bumthang Airport Management",
    },
    {
      value: "Yonphula Airport Management",
      label: "Yonphula Airport Management",
    },
    {
      value: "Gelephu Airport Management",
      label: "Gelephu Airport Management",
    },
    { value: "Paro Airport Management", label: "Paro Airport Management" },
  ];

  const customStyles = {
    menuList: (provided, state) => ({
      ...provided,
      maxHeight: "100px",
      overflow: "auto",
    }),
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "black" : "black",
      backgroundColor: state.isSelected ? "white" : "white",
      "&:hover": {
        backgroundColor: "gray",
      },
    }),
  };

  const handleSave = async (e) => {
    e.preventDefault();
    console.log("form triggered");
    const data = {
      EmployeeId: employeeId,
      Name: name,
      Designation: designation ? designation.value : "",
      Division: division ? division.value : "",
      Section: section ? section.value : "",
    };

    try {
      const response = await fetch("http://localhost:4000/api/details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        if (
          response.status === 400 &&
          errorData.error === "EmployeeId already exists"
        ) {
          alert("Employee with this ID already exists!");
        } else {
          throw new Error(errorData.error);
        }
      } else {
        setEmployeeId("");
        setName("");
        setDesignation(null);
        setDivision(null);
        setSection(null);
        console.log("Employee detail added successfully");
      }
    } catch (error) {
      console.error("Error adding employee detail:", error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start h-screen p-4 space-y-4">
      <div className="pt-4">
        <button
          className="bg-blue-500 hover:bg-green-700 font-sans text-white pr-8 pl-8 text-center font-bold py-2 px-4 rounded mt-4 transform transition duration-500 ease-in-out hover:scale-105 active:scale-95"
          onClick={() => setShowModal(true)}
        >
          Add Employee
        </button>
      </div>
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center ">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>

          <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl max-w-md w-full p-8">
            <button
              type="button"
              className="absolute top-0 right-0 mt-4 mr-4 bg-gray-300 rounded-full p-2 hover:bg-gray-400"
              onClick={() => setShowModal(false)}
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>

            <h3 className="text-lg leading-6 font-semibold text-gray-900 pb-4">
              Enter Details
            </h3>
            <form onSubmit={handleSave}>
              <input
                type="text"
                placeholder="Employee Id"
                className="border p-2 w-full mb-4"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              />
              <input
                type="text"
                placeholder="Name"
                className="border p-2 w-full mb-4"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Select
                options={designations}
                styles={customStyles}
                className="mb-4"
                placeholder="Designation"
                value={designation}
                onChange={setDesignation}
              />
              <Select
                options={divisions}
                styles={customStyles}
                className="mb-4"
                placeholder="Division"
                value={division}
                onChange={setDivision}
              />
              <Select
                options={sections}
                styles={customStyles}
                className="mb-4"
                placeholder="Section"
                value={section}
                onChange={setSection}
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div>
        <div className="mt-8">
          <DetailsTable />
        </div>
      </div>
    </div>
  );
}

export default Home;
