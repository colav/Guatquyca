import React, { useState } from "react";
import Authors from "./components/authors/Authors";
import SearchResultList from "./components/SearchResultList";
import Departments from "./components/departments/Departments";
import Faculties from "./components/faculties/Faculties";
import Footer from "./layouts/Footer";
import Groups from "./components/groups/Groups";
import Header from "./layouts/Header";
import history from "./history";
import Institutions from "./components/institutions/Institutions";
import Sidebar from "./layouts/Sidebar";
import ScrollToTop from "./helpers/ScrollToTop";
import { Router, Route } from "react-router-dom";
import { URLBuilder } from "./helpers/URLBuilder";
import "./App.less";
const Layout = require("antd/lib/layout").default;

const App = () => {
  const [currentURL, setCurrentURL] = useState(URLBuilder());

  return (
    <Router history={history}>
      <ScrollToTop />
      <Route path="/app">
        <Layout>
          <Header setCurrentURL={setCurrentURL} />
          <Sidebar />
          <Layout.Content
            style={{
              margin: "85px 10px 15px 60px",
              overflow: "initial",
              transition: "opacity 0.5s",
            }}
          >
            <Route exact path="/app/search">
              <SearchResultList
                currentURL={currentURL}
                setCurrentURL={setCurrentURL}
              />
            </Route>
            <Route exact path="/app/faculties">
              <Faculties
                currentURL={currentURL}
                setCurrentURL={setCurrentURL}
              />
            </Route>
            <Route exact path="/app/departments">
              <Departments
                currentURL={currentURL}
                setCurrentURL={setCurrentURL}
              />
            </Route>
            <Route exact path="/app/groups">
              <Groups currentURL={currentURL} setCurrentURL={setCurrentURL} />
            </Route>
            <Route exact path="/app/authors">
              <Authors currentURL={currentURL} setCurrentURL={setCurrentURL} />
            </Route>
            <Route exact path="/app/institutions">
              <Institutions
                currentURL={currentURL}
                setCurrentURL={setCurrentURL}
              />
            </Route>
            <Footer />
          </Layout.Content>
        </Layout>
      </Route>
    </Router>
  );
};

export default App;
