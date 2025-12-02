import '../styles/globals.css';
import { Provider } from 'next-auth/client';
import Layout from '../components/Layout/Layout';
// h
import Head from 'next/head';

import { Toaster } from 'react-hot-toast';
import NextNProgress from 'nextjs-progressbar';
import { ThemeProvider } from '../context/ThemeContext';

function MyApp({ Component, pageProps }) {
  // Pass cases to Layout if available (for dashboard and global calendar)
  const layoutProps = {};
  if (pageProps.cases) layoutProps.cases = pageProps.cases;
  return (
    <Provider session={pageProps.session}>
      <ThemeProvider>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
        <NextNProgress
          color="#700B97"
          height={3}
          options={{ showSpinner: false }}
        />
        <Toaster />
        <Layout {...layoutProps}>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
