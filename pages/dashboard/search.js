import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { getSession } from 'next-auth/client';
import toast from 'react-hot-toast';
import CaseSearch from '@/components/ui/CaseSearch';

function SearchResults() {
  const router = useRouter();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({});

  // Fetch search results when query params change
  useEffect(() => {
    async function fetchSearchResults() {
      if (!router.isReady) return;
      
      setLoading(true);
      
      try {
        // Get all query params
        const params = new URLSearchParams(router.query);
        
        const response = await fetch(`/api/case/search?${params.toString()}`);
        const data = await response.json();
        
        if (response.ok) {
          setCases(data.cases || []);
          setSearchParams(data.filters || {});
        } else {
          toast.error('Failed to fetch search results');
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
        toast.error('An error occurred while fetching search results');
      } finally {
        setLoading(false);
      }
    }

    fetchSearchResults();
  }, [router.query, router.isReady]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <>
      <Head>
        <title>Search Cases</title>
        <meta name="description" content="Search and filter your court cases" />
      </Head>

      <div className="pt-8 pb-12">
        <h1 className="text-3xl font-bold mb-6 dark:text-white">Search Cases</h1>
        
        {/* Search Form */}
        <CaseSearch defaultOpen={Object.keys(router.query).length > 0} />
        
        {/* Search Results */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-200">
          {loading ? (
            <p className="text-gray-500 dark:text-gray-400">Loading search results...</p>
          ) : (
            <>
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-bold dark:text-white">
                  {cases.length === 0 ? 'No results found' : `${cases.length} Results`}
                </h2>
                {Object.keys(searchParams).some(key => searchParams[key]) && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {searchParams.query && (
                      <span className="mr-2">
                        Search: <strong className="dark:text-gray-300">{searchParams.query}</strong>
                      </span>
                    )}
                    {searchParams.caseType && (
                      <span className="mr-2">
                        Type: <strong className="dark:text-gray-300">{searchParams.caseType}</strong>
                      </span>
                    )}
                    {searchParams.status && (
                      <span className="mr-2">
                        Status: <strong className="dark:text-gray-300">{searchParams.status}</strong>
                      </span>
                    )}
                    {(searchParams.startDate || searchParams.endDate) && (
                      <span>
                        Date: <strong className="dark:text-gray-300">
                          {searchParams.startDate ? formatDate(searchParams.startDate) : 'Any'} 
                          {' to '} 
                          {searchParams.endDate ? formatDate(searchParams.endDate) : 'Any'}
                        </strong>
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              {cases.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No cases match your search criteria</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white dark:bg-gray-800">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Case No</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Case Type</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Lawyer Name</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Hearing Date</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cases.map((caseItem, index) => (
                        <tr key={caseItem._id} className="border-t border-gray-200 dark:border-gray-700">
                          <td className="px-4 py-3 text-sm dark:text-gray-300">{index + 1}</td>
                          <td className="px-4 py-3 text-sm dark:text-gray-300">{caseItem.Case_Type}</td>
                          <td className="px-4 py-3 text-sm dark:text-gray-300">{caseItem.Lawyer_Name}</td>
                          <td className="px-4 py-3 text-sm dark:text-gray-300">{formatDate(caseItem.Hearing_Date)}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              caseItem.currentStatus === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                              caseItem.currentStatus === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                              caseItem.currentStatus === 'Dismissed' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                            }`}>
                              {caseItem.currentStatus || 'Not Set'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <Link href={`/dashboard/${caseItem.uid}`}>
                              <a className="py-1 px-2 bg-blue-700 hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500 text-white hover:text-black dark:hover:text-white rounded transition duration-300">
                                View
                              </a>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}

export default SearchResults; 