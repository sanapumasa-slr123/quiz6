import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listSellerServices, createService } from '../actions/serviceActions';

const SellerDashboard = () => {
  const dispatch = useDispatch();
  const { services, loading, error } = useSelector((state) => state.service);
  const [formData, setFormData] = useState({
    service_name: '',
    description: '',
    price: '',
    duration_of_service: '',
    sample_image: null,
  });

  useEffect(() => {
    dispatch(listSellerServices());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    dispatch(createService(data)).then(() => {
      setFormData({
        service_name: '',
        description: '',
        price: '',
        duration_of_service: '',
        sample_image: null,
      });
      dispatch(listSellerServices());
    });
  };

  if (loading && services.length === 0) return <p>Loading...</p>;

  return (
    <div className="seller-dashboard">
      <h2>Seller Dashboard</h2>
      {error && <p className="error">{error}</p>}

      <div className="add-service-form">
        <h3>Add New Service</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="service_name"
            placeholder="Service Name"
            value={formData.service_name}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="duration_of_service"
            placeholder="Duration"
            value={formData.duration_of_service}
            onChange={handleChange}
          />
          <input
            type="file"
            name="sample_image"
            accept="image/*"
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Service'}
          </button>
        </form>
      </div>

      <div className="services-list">
        <h3>Your Services</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td>{service.service_name}</td>
                <td>${service.price}</td>
                <td>{service.rating}</td>
                <td>
                  <button>Edit</button>
                  <button>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellerDashboard;
