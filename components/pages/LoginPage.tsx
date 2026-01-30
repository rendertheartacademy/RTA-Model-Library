
import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface LoginPageProps {
  onLogin: (email: string, phone: string) => void;
  onNavigate: (page: 'landing') => void;
  error?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigate, error }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, phone);
  };

  return (
    <div className="container mx-auto px-6 py-20 flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md bg-[#111827] border-[#1f2937] shadow-2xl">
        <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#c8102e] mb-2">Login / Check Status</h1>
            <p className="text-gray-400 text-sm leading-relaxed">
                Please enter the Email and Phone Number you used during subscription.
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email</label>
                <input 
                    type="email" 
                    id="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-md bg-[#1f2937] border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#c8102e] focus:border-transparent transition-all placeholder-gray-500"
                    required
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-200">Phone Number</label>
                <input 
                    type="tel" 
                    id="phone" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 rounded-md bg-[#1f2937] border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#c8102e] focus:border-transparent transition-all placeholder-gray-500"
                    required
                />
            </div>

            {error && (
                <div className="p-3 bg-red-900/30 border border-red-800 text-red-400 rounded text-sm text-center">
                    {error}
                </div>
            )}

            <Button type="submit" className="w-full !py-3 !text-base !font-bold shadow-lg shadow-[#c8102e]/20">
                Login to Dashboard
            </Button>
            
            <div className="text-center mt-4">
                <button 
                    type="button" 
                    onClick={() => onNavigate('landing')}
                    className="text-gray-500 text-sm hover:text-gray-300 transition-colors"
                >
                    Back to Home
                </button>
            </div>
        </form>
      </Card>
    </div>
  );
};
