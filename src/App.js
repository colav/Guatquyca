import { useState } from "react";
import "./App.css";

/* Layouts */
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import FilterDrawer from "./layouts/FilterDrawer";

/* Modules */
import About from "./components/modules/About";
import Home from "./components/modules/Home";
import Metrics from "./components/modules/Metrics";
import Participants from "./components/modules/Participants";
import SearchResult from "./components/modules/SearchResult";

/* UI Library Components */
import DisclaimerModal from "./components/DisclaimerModal";
import { App, Layout, FloatButton, ConfigProvider } from "antd";

/* Utils */
import { Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./utils/ScrollToTop";
import Affiliation from "./components/modules/AffiliationRouter";
import Person from "./components/modules/Person";

/* UI Library Sub-components */
const { BackTop } = FloatButton;

function MyApp() {
  const [home, setHome] = useState(false);
  const core = { /* URL, setURL, filters, setFilters, */ home, setHome };

  return (
    <App>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#F9B250",
            borderRadius: 6,
          },
        }}
      >
        <DisclaimerModal />
        <BackTop />
        <ScrollToTop />
        <FilterDrawer core={core} />
        <Layout>
          <Header core={core} />
          <Layout.Content id="layout--content">
            <Routes>
              <Route path="/" element={<Navigate replace to="/app" />} />
              <Route path="/app" element={<Home core={core} />} />
              <Route path="/app/metrics" element={<Metrics core={core} />} />
              <Route path="/app/participants" element={<Participants />} />
              <Route path="/app/person" element={<Person />} />
              <Route path="/app/about" element={<About />} />
              <Route
                path="/app/search"
                element={<SearchResult core={core} />}
              />
              <Route
                path="/app/affiliation"
                element={<Affiliation core={core} />}
              />
            </Routes>
          </Layout.Content>
        </Layout>
        <Footer />
      </ConfigProvider>
    </App>
  );
}

export default MyApp;
