export const renderedTitle = (name) => {
  switch (name) {
    case "authors":
      return "Autores";
    case "departments":
      return "Departamentos";
    case "faculties":
      return "Facultades";
    case "groups":
      return "Grupos";
    case "institutions":
      return "Instituciones";
    case "literature":
      return "Literatura";
    default:
      return null;
  }
};
