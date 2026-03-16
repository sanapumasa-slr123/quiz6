import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderHistory } from '../actions/orderActions';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const { orders, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getOrderHistory());
  }, [dispatch]);

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      
      <div className="user-info">
        <h3>Account Information</h3>
        <p>
          <strong>Email:</strong> {userInfo?.email}
        </p>
        <p>
          <strong>Role:</strong> {userInfo?.role?.charAt(0).toUpperCase() + userInfo?.role?.slice(1)}
        </p>
      </div>

      <div className="order-history">
        <h3>Order History</h3>
        {error && <p className="error">{error}</p>}
        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Price</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.service_details?.service_name}</td>
                  <td>${order.price_paid}</td>
                  <td>{new Date(order.date_purchased).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
