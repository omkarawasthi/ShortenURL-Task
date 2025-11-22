'use client';

import { useState, useEffect } from 'react';
import { healthCheck } from '@/lib/api';

export default function HealthPage() {
  const [healthData, setHealthData] = useState<{ ok: boolean; version: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    try {
      setLoading(true);
      const data = await healthCheck();
      setHealthData(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch health data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">System Health</h1>
        <p className="mt-2 text-gray-600">Status and details of the TinyLink service</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Health Status</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Current system status information</p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <p className="text-sm font-medium text-gray-500">Status</p>
                <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    healthData?.ok 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {healthData?.ok ? 'Operational' : 'Degraded'}
                  </span>
                </div>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <p className="text-sm font-medium text-gray-500">Version</p>
                <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {healthData?.version || 'Unknown'}
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <p className="text-sm font-medium text-gray-500">Last Check</p>
                <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date().toLocaleString()}
                </div>
              </div>
            </dl>
          </div>
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={checkHealth}
          className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Refresh Status
        </button>
      </div>
    </div>
  );
}