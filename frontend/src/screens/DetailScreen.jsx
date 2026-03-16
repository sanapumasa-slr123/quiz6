import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getServiceDetail } from '../actions/serviceActions';

const DetailScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { service, loading, error } = useSelector((state) => state.service);

  useEffect(() => {
    dispatch(getServiceDetail(id));
  }, [dispatch, id]);

  if (loading) return <p>Loading service details...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!service) return <p>Service not found.</p>;

  return (
    <div className="detail-container">
      <div className="detail-content">
        {service.sample_image && (
          <img src={service.sample_image} alt={service.service_name} className="detail-image" />
        )}
        <div className="detail-info">
          <h2>{service.service_name}</h2>
          <p className="seller">By: {service.seller_name}</p>
          <p className="description">{service.description}</p>
          <p className="duration">Duration: {service.duration_of_service}</p>
          <p className="price">Price: ${service.price}</p>
          <p className="rating">Rating: {service.rating}</p>
          <button className="avail-btn">Avail Service</button>
        </div>
      </div>
    </div>
  );
};

export default DetailScreen;
