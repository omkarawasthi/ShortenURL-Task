"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getLinkStats, Link } from "@/lib/api";
import Image from "next/image";

export default function LinkStatsPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const router = useRouter();
  const [link, setLink] = useState<Link | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Unwrap the params promise
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    const unwrapParams = async () => {
      const unwrappedParams = await params;
      setCode(unwrappedParams.code);
    };
    unwrapParams();
  }, [params]);

  const fetchLinkStats = async () => {
    if (!code) return;

    try {
      setLoading(true);
      const data = await getLinkStats(code);
      setLink(data);
      setError(null);
    } catch (err) {
      setError("Link not found");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (code) {
      fetchLinkStats();
    }
  }, [code]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="shrink-0">
              <Image src="/paste.png" alt="Error" width={24} height={24} />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {error || "Link not found"}
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>The requested link could not be found.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={() => router.push("/")}
            className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => router.push("/")}
          className="cursor-pointer inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          <Image src="/arrow.png" alt="Back" width={24} height={24} />
          Back to Dashboard
        </button>
      </div>

      <div className="bg-white shadow overflow-hipen sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Link Statistics
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Details for your short link
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <p className="text-sm font-medium text-gray-500">Short Code</p>
              <p className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                {link.code}
                <button
                  onClick={() => copyToClipboard(link.code)}
                  className="cursor-pointer ml-2 text-gray-400 hover:text-gray-500 focus:outline-none"
                  aria-label="Copy short code"
                >
                  <Image src="/paste.png" alt="Copy" width={16} height={16} />
                </button>
              </p>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <p className="text-sm font-medium text-gray-500">Original URL</p>
              <p className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-900 break-all"
                >
                  {link.url}
                </a>
              </p>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <p className="text-sm font-medium text-gray-500">Short Link</p>
              <p className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                {`${process.env.NEXT_PUBLIC_BASE_URL}/${link.code}`}
                <button
                  onClick={() =>
                    copyToClipboard(
                      `${process.env.NEXT_PUBLIC_BASE_URL}/${link.code}`
                    )
                  }
                  className="cursor-pointer ml-2 text-gray-400 hover:text-gray-500 focus:outline-none"
                  aria-label="Copy short link"
                >
                  <Image src="/paste.png" alt="Copy" width={16} height={16} />
                </button>
              </p>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <p className="text-sm font-medium text-gray-500">Total Clicks</p>
              <p className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {link.clicks}
              </p>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <p className="text-sm font-medium text-gray-500">Last Clicked</p>
              <p className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(link.lastClicked)}
              </p>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <p className="text-sm font-medium text-gray-500">Created At</p>
              <p className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(link.createdAt)}
              </p>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-6">
        <a
          href={`${process.env.NEXT_PUBLIC_BASE_URL}/${link.code}`}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Visit Short Link
        </a>
      </div>
    </div>
  );
}
