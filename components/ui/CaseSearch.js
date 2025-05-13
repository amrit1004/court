import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';

function CaseSearch({ defaultOpen = false }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [caseType, setCaseType] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showSearchForm, setShowSearchForm] = useState(defaultOpen);
  const dropdownRef = useRef(null);

  // Common search categories
  const searchCategories = [
    { id: 'caseNumber', label: 'Case Number' },
    { id: 'plaintiff', label: 'Plaintiff Name' },
    { id: 'defendant', label: 'Defendant Name' },
    { id: 'lawyer', label: 'Lawyer Name' },
    { id: 'court', label: 'Court Name' },
    { id: 'judge', label: 'Judge Name' },
  ];

  const caseTypes = [
    'Criminal',
    'Civil',
    'Family-Matters',
    'Land',
    'Co-op court dispute',
    'Charity Trust',
    'SEBI',
  ];

  const statusOptions = [
    'Filed',
    'In Progress',
    'Hearing Scheduled',
    'Under Review',
    'Judgment Reserved',
    'Completed',
    'Dismissed',
    'Withdrawn'
  ];

  // Initialize search fields from URL query params
  useEffect(() => {
    if (router.isReady) {
      const { q, caseType: typeParm, status: statusParam, startDate: startParam, endDate: endParam } = router.query;
      if (q) setSearchTerm(q);
      if (typeParm) setCaseType(typeParm);
      if (statusParam) setStatus(statusParam);
      if (startParam) setStartDate(startParam);
      if (endParam) setEndDate(endParam);
    }
  }, [router.isReady, router.query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Build query params
    const params = new URLSearchParams();
    
    if (searchTerm) params.append('q', searchTerm);
    if (caseType) params.append('caseType', caseType);
    if (status) params.append('status', status);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    // Navigate to search results page
    router.push(`/dashboard/search?${params.toString()}`);
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setCaseType('');
    setStatus('');
    setStartDate('');
    setEndDate('');
  };

  const handleCategorySelect = (categoryLabel) => {
    setSearchTerm(prevTerm => {
      // If there's already text, add the category as a prefix
      if (prevTerm && !prevTerm.startsWith(categoryLabel + ': ')) {
        return `${categoryLabel}: ${prevTerm}`;
      }
      // Otherwise just set the category as a prefix
      return `${categoryLabel}: `;
    });
    setIsDropdownOpen(false);
  };

  const toggleSearchForm = () => {
    setShowSearchForm(prevState => !prevState);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6 transition-colors duration-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold dark:text-white">Search Cases</h2>
        <button
          type="button"
          onClick={toggleSearchForm}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800 rounded-lg transition-colors duration-200"
        >
          {showSearchForm ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Hide Search
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              Show Search
            </>
          )}
        </button>
      </div>
      
      {showSearchForm && (
        <form onSubmit={handleSearch} className="mt-4 border-t dark:border-gray-700 pt-4">
          <div className="mb-4 relative" ref={dropdownRef}>
            <label className="block uppercase tracking-wide text-gray-500 dark:text-gray-400 text-xs font-bold mb-2">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 dark:text-white bg-white dark:bg-gray-700 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="Search by case type, description, lawyer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsDropdownOpen(true)}
              />
              <button 
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 rounded-md shadow-lg">
                <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                  <li className="px-4 py-2 font-medium text-gray-500 dark:text-gray-400">
                    Search by category:
                  </li>
                  {searchCategories.map((category) => (
                    <li 
                      key={category.id}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                      onClick={() => handleCategorySelect(category.label)}
                    >
                      {category.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block uppercase tracking-wide text-gray-500 dark:text-gray-400 text-xs font-bold mb-2">
                Case Type
              </label>
              <select
                className="form-select mt-1 block w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={caseType}
                onChange={(e) => setCaseType(e.target.value)}
              >
                <option value="">All Case Types</option>
                {caseTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block uppercase tracking-wide text-gray-500 dark:text-gray-400 text-xs font-bold mb-2">
                Status
              </label>
              <select
                className="form-select mt-1 block w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block uppercase tracking-wide text-gray-500 dark:text-gray-400 text-xs font-bold mb-2">
                Hearing Date From
              </label>
              <input
                type="date"
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 dark:text-white bg-white dark:bg-gray-700 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block uppercase tracking-wide text-gray-500 dark:text-gray-400 text-xs font-bold mb-2">
                Hearing Date To
              </label>
              <input
                type="date"
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 dark:text-white bg-white dark:bg-gray-700 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              Search
            </button>
            
            <button
              type="button"
              onClick={clearFilters}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Clear Filters
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default CaseSearch; 