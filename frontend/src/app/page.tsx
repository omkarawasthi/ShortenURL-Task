'use client';

import { useState, useEffect } from 'react';
import LinkForm from '@/components/LinkForm';
import LinkTable from '@/components/LinkTable';
import { getAllLinks, deleteLink, Link } from '@/lib/api';
import Image from 'next/image';

export default function Dashboard() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const data = await getAllLinks();
      setLinks(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch links');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (code: string) => {
    // Debugging: log the code parameter
    
    if (!confirm('Are you sure you want to delete this link?')) {
      return;
    }

    try {
      await deleteLink(code);
      fetchLinks(); // Refresh the list
    } catch (err) {
      alert('Failed to delete link');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Create and manage your short links</p>
      </div>

      <div className="mb-8">
        <LinkForm onLinkCreated={fetchLinks} />
      </div>

      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">All Links</h2>
            <p className="mt-1 text-sm text-gray-600">
              {searchTerm 
                ? `Showing ${links.filter(link => 
                    link.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    link.url.toLowerCase().includes(searchTerm.toLowerCase())
                  ).length} of ${links.length} links` 
                : `Showing all ${links.length} links`}
            </p>
          </div>
          <div className="w-full sm:w-auto">
            <div className="flex rounded-md shadow-sm">
              <div className="relative grow focus-within:z-10">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Image src="/search.png" alt="Search" width={20} height={20} />
                </div>
                <input
                  type="text"
                  className="focus:ring-indigo-500 focus:outline-none focus:border-indigo-500 block w-full rounded-none rounded-l-md pl-10 sm:text-sm border-gray-300 py-2"
                  placeholder="Search by code or URL"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="cursor-pointer -ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                onClick={() => setSearchTerm('')}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <LinkTable links={links} onDelete={handleDelete} searchTerm={searchTerm} />
      )}
    </div>
  );
}