"use client";

/* APIs */
import { submitFile } from "@/lib/apis/submit.api";

/* Components */
import SubmitHeader from "./components/SubmitHeader";
import SubmitTypeSelector from "./components/SubmitTypeSelector";
import SubmitUploader from "./components/SubmitUploader";
import UploadingModal from "./components/UploadingModal";
import ValidationErrorModal from "./components/ValidationErrorModal";

/* Hooks */
import { useState } from "react";
import { useRouter } from "next/navigation";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Row, Col, Alert } from "antd";

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
      "Archivo comprimido con el dump de ScienTI.",
      "Debe contener la totalidad de los identificadores (ID).",
      "Solicitado al Ministerio de Ciencia, Tecnología e Innovación.",
    ],
  },
};

/**
 * SubmitPage component provides the institutional file upload workflow, including type selection,
 * file upload, validation, and error handling.
 *
 * State variables:
 * - type: Selected file type key.
 * - file: File object to upload.
 * - loading: Whether a file is being processed.
 * - uploadingModalOpen: Whether the uploading modal is visible.
 * - validationResult: Validation result object (if any).
 * - error: General error message.
 * - uploadError: Upload-specific error message.
 *
 * @returns {JSX.Element} Rendered submit page UI.
 */
export default function SubmitPage() {
  const router = useRouter();

  const [type, setType] = useState(null);
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [uploadingModalOpen, setUploadingModalOpen] = useState(false);

  const [validationResult, setValidationResult] = useState(null);

  const [error, setError] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const handleSubmit = async () => {
    setError(null);
    setUploadError(null);

    setLoading(true);
    setUploadingModalOpen(true);

    try {
      await submitFile({ type, file });
    } catch (e) {
      if (e.status === 401 || e.message === "SESSION_EXPIRED") {
        router.push("/login?reason=expired");
        return;
      }

      if (e.success === false && e.pdf_base64) {
        setValidationResult(e);
        return;
      }

      setError(e.msg || "Ocurrió un error inesperado al procesar el archivo.");
    } finally {
      setLoading(false);
      setUploadingModalOpen(false);
    }
  };

  const handleTypeChange = (value) => {
    setType(value);
    setFile(null);
    setError(null);
    setUploadError(null);
    setValidationResult(null);
  };

  return (
    <Row justify="center" style={{ marginTop: 32 }}>
      <Col xs={24} sm={22} md={16} lg={12}>
        <SubmitHeader />

        {error && (
          <Alert
            type="error"
            message={error}
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <SubmitTypeSelector
          submitTypes={SUBMIT_TYPES}
          value={type}
          onChange={handleTypeChange}
        />

        {uploadError && (
          <Alert
            type="error"
            message={uploadError}
            showIcon
            style={{ marginTop: 16 }}
          />
        )}

        {type && (
          <SubmitUploader
            extensions={SUBMIT_TYPES[type].extensions}
            file={file}
            onFileChange={setFile}
            onSubmit={handleSubmit}
            onError={setUploadError}
            disabled={!file || loading}
          />
        )}

        <UploadingModal open={uploadingModalOpen} />

        <ValidationErrorModal
          open={!!validationResult}
          result={validationResult}
          onClose={() => setValidationResult(null)}
        />
      </Col>
    </Row>
  );
}
