// src/components/ui/LoginForm.tsx
import type { LoginRequest } from '../../api/login/types';
import './LoginForm.css';

interface LoginFormProps {
  onSubmit: (credentials: LoginRequest) => void;
  isLoading: boolean;
}

export default function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    onSubmit({ email, password });
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="login-form-group">
        <label htmlFor="email" className="login-form-label">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="Enter your admin email"
          className="login-form-input"
          autoComplete="email"
        />
      </div>

      <div className="login-form-group">
        <label htmlFor="password" className="login-form-label">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder="Enter your password"
          className="login-form-input"
          autoComplete="current-password"
        />
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        className="login-form-button"
      >
        {isLoading ? 'Signing In...' : 'Sign In to Admin Panel'}
      </button>
    </form>
  );
}