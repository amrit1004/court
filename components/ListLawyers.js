import LawyerCard from "@/components/ui/LawyerCard";

function ListLawyers({ lawyers }) {
  return (
    <section>
      <div className="max-w-6xl px-4 mx-auto">
        <h4 className="w-full mt-8 mb-4 text-3xl font-bold">List of Lawyers</h4>
        <table className="block min-w-full border-collapse md:table">
          <thead className="block md:table-header-group">
            <tr className="absolute block border border-grey-500 md:border-none md:table-row -top-full md:top-auto -left-full md:left-auto md:relative ">
              <th className="block p-2 font-bold text-left text-white bg-gray-600 md:border md:border-grey-500 md:table-cell">
                Lawyer Name
              </th>
              <th className="block p-2 font-bold text-left text-white bg-gray-600 md:border md:border-grey-500 md:table-cell">
                Preferred Case Types
              </th>
              <th className="block p-2 font-bold text-left text-white bg-gray-600 md:border md:border-grey-500 md:table-cell">
                Fees (Rs)
              </th>
              <th className="block p-2 font-bold text-left text-white bg-gray-600 md:border md:border-grey-500 md:table-cell">
                Years of Experience
              </th>
              <th className="block p-2 font-bold text-left text-white bg-gray-600 md:border md:border-grey-500 md:table-cell">
                View
              </th>
            </tr>
          </thead>
          <tbody className="block md:table-row-group">
            {lawyers.map((lawyer) => (
              <LawyerCard
                key={lawyer.bar_council_id}
                bcid={lawyer.bar_council_id}
                name={lawyer.name}
                prefCase={lawyer.pref_case_types}
                fees={lawyer.fees}
                yrs={lawyer.exp_yrs}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ListLawyers;
