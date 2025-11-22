import { useState, useMemo } from 'react';
import { Link } from '@/lib/api';
import Image from 'next/image';

interface LinkTableProps {
  links: Link[];
  onDelete: (code: string) => void;
  searchTerm: string;
}

export default function LinkTable({ links, onDelete, searchTerm }: LinkTableProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Filter links based on search term
  const filteredLinks = useMemo(() => {
    if (!searchTerm) return links;
    return links.filter(link => 
      link.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.url.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [links, searchTerm]);


  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const handleDelete = (code: string) => {
    // Debugging: log the code parameter
    onDelete(code);
  };

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            {filteredLinks.length === 0 ? (
              <div className="text-center py-12">
                {searchTerm ? (
                  <div>
                    <Image src="/paste.png" alt="No matches" width={12} height={12} className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No matches found</h3>
                    <p className="mt-1 text-sm text-gray-500">No links match your search term &quot;{searchTerm}&quot;.</p>
                  </div>
                ) : (
                  <div>
                    <Image src="/paste.png" alt="No links" width={12} height={12} className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No links found</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new short link.</p>
                  </div>
                )}
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                      Short Code
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/6">
                      Target URL
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                      Total Clicks
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                      Last Clicked
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLinks.map((link) => (
                    <tr key={link.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">{link.code}</div>
                          <button
                            onClick={() => copyToClipboard(link.code)}
                            className="cursor-pointer ml-2 text-gray-400 hover:text-gray-500 focus:outline-none"
                            aria-label="Copy to clipboard"
                          >
                            <Image src="/paste.png" alt="Copy" width={16} height={16} />
                          </button>
                          {copiedCode === link.code && (
                            <span className="ml-2 text-xs text-green-600">Copied!</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          <a 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-900"
                            title={link.url}
                          >
                            {link.url}
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {link.clicks}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(link.lastClicked)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a 
                          href={`/code/${link.code}`} 
                          className="cursor-pointer text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          View Stats
                        </a>
                        <button
                          onClick={() => handleDelete(link.code)}
                          className="cursor-pointer text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}