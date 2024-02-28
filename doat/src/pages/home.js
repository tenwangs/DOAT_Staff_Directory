import React, { useState } from "react";
import Select from "react-select";
import DetailsTable from "../components/DetailsTable";
import { useAuthContext } from "../hooks/useAuthContext";
import add from "../icons/icons8-add-user-male-50.png";

function Home() {
  const [showModal, setShowModal] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [division, setDivision] = useState(null);
  const [section, setSection] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const { user } = useAuthContext();

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
    menuList: (provided) => ({
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

  const validateForm = () => {
    let errors = {};
    if (!employeeId.trim()) {
      errors = { ...errors, employeeId: "Employee ID is required" };
    }
    if (!name.trim()) {
      errors = { ...errors, name: "Name is required" };
    }
    if (!designation.trim()) {
      errors = { ...errors, designation: "Designation is required" };
    }
    if (!division) {
      errors = { ...errors, division: "Division is required" };
    }
    if (!section) {
      errors = { ...errors, section: "Section is required" };
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    const data = {
      EmployeeId: employeeId,
      Name: name,
      Designation: designation,
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
          setErrorMessage("Employee with this ID already exists!");
        } else {
          throw new Error(errorData.error);
        }
      } else {
        setEmployeeId("");
        setName("");
        setDesignation("");
        setDivision(null);
        setSection(null);
        setSuccessMessage("Employee detail added successfully");
        setTimeout(() => {
          setSuccessMessage("");
        }, 2000);
      }
    } catch (error) {
      setErrorMessage(`Error adding employee detail: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start p-8 space-y-4 box-border max-w-screen">
      <div className="pt-4 w-4/6 flex justify-end">
        {user.email !== "kwangchuk@doat.gov.bt" &&
          user.email !== "sangay@doat.gov.bt" &&
          user.email !== "tgyelten@doat.gov.bt" &&
          user.email !== "nrinchen@doat.gov.bt" &&
          user.email !== "tdukpa@doat.gov.bt" && (
            <button
              className="text-green-600 hover:text-green-800 focus:outline-none border rounded px-2 py-1 transition duration-300 ease-in-out hover:bg-green-300"
              title="Add Employee"
              onClick={() => setShowModal(true)}
            >
              <img src={add} alt="add" className="w-10 h-10" />
            </button>
          )}
      </div>
      {showModal && (
        <div className="fixed z-20 inset-0 overflow-y-auto flex items-center justify-center ">
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
            {errorMessage && (
              <p className="text-red-500 mb-4">{errorMessage}</p>
            )}
            {successMessage && (
              <p className="text-green-500 mb-4">{successMessage}</p>
            )}
            <form onSubmit={handleSave}>
              <input
                type="text"
                placeholder="Employee Id"
                className={`border p-2 w-full mb-4 ${
                  fieldErrors.employeeId ? "border-red-500" : ""
                }`}
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              />
              {fieldErrors.employeeId && (
                <p className="text-red-500 mb-2">{fieldErrors.employeeId}</p>
              )}
              <input
                type="text"
                placeholder="Name"
                className={`border p-2 w-full mb-4 ${
                  fieldErrors.name ? "border-red-500" : ""
                }`}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {fieldErrors.name && (
                <p className="text-red-500 mb-2">{fieldErrors.name}</p>
              )}
              <input
                type="text"
                placeholder="Designation"
                className={`border p-2 w-full mb-4 ${
                  fieldErrors.Designation ? "border-red-500" : ""
                }`}
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
              />
              {fieldErrors.designation && (
                <p className="text-red-500 mb-2">{fieldErrors.designation}</p>
              )}
              <Select
                options={divisions}
                styles={customStyles}
                className={`mb-4 ${
                  fieldErrors.division ? "border-red-500" : ""
                }`}
                placeholder="Division"
                value={division}
                onChange={setDivision}
              />
              {fieldErrors.division && (
                <p className="text-red-500 mb-2">{fieldErrors.division}</p>
              )}
              <Select
                options={sections}
                styles={customStyles}
                className={`mb-4 ${
                  fieldErrors.section ? "border-red-500" : ""
                }`}
                placeholder="Section"
                value={section}
                onChange={setSection}
              />
              {fieldErrors.section && (
                <p className="text-red-500 mb-2">{fieldErrors.section}</p>
              )}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="w-4/5 h-screen p-4 flex flex-col">
        <DetailsTable />
      </div>
    </div>
  );
}

export default Home;
