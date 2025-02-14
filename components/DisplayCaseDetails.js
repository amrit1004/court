import { Fragment, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function DisplayCaseDetails(props) {
  const detailsRef = useRef(); // Reference to the details div

  const uid = props.caseDetail.uid;

  function deleteHandler() {
    props.delete(uid);
  }

  async function downloadPDFHandler() {
    const input = detailsRef.current;

    // Convert HTML to Canvas, then to PDF
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    pdf.save(`Case_Details_${uid}.pdf`);
  }

  return (
    <Fragment>
      <div className="min-h-screen px-10 py-32 bg-white">
        <div ref={detailsRef} className="p-10 mx-auto bg-gray-100 md:w-3/4 lg:w-1/2">
          <div className="flex items-center mb-5">
            <label className="items-center mr-6 text-2xl font-black text-right text-gray-600">
              CASE DETAILS
            </label>
          </div>

          <div className="flex items-center mb-5">
            <label className="inline-block w-32 mr-6 font-bold text-right text-gray-600">
              Case No:
            </label>
            <p className="flex-1 py-2 text-gray-600 border-b-2 border-gray-400 outline-none">
              {props.caseDetail._id}
            </p>
          </div>

          <div className="flex items-center mb-5">
            <label className="inline-block w-32 mr-6 font-bold text-right text-gray-600">
              Case Type:
            </label>
            <p className="flex-1 py-2 text-gray-600 border-b-2 border-gray-400 outline-none">
              {props.caseDetail.Case_Type}
            </p>
          </div>

          <div className="flex items-center mb-5">
            <label className="inline-block w-32 mr-6 font-bold text-right text-gray-600">
              Case Description:
            </label>
            <p className="flex-1 py-2 text-gray-600 border-b-2 border-gray-400 outline-none">
              {props.caseDetail.Case_desciption}
            </p>
          </div>

          <div className="flex items-center mb-5">
            <label className="inline-block w-32 mr-6 font-bold text-right text-gray-600">
              Lawyer Name:
            </label>
            <p className="flex-1 py-2 text-gray-600 border-b-2 border-gray-400 outline-none">
              {props.caseDetail.Lawyer_Name}
            </p>
          </div>

          <div className="flex items-center mb-5">
            <label className="inline-block w-32 mr-6 font-bold text-right text-gray-600">
              Court Type:
            </label>
            <p className="flex-1 py-2 text-gray-600 border-b-2 border-gray-400 outline-none">
              {props.caseDetail.Case_Type}
            </p>
          </div>

          <div className="flex items-center mb-5">
            <label className="inline-block w-32 mr-6 font-bold text-right text-gray-600">
              Hearing Date:
            </label>
            <p className="flex-1 py-2 text-gray-600 border-b-2 border-gray-400 outline-none">
              {props.caseDetail.Hearing_Date}
            </p>
          </div>
        </div>
      </div>

      {/* Buttons for Withdraw & Download PDF */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={deleteHandler}
          className="px-4 py-2 font-semibold text-white bg-red-500 rounded-lg hover:bg-red-700"
        >
          Withdraw Case
        </button>

        <button
          onClick={downloadPDFHandler}
          className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-700"
        >
          Download PDF
        </button>
      </div>
    </Fragment>
  );
}

export default DisplayCaseDetails;
