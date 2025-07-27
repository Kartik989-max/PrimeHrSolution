import { useEffect, useRef, useState } from "react";

export default function Privacy() {
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
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-sm sm:text-base text-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          {/* Content */}
          <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
            
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Prime HR Solutions ("we," "our," or "us") is committed to protecting your privacy and ensuring the security 
                of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard 
                your information when you visit our website or use our services.
              </p>
              <p className="text-gray-700 leading-relaxed">
                By using our services, you consent to the data practices described in this policy. We are committed to 
                complying with applicable data protection laws, including the Information Technology Act, 2000 and related rules.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">2.1 Personal Information</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We may collect the following personal information:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                <li>Name, email address, and phone number</li>
                <li>Professional information (resume, work history, skills)</li>
                <li>Company information (for client organizations)</li>
                <li>Account credentials and preferences</li>
                <li>Communication records and correspondence</li>
              </ul>

              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">2.2 Automatically Collected Information</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                When you visit our website, we automatically collect certain information:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Pages visited and time spent</li>
                <li>Referring website</li>
                <li>Cookies and similar technologies</li>
              </ul>
            </section>

            {/* How We Use Your Information */}
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                <li>Providing and improving our HR services</li>
                <li>Processing job applications and recruitment</li>
                <li>Managing client relationships and contracts</li>
                <li>Communicating with you about our services</li>
                <li>Analyzing website usage and improving user experience</li>
                <li>Complying with legal obligations</li>
                <li>Preventing fraud and ensuring security</li>
              </ul>
            </section>

            {/* Information Sharing and Disclosure */}
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We do not sell, trade, or rent your personal information to third parties. We may share your information 
                in the following circumstances:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                <li><strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating our website and services</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
                <li><strong>Client Organizations:</strong> For recruitment purposes, with your consent</li>
              </ul>
            </section>

            {/* Data Security */}
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Employee training on data protection</li>
                <li>Incident response procedures</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                However, no method of transmission over the internet or electronic storage is 100% secure. 
                We cannot guarantee absolute security of your information.
              </p>
            </section>

            {/* Cookies and Tracking Technologies */}
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">6. Cookies and Tracking Technologies</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We use cookies and similar technologies to enhance your browsing experience and analyze website usage. 
                These technologies help us:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                <li>Remember your preferences and settings</li>
                <li>Analyze website traffic and performance</li>
                <li>Provide personalized content and advertisements</li>
                <li>Improve our services and user experience</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                You can control cookie settings through your browser preferences. However, disabling cookies may 
                affect the functionality of our website.
              </p>
            </section>

            {/* Your Rights and Choices */}
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">7. Your Rights and Choices</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Objection:</strong> Object to processing of your personal information</li>
                <li><strong>Withdrawal:</strong> Withdraw consent for data processing</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                To exercise these rights, please contact us using the information provided below.
              </p>
            </section>

            {/* Data Retention */}
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">8. Data Retention</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this 
                Privacy Policy, unless a longer retention period is required or permitted by law.
              </p>
              <p className="text-gray-700 leading-relaxed">
                When we no longer need your personal information, we will securely delete or anonymize it in accordance 
                with our data retention policies.
              </p>
            </section>

            {/* International Data Transfers */}
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">9. International Data Transfers</h2>
              <p className="text-gray-700 leading-relaxed">
                Your personal information may be transferred to and processed in countries other than your country of residence. 
                We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards 
                to protect your information.
              </p>
            </section>

            {/* Children's Privacy */}
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">10. Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Our services are not intended for children under the age of 18. We do not knowingly collect personal 
                information from children under 18. If you believe we have collected information from a child under 18, 
                please contact us immediately.
              </p>
            </section>

            {/* Changes to This Policy */}
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">11. Changes to This Policy</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. 
                We will notify you of any material changes by posting the updated policy on our website and updating the 
                "Last updated" date.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
              </p>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">12. Contact Information</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, 
                please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>Prime HR Solutions</strong>
                </p>
                <p className="text-gray-700 mb-2">Delhi NCR, India</p>
                <p className="text-gray-700 mb-2">Phone: +91 12345 67890</p>
                <p className="text-gray-700 mb-2">Email: info@primehrsolution.com</p>
                <p className="text-gray-700">Data Protection Officer: privacy@primehrsolution.com</p>
              </div>
            </section>

            {/* Footer */}
            <div className="border-t border-gray-200 pt-6 mt-12">
              <p className="text-sm text-gray-500 text-center">
                This Privacy Policy is effective as of the date stated above and applies to all users of our services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 