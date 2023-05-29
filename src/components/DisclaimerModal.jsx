import React, { useEffect } from 'react';

/* UI Library Components */
import { Modal } from 'antd';

const DisclaimerModal = () => {
  const [modal, contextHolder] = Modal.useModal();
  const instance = () =>
    modal.warning({
      title: 'Plataforma en construcción',
      content: (
        <>
          <p>
            ImpactU está en desarrollo. Esta es la primera versión disponible
            para ofrecer información sobre artículos resultados de investigación
            e integra sólo aquellos que tienen DOI en diferentes bases de datos
            locales, nacionales y globales.
          </p>
          <p>
            La plataforma está en{' '}
            <a
              href="https://es.wikipedia.org/wiki/Ciclo_de_vida_del_lanzamiento_de_software#Alfa"
              target="_blank"
              rel="noreferrer"
            >
              versión alfa
            </a>{' '}
            y aún requiere de trabajo posterior, agradecemos todos los
            comentarios que pueda hacer en{' '}
            <a
              href="https://forms.gle/mroVGTkddM1QEL9q9"
              target="_blank"
              rel="noreferrer"
            >
              este formulario.
            </a>{' '}
          </p>
        </>
      ),
      maskClosable: true,
      centered: true,
      autoFocusButton: null,
      okText: 'Probar versión alfa',
    });

  useEffect(() => {
    instance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{contextHolder}</>;
};

export default DisclaimerModal;
