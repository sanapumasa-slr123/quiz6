import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/" element={<div><h1>Home Screen - Coming Soon</h1></div>} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
