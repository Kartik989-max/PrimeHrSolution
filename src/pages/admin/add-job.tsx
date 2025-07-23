import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AddJob() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    type: '',
    company: '',
    requirements: '',
  });
  const [status, setStatus] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');
    const res = await fetch('/api/job', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        requirements: form.requirements.split(',').map(r => r.trim()).filter(Boolean),
      }),
    });
    if (res.ok) {
      setStatus('Job added!');
      setForm({ title: '', description: '', location: '', type: '', company: '', requirements: '' });
      setTimeout(() => router.push('/admin/dashboard'), 1200);
    } else {
      setStatus('Failed to add job.');
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar placeholder for layout consistency */}
      <aside className="w-64 bg-white border-r min-h-screen hidden md:block"></aside>
      <main className="flex-1 p-8 flex flex-col items-center justify-center">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-2">Add New Job</h2>
          <input className="border border-gray-300 rounded px-4 py-2" name="title" placeholder="Job Title" value={form.title} onChange={handleChange} required />
          <textarea className="border border-gray-300 rounded px-4 py-2" name="description" placeholder="Job Description" value={form.description} onChange={handleChange} required />
          <input className="border border-gray-300 rounded px-4 py-2" name="location" placeholder="Location" value={form.location} onChange={handleChange} required />
          <input className="border border-gray-300 rounded px-4 py-2" name="type" placeholder="Job Type (Full-time, Part-time)" value={form.type} onChange={handleChange} required />
          <input className="border border-gray-300 rounded px-4 py-2" name="company" placeholder="Company Name" value={form.company} onChange={handleChange} required />
          <textarea className="border border-gray-300 rounded px-4 py-2" name="requirements" placeholder="Requirements (comma separated)" value={form.requirements} onChange={handleChange} />
          <button type="submit" className="bg-blue-700 text-white py-2 rounded font-semibold hover:bg-blue-800 transition-colors">Add Job</button>
          {status && <div className="text-center text-blue-600 mt-2">{status}</div>}
        </form>
      </main>
    </div>
  );
} 