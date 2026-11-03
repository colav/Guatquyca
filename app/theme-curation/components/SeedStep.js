"use client";

/* Styles */
import styles from "../styles.module.css";

/* UI Library Components */
import {
  Card,
  Input,
  InputNumber,
  Alert,
  Typography,
  Button,
  Space,
  Popconfirm,
} from "antd";
import { BulbOutlined } from "@ant-design/icons";

/* Constants */
import {
  SEED_CHAR_LIMIT,
  SEED_LONG_MESSAGE,
  SEED_TRUNCATED_MESSAGE,
  SEED_TIPS,
  TOPIC_COUNT_MIN,
  TOPIC_COUNT_MAX,
  TOPIC_COUNT_DEFAULT,
  TOPIC_COUNT_STEP,
} from "../lib/constants";

const { TextArea } = Input;
const { Text } = Typography;

/**
 * Formats an integer with a dot as thousands separator ("1.800"), the
 * Spanish convention, independent of the browser's locale data.
 *
 * @param {number} value
 * @returns {string}
 */
function formatThousands(value) {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * SeedStep is Screen 1 of the Theme Curation flow: the curator names the
 * theme and writes the natural-language seed that will be embedded to find
 * candidate topics.
 *
 * @param {string} name - Current working name of the theme.
 * @param {function} onNameChange
 * @param {string} seedText - Current seed text.
 * @param {function} onSeedTextChange
 * @param {number} topicCount - How many candidates to request from /app/theme/candidates.
 * @param {function} onTopicCountChange
 * @param {function} onSubmit - Called when the curator asks to search candidates.
 * @param {function} onCancel - Called when the curator discards the current draft.
 * @param {boolean} loading - Whether the candidates request is in flight.
 * @param {string|null} error - Error message from the last failed request, if any.
 * @param {boolean} [truncated] - True when the last /candidates answer reported that the backend truncated the seed.
 * @returns {JSX.Element}
 */
export default function SeedStep({
  name,
  onNameChange,
  seedText,
  onSeedTextChange,
  topicCount,
  onTopicCountChange,
  onSubmit,
  onCancel,
  loading,
  error,
  truncated = false,
}) {
  // Counted on the text as it is sent in `seed_text` (line breaks included).
  // A length guide (SEED_CHAR_LIMIT), not the model's cut (about 4,095 tokens
  // with Qwen, 30 §2): only a heads-up, it never blocks submission.
  const charCount = seedText.length;
  const overLimit = charCount > SEED_CHAR_LIMIT;

  const canSubmit =
    name.trim().length > 0 && seedText.trim().length > 0 && !loading;
  const hasDraft = name.trim().length > 0 || seedText.trim().length > 0;

  return (
    <div className={styles.seedFormWrap}>
      <Card className={styles.stepCard}>
        <h2 className={styles.stepTitle}>Descripción del eje</h2>

        {error && (
          <Alert
            type="error"
            message={error}
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <div className={styles.field}>
          <Text strong>Nombre del eje</Text>
          <Input
            size="large"
            placeholder="Ej. Inteligencia artificial aplicada a la salud"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            maxLength={200}
            style={{ marginTop: 8 }}
          />
        </div>

        <div className={styles.field}>
          <Text strong>Semilla</Text>
          <TextArea
            placeholder="Describe el eje temático con vocabulario técnico específico..."
            value={seedText}
            onChange={(e) => onSeedTextChange(e.target.value)}
            autoSize={{ minRows: 6, maxRows: 12 }}
            style={{ marginTop: 8 }}
          />
          <div className={styles.wordCounter}>
            <Text type={overLimit ? "danger" : "secondary"}>
              {formatThousands(charCount)}/{formatThousands(SEED_CHAR_LIMIT)}{" "}
              caracteres
            </Text>
          </div>
          {(overLimit || truncated) && (
            <Alert
              type="warning"
              showIcon
              style={{ marginTop: 8 }}
              message={truncated ? SEED_TRUNCATED_MESSAGE : SEED_LONG_MESSAGE}
            />
          )}
        </div>

        <div className={styles.field}>
          <Text strong>Cantidad de tópicos a buscar</Text>
          <div style={{ marginTop: 8 }}>
            <InputNumber
              min={TOPIC_COUNT_MIN}
              max={TOPIC_COUNT_MAX}
              step={TOPIC_COUNT_STEP}
              value={topicCount}
              onChange={(value) =>
                onTopicCountChange(value ?? TOPIC_COUNT_DEFAULT)
              }
              addonAfter="tópicos"
            />
          </div>
          <div
            className={styles.wordCounter}
            style={{ textAlign: "left", marginTop: 4 }}
          >
            <Text type="secondary">
              Recomendamos {TOPIC_COUNT_DEFAULT}: suele cubrir bien el eje sin
              alargar demasiado la revisión. Puedes pedir hasta{" "}
              {TOPIC_COUNT_MAX}.
            </Text>
          </div>
        </div>

        <Space style={{ marginTop: 8 }}>
          {hasDraft ? (
            <Popconfirm
              title="¿Descartar esta semilla?"
              description="Se borrará el nombre y el texto que llevas escrito."
              onConfirm={onCancel}
              okText="Descartar"
              cancelText="Seguir editando"
            >
              <Button size="large">Cancelar</Button>
            </Popconfirm>
          ) : (
            <Button size="large" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button
            type="primary"
            size="large"
            loading={loading}
            disabled={!canSubmit}
            onClick={onSubmit}
          >
            Buscar tópicos candidatos
          </Button>
        </Space>
      </Card>

      <Card size="small" className={styles.tipsCard}>
        <Space align="start">
          <BulbOutlined style={{ color: "#F9B250", marginTop: 4 }} />
          <div>
            <Text strong>Tips para una buena semilla</Text>
            <ul className={styles.tipsList}>
              {SEED_TIPS.map((tip, i) => (
                <li key={i}>
                  <Text type="secondary">{tip}</Text>
                </li>
              ))}
            </ul>
          </div>
        </Space>
      </Card>
    </div>
  );
}
