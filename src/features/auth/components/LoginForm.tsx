// src/features/auth/components/LoginForm.tsx

import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Eye, EyeOff, Mail} from 'lucide-react';
import {useAuthStore} from '../../../store/auth/auth.store';
import {Button, Input} from '../../../components/ui';

export const LoginForm = () => {
  const navigate = useNavigate();
  const { login, error, isLoading, clearError } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login(formData.email, formData.password);
        // On successful login, navigate to the root or a dashboard page
      navigate('/');
    } catch (err) {
        // The error will be set in the auth store, no need to log here
        console.error('Login attempt failed', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        <Input
            label="Email address"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="test@example.com"
            rightIcon={<Mail className="h-5 w-5"/>}
          />

        <Input
            label="Password"
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            rightIcon={
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:opacity-70 focus:outline-none transition-opacity"
                aria-label={showPassword ? "Hide password" : "Show password"}
            >
                {showPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
            </button>
            }
            // Pass the error message from the store directly to the input
            error={error || undefined}
        />

        <Button
            variant="primary"
            size="lg"
            // The new Button's loading prop handles the disabled state and spinner automatically
            loading={isLoading}
            className="w-full"
        type="submit"
      >
            Sign in
        </Button>
    </form>
  );
};