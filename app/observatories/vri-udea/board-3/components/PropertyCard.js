"use client";

/* Hooks */
import { memo, useMemo } from "react";

/* Components */
import ChartCard from "@/app/observatories/components/ChartCard";
import KpiCard from "@/app/observatories/components/KpiCard";
import Note from "@/app/observatories/components/Note";
import { HBarsChart, LinesChart } from "./Charts";

/* lib */
import { PI_TOP } from "@/lib/observatories/foundations";
import { FOUNDATIONS_COLORS } from "@/lib/observatories/palette";

/* Texts */
import { PI_FILTER_NOTE, PI_PATENTS_NOTE, PI_SERIES_LABEL, PI_TITLE, PI_VIEWS, piNotRespondingNote, piYearNote } from "./boardTexts";

/* UI Library Components */
import { Col, Row, Segmented, Typography } from "antd";

/* Constants */
const fmt = (n) => Number(n).toLocaleString("es-CO");
const { series: SERIES, bars: BAR_COLORS } = FOUNDATIONS_COLORS;
const SERIES_COLORS = { [PI_SERIES_LABEL]: SERIES[0] };
const subtitle = (text) => <Typography.Text strong style={{ display: "block", fontSize: 12, marginBottom: 4 }}>{text}</Typography.Text>;
const toRows = (list, total) => list.map((x) => ({ label: x.label, value: x.value, text: `${fmt(x.value)}${total ? ` · ${((100 * x.value) / total).toFixed(0)} %` : ""}`, detail: total ? `${fmt(x.value)} de ${fmt(total)} activos` : "" }));

/**
 * Card «11b · Propiedad intelectual y patentes» (F58): three figures, bars by type and state, country of protection,
 * series by year of concession and the 10 units or groups with most assets. No titles, people or holders.
 *
 * @param {Object} pi - From computePropertyAssets().
 * @param {"unit"|"group"} view - Ranking shown (by default, units).
 * @param {Function} onView - Changes the ranking.
 */
function PropertyCard({ pi, view, onView }) {
  const types = useMemo(() => toRows(pi.byType, pi.total), [pi.byType, pi.total]);
  const states = useMemo(() => toRows(pi.byState, pi.total), [pi.byState, pi.total]);
  const countries = useMemo(
    () => toRows([{ label: "Colombia", value: pi.countries.colombia }, ...pi.countries.top].filter((x) => x.value > 0), pi.total),
    [pi.countries, pi.total],
  );
  const ranking = useMemo(() => toRows(view === "group" ? pi.byGroup : pi.byUnit, 0), [pi.byGroup, pi.byUnit, view]);
  const series = useMemo(() => [{ label: PI_SERIES_LABEL, values: pi.values }], [pi.values]);
  const empty = (rows) => (rows.length ? null : <Typography.Text type="secondary">Sin activos para este filtro.</Typography.Text>);
  return (
    <Row gutter={[12, 12]} style={{ marginTop: 12 }} data-testid="pi-card">
      <Col xs={24}>
        <ChartCard title={PI_TITLE}>
          <Row gutter={[8, 8]}>
            <Col xs={24} md={8}><KpiCard label="activos de propiedad intelectual en la selección" value={fmt(pi.total)} detail="derechos de autor, marcas, diseños, secretos y patentes" valueFontSize={20} withDetail /></Col>
            <Col xs={24} md={8}><KpiCard label="de ellos, con grupo de investigación" value={fmt(pi.withGroup)} detail={pi.total ? `${((100 * pi.withGroup) / pi.total).toFixed(0)} % de la selección` : ""} valueFontSize={20} withDetail /></Col>
            <Col xs={24} md={8}><KpiCard label="patentes registradas" value={fmt(pi.patents.n)} detail="otra fuente · no responde a los filtros" valueFontSize={20} withDetail /></Col>
          </Row>
          <Note>{PI_PATENTS_NOTE}</Note>
          <Row gutter={[12, 12]} style={{ marginTop: 8 }}>
            <Col xs={24} xl={8}>
              {subtitle("Por tipo")}
              {empty(types) || <HBarsChart rows={types} color={BAR_COLORS.appropriation} unit="Activos" />}
            </Col>
            <Col xs={24} xl={8}>
              {subtitle("Por estado de gestión")}
              {empty(states) || <HBarsChart rows={states} color={BAR_COLORS.appropriation} unit="Activos" />}
            </Col>
            <Col xs={24} xl={8}>
              {subtitle("País de protección")}
              {empty(countries) || <HBarsChart rows={countries} color={BAR_COLORS.appropriation} unit="Activos" />}
              <Note>{`Fuera de Colombia: ${fmt(pi.countries.others)} activos en ${fmt(pi.countries.otherCountries)} países (se muestran los 5 principales).`}</Note>
            </Col>
            <Col xs={24} xl={14}>
              {subtitle(`Por año de concesión (${pi.years[0]}–${pi.years[pi.years.length - 1]})`)}
              <LinesChart years={pi.years} series={series} colors={SERIES_COLORS} unit="Activos" legend={false} height={240} />
            </Col>
            <Col xs={24} xl={10}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 4 }}>
                {subtitle(`${PI_TOP} ${view === "group" ? "grupos" : "unidades"} con más activos`)}
                <Segmented size="small" options={PI_VIEWS} value={view} onChange={onView} data-testid="pi-view" />
              </div>
              {empty(ranking) || <HBarsChart rows={ranking} color={BAR_COLORS.company} unit="Activos" labelSize={34} />}
            </Col>
          </Row>
          <Note data-testid="pi-year-note">{piYearNote(pi.withoutYear, pi.fullRange)}</Note>
          <Note data-testid="pi-filter-note">{PI_FILTER_NOTE}</Note>
          {pi.notResponding.length ? <Note data-testid="pi-not-responding">{piNotRespondingNote(pi.notResponding)}</Note> : null}
        </ChartCard>
      </Col>
    </Row>
  );
}

export default memo(PropertyCard);
