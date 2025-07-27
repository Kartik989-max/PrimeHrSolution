import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center py-12 px-4" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
      {/* Hero Section */}
      <section className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-8 mb-10 flex flex-col items-center">
        <Image src="/logo.png" alt="Prime HR Solutions Logo" width={120} height={40} className="mb-4 h-40 w-40 object-cover" />
        <h1 className="text-heading mb-2 text-center">About Prime HR Solutions</h1>
        <p className="text-body text-center max-w-2xl">
          Prime HR Solutions is a leading HR and manpower consultancy based in Delhi NCR, dedicated to connecting top talent with top organizations across India. We specialize in providing tailored recruitment, outsourcing, and HR solutions for a wide range of industries.
        </p>
      </section>

      {/* About Company */}
      <section className="w-full max-w-6xl bg-white rounded-xl shadow p-8 mb-10">
        <h2 className="text-subheading mb-4 text-blue-700">Who We Are</h2>
        <p className="text-body mb-4">
          Established by a team of experienced HR professionals, Prime HR Solutions has become a trusted partner for organizations seeking reliable and effective talent solutions. Our consultants leverage deep industry knowledge and a personalized approach to ensure the perfect match for both employers and job seekers.
        </p>
        <p className="text-body">
          We serve a diverse clientele, including MNCs, private companies, and startups, across sectors such as Power, IT, Manufacturing, Services, and more. Our commitment to quality, transparency, and long-term relationships sets us apart in the recruitment industry.
        </p>
      </section>

      {/* Mission Statement */}
      <section className="w-full max-w-6xl bg-white rounded-xl shadow p-8 mb-10">
        <h2 className="text-subheading mb-4 text-blue-700">Our Mission</h2>
        <p className="text-body">
          Our mission is to empower organizations and individuals by delivering exceptional HR solutions and fostering lasting partnerships. We strive to provide the highest level of service, ensuring our clients and candidates achieve their goals with confidence and success.
        </p>
      </section>

      {/* Why Choose Us */}
      <section className="w-full max-w-6xl bg-white rounded-xl shadow p-8 mb-10">
        <h2 className="text-subheading mb-4 text-blue-700">Why Choose Prime HR Solutions?</h2>
        <ul className="list-disc list-inside text-body space-y-2">
          <li>Personalized recruitment and HR solutions tailored to your needs</li>
          <li>Extensive industry expertise and a proven track record</li>
          <li>Rigorous candidate screening and verification</li>
          <li>Commitment to transparency, integrity, and long-term success</li>
          <li>Ongoing support for both clients and candidates</li>
        </ul>
      </section>

      {/* Call to Action */}
      <section className="w-full max-w-4xl bg-blue-50 rounded-xl shadow p-8 flex flex-col items-center">
        <h2 className="text-subheading mb-2 text-blue-700">Ready to Find Your Next Opportunity?</h2>
        <p className="text-body mb-4 text-center">
          Whether you&apos;re a job seeker or an employer, Prime HR Solutions is here to help you succeed. <br />
          <Link href="/contact" className="text-blue-700 font-semibold underline hover:text-blue-900">Contact us</Link> today or <Link href="/jobs" className="text-blue-700 font-semibold underline hover:text-blue-900">explore our job openings</Link>.
        </p>
      </section>
    </div>
  );
} 