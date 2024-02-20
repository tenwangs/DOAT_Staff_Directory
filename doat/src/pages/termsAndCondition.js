import React from 'react';
import { Link } from 'react-router-dom';



const TermsAndConditions = () => {
  return (
    <div className="p-6 mb-60">
      <p className=''>
       <h1 className='font-bold ml-60 pl-80 underline'>Terms and Conditions </h1><br/>

<h1  className='font-semibold'>User Conduct and Responsibilities </h1> <br/>

By using our services, you agree to:  <br/>

Truthfulness of Claims: You affirm that all claims or statements you make in relation to our services are truthful and based on actual events. Making false claims or statements that have not actually occurred is strictly prohibited and may result in immediate termination of your account and legal action. <br/>

Violations and Penalties <br/>

If we determine that you have violated these terms, we may, at our sole discretion, take any action we deem appropriate, including but not limited to: <br/>

* Suspending or terminating your access to our services; <br/>
* Taking legal action against you.  <br/>

Governing Law <br/>

These terms and conditions are governed by the laws of Bhutan. Any disputes arising out of or relating to these terms shall be resolved in accordance with Bhutanese law[^2^][4].



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
