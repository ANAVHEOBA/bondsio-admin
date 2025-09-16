// src/pages/LoginPage.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ← ADD THIS
import { login } from '../api/login/api';
import type { LoginRequest } from '../api/login/types';
import LoginForm from '../components/ui/LoginForm.tsx';
import './LoginPage.css';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // ← GET NAVIGATE FUNCTION

  const handleLogin = async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);
  
    try {
      const result = await login(credentials);
      console.log('✅ Login successful:', result.data.access_token);
  
      // 🧠 SAVE TOKEN TO localStorage
      localStorage.setItem('admin_token', result.data.access_token);
  
      // 🚀 REDIRECT TO DASHBOARD
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('❌ Login failed:', err);
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <h1>Admin Login</h1>
      {error && (
        <div className="login-error">
          {error}
        </div>
      )}
      <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
    </div>
  );
}