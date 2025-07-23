import { useState } from "react";

const countries = [
  "India",
  "United States",
  "United Kingdom",
  "United Arab Emirates",
  "Australia",
  "Canada",
  "Other",
];
const industries = [
  "Manufacturing",
  "Information Technology",
  "Healthcare",
  "Education",
  "Finance",
  "Other",
];
const services = [
  "Certification",
  "Inspection",
  "Training",
  "Other",
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "India",
    industry: "Manufacturing",
    service: "Certification",
    message: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Handle form submission (e.g., send to API or show success message)
    alert("Thank you for contacting us!");
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center py-12 px-4" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg flex flex-col md:flex-row overflow-hidden">
        {/* Left: Contact Info */}
        <div className="md:w-1/2 bg-blue-50 p-8 flex flex-col gap-6 justify-center">
          <h2 className="text-2xl font-bold text-blue-700 mb-2">Get In Touch</h2>
          <div>
            <div className="mb-2 text-gray-700 font-semibold">Phone (24/7):</div>
            <div className="mb-4 text-lg font-bold text-gray-900">+91-755451 7565, +91-79098 21294</div>
            <div className="mb-2 text-gray-700 font-semibold">Email:</div>
            <div className="mb-4 text-blue-700 underline">admin@cmsil.org, Info@cmsil.org</div>
            <div className="mb-2 text-gray-700 font-semibold">Gujarat Office:</div>
            <div className="mb-4 text-gray-800">No. 9, Mahavir Estate, Santej, Gujarat 382721</div>
            <div className="mb-2 text-gray-700 font-semibold">Madhya Pradesh Office:</div>
            <div className="mb-4 text-gray-800">HIG-B-89 SECTOR-A Vidhya Nagar, H.B Road, Madhya Pradesh 462026</div>
          </div>
        </div>
        {/* Right: Contact Form */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Contact Form</h2>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <input name="name" value={form.name} onChange={handleChange} type="text" placeholder="Your Name" className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" required />
              <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="Your Email" className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" required />
              <input name="phone" value={form.phone} onChange={handleChange} type="tel" placeholder="Your Phone" className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:gap-4">
              <select name="country" value={form.country} onChange={handleChange} className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 w-full md:w-1/3">
                {countries.map(c => <option key={c}>{c}</option>)}
              </select>
              <select name="industry" value={form.industry} onChange={handleChange} className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 w-full md:w-1/3">
                {industries.map(i => <option key={i}>{i}</option>)}
              </select>
              <select name="service" value={form.service} onChange={handleChange} className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 w-full md:w-1/3">
                {services.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <textarea name="message" value={form.message} onChange={handleChange} placeholder="Your Message" rows={4} className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded font-semibold hover:bg-blue-800 transition-colors">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
} 