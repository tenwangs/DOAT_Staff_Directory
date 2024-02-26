import React from 'react';
import { Link } from 'react-router-dom';



const TermsAndConditions = () => {
  return (
    <div className="p-6 mb-60">
      <p className=''>
       <h1 className='font-bold ml-60 pl-80 underline'>Terms and Conditions </h1><br/>

<h1  className='font-semibold font-mono'>User Conduct and Responsibilities </h1> 

By using our services, you agree to:  <br/>

Truthfulness of Claims: You affirm that all claims or statements you make in relation to our services are truthful and based on actual events. Making false claims or statements that have not actually occurred is strictly prohibited and may result in immediate termination of your account and legal action. <br/>

Violations and Penalties <br/>

If we determine that you have violated these terms, we may, at our sole discretion, take any action we deem appropriate, including but not limited to: <br/>

* Suspending or terminating your access to our services; <br/>
* Taking legal action against you.  <br/><br/>

<p className='font-semibold font-mono'>GOVERNING LAW<br/></p>
 <p className='font-semibold font-mono'>CHAPTER 28: OFFENCES RELATED TO PUBLIC AND CIVIC DUTIES <br/></p>
Reporting of false information <br/>
426. A defendant shall be guilty of the offence of reporting of false information, if the 
defendant knowingly reports false information to a lawful authority with the intent to 
deceive that authority. 
Grading of reporting of false information <br/>
427. The offence of reporting of false information shall be a petty misdemeanour.



      </p>
      <div className='mt-20 ml-80 pl-40'>
      
          <Link to="/login" className="text-blue-500 ml-4  font-bold underline">
        Back to login
      </Link>
      </div>
    </div>
  );
};

export default TermsAndConditions;
