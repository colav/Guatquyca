import { useState } from 'react';
import './App.css';

/* Layouts */
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import FilterDrawer from './layouts/FilterDrawer';

/* Modules */
import About from './components/modules/About';
import Home from './components/modules/Home';
import Metrics from './components/modules/Metrics';
import Principles from './components/modules/Principles';
import SearchResult from './components/modules/SearchResult';
import OpenSource from './components/modules/OpenSource';
import Person from './components/modules/Person';
import Test from './components/modules/Test';

/* UI Library Components */
import DisclaimerModal from './components/DisclaimerModal';
import { App, Layout, FloatButton, ConfigProvider } from 'antd';

/* Utils */
import { Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './utils/ScrollToTop';
import Affiliation from './components/modules/AffiliationRouter';
import ReactGA from 'react-ga4';

/* UI Library Sub-components */
const { BackTop } = FloatButton;

function MyApp() {
  const [home, setHome] = useState(false);

  ReactGA.initialize('G-W7EXCCG79F');
  ReactGA.pageview(document.location.pathname);

  return (
    <App>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#F9B250',
            borderRadius: 6,
          },
        }}
      >
        <DisclaimerModal />
        <BackTop />
        <ScrollToTop />
        <FilterDrawer />
        <Layout>
          <Header home={home} />
          <Layout.Content id="layout--content">
            <Routes>
              <Route path="/" element={<Navigate replace to="/app" />} />
              <Route
                path="/app"
                element={<Home home={home} setHome={setHome} />}
              />
              <Route path="/app/open-source" element={<OpenSource />} />
              <Route path="/app/metrics" element={<Metrics />} />
              <Route path="/app/principles" element={<Principles />} />
              <Route path="/app/person" element={<Person />} />
              <Route path="/app/about" element={<About />} />
              <Route path="/app/search" element={<SearchResult />} />
              <Route path="/app/affiliation" element={<Affiliation />} />
              <Route path="/app/test" element={<Test />} />
            </Routes>
          </Layout.Content>
        </Layout>
        <Footer />
      </ConfigProvider>
    </App>
  );
}

export default MyApp;
