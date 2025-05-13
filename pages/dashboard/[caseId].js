import DisplayCaseDetails from '@/components/DisplayCaseDetails';
import CaseStatusUpdate from '@/components/ui/CaseStatusUpdate';
import CaseDocuments from '@/components/ui/CaseDocuments';
import LawyerRatingForm from '@/components/ui/LawyerRatingForm';
import LawyerReviews from '@/components/ui/LawyerReviews';
import { connectToDatabase } from '@/helpers/db-utils';

import { useRouter } from 'next/router';
import Head from 'next/head';
import { useState } from 'react';
import { getSession } from 'next-auth/client';
import toast from 'react-hot-toast';

function CaseDetailsPage(props) {
  const parsedData = JSON.parse(props.caseDetail);
  const parsedFees = JSON.parse(props.fees);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('details');

  // delete case
  async function deleteHandler(uid) {
    const response = await fetch('/api/case/deletecase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uid),
    });

    const data = await response.json();
    console.log(data);
    router.replace('/dashboard');

    return data;
  }

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Extract lawyer ID from case data
  const getLawyerId = () => {
    // This is a placeholder - you'd need to adjust based on how lawyer IDs are stored
    // For demonstration, we'll use the lawyer name as the ID
    return parsedData.Lawyer_Name;
  };

  return (
    <>
      <Head>
        <title>Case No : {parsedData.uid}</title>
        <meta
          name="description"
          content="Adaalat: One step Solution to managing court hearings"
        />
      </Head>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'details'
              ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
          }`}
          onClick={() => handleTabChange('details')}
        >
          Case Details
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'status'
              ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
          }`}
          onClick={() => handleTabChange('status')}
        >
          Status Updates
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'documents'
              ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
          }`}
          onClick={() => handleTabChange('documents')}
        >
          Documents
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'lawyer'
              ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
          }`}
          onClick={() => handleTabChange('lawyer')}
        >
          Lawyer Review
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 'details' && (
          <DisplayCaseDetails
            caseDetail={parsedData}
            delete={deleteHandler}
            fees={parsedFees.fees}
          />
        )}
        
        {activeTab === 'status' && (
          <CaseStatusUpdate caseId={parsedData.uid} />
        )}
        
        {activeTab === 'documents' && (
          <CaseDocuments caseId={parsedData.uid} />
        )}
        
        {activeTab === 'lawyer' && (
          <div className="space-y-6">
            <LawyerRatingForm 
              lawyerId={getLawyerId()}
              lawyerName={parsedData.Lawyer_Name}
              caseId={parsedData.uid}
            />
            <LawyerReviews lawyerId={getLawyerId()} />
          </div>
        )}
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { caseId } = context.params;
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    };
  }

  const client = await connectToDatabase();
  const db = client.db();

  const caseDetail = await db.collection('cases').findOne({ uid: caseId });

  if (!caseDetail) {
    return {
      notFound: true,
    };
  }

  // Set a default status if not already set
  if (!caseDetail.currentStatus) {
    await db.collection('cases').updateOne(
      { uid: caseId },
      { $set: { currentStatus: 'Filed' } }
    );
    caseDetail.currentStatus = 'Filed';
  }

  const fees = await db.collection('fees').findOne({
    LawyerName: caseDetail.Lawyer_Name,
  });

  client.close();

  const jsonCase = JSON.stringify(caseDetail);
  const jsonFees = JSON.stringify(fees || { fees: '5000 (default)' });

  return {
    props: {
      session,
      caseDetail: jsonCase,
      fees: jsonFees,
    },
  };
}

export default CaseDetailsPage;
