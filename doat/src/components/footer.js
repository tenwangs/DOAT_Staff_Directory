import React, { useState } from 'react';

const Footer = () => {
    const [activeSection, setActiveSection] = useState('details');
    const [detailsButtonColor, setDetailsButtonColor] = useState('bg-gray-800');
    const [contactUsButtonColor, setContactUsButtonColor] = useState('bg-gray-800');

    const details = (
        <div className="transition-all duration-500 w-2/6 ml-40 font-semibold ">
            <p>Department of Air Transport
Ministry of Infrastructure and Transport
Paro International Airport; Bhutan
Tel : +975 8-271403
P.O. Box No. : 1220
Email : doat@doat.gov.bt </p>
        </div>
    );

    const contactUs = (
        <div className="transition-all duration-500 mt-4 w-2/6 ml-40 font-semibold">
           <p>Email:enquiry@drukair.com.bt  
            Contact: 1300 (within Bhutan)
            +975 8 276430 (International)
            Operational: 7AM - 9PM (GMT +6)</p>
        </div>
        
    );
    

    return (
        <footer className="bg-gray-800 text-gray-300 p-6 flex">
            <div className="flex flex-col justify-between items-center  mr-4 ml-40">
                <button onClick={() => {setActiveSection('details'); setDetailsButtonColor('bg-gray-400'); setContactUsButtonColor('bg-gray-800')}} className={`${detailsButtonColor} rounded pl-12 pr-12 pt-2 pb-2 font-semibold hover:bg-gray-200 border-solid border-2 border-gray-700`}>Details</button>
                <button onClick={() => {setActiveSection('contactUs'); setContactUsButtonColor('bg-gray-400'); setDetailsButtonColor('bg-gray-800')}} className={`${contactUsButtonColor} rounded pl-8 pr-10  pt-2 pb-2 font-semibold hover:bg-gray-200 mt-4 border-solid border-2 border-gray-700`}>Contact_us</button>
                
               
            </div>
            <div className=" ml-4 flex-grow">
                {activeSection === 'details' ? details : null}
                {activeSection === 'contactUs' ? contactUs : null}
                
               
            </div>
        </footer>
    );
};

export default Footer;
