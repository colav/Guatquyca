export const renderedTitle = (name) => {
  switch (name) {
    case "authors":
      return "Autores";
    case "author":
      return "del Autor";
    case "departments":
      return "Departamentos";
    case "department":
      return "del Departamento";
    case "faculties":
      return "Facultades";
    case "faculty":
      return "de la Facultad";
    case "groups":
      return "Grupos";
    case "group":
      return "del Grupo de Investigación";
    case "institutions":
      return "Instituciones";
    case "institution":
      return "de la Institución";
    case "literature":
      return "Literatura";
    default:
      return null;
  }
};
