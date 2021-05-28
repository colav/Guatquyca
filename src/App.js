import React, { useState } from "react";

/* Components */
import Authors from "./components/authors/Authors";
import Departments from "./components/departments/Departments";
import Faculties from "./components/faculties/Faculties";
import Footer from "./layouts/Footer";
import Groups from "./components/groups/Groups";
import Header from "./layouts/Header";
import Home from "./layouts/Home";
import Institutions from "./components/institutions/Institutions";
import SearchResultList from "./components/SearchResultList";
import Sidebar from "./layouts/Sidebar";
import ScrollToTop from "./helpers/ScrollToTop";
import { Router, Route } from "react-router-dom";
import { URLBuilder } from "./helpers/URLBuilder";

/* Utilities */
import history from "./history";

/* Styles */
import "./App.less";

/* UI Library Components */
const BackTop = require("antd/lib/back-top").default;
const Layout = require("antd/lib/layout").default;

const App = () => {
  const [currentURL, setCurrentURL] = useState(URLBuilder());
  const [filters, setFilters] = useState([]);
  const [home, setHome] = useState(false);
  const core = { currentURL, setCurrentURL, filters, setFilters };

  return (
    <Router history={history}>
      <ScrollToTop />
      <BackTop />
      <Layout>
        <Header core={core} home={home} setHome={setHome} />
        <Sidebar core={core} />
        <Layout.Content style={{ minHeight: "65vh", position: "relative" }}>
          <Route exact path="/app">
            <Home core={core} setHome={setHome} />
          </Route>
          <Route exact path="/app/search">
            <SearchResultList core={core} />
          </Route>
          <Route exact path="/app/faculties">
            <Faculties core={core} />
          </Route>
          <Route exact path="/app/departments">
            <Departments core={core} />
          </Route>
          <Route exact path="/app/groups">
            <Groups core={core} />
          </Route>
          <Route exact path="/app/authors">
            <Authors core={core} />
          </Route>
          <Route exact path="/app/institutions">
            <Institutions core={core} />
          </Route>
        </Layout.Content>
      </Layout>
      <Footer />
    </Router>
  );
};

export default App;
