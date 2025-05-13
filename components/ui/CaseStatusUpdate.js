import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

function CaseStatusUpdate({ caseId }) {
  const [statusUpdates, setStatusUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

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

  // Fetch status updates on component mount
  useEffect(() => {
    async function fetchStatusUpdates() {
      try {
        const response = await fetch(`/api/case/status?caseId=${caseId}`);
        const data = await response.json();
        
        if (response.ok) {
          setStatusUpdates(data.statusUpdates || []);
        } else {
          toast.error('Failed to fetch status updates');
        }
      } catch (error) {
        console.error('Error fetching status updates:', error);
        toast.error('An error occurred while fetching status updates');
      } finally {
        setLoading(false);
      }
    }

    if (caseId) {
      fetchStatusUpdates();
    }
  }, [caseId]);

  // Handle form submission
  const onSubmit = async (data) => {
    setSubmitting(true);
    const toastId = toast.loading('Updating case status...');

    try {
      const response = await fetch('/api/case/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          caseId,
          status: data.status,
          notes: data.notes,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success('Case status updated successfully');
        
        // Add the new status update to the list
        setStatusUpdates([
          {
            caseId,
            status: data.status,
            notes: data.notes,
            updatedAt: new Date().toISOString(),
            updatedBy: 'You', // Will be replaced by actual user in the API
            _id: responseData.result.insertedId,
          },
          ...statusUpdates,
        ]);
        
        // Reset the form
        reset();
      } else {
        toast.error(responseData.message || 'Failed to update case status');
      }
    } catch (error) {
      console.error('Error updating case status:', error);
      toast.error('An error occurred while updating the case status');
    } finally {
      setSubmitting(false);
      toast.dismiss(toastId);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6 transition-colors duration-200">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Case Status</h2>
      
      {/* Status update form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
        <div className="mb-4">
          <label className="block uppercase tracking-wide text-gray-500 dark:text-gray-400 text-xs font-bold mb-2">
            Update Status
          </label>
          <select
            className="form-select mt-1 block w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            {...register('status', { required: true })}
          >
            <option value="">Select Status</option>
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className="text-red-500 text-xs mt-1">Status is required</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block uppercase tracking-wide text-gray-500 dark:text-gray-400 text-xs font-bold mb-2">
            Notes
          </label>
          <textarea
            className="border-0 px-3 py-3 mt-1 placeholder-blueGray-300 text-blueGray-600 dark:text-white bg-white dark:bg-gray-700 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            placeholder="Add additional notes or context for this status update"
            rows="3"
            {...register('notes')}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          {submitting ? 'Updating...' : 'Update Status'}
        </button>
      </form>

      {/* Status history */}
      <div>
        <h3 className="text-lg font-semibold mb-3 dark:text-white">Status History</h3>
        
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading status history...</p>
        ) : statusUpdates.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No status updates found</p>
        ) : (
          <div className="space-y-4">
            {statusUpdates.map((update) => (
              <div key={update._id} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex justify-between">
                  <span className="font-medium text-blue-700 dark:text-blue-400">{update.status}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(update.updatedAt)}</span>
                </div>
                {update.notes && <p className="text-gray-700 dark:text-gray-300 mt-1">{update.notes}</p>}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Updated by: {update.updatedBy}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CaseStatusUpdate; 