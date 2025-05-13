import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

function LawyerRatingForm({ lawyerId, lawyerName, caseId, onRatingSubmitted }) {
  const [submitting, setSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Handle form submission
  const onSubmit = async (data) => {
    setSubmitting(true);
    const toastId = toast.loading('Submitting review...');

    try {
      const response = await fetch('/api/lawyer/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lawyerId,
          rating: data.rating,
          comment: data.comment,
          caseId,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success('Review submitted successfully');
        reset();
        setSelectedRating(0);
        if (onRatingSubmitted) {
          onRatingSubmitted(data.rating);
        }
      } else {
        toast.error(responseData.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('An error occurred while submitting your review');
    } finally {
      setSubmitting(false);
      toast.dismiss(toastId);
    }
  };

  const handleStarClick = (rating) => {
    setSelectedRating(rating);
    setValue('rating', rating);
  };
  
  const handleStarHover = (rating) => {
    setHoveredRating(rating);
  };

  const resetHover = () => {
    setHoveredRating(0);
  };

  const getStarColor = (index) => {
    const displayRating = hoveredRating || selectedRating;
    return index < displayRating 
      ? 'text-yellow-400 dark:text-yellow-300' 
      : 'text-gray-300 dark:text-gray-600';
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6 transition-colors duration-200">
      <h2 className="text-xl font-bold mb-2 dark:text-white">Rate Your Lawyer</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">Share your experience with {lawyerName}</p>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block uppercase tracking-wide text-gray-500 dark:text-gray-400 text-xs font-bold mb-2">
            Rating
          </label>
          <div className="flex space-x-4">
            {[1, 2, 3, 4, 5].map((rating) => (
              <label
                key={rating}
                className="flex flex-col items-center"
                onMouseEnter={() => handleStarHover(rating)}
                onMouseLeave={resetHover}
              >
                <input
                  type="radio"
                  value={rating}
                  className="sr-only"
                  {...register('rating', { required: true })}
                />
                <span
                  className={`text-3xl cursor-pointer transition-colors duration-200 ${getStarColor(rating - 1)}`}
                  onClick={() => handleStarClick(rating)}
                >
                  ★
                </span>
                <span className="text-sm dark:text-gray-300">{rating}</span>
              </label>
            ))}
          </div>
          {errors.rating && (
            <p className="text-red-500 text-xs mt-1">Please select a rating</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block uppercase tracking-wide text-gray-500 dark:text-gray-400 text-xs font-bold mb-2">
            Your Review
          </label>
          <textarea
            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 dark:text-white bg-white dark:bg-gray-700 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            placeholder="Share your experience working with this lawyer..."
            rows="4"
            {...register('comment')}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}

export default LawyerRatingForm; 