import { signOut, useSession } from 'next-auth/client';
import { Fragment } from 'react';
import Link from 'next/link';
import DarkModeToggle from '../ui/DarkModeToggle';

function Layout(props) {
  const [session] = useSession();
  return (
    <Fragment>
      <nav className="bg-gray-100 dark:bg-gray-800 transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between">
            <div className="flex space-x-4">
              {/* logo  */}
              <div>
                <a className="flex items-center py-5 px-2 text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-300">
                  <svg
                    className="h-6 w-6 text-blue-700 dark:text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                  <Link href="/" passHref>
                    <span className="cursor-pointer font-bold dark:text-white">Adaalat</span>
                  </Link>
                </a>
              </div>

              {/* primary nav  */}
              {session && (
                <div className="hidden md:flex items-center space-x-1">
                  <Link href="/dashboard">
                    <a className="py-5 px-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                      Dashboard
                    </a>
                  </Link>
                  <Link href="/dashboard/AddCases">
                    <a className="py-5 px-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                      Add cases
                    </a>
                  </Link>
                </div>
              )}
            </div>

            {/* dark mode toggle and buttons */}
            <div className="flex items-center space-x-3">
              <DarkModeToggle />

              {session && (
                <div
                  onClick={signOut}
                  className="hidden cursor-pointer md:flex items-center"
                >
                  <a className="py-2 px-3 bg-blue-700 hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500 text-white hover:text-black dark:hover:text-white rounded transition duration-300">
                    SignOut
                  </a>
                </div>
              )}
              {!session && (
                <div className="hidden md:flex items-center">
                  <Link href="/auth">
                    <a className="py-2 px-3 bg-blue-700 hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500 text-white hover:text-black dark:hover:text-white rounded transition duration-300">
                      SignUp
                    </a>
                  </Link>
                </div>
              )}

              {/* mobile button goes here  */}
              <div className="md:hidden flex items-center">
                <button className="mobile-menu-button text-gray-700 dark:text-white">
                  <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* mobile menu  */}
        {session && (
          <div className="mobile-menu hidden md:hidden">
            <Link href="/dashboard">
              <a className="block py-2 px-4 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                Dashboard
              </a>
            </Link>
            <Link href="/AddCases">
              <a className="block py-2 px-4 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                Add cases
              </a>
            </Link>

            {!session && (
              <Link href="/auth">
                <a className="block py-2 px-4 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                  Signup
                </a>
              </Link>
            )}
          </div>
        )}
      </nav>
      <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        {props.children}
      </main>
    </Fragment>
  );
}

export default Layout;
