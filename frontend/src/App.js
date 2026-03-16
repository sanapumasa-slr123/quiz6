import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import store from './store';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import ApplySeller from './screens/ApplySeller';
import SellerDashboard from './screens/SellerDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function AppContent() {
  const { userInfo } = useSelector((state) => state.user);

  return (
    <Router>
      <Routes>
        <Route
          path="/signin"
          element={userInfo ? <Navigate to="/" /> : <SignIn />}
        />
        <Route
          path="/register"
          element={userInfo ? <Navigate to="/" /> : <SignUp />}
        />
        <Route path="/" element={<HomeScreen />} />
        <Route path="/services/:id" element={<DetailScreen />} />
        <Route
          path="/apply"
          element={
            <ProtectedRoute>
              <ApplySeller />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/dashboard"
          element={
            <ProtectedRoute requiredRole="seller">
              <SellerDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
