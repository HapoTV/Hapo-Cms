// src/features/auth/routes/Auth.tsx
import React from 'react';
import { Cloud } from 'lucide-react';
import { LoginForm } from '../components/LoginForm';

export const Auth = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="rounded-lg bg-blue-500 p-2">
            <Cloud className="h-12 w-12 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your credentials to sign in
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <LoginForm />

          {/* Only show test credentials in development mode */}
          {import.meta.env.MODE === 'development' && (
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Test Credentials</span>
                  </div>
                </div>
                <div className="mt-6 text-center text-sm">
                  <div className="text-gray-600">Email: example@example.com</div>
                  <div className="text-gray-600">Password: @Tester1154</div>
                </div>
              </div>
          )}


        </div>
      </div>
    </div>
  );
};