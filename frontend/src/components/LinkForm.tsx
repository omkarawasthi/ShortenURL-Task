import { useState } from 'react';
import { createLink } from '@/lib/api';
import Image from 'next/image';

interface LinkFormProps {
  onLinkCreated: () => void;
}

export default function LinkForm({ onLinkCreated }: LinkFormProps) {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateCode = (code: string) => {
    if (!code) return true; // Custom code is optional
    const regex = /^[A-Za-z0-9]{6,8}$/;
    return regex.test(code);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate inputs
    if (!url) {
      setError('URL is required');
      return;
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid URL');
      return;
    }

    if (customCode && !validateCode(customCode)) {
      setError('Custom code must be 6-8 alphanumeric characters');
      return;
    }

    setIsLoading(true);
    try {
      await createLink(url, customCode || undefined);
      setUrl('');
      setCustomCode('');
      setSuccess('Link created successfully!');
      onLinkCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Create Short Link</h3>
        <div className="mt-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                Original URL
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="customCode" className="block text-sm font-medium text-gray-700">
                Custom Short Code (optional)
              </label>
              <input
                type="text"
                id="customCode"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="6-8 alphanumeric characters"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="shrink-0">
                    <Image src="/paste.png" alt="Error" width={24} height={24} />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="shrink-0">
                    <Image src="/paste.png" alt="Success" width={24} height={24} />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">{success}</h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Image src="/paste.png" alt="Loading" width={24} height={24} className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Creating...
                  </>
                ) : (
                  'Create Short Link'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}