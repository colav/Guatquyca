"use client";

import InfoButton from "../../ClientSide/Charts/InfoButton/InfoButton";

export default function MultipleProfilesInfoButton({ source }) {
  return (
    <InfoButton
      label="Múltiples Perfiles"
      text={`Hemos encontrado múltiples perfiles de ${source} asociados a este autor, lo que indica que su producción de investigación está distribuida en varios perfiles. Por favor, revisa todos los perfiles para obtener una visión completa de su trabajo académico.`}
    />
  );
}
