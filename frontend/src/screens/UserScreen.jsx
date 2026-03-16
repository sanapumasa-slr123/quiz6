import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listAllUsers, listApplicationsAdmin, approveApplication, declineApplication } from '../actions/chatActions';

const UserScreen = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const { loading, users, applications, error } = useSelector((state) => state.chat);
  const [activeTab, setActiveTab] = useState('users');
  const [declineReason, setDeclineReason] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    if (userInfo?.role === 'admin') {
      dispatch(listAllUsers());
      dispatch(listApplicationsAdmin());
    }
  }, [dispatch, userInfo]);

  const handleApprove = (id) => {
    dispatch(approveApplication(id)).then(() => {
      dispatch(listApplicationsAdmin());
    });
  };

  const handleDecline = (id) => {
    dispatch(declineApplication(id, declineReason)).then(() => {
      setDeclineReason('');
      setSelectedApp(null);
      dispatch(listApplicationsAdmin());
    });
  };

  if (userInfo?.role !== 'admin') {
    return <p>Access denied.</p>;
  }

  return (
    <div className="admin-container">
      <h2>Admin Panel</h2>
      {error && <p className="error">{error}</p>}

      <div className="admin-tabs">
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={activeTab === 'applications' ? 'active' : ''}
          onClick={() => setActiveTab('applications')}
        >
          Seller Applications
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="tab-content">
          <h3>All Users</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.first_name}</td>
                    <td>{user.last_name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <button>Edit</button>
                      <button>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="tab-content">
          <h3>Seller Applications</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td>{app.user.first_name} {app.user.last_name}</td>
                    <td>{app.user.email}</td>
                    <td>{app.status}</td>
                    <td>
                      {app.status === 'pending' && (
                        <>
                          <button onClick={() => handleApprove(app.id)}>Approve</button>
                          <button
                            onClick={() => setSelectedApp(app.id)}
                          >
                            Decline
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedApp && (
            <div className="decline-modal">
              <div className="modal-content">
                <h3>Decline Application</h3>
                <textarea
                  placeholder="Reason for decline"
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                />
                <button onClick={() => handleDecline(selectedApp)}>
                  Confirm Decline
                </button>
                <button onClick={() => setSelectedApp(null)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserScreen;
