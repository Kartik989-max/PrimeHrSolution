import { useEffect, useRef, useState } from "react";

export default function Terms() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 md:py-12" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={sectionRef}
          className={`bg-white rounded-lg shadow-sm p-6 sm:p-8 md:p-10 transition-opacity duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionProperty: 'opacity, transform' }}
        >
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-sm sm:text-base text-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          {/* Content */}
          <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
            
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Welcome to Prime HR Solutions. These Terms of Service ("Terms") govern your use of our website and services. 
                By accessing or using our services, you agree to be bound by these Terms and all applicable laws and regulations.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Prime HR Solutions is a leading manpower and HR solutions agency based in Delhi NCR, providing recruitment, 
                outsourcing, and HR services to organizations across India.
              </p>
            </section>

            {/* Acceptance of Terms */}
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">2. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                By accessing our website or using our services, you acknowledge that you have read, understood, and agree 
                to be bound by these Terms. If you do not agree with any part of these Terms, you must not use our services.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting 
                on our website. Your continued use of our services after any changes constitutes acceptance of the new Terms.
              </p>
            </section>

            {/* Services Description */}
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">3. Services Description</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Prime HR Solutions provides the following services:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                <li>Executive Search and Recruitment</li>
                <li>Manpower Outsourcing</li>
                <li>Payroll Administration</li>
                <li>HR Systems & Policy Development</li>
                <li>Training & Compliance</li>
                <li>Statutory Compliance</li>
                <li>Technical & Behavioral Training</li>
              </ul>
            </section>

            {/* User Accounts */}
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">4. User Accounts</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                When you create an account with us, you must provide accurate, complete, and current information. 
                You are responsible for maintaining the confidentiality of your account credentials and for all 
                activities that occur under your account.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You agree to notify us immediately of any unauthorized use of your account or any other breach of security. 
                We reserve the right to terminate accounts that violate these Terms or are used for fraudulent purposes.
              </p>
            </section>

            {/* Privacy and Data Protection */}
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">5. Privacy and Data Protection</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Your privacy is important to us. Our collection and use of personal information is governed by our 
                Privacy Policy, which is incorporated into these Terms by reference.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We are committed to protecting your personal data in accordance with applicable data protection laws 
                and regulations, including the Information Technology Act, 2000 and related rules.
              </p>
            </section>

            {/* Intellectual Property */}
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                All content on our website, including but not limited to text, graphics, logos, images, and software, 
                is the property of Prime HR Solutions and is protected by copyright and other intellectual property laws.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You may not reproduce, distribute, modify, or create derivative works of our content without our 
                express written consent.
              </p>
            </section>

            {/* Prohibited Uses */}
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">7. Prohibited Uses</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                You agree not to use our services for any unlawful purpose or in any way that could damage, disable, 
                overburden, or impair our servers or networks. Prohibited activities include:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                <li>Violating any applicable laws or regulations</li>
                <li>Infringing on intellectual property rights</li>
                <li>Transmitting harmful, offensive, or inappropriate content</li>
                <li>Attempting to gain unauthorized access to our systems</li>
                <li>Interfering with other users' use of our services</li>
              </ul>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                To the maximum extent permitted by law, Prime HR Solutions shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages arising out of or relating to your use of our services.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our total liability to you for any claims arising from these Terms or your use of our services 
                shall not exceed the amount you paid us in the twelve months preceding the claim.
              </p>
            </section>

            {/* Indemnification */}
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">9. Indemnification</h2>
              <p className="text-gray-700 leading-relaxed">
                You agree to indemnify and hold harmless Prime HR Solutions, its officers, directors, employees, 
                and agents from and against any claims, damages, obligations, losses, liabilities, costs, or debt 
                arising from your use of our services or violation of these Terms.
              </p>
            </section>

            {/* Termination */}
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">10. Termination</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We may terminate or suspend your account and access to our services at any time, with or without cause, 
                with or without notice, effective immediately.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Upon termination, your right to use our services will cease immediately. All provisions of these Terms 
                which by their nature should survive termination shall survive termination.
              </p>
            </section>

            {/* Governing Law */}
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">11. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of India. Any disputes 
                arising from these Terms or your use of our services shall be subject to the exclusive jurisdiction 
                of the courts in Delhi NCR, India.
              </p>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">12. Contact Information</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>Prime HR Solutions</strong>
                </p>
                <p className="text-gray-700 mb-2">Delhi NCR, India</p>
                <p className="text-gray-700 mb-2">Phone: +91 12345 67890</p>
                <p className="text-gray-700">Email: info@primehrsolution.com</p>
              </div>
            </section>

            {/* Footer */}
            <div className="border-t border-gray-200 pt-6 mt-12">
              <p className="text-sm text-gray-500 text-center">
                These Terms of Service constitute the entire agreement between you and Prime HR Solutions 
                regarding the use of our services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 