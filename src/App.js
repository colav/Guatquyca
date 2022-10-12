import { useState } from 'react';
import './App.css';

/* Layouts */
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import FilterDrawer from './layouts/FilterDrawer';

/* Modules */
import About from './components/modules/About';
import Home from './components/modules/Home';
import Institutions from './components/modules/Institutions';
import Metrics from './components/modules/Metrics';
import Participants from './components/modules/Participants';
import SearchResult from './components/modules/SearchResult';

/* UI Library Components */
import { Layout, BackTop } from 'antd';

/* Utils */
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './utils/ScrollToTop';

function App() {
  const [home, setHome] = useState(false);
  const core = { /* URL, setURL, filters, setFilters, */ home, setHome };

  return (
    <>
      <BackTop />
      <ScrollToTop />
      <FilterDrawer core={core} />
      <Layout>
        <Header core={core} />
        <Layout.Content id="layout--content">
          <Routes>
            <Route path="/app" element={<Home core={core} />} />
            <Route path="/app/metrics" element={<Metrics core={core} />} />
            <Route path="/app/participants" element={<Participants />} />
            <Route path="/app/about" element={<About />} />
            <Route path="/app/search" element={<SearchResult core={core} />} />
            <Route
              path="/app/institutions"
              element={<Institutions core={core} />}
            />
          </Routes>
        </Layout.Content>
      </Layout>
      <Footer />
    </>
  );
}

export default App;
