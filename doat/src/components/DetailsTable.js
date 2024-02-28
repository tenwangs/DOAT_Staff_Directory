import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useSortable from "./useSortable";
import { useAuthContext } from "../hooks/useAuthContext";
import trash from "../icons/icons8-trash-can-50.png";

const DetailsTable = () => {
  const [details, setDetails] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const { sortOption, sortDirection, handleSort } = useSortable();
  const { user } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/details", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch details");
        }
        const detailsData = await response.json();
        setDetails(detailsData);
      } catch (error) {
        console.error("Error fetching details:", error.message);
      }
    };
    if (user) {
      fetchData();
    }
  }, [user]);

  const sortDetails = (details) => {
    if (!sortOption) return details;
    return [...details].sort((a, b) => {
      const fieldA = a[sortOption];
      const fieldB = b[sortOption];
      if (typeof fieldA === "string" && typeof fieldB === "string") {
        return sortDirection === "asc"
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }
      if (typeof fieldA === "number" && typeof fieldB === "number") {
        return sortDirection === "asc" ? fieldA - fieldB : fieldB - fieldA;
      }
      return 0;
    });
  };
  const sortedDetails = sortDetails(details);

  const filteredDetails = sortedDetails.filter((detail) => {
    const { EmployeeId, Name, Designation, Division, Section, Trainings } = detail;
    const query = searchQuery.toLowerCase();
    const trainingTitles = Trainings.map(training => training.Title.toLowerCase());
    return (
      EmployeeId.toLowerCase().includes(query) ||
      Name.toLowerCase().includes(query) ||
      Designation.toLowerCase().includes(query) ||
      Division.toLowerCase().includes(query) ||
      Section.toLowerCase().includes(query) ||
      trainingTitles.some(title => title.includes(query))
    );
  });

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/api/details/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete detail");
      }
      setDetails(details.filter((detail) => detail._id !== id));
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting detail:", error.message);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-start justify-start p-4">
      {/* search bar */}
      <div className="pb-4">
        <input
          type="text"
          placeholder="Search..."
          className="border p-2 bg-gray-100 mb-4 pl-4 rounded border-gray-300 hover:bg-gray-300 focus:outline-none focus:border-gray-500 transition-colors duration-200 ease-in-out"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {/* details list */}
      <div className="w-full h-full overflow-auto rounded border border-gray-300">
        <table className="w-full divide-y divide-gray-200 p-5">
          <thead className="bg-gray-400 sticky top-0 z-10">
            <tr>
              <th
                className="px-6 py-3 text-left pr-40 text-sm font-medium font-serif font-semibold text-gray-700 uppercase cursor-pointer whitespace-nowrap"
                onClick={() => handleSort("EmployeeId")}
              >
                Employee ID
                {sortOption === "EmployeeId" && (
                  <span>{sortDirection === "asc" ? " ↓" : " ↑"}</span>
                )}
              </th>
              <th
                className="px-6 py-3 text-left pr-40 text-sm font-medium font-serif font-semibold text-gray-700 uppercase cursor-pointer whitespace-nowrap"
                onClick={() => handleSort("Name")}
              >
                Name
                {sortOption === "Name" && (
                  <span>{sortDirection === "asc" ? " ↓" : " ↑"}</span>
                )}
              </th>
              <th
                className="px-6 py-3 text-left pr-40 text-sm font-medium font-serif font-semibold text-gray-700 uppercase cursor-pointer whitespace-nowrap"
                onClick={() => handleSort("Designation")}
              >
                Designation
                {sortOption === "Designation" && (
                  <span>{sortDirection === "asc" ? " ↓" : " ↑"}</span>
                )}
              </th>
              <th
                className="px-6 py-3 text-left pr-40 text-sm font-medium font-serif font-semibold text-gray-700 uppercase cursor-pointer whitespace-nowrap"
                onClick={() => handleSort("Division")}
              >
                Division
                {sortOption === "Division" && (
                  <span>{sortDirection === "asc" ? " ↓" : " ↑"}</span>
                )}
              </th>
              <th
                className="px-6 py-3 text-left pr-40 text-sm font-medium font-serif font-semibold text-gray-700 uppercase cursor-pointer whitespace-nowrap"
                onClick={() => handleSort("Section")}
              >
                Section
                {sortOption === "Section" && (
                  <span>{sortDirection === "asc" ? " ↓" : " ↑"}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-left pr-40 text-sm font-medium font-serif font-semibold text-gray-700 uppercase cursor-pointer whitespace-nowrap"
              >
                Trainings
              </th>
              <th className="px-6 py-3 text-left pr-40 text-sm font-medium font-serif font-semibold text-gray-700 uppercase cursor-pointer whitespace-nowrap lg:sticky lg:right-0 lg:top-0 md:sticky md:right-0 md:top-0 bg-gray-400 z-10"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-gray-200">
            {filteredDetails.map((detail, index) => (
              <tr key={index} className="hover:bg-gray-100 overflow-auto">
                <td className="px-6 py-4 whitespace-nowrap">
                  {detail.EmployeeId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{detail.Name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {detail.Designation}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {detail.Division}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {detail.Section}
                </td>
                <td className="px-6 py-4">
                {detail.Trainings.map(training => training.Title).join(", ")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap bg-gray-200 z-5 hover:bg-gray-300 lg:sticky lg:right-0 md:sticky md:right-0">
                  <Link
                    to={`/${detail._id}`}
                    className=" p-2 pl-4 pr-4  rounded transition-colors duration-200 ease-in-out hover:bg-green-500 hover:text-white focus:outline-none mr-2"
                    title="View Detail"
                  >
                  View
                  </Link>
                  {user.email !== "kwangchuk@doat.gov.bt" &&
                    user.email !== "sangay@doat.gov.bt" &&
                    user.email !== "tgyelten@doat.gov.bt" &&
                    user.email !== "nrinchen@doat.gov.bt" &&
                    user.email !== "tdukpa@doat.gov.bt" && (
                      <button
                        className=" p-2 pl-4 pr-4  rounded transition-colors duration-200 ease-in-out hover:bg-red-300 hover:text-white focus:outline-none mr-2"
                        onClick={() => setDeleteId(detail._id)}
                        title="Delete Item"
                      >
                        <img src={trash} alt="Delete Employee" className="w-6 h-6"/>
                      </button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deleteId && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      Delete Confirmation
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this detail?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => handleDelete(deleteId)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteId(null)}
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailsTable;
