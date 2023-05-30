import React, { useEffect, useState } from "react";

/* Hooks */
import { useSearchParams } from "react-router-dom";

/* Wrappers */
import AffiliationWrapperFaculty from "../wrappers/AffiliationWrapperFaculty";
import ExtensionWrapper from "../wrappers/ExtensionWrapper";
import ResearchWrapper from "../wrappers/ResearchWrapper";
import CooperationWrapper from "../wrappers/CooperationWrapper";

/* Components */
import CommonTitleCard from "../CommonTitleCard";
import TopMenu from "../TopMenu";

/* UI Library Components */
import { Row } from "antd";

const Faculties = () => {
  const [searchParams] = useSearchParams();
  const [current, setCurrent] = useState(searchParams.get("section"));

  useEffect(() => {
    document.title = "Facultades - ImpactU";
  }, []);

  return (
    <>
      <Row gutter={[15, 15]}>
        <CommonTitleCard />
      </Row>
      <TopMenu current={current} setCurrent={setCurrent} affiliations={true} />
      {current === "affiliations" ? <AffiliationWrapperFaculty /> : ""}
      {current === "research" ? <ResearchWrapper /> : ""}
      {current === "extension" ? <ExtensionWrapper /> : ""}
      {current === "cooperation" ? <CooperationWrapper /> : ""}
    </>
  );
};

export default Faculties;
