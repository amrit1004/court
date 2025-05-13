import '../styles/globals.css';
import { Provider } from 'next-auth/client';
import Layout from '../components/Layout/Layout';
// h
import Head from 'next/head';

import { Toaster } from 'react-hot-toast';
import NextNProgress from 'nextjs-progressbar';
import { ThemeProvider } from '../context/ThemeContext';

function MyApp({ Component, pageProps }) {
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
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
