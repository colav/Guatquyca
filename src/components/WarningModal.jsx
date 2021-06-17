/* UI Library Components */
const Modal = require("antd/lib/modal").default;

export const WarningModal = () => {
  const modal = Modal.warning({
    title: "Estamos generando tu archivo",
    content: `Por favor no refresques la página ni navegues fuera de ella,
    este proceso puede llegar a tardar varios minutos...
    Una vez esté listo tu navegador abrirá una ventana.`,
  });
  setTimeout(() => {
    modal.destroy();
  }, 4000);
};
