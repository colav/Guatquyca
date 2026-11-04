"use client";

/* Styles */
import styles from "../styles.module.css";

/* Hooks */
import { useMemo, useState } from "react";

/* APIs */
import { getExportUrl } from "@/lib/apis/theme.api";

/* Icons */
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  FlagOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";

/* Constants & utils */
import { computeCounts } from "../lib/classification";

/* UI Library Components */
import {
  Alert,
  Button,
  Card,
  Col,
  Input,
  Result,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";

const { TextArea } = Input;
const { Text } = Typography;

/**
 * SaveStep is Screen 3 of the Theme Curation flow: the curator confirms the
 * theme's final name, writes a public description and their curator
 * credit, reviews a summary of how Screen 2's classification landed, and
 * saves — which creates the theme (POST /app/theme) and then persists
 * every classified topic against it (see lib/persist.js).
 *
 * Two things here intentionally diverge from the original high-fidelity
 * mockup, per the API contract (02 §2, §3.8):
 *   - "Frontera" topics are saved with status "borderline", not folded
 *     into "included" — the API tracks it as its own status and the theme
 *     summary counts it separately.
 *   - Unclassified topics (possible here because Screen 2 lets the curator
 *     continue with some still unclassified) are simply not sent — there's
 *     no "unclassified" status in the API — and called out below instead.
 *
 * @param {string} name
 * @param {function} onNameChange
 * @param {Object[]} candidates
 * @param {Object[]} manualTopics
 * @param {Object.<string, {status: string, justification?: string}>} classifications
 * @param {boolean} saving
 * @param {string|null} saveError
 * @param {Object|null} savedTheme - The created theme (from POST /app/theme) once saved.
 * @param {{topicId: string, ok: boolean, error?: string}[]} failedTopics - Topics that failed to persist even though the theme itself saved.
 * @param {function} onSave - ({curator, description}) => void
 * @param {string|null} [failureReason] - Why the last attempt to save the topics failed as a whole (429, 5xx, no connection, ...); shown in the warning with the failed topics.
 * @param {function} onRetryFailedTopics
 * @param {function} onStartNewTheme
 * @param {function} onGoToList - Go to Screen 4 (themes listing), from the success view.
 * @param {function} onBack - Go back to Screen 2.
 * @returns {JSX.Element}
 */
export default function SaveStep({
  name,
  onNameChange,
  candidates,
  manualTopics,
  classifications,
  saving,
  saveError,
  savedTheme,
  failedTopics,
  failureReason = null,
  onSave,
  onRetryFailedTopics,
  onStartNewTheme,
  onGoToList,
  onBack,
}) {
  const [curator, setCurator] = useState("");
  const [description, setDescription] = useState("");

  const allTopics = useMemo(
    () => [...candidates, ...manualTopics],
    [candidates, manualTopics],
  );
  const counts = useMemo(
    () => computeCounts(allTopics, classifications),
    [allTopics, classifications],
  );
  const evaluatedCount = counts.included + counts.borderline + counts.excluded;

  const canSave =
    name.trim().length > 0 && curator.trim().length > 0 && !saving;

  if (savedTheme) {
    const persistedCount = evaluatedCount - failedTopics.length;
    return (
      <Card className={styles.stepCard}>
        <Result
          status="success"
          title="Eje temático guardado"
          subTitle={`"${savedTheme.name}" quedó creado con ${persistedCount} de ${evaluatedCount} tópicos clasificados guardados.`}
        />

        {failedTopics.length > 0 && (
          <Alert
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
            message={`${failedTopics.length} tópico(s) no se pudieron guardar`}
            description={
              <>
                <div>
                  El eje ya quedó creado; puedes reintentar guardar solo esos
                  tópicos sin perder el resto de la curación.
                </div>
                {failureReason && (
                  <div data-testid="save-failure-reason">{failureReason}</div>
                )}
              </>
            }
            action={
              <Button
                size="small"
                loading={saving}
                onClick={onRetryFailedTopics}
              >
                Reintentar
              </Button>
            }
          />
        )}

        <Space wrap size={12} className={styles.successActions}>
          <Button
            icon={<DownloadOutlined />}
            href={getExportUrl(savedTheme.theme_id, "csv")}
            target="_blank"
            rel="noopener noreferrer"
          >
            Descargar CSV
          </Button>
          <Button
            icon={<DownloadOutlined />}
            href={getExportUrl(savedTheme.theme_id, "json")}
            target="_blank"
            rel="noopener noreferrer"
          >
            Descargar JSON
          </Button>
          <Button type="primary" onClick={onStartNewTheme}>
            Curar otro eje temático
          </Button>
          <Button onClick={onGoToList}>Ver todos los ejes</Button>
        </Space>
      </Card>
    );
  }

  return (
    <Row gutter={24}>
      <Col xs={24} md={14}>
        <Card className={styles.stepCard}>
          <h2 className={styles.stepTitle}>Datos finales del eje</h2>

          {saveError && (
            <Alert
              type="error"
              message={saveError}
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          <div className={styles.field}>
            <Text strong>Nombre del eje</Text>
            <Input
              size="large"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              maxLength={200}
              style={{ marginTop: 8 }}
            />
          </div>

          <div className={styles.field}>
            <Text strong>Descripción pública</Text>
            <TextArea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Panorama de lo que cubre este eje temático..."
              autoSize={{ minRows: 3, maxRows: 8 }}
              style={{ marginTop: 8 }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Esta descripción será visible para otros investigadores que
              consulten el eje.
            </Text>
          </div>

          <div className={styles.field}>
            <Text strong>Autor / equipo curador</Text>
            <Input
              value={curator}
              onChange={(e) => setCurator(e.target.value)}
              placeholder="Ej. Equipo Ruta N"
              style={{ marginTop: 8 }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Campo de texto libre, no requiere una cuenta registrada en la
              plataforma.
            </Text>
          </div>
        </Card>
      </Col>

      <Col xs={24} md={10}>
        <Card className={styles.stepCard}>
          <h2 className={styles.stepTitle}>Resumen de la curación</h2>

          <div className={styles.summaryRow}>
            <Text>Tópicos evaluados</Text>
            <Text strong>{evaluatedCount}</Text>
          </div>
          <div className={styles.summaryRow}>
            <Tag color="success" icon={<CheckCircleOutlined />}>
              Incluidos
            </Tag>
            <Text strong>{counts.included}</Text>
          </div>
          <div className={styles.summaryRow}>
            <Tag color="warning" icon={<FlagOutlined />}>
              Frontera
            </Tag>
            <Text strong>{counts.borderline}</Text>
          </div>
          <div className={styles.summaryRow}>
            <Tag color="error" icon={<CloseCircleOutlined />}>
              Excluidos
            </Tag>
            <Text strong>{counts.excluded}</Text>
          </div>
          <div className={styles.summaryRow}>
            <Text type="secondary">Agregados manualmente</Text>
            <Text strong>{manualTopics.length}</Text>
          </div>

          {counts.unclassified > 0 && (
            <Alert
              type="warning"
              showIcon
              icon={<MinusCircleOutlined />}
              style={{ marginTop: 12 }}
              message={`${counts.unclassified} tópico(s) sin clasificar`}
              description="No se guardarán en el eje. Puedes volver a Revisar tópicos si quieres clasificarlos antes de guardar."
            />
          )}

          {counts.borderline > 0 && (
            <Alert
              type="info"
              showIcon
              style={{ marginTop: 12 }}
              message="Los tópicos frontera se guardarán con su propia clasificación y la justificación registrada."
            />
          )}
        </Card>
      </Col>

      <Col span={24}>
        {evaluatedCount > 0 && (
          <Text type="secondary" style={{ fontSize: 12 }}>
            Se guardarán {evaluatedCount} tópico(s) clasificados en una sola
            solicitud.
          </Text>
        )}
        <div className={styles.saveActions}>
          <Button onClick={onBack} disabled={saving}>
            Volver a revisar tópicos
          </Button>
          <Button
            type="primary"
            loading={saving}
            disabled={!canSave}
            onClick={() =>
              onSave({
                curator: curator.trim(),
                description: description.trim(),
              })
            }
          >
            Guardar eje temático
          </Button>
        </div>
      </Col>
    </Row>
  );
}
