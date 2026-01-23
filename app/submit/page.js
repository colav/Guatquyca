"use client";

/* APIs */
import { submitFile } from "@/lib/apis/submit.api";

/* Hooks */
import { useState } from "react";
import { useRouter } from "next/navigation";

/* Styles */
import styles from "./styles.module.css";

/* UI Components */
import {
  Row,
  Col,
  Typography,
  Select,
  Upload,
  Button,
  Card,
  Modal,
  Alert,
  Spin,
} from "antd";

import { InboxOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Dragger } = Upload;

const SUBMIT_TYPES = {
  staff: {
    label: "Staff institucional (Talento humano)",
    extensions: [".xlsx"],
    description: (
      <>
        Archivo base de talento humano de la institución. Esta información es
        clave para construir el perfil institucional, asociar autores y
        organizar la producción académica en <b id={styles.impact}>Impact</b>
        <b id={styles.u}>U</b>.
      </>
    ),
    notes: [
      "Archivo Excel (.xlsx) con una sola hoja.",
      "Los nombres de las columnas deben coincidir exactamente con el formato oficial.",
      "Evite abreviaciones y valores inconsistentes; los datos se reflejan tal como están escritos.",
    ],
  },

  ciarp: {
    label: "CIARP institucional",
    extensions: [".xlsx"],
    description:
      "Información CIARP requerida para instituciones universitarias públicas. Permite validar y cruzar la producción académica con los datos institucionales.",
    notes: [
      "Archivo Excel (.xlsx) con una sola hoja.",
      "Utiliza los mismos identificadores definidos en Talento Humano.",
      "No redefine unidades ni autores, solo los referencia.",
    ],
  },

  scienti: {
    label: "Dump institucional de ScienTI",
    extensions: [
      ".zip",
      ".rar",
      ".7z",
      ".tar",
      ".gz",
      ".tgz",
      ".bz2",
      ".tar.gz",
      ".tar.bz2",
    ],
    description:
      "Dump completo de información institucional proveniente de ScienTI (CvLAC, GrupLAC e InstituLAC), usado para enriquecer y contrastar la producción académica.",
    notes: [
      "Archivo comprimido exportado oficialmente desde ScienTI.",
      "Debe contener la totalidad de los identificadores (ID).",
      "Generalmente se solicita a través de la Vicerrectoría de Investigación.",
    ],
  },
};

export default function SubmitPage() {
  const router = useRouter();

  const [type, setType] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const selectedType = type ? SUBMIT_TYPES[type] : null;

  const beforeUpload = (file) => {
    if (!type) {
      setError("Seleccione primero el tipo de información a cargar.");
      return Upload.LIST_IGNORE;
    }

    const isValidExtension = selectedType.extensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext),
    );

    if (!isValidExtension) {
      setError(
        `Formato inválido. Se permiten archivos: ${selectedType.extensions.join(
          ", ",
        )}`,
      );
      return Upload.LIST_IGNORE;
    }

    setError(null);
    setFile(file);
    return false;
  };

  const handleSubmit = async () => {
    if (!file || !type) return;

    setSubmitting(true);
    setModalOpen(true);
    setError(null);

    try {
      const result = await submitFile({ type, file });

      console.log(result);
    } catch (e) {
      if (e.status === 401 || e.message === "SESSION_EXPIRED") {
        router.push("/login?reason=expired");
        return;
      }

      setError(e.msg || "Ocurrió un error al procesar el archivo.");
    } finally {
      setSubmitting(false);
      setModalOpen(false);
    }
  };

  return (
    <Row justify="center" style={{ marginTop: 32 }}>
      <Col xs={24} sm={22} md={16} lg={12}>
        <h2 level={4} style={{ marginBottom: 4 }}>
          Carga de información institucional
        </h2>

        <p>
          Envíe los archivos oficiales de su institución para la validación y
          posterior integración en <b id={styles.impact}>Impact</b>
          <b id={styles.u}>U</b>.
        </p>

        {error && (
          <Alert
            type="error"
            message={error}
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Card style={{ marginBottom: 24 }}>
          <Text strong>Tipo de información a cargar</Text>

          <Select
            placeholder="Seleccione el tipo de archivo"
            style={{ width: "100%", marginTop: 8 }}
            onChange={(value) => {
              setType(value);
              setFile(null);
              setError(null);
            }}
            options={Object.entries(SUBMIT_TYPES).map(([key, cfg]) => ({
              value: key,
              label: cfg.label,
            }))}
          />

          {selectedType && (
            <p style={{ display: "block", marginTop: 16, marginLeft: 3 }}>
              {selectedType.description}
            </p>
          )}
        </Card>

        {type && (
          <Card>
            <Dragger
              multiple={false}
              beforeUpload={beforeUpload}
              fileList={file ? [file] : []}
              onRemove={() => setFile(null)}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Arrastre el archivo aquí o haga clic para seleccionarlo
              </p>
              <p className="ant-upload-hint">
                Formatos permitidos: {selectedType.extensions.join(", ")}
              </p>
            </Dragger>

            <Button
              type="primary"
              block
              style={{ marginTop: 16 }}
              disabled={!file || submitting}
              onClick={handleSubmit}
            >
              Validar y enviar archivo
            </Button>
          </Card>
        )}

        <Modal open={modalOpen} footer={null} closable={false} centered>
          <div style={{ textAlign: "center", padding: 24 }}>
            <Spin size="large" />
            <Title level={5} style={{ marginTop: 16 }}>
              Procesando archivo
            </Title>
            <Text type="secondary">
              Su archivo se está cargando y validando. Este proceso puede tardar
              algunos segundos.
            </Text>
          </div>
        </Modal>
      </Col>
    </Row>
  );
}
