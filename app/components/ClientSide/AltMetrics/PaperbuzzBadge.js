/* Hooks */
import usePaperbuzzScore from "@/lib/Hooks/usePaperbuzzScore";

/* Next.js */
import Link from "next/link";

/* Styles */
import styles from "./styles.module.css";

/* SVG Component */
import PaperbuzzIMG from "./PaperbuzzIMG";

/* UI Library Components */
import { ConfigProvider, Tooltip, Image, Divider, Row, Col } from "antd";

/* Utils */
import formatPaperbuzzSourcesTexts from "@/lib/Utils/formatPaperbuzzSourcesTexts";
import PaperbuzzInfoButton from "./PaperbuzzInfoButton";

/**
 * Renders a badge with a tooltip showing the Paperbuzz score and details for a given DOI.
 *
 * @param {string} doi - The DOI for which to display the Paperbuzz score and details.
 * @returns {JSX.Element} The rendered component.
 */
export default function PaperbuzzBadge({ doi }) {
  const { score, tooltipInfo } = usePaperbuzzScore(doi);

  /**
   * Renders tooltip information based on the provided data.
   *
   * @returns {JSX.Element[]} An array of JSX elements representing the tooltip information.
   */
  const renderedTooltipInfo = () => {
    return tooltipInfo.map(
      ({ sourceId, iconUrl, displayName, eventsCount }) => {
        if (sourceId === "no-info") {
          return <div key={sourceId}>{displayName}</div>;
        } else {
          return (
            <div key={sourceId} className={styles.tooltipContainer}>
              <Image
                src={
                  sourceId === "facultyopinions"
                    ? "/media/H1Connect.jpg"
                    : iconUrl
                }
                alt={`Logo of ${displayName}`}
                width={16}
                height={16}
                preview={false}
              />{" "}
              {formatPaperbuzzSourcesTexts(sourceId, displayName, eventsCount)}
            </div>
          );
        }
      }
    );
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorTextLightSolid: "black",
          fontSize: "13px",
        },
      }}
    >
      <Tooltip
        placement="top"
        id={styles.tooltip}
        title={
          <>
            <Row justify={"space-between"}>
              <Col>
                <h4 style={{ margin: "5px 0 0 0" }}>Paperbuzz</h4>
              </Col>
              <Col>
                <PaperbuzzInfoButton />
              </Col>
            </Row>
            <Divider style={{ margin: "5px" }} />
            {renderedTooltipInfo()}
            <div id={styles.paperbuzz_link}>
              <Link
                href={`https://paperbuzz.org/details/${doi}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver más detalles
              </Link>
            </div>
          </>
        }
        color="white"
      >
        <div>
          <PaperbuzzIMG score={score} />
        </div>
      </Tooltip>
    </ConfigProvider>
  );
}
