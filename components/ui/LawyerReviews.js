import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

function LawyerReviews({ lawyerId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch reviews on component mount
  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch(`/api/lawyer/reviews?lawyerId=${lawyerId}`);
        const data = await response.json();
        
        if (response.ok) {
          setReviews(data.reviews || []);
        } else {
          toast.error('Failed to fetch reviews');
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        toast.error('An error occurred while fetching reviews');
      } finally {
        setLoading(false);
      }
    }

    if (lawyerId) {
      fetchReviews();
    }
  }, [lawyerId]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  // Render stars for rating
  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <span key={i} className={`text-xl ${i < rating ? 'text-yellow-400 dark:text-yellow-300' : 'text-gray-300 dark:text-gray-600'}`}>
          ★
        </span>
      ));
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-200">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Client Reviews</h2>
      
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No reviews yet</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review._id} className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 last:border-0">
              <div className="flex items-center mb-2">
                <div className="flex mr-2">{renderStars(review.rating)}</div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(review.createdAt)}
                </span>
              </div>
              
              {review.comment && (
                <p className="text-gray-700 dark:text-gray-300 mt-1">{review.comment}</p>
              )}
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Posted by: {review.userEmail.split('@')[0]} {/* Show only username part of email */}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LawyerReviews; 