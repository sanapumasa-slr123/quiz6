import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { listServices } from '../actions/serviceActions';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { services, loading, error } = useSelector((state) => state.service);

  useEffect(() => {
    dispatch(listServices());
  }, [dispatch]);

  if (loading) return <p>Loading services...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="home-container">
      <h1>Available Services</h1>
      <div className="service-grid">
        {services.map((service) => (
          <div key={service.id} className="service-card" onClick={() => navigate(`/services/${service.id}`)}>
            {service.sample_image && <img src={service.sample_image} alt={service.service_name} />}
            <h3>{service.service_name}</h3>
            <p>{service.description.substring(0, 100)}...</p>
            <p className="price">${service.price}</p>
            <p className="rating">Rating: {service.rating}</p>
            <p className="seller">{service.seller_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeScreen;
