import { useRef, useState } from 'react';
import { useRouter } from 'next/router'; // Import useRouter
import toast from 'react-hot-toast';

async function createUser(email, password, firstName, lastName) {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, firstName, lastName }),
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

function SignUpPage() {
  const [isInvalid, setIsInvalid] = useState(false);
  const router = useRouter(); // Initialize router

  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const fnameInputRef = useRef(null);
  const lnameInputRef = useRef(null);

  async function submitHandler(e) {
    e.preventDefault();
    const toastId = toast.loading('Processing...');

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    const enteredFirstName = fnameInputRef.current.value;
    const enteredLastName = lnameInputRef.current.value;

    if (
      !enteredEmail ||
      !enteredEmail.includes('@') ||
      !enteredFirstName ||
      !enteredLastName
    ) {
      setIsInvalid(true);
      toast.dismiss(toastId);
      toast.error('Please enter valid information!');
      return;
    }

    try {
      const response = await createUser(
        enteredEmail,
        enteredPassword,
        enteredFirstName,
        enteredLastName
      );
      console.log(response);

      toast.dismiss(toastId);
      toast.success("You're in 🤘🏼");

      // Navigate to the home page after successful signup
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(error.message || 'Signup failed');
      console.error(error);
    }

    // Reset input fields
    emailInputRef.current.value = '';
    fnameInputRef.current.value = '';
    lnameInputRef.current.value = '';
    passwordInputRef.current.value = '';
  }

  return (
    <section className="w-full bg-white dark:bg-gray-900 transition-colors duration-200">
      <form onSubmit={submitHandler}>
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center">
            <div className="w-full bg-white dark:bg-gray-900 lg:w-6/12 xl:w-5/12">
              <div className="flex flex-col items-start justify-start w-full h-full p-10 lg:p-16 xl:p-24">
                <h4 className="w-full text-3xl font-bold text-gray-900 dark:text-white">Signup</h4>
                <div className="relative w-full mt-10 space-y-8">
                  <div className="relative">
                    <label className="font-medium text-gray-900 dark:text-gray-200">First Name</label>
                    <input
                      ref={fnameInputRef}
                      type="text"
                      className="block w-full px-4 py-4 mt-2 text-xl placeholder-gray-400 bg-gray-200 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-opacity-50"
                      placeholder="Enter Your First Name"
                    />
                  </div>
                  <div className="relative">
                    <label className="font-medium text-gray-900 dark:text-gray-200">Last Name</label>
                    <input
                      ref={lnameInputRef}
                      type="text"
                      className="block w-full px-4 py-4 mt-2 text-xl placeholder-gray-400 bg-gray-200 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-opacity-50"
                      placeholder="Enter Your Last Name"
                    />
                  </div>
                  <div className="relative">
                    <label className="font-medium text-gray-900 dark:text-gray-200">Email</label>
                    <input
                      ref={emailInputRef}
                      type="text"
                      className="block w-full px-4 py-4 mt-2 text-xl placeholder-gray-400 bg-gray-200 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-opacity-50"
                      placeholder="Enter Your Email Address"
                    />
                  </div>
                  <div className="relative">
                    <label className="font-medium text-gray-900 dark:text-gray-200">Password</label>
                    <input
                      ref={passwordInputRef}
                      type="password"
                      className="block w-full px-4 py-4 mt-2 text-xl placeholder-gray-400 bg-gray-200 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-opacity-50"
                      placeholder="Password"
                    />
                  </div>
                  <div className="relative">
                    <button
                      type="submit"
                      className="inline-block w-full px-5 py-4 text-lg font-medium text-center text-white transition duration-200 bg-blue-600 dark:bg-blue-700 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 ease"
                    >
                      Create Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {isInvalid && <p className="text-center text-red-500">Please enter valid information!</p>}
    </section>
  );
}

export default SignUpPage;
