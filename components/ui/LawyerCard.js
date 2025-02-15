import Link from "next/link";

function LawyerCard({ bcid, name, prefCase, fees, yrs }) {
  return (
    <tr className="block bg-gray-300 border border-grey-500 md:border-none md:table-row">
      <td className="block p-2 text-left md:border md:border-grey-500 md:table-cell">
        <span className="inline-block w-1/3 font-bold md:hidden">Lawyer Name</span>
        {name}
      </td>
      <td className="block p-2 text-left md:border md:border-grey-500 md:table-cell">
        <span className="inline-block w-1/3 font-bold md:hidden">Preferred Case Types</span>
        {prefCase.join(", ")}
      </td>
      <td className="block p-2 text-left md:border md:border-grey-500 md:table-cell">
        <span className="inline-block w-1/3 font-bold md:hidden">Fees (Rs)</span>
        {fees}
      </td>
      <td className="block p-2 text-left md:border md:border-grey-500 md:table-cell">
        <span className="inline-block w-1/3 font-bold md:hidden">Years of Experience</span>
        {yrs}
      </td>
      <td className="block p-2 text-left md:border md:border-grey-500 md:table-cell">
        <Link
          href={`/lawyers/${bcid}`}
          className="px-3 py-2 text-white transition duration-300 bg-blue-700 rounded hover:bg-blue-500 hover:text-black"
        >
          View
        </Link>
      </td>
    </tr>
  );
}

export default LawyerCard;
