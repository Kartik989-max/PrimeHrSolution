import Link from 'next/link';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Add form handling logic as needed
  return (
    <div className="min-h-screen flex">
      {/* Left: Form */}
      <div className="flex-1 flex flex-col justify-center px-12 py-16 bg-white">
        <h1 className="text-4xl font-bold text-blue-800 mb-2">Candidate Login</h1>
        <p className="mb-8 text-gray-500">Welcome back! Please login to your account.</p>
        <form className="space-y-6">
          <input className="w-full border-b-2 border-blue-200 focus:border-blue-500 outline-none py-2" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="w-full border-b-2 border-blue-200 focus:border-blue-500 outline-none py-2" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <button className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition">Login</button>
        </form>
        <div className="mt-6 text-sm">
          Don&apos;t have an account? <Link href="/register" className="text-blue-700 underline">Register</Link>
        </div>
      </div>
      {/* Right: Illustration/Background */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-blue-100 relative">
        {/* Example SVG shape */}
        <svg className="absolute top-10 right-10 w-40 h-40 opacity-30" fill="#60A5FA" viewBox="0 0 200 200">
          <path d="M40,-60C55,-50,70,-40,80,-20C90,0,95,20,85,40C75,60,50,80,30,80C10,80,-10,60,-30,40C-50,20,-70,0,-70,-20C-70,-40,-50,-60,-30,-70C-10,-80,10,-70,40,-60Z" />
        </svg>
      </div>
    </div>
  );
} 