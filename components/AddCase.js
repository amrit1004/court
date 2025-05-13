import AddCaseForm from './ui/AddCaseForm';

function AddCase(props) {
  return (
    <section className="py-1 transition-colors duration-200 bg-blueGray-50 dark:bg-gray-900">
      <div className="w-full px-4 mx-auto mt-6 lg:w-8/12">
        <div className="relative flex flex-col w-full min-w-0 mb-6 break-words border-0 rounded-lg shadow-lg bg-blueGray-100 dark:bg-gray-800 transition-colors duration-200">
          <div className="px-6 py-6 mb-0 bg-white dark:bg-gray-700 rounded-t transition-colors duration-200">
            <div className="flex justify-between text-center">
              <h6 className="text-xl font-bold text-blueGray-700 dark:text-white transition-colors duration-200">ADD CASE</h6>
            </div>
          </div>
          <div className="flex-auto px-4 py-10 pt-0 lg:px-10">
            <AddCaseForm names={props.names} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AddCase;
