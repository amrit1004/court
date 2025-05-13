import Feed from '@/components/Feed';
import FeedHeader from '@/components/FeedHeader';
import CaseSearch from '@/components/ui/CaseSearch';
import { connectToDatabase } from '@/helpers/db-utils';
import { getSession, signOut, useSession } from 'next-auth/client';

import Head from 'next/head';

function Dashboard(props) {
  const { cases } = props;
  const parsedData = JSON.parse(cases);
  // console.log(session);

  return (
    <div>
      <Head>
        <title className='text-2xl '>Dashboard: {props.session.user.email}</title>
        <meta
          name="description"
          content="Adaalat: One step Solution to managing court hearings"
        />
      </Head>
      {/* Advanced Case Search */}
      <div className="mb-8">
        <CaseSearch />
      </div>
      
      {/* Section for add clients */}
      <FeedHeader />
      
      {/* Table of clients */}
      <Feed cases={parsedData} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  // checks for the incoming request and sees whether a session token is available or not and accordingly takes action

  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false, // if we want to permanently redirect to auth page or not ?
      },
    };
  }

  const client = await connectToDatabase();
  const db = client.db();
  const response = await db.collection('cases').find().toArray();
  const stringifiedData = JSON.stringify(response);

  return {
    props: {
      session,
      cases: stringifiedData,
    },
  };
}

export default Dashboard;
