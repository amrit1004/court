import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { v4 } from 'uuid';

import toast from 'react-hot-toast';
import { useSession } from 'next-auth/client';

export default function AddCaseForm(props) {
  const router = useRouter();
  const [session] = useSession();

  const { names } = props;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    const toastId = toast.loading('Adding your case..');
    const response = await fetch('/api/case/addcase', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        uid: v4(),
        email: session.user.email,
      }),
    });

    const parse = await response.json();

    if (!response.ok) {
      toast.dismiss(toastId);
      toast.error('Something went wrong');
      throw new Error(response.message || 'Something went wrong');
    }

    console.log(parse);
    reset();
    toast.dismiss(toastId);
    router.replace('/dashboard');
    toast.success('Your case has been registered');
    // console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="transition-colors duration-200">
      {/* Select case-type */}

      <div className="mt-6">
        <label className="block uppercase tracking-wide text-gray-500 dark:text-gray-300 text-xs font-bold mb-2">
          Case Type
        </label>
        <select
          className={`form-select mt-1 block w-full border dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-white transition-colors duration-200 ${
            errors.Case_Type ? 'border-red-500 dark:border-red-400' : ''
          }`}
          {...register('Case_Type', { required: true })}
        >
          <option value="Criminal">Criminal</option>
          <option value="Civil">Civil</option>
          <option value="Family-Matters">Family-Matters</option>
          <option value="Land">Land</option>
          <option value="Co-op court dispute">Co-op court dispute</option>
          <option value="Charity Trust">Charity Trust</option>
          <option value="SEBI">SEBI</option>
        </select>
        {errors.Case_Type && (
          <p className="text-red-500 dark:text-red-400 text-xs mt-1">Case type is required</p>
        )}
      </div>
      {/* Enter description */}
      <div className="mt-6">
        <label className="block uppercase tracking-wide text-gray-500 dark:text-gray-300 text-xs font-bold mb-2">
          Case description
        </label>
        <textarea
          className={`border-0 px-3 py-3 mt-4 placeholder-blueGray-300 text-blueGray-600 dark:text-white bg-white dark:bg-gray-700 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 ${
            errors.Case_desciption ? 'border-2 border-red-500 dark:border-red-400' : ''
          }`}
          placeholder="Describe the case details"
          {...register('Case_desciption', { required: true, maxLength: 500 })}
        />
        {errors.Case_desciption && (
          <p className="text-red-500 dark:text-red-400 text-xs mt-1">Case description is required (max 500 characters)</p>
        )}
      </div>

      {/* Select Lawyer */}
      <div className="mt-6">
        <label className="block uppercase tracking-wide text-gray-500 dark:text-gray-300 text-xs font-bold mb-2">
          Select Lawyer
        </label>
        <div className={`mt-2 flex flex-col space-y-2 ${errors.Lawyer_Name ? 'pb-1 border-b-2 border-red-500 dark:border-red-400' : ''}`}>
          {names.map((item, index) => (
            <label key={index} className="inline-flex items-center">
              <input
                className="form-radio text-blue-600 dark:text-blue-500 transition-colors duration-200"
                {...register('Lawyer_Name', { required: true })}
                type="radio"
                value={item.name}
              />
              <span className="ml-2 text-gray-700 dark:text-gray-200">{item.name}</span>
            </label>
          ))}
        </div>
        {errors.Lawyer_Name && (
          <p className="text-red-500 dark:text-red-400 text-xs mt-1">Please select a lawyer</p>
        )}
      </div>

      <div className="w-full my-6 md:w-3/3 px-3 mb-6 md:mb-0">
        <label className="block uppercase tracking-wide text-gray-500 dark:text-gray-300 text-xs font-bold mb-2">
          Address
        </label>

        <input
          type="text"
          className={`border-0 px-3 py-3 mt-4 placeholder-blueGray-300 text-blueGray-600 dark:text-white bg-white dark:bg-gray-700 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 ${
            errors.Address ? 'border-2 border-red-500 dark:border-red-400' : ''
          }`}
          placeholder="Address"
          {...register('Address', { required: true })}
        />
        {errors.Address && (
          <p className="text-red-500 dark:text-red-400 text-xs mt-1">Address is required</p>
        )}
      </div>
      <div className="flex flex-wrap -mx-3 my-6 mb-2">
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-500 dark:text-gray-300 text-xs font-bold mb-2">
            City
          </label>

          <input
            className={`border-0 px-3 py-3 mt-4 placeholder-blueGray-300 text-blueGray-600 dark:text-white bg-white dark:bg-gray-700 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 ${
              errors.City ? 'border-2 border-red-500 dark:border-red-400' : ''
            }`}
            type="text"
            placeholder="City"
            {...register('City', { required: true })}
          />
          {errors.City && (
            <p className="text-red-500 dark:text-red-400 text-xs mt-1">City is required</p>
          )}
        </div>
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-500 dark:text-gray-300 text-xs font-bold mb-2">
            Country
          </label>

          <input
            className={`border-0 px-3 py-3 mt-4 placeholder-blueGray-300 text-blueGray-600 dark:text-white bg-white dark:bg-gray-700 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 ${
              errors.Country ? 'border-2 border-red-500 dark:border-red-400' : ''
            }`}
            type="text"
            placeholder="Country"
            {...register('Country', { required: true })}
          />
          {errors.Country && (
            <p className="text-red-500 dark:text-red-400 text-xs mt-1">Country is required</p>
          )}
        </div>
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-500 dark:text-gray-300 text-xs font-bold mb-2">
            Postal Code
          </label>

          <input
            className={`border-0 px-3 py-3 mt-4 placeholder-blueGray-300 text-blueGray-600 dark:text-white bg-white dark:bg-gray-700 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 ${
              errors.Postal_Code ? 'border-2 border-red-500 dark:border-red-400' : ''
            }`}
            type="number"
            placeholder="Postal Code"
            {...register('Postal_Code', { required: true })}
          />
          {errors.Postal_Code && (
            <p className="text-red-500 dark:text-red-400 text-xs mt-1">Postal code is required</p>
          )}
        </div>
      </div>

      <div className="flex space-y-4 flex-col md:flex-row justify-evenly md:space-y-0 md:space-x-4">
        <div className="w-full md:w-1/2">
          <label className="block uppercase tracking-wide text-gray-500 dark:text-gray-300 text-xs font-bold mb-2">
            Hearing Date
          </label>
          <input
            className={`border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 dark:text-white bg-white dark:bg-gray-700 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 ${
              errors.Hearing_Date ? 'border-2 border-red-500 dark:border-red-400' : ''
            }`}
            type="date"
            placeholder="Hearing Date"
            {...register('Hearing_Date', { required: true })}
          />
          {errors.Hearing_Date && (
            <p className="text-red-500 dark:text-red-400 text-xs mt-1">Hearing date is required</p>
          )}
        </div>

        <div className="w-full md:w-1/2">
          <label className="block uppercase tracking-wide text-gray-500 dark:text-gray-300 text-xs font-bold mb-2">
            Court Type
          </label>
          <input
            className={`border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 dark:text-white bg-white dark:bg-gray-700 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 ${
              errors.Court_Type ? 'border-2 border-red-500 dark:border-red-400' : ''
            }`}
            type="text"
            placeholder="Court Type"
            {...register('Court_Type', { required: true })}
          />
          {errors.Court_Type && (
            <p className="text-red-500 dark:text-red-400 text-xs mt-1">Court type is required</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="block w-full mt-8 py-3 px-6 text-white font-medium bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-lg transition-colors duration-200"
      >
        Register Case
      </button>
    </form>
  );
}
