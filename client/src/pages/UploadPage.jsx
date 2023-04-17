import React from 'react';
import { Navigate } from 'react-router-dom';
import UploadComponent from '../components/UploadComponent';

function requireAuth(WrappedComponent) {
  return function WithAuth(props) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      return <Navigate to="/login" />;
    }
    return <WrappedComponent {...props} />;
  };
}

function UploadPage() {
  return <UploadComponent />;
}

export default requireAuth(UploadPage);
