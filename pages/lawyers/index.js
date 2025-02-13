import ListLawyers from "@/components/ListLawyers";
import { connectToDatabase, getAllLawyerProfiles } from "@/helpers/db-utils";
import Head from "next/head";

function LawyersPage({ profiles }) {
  const lawyers = JSON.parse(profiles);

  return (
    <>
      <Head>
        <title>Lawyers List</title>
        <meta
          name="description"
          content="Adaalat: One step Solution to managing court hearings"
        />
      </Head>
      <ListLawyers lawyers={lawyers} />
    </>
  );
}

export async function getStaticProps() {
  const client = await connectToDatabase();
  const allLawyerProfiles = await getAllLawyerProfiles(client);

  return {
    props: {
      profiles: JSON.stringify(allLawyerProfiles),
    },
  };
}

export default LawyersPage;
