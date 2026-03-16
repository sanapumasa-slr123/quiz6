import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitApplication } from '../actions/applicationActions';

const ApplySeller = () => {
  const dispatch = useDispatch();
  const { loading, submitted, error } = useSelector((state) => state.application);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submitApplication());
  };

  return (
    <div className="apply-container">
      <h2>Apply to Become a Seller</h2>
      {error && <p className="error">{error}</p>}
      {submitted && <p className="success">Application submitted successfully!</p>}
      <form onSubmit={handleSubmit}>
        <p>Click the button below to apply as a seller on our platform.</p>
        <button type="submit" disabled={loading || submitted}>
          {loading ? 'Submitting...' : submitted ? 'Application Submitted' : 'Apply as Seller'}
        </button>
      </form>
    </div>
  );
};

export default ApplySeller;
