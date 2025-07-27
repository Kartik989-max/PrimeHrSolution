import { useState } from 'react';

interface CloudinaryStatus {
  success?: boolean;
  error?: string;
  message?: string;
  cloud_name?: string;
  api_key?: string;
  api_secret?: string;
  uploads?: Array<{
    public_id: string;
    secure_url: string;
    created_at: string;
  }>;
}

export default function CheckCloudinary() {
  const [cloudinaryStatus, setCloudinaryStatus] = useState<CloudinaryStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkCloudinary = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/check-cloudinary');
      const data = await response.json();
      setCloudinaryStatus(data);
    } catch (error) {
      console.error('Error:', error);
      setCloudinaryStatus({ error: 'Failed to check Cloudinary status' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Cloudinary Status Check</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Check Configuration</h2>
          <button
            onClick={checkCloudinary}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Checking...' : 'Check Cloudinary Status'}
          </button>
        </div>

        {cloudinaryStatus && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Results</h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(cloudinaryStatus, null, 2)}
            </pre>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">How to Check Uploads</h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold">1. Cloudinary Dashboard</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Go to <a href="https://cloudinary.com/console" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Cloudinary Console</a></li>
                <li>Sign in to your account</li>
                <li>Click &quot;Media Library&quot; in the left sidebar</li>
                <li>Look for the &quot;resumes&quot; folder</li>
                <li>Your uploaded files should appear here</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold">2. Server Console Logs</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Check your terminal/console where you&apos;re running the dev server</li>
                <li>Look for upload logs when you submit a resume</li>
                <li>You should see &quot;Starting Cloudinary upload&quot; and &quot;Cloudinary upload successful&quot; messages</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold">3. Environment Variables</h3>
              <p className="ml-4">Make sure your <code className="bg-gray-100 px-1 rounded">.env.local</code> file has:</p>
              <pre className="bg-gray-100 p-3 rounded-lg text-sm ml-4 mt-2">
{`CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 