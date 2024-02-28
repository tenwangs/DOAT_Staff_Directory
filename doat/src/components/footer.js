import React, { useState } from "react";

const Footer = () => {
  const [activeSection, setActiveSection] = useState("details");
  const [detailsButtonColor, setDetailsButtonColor] = useState("bg-gray-800");
  const [contactUsButtonColor, setContactUsButtonColor] = useState("bg-gray-800");

  const details = (
    <div className="transition-all duration-500 w-full font-semibold ">
      <p>
        Department of Air Transport <br />
        Ministry of Infrastructure and Transport
        <br />
        Paro International Airport; Bhutan
        <br />
        Tel : +975 8-271403
        <br />
        Email : doat@doat.gov.bt{" "}
      </p>
    </div>
  );

  const contactUs = (
    <div className="transition-all duration-500 mt-2 pb-4 w-full font-semibold">
      <p>
        Email: enquiry@drukair.com.bt <br />
        Contact: 1300 (within Bhutan) <br />
        +975 8 276430 (International) <br />
        Operational: 7AM - 9PM (GMT +6)
      </p>
    </div>
  );

  return (
    <div className="mt-8 overflow-auto">
      <footer className="bg-gray-800 text-gray-300 p-4 lg:p-6 flex flex-col lg:flex-row items-center justify-center">
        <div className="flex mb-4 lg:mb-0 lg:mr-4">
          <button
            onClick={() => {
              setActiveSection("details");
              setDetailsButtonColor("bg-gray-400");
              setContactUsButtonColor("bg-gray-800");
            }}
            className={`${detailsButtonColor} rounded pl-4 pr-4 pt-1 pb-1 font-semibold hover:bg-gray-200 border-solid border-2 border-gray-700`}
          >
            Details
          </button>
          <button
            onClick={() => {
              setActiveSection("contactUs");
              setContactUsButtonColor("bg-gray-400");
              setDetailsButtonColor("bg-gray-800");
            }}
            className={`${contactUsButtonColor} rounded pl-4 pr-4 pt-1 pb-1 font-semibold hover:bg-gray-200 border-solid border-2 border-gray-700 ml-2 lg:ml-4`}
          >
            Contact Us
          </button>
        </div>
        <div className="flex flex-col items-center lg:flex-row">
          {activeSection === "details" ? details : null}
          {activeSection === "contactUs" ? contactUs : null}
        </div>
      </footer>
    </div>
  );
};

export default Footer;
