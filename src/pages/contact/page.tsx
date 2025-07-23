import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setStatus('Message sent!');
      setForm({ name: '', email: '', message: '' });
    } else {
      setStatus('Failed to send.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 px-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full space-y-6">
        <h1 className="text-3xl font-bold text-blue-800 mb-2">Contact Us</h1>
        <input
          className="w-full border-b-2 border-blue-200 focus:border-blue-500 outline-none py-2"
          placeholder="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border-b-2 border-blue-200 focus:border-blue-500 outline-none py-2"
          placeholder="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <textarea
          className="w-full border-b-2 border-blue-200 focus:border-blue-500 outline-none py-2 min-h-[100px]"
          placeholder="Message"
          name="message"
          value={form.message}
          onChange={handleChange}
          required
        />
        <button className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition">Send</button>
        {status && <div className="text-center text-blue-600 mt-2">{status}</div>}
      </form>
    </div>
  );
} 