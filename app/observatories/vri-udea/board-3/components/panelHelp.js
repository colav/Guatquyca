/**
 * Help of the panels of the Board 3, for the button (i) of each card (F100, D-221). Provisional texts: Luis and Gabriel approve them.
 * Structure: `what`, `how`, `look` and `care`. No figure is written by hand (D-174); the notes below each chart are not repeated here.
 */
/** The filters of centre, unit and subunit are direct (F102, D-226): the panels that answer to them say so in their `care`. */
const DIRECT = "Con un centro, unidad o subunidad elegidos solo se cuentan los productos de esa entidad.";
const withDirect = (entry) => ({ ...entry, care: [entry.care, DIRECT].filter(Boolean) });

const HELP = {
  p1: {
    what: "Cuántos profesores con contrato tiene la Universidad y cómo se reparten por nivel de formación o por categoría de Minciencias; además, su densidad frente a la población de Antioquia.",
    how: "Las tarjetas de arriba dan el total y su densidad por cada cien mil habitantes (con población ajustada y censada). Cada barra de abajo es un nivel o una categoría y su longitud es el número de profesores; el selector cambia entre las dos vistas cuando existen.",
    look: "Qué niveles o categorías concentran al profesorado y cómo cambia la densidad según la población de referencia.",
    care: "Este panel no responde a los filtros: es siempre el agregado de la Universidad. La densidad depende de qué población se use.",
  },
  p2: {
    what: "Cuántos investigadores activos están vinculados a grupos, por gran área de la OCDE.",
    how: "Cada rectángulo es un área y su superficie es proporcional al número de investigadores activos; el color distingue el área. Pase el cursor para ver la cifra y su porcentaje.",
    look: "Qué áreas concentran a los investigadores y cuáles pesan poco.",
    care: "Solo se cuentan las personas con un grupo principal. Una persona cuenta en una sola área.",
  },
  p3: {
    what: "Cuántos grupos activos hay en cada gran área de la OCDE y categoría de Minciencias.",
    how: "Cada columna es un área y cada fila una categoría; el tamaño de la burbuja y el número en su centro son los grupos de esa casilla. Una casilla sin burbuja no tiene grupos.",
    look: "En qué categorías se concentran los grupos de cada área, y qué áreas tienen pocos grupos en las categorías altas.",
    care: "Solo cuentan los grupos con estado «Activo». Con un filtro de centro, unidad o tema solo aparecen los grupos con productos en la selección.",
  },
  p4: {
    what: "Cuántos autores distintos publican cada año, repartidos por grupo de edad.",
    how: "El eje horizontal son los años y el vertical el número de autores únicos; cada línea es un grupo de edad (leyenda). La edad es la que tenía el autor el año de cada producto.",
    look: "Qué grupos de edad sostienen la producción y si el relevo generacional se ve en las líneas.",
    care: "Solo entran los autores con fecha de nacimiento: la cobertura es parcial. El último año suele estar incompleto, así que su caída no es una tendencia.",
  },
  p5: {
    what: "Cuántos autores distintos publican cada año, según su sexo.",
    how: "El eje horizontal son los años y el vertical el número de autores únicos; cada línea es una categoría de sexo (leyenda), incluida la de autores sin dato.",
    look: "Si la brecha entre las líneas se abre, se cierra o se mantiene con los años.",
    care: "Solo se conoce el sexo de una parte de los autores; la línea «sin dato» mide esa falta, no una categoría real. El último año suele estar incompleto.",
  },
  p6: {
    what: "En qué tópicos de investigación están los autores de cada grupo de edad.",
    how: "Cada barra es un tópico (los que tienen más investigadores) y se divide en segmentos por grupo de edad (leyenda); el largo total es el número de autores del tópico.",
    look: "Qué tópicos están a cargo de investigadores más jóvenes o más mayores.",
    care: "Solo entran los autores con fecha de nacimiento. Un autor puede estar en varios tópicos.",
  },
  p7: {
    what: "Cuántos estudiantes participan cada año en proyectos de investigación, por nivel de formación.",
    how: "El eje horizontal son los años y el vertical el número de personas; cada línea es un nivel (leyenda).",
    look: "Qué niveles tienen más participación y cómo cambia con los años.",
    care: "Responde al centro y a los años, pero no a unidad, subunidad ni tema. Con un centro elegido solo cuentan los proyectos que ese centro gestiona.",
  },
  p8: {
    what: "Cuántas tesis de posgrado se registran cada año, según su tipo.",
    how: "El eje horizontal son los años y el vertical el número de tesis; cada línea es un tipo de tesis (leyenda).",
    look: "Qué tipo de tesis domina y si la producción sube o baja.",
    care: "El último año puede estar incompleto. Los autores de una tesis incluyen a directores y, en parte, a estudiantes.",
  },
  p10: {
    what: "En qué unidades académicas hay profesores con productos de apropiación social.",
    how: "Cada barra es una unidad académica; su longitud es el número de profesores de esa unidad con al menos un producto de apropiación social. Al pasar el cursor se ve cuántos profesores de la unidad hay en la selección y qué parte son.",
    look: "Qué unidades tienen más profesores en apropiación social, en cifras absolutas y en proporción.",
    care: "Los profesores son los autores con contrato vigente. Una unidad sin barra no tiene profesores con este tipo de producto en la selección.",
  },
  p11: {
    what: "En qué unidades académicas hay profesores con productos hechos junto con empresas.",
    how: "Cada barra es una unidad académica; su longitud es el número de profesores con al menos un producto compartido con una empresa. Al pasar el cursor se ve qué parte son de los profesores de la unidad en la selección.",
    look: "Qué unidades se relacionan más con el sector empresarial, en cifras y en proporción.",
    care: "La empresa se identifica por reglas sobre el nombre de la organización: puede haber errores. Los profesores son los autores con contrato vigente.",
  },
  p11b: {
    what: "Los activos de propiedad intelectual de la Universidad y a quién pertenecen o dónde se protegen.",
    how: "Las tarjetas dan el total y cuántos tienen grupo de investigación. Las barras de abajo los reparten por tipo de activo, por país y por grupo o unidad (el selector cambia entre grupo y unidad); la línea muestra su evolución por año.",
    look: "Qué tipos de activo dominan y qué grupos o unidades concentran la propiedad intelectual.",
    care: "El contador de patentes viene de otra fuente y no responde a los filtros. Los activos sin año no entran en la línea.",
  },
  p12: {
    what: "Cuántos profesores tienen productos artísticos y cuántos productos tiene cada uno.",
    how: "El eje horizontal es el número de productos artísticos por profesor y el vertical el número de profesores con ese número; cada color es un nivel de formación o un tipo de contrato (leyenda). El tamaño de la burbuja crece con el número de profesores.",
    look: "Si la producción artística está repartida entre muchos profesores o concentrada en pocos, y en qué nivel de formación.",
    care: "Este panel no responde a los filtros. El eje horizontal se corta en un máximo; los profesores con más productos se agrupan en el último valor.",
  },
  p13: {
    what: "Cuántos proyectos tiene cada grupo del Centro de Investigación de Artes.",
    how: "Cada barra es un grupo y su longitud es el número de proyectos del grupo.",
    look: "Qué grupos concentran los proyectos del centro.",
    care: "Un proyecto de varios grupos cuenta en cada uno, así que la suma de las barras es mayor que el número de proyectos distintos. Este panel no responde a los filtros.",
  },
  p14: {
    what: "En qué unidades académicas se hacen los proyectos de investigación-creación y las obras de creación.",
    how: "Cada barra es una unidad académica y su longitud es el número de obras de creación que declara.",
    look: "Qué unidades tienen más creación registrada.",
    care: "Viene de un registro de productos de creación que no se puede cruzar con el resto de las obras. Este panel no responde a los filtros.",
  },
  p15: {
    what: "Cuántas publicaciones están en un repositorio abierto, en comparación con el total, por año y dominio del conocimiento.",
    how: "Hay un gráfico por dominio. El eje horizontal son los años; una línea es el total de publicaciones y la otra es la parte con texto completo en repositorio (leyenda). Mientras más cerca estén las dos, más abierta es la producción.",
    look: "En qué dominios la distancia entre las líneas es mayor y si se está cerrando con los años.",
    care: "No siempre se sabe si una publicación está en un repositorio. El último año suele estar incompleto.",
  },
  p16: {
    what: "En qué tópicos están los conjuntos de datos abiertos que registra la Universidad.",
    how: "Cada barra es un tópico y su longitud es el número de conjuntos de datos; los tópicos van del que más tiene al que menos.",
    look: "Qué temas concentran los datos abiertos de la Universidad.",
    care: "Algunos conjuntos no tienen tópico y se agrupan aparte. Solo se muestran los tópicos con más conjuntos.",
  },
  p17: {
    what: "Qué parte de la producción está en acceso abierto y cuánta es de otros tipos abiertos (datos, preprints, software).",
    how: "El anillo reparte las publicaciones según su acceso (abierto, cerrado o sin dato) y su centro dice la parte abierta. Las tarjetas dan los totales de publicaciones abiertas, conjuntos de datos abiertos, preprints y software. Cuando hay preprints, un segundo anillo reparte todos los productos por clase.",
    look: "Cuánto de la producción es abierta frente a cerrada y cuánta falta clasificar.",
    care: "El porcentaje de abiertas se calcula sobre las que tienen dato, no sobre todas. Los preprints son una marca de OpenAlex y pueden ser de cualquier tipo.",
  },
  p18: {
    what: "Qué parte de las personas, productos y organizaciones tiene un identificador persistente (PID).",
    how: "Cada barra es una entidad (por ejemplo, personas con ORCID, productos con DOI) y se divide en los registros con PID y sin PID (leyenda); la tabla de abajo da las cifras y el porcentaje.",
    look: "Qué identificadores están más extendidos y dónde falta más cobertura.",
    care: "Los totales de cada barra son distintos (personas, productos, organizaciones): compare los porcentajes, no las longitudes.",
  },
  p19: {
    what: "Cuántos profesores tienen productos de cada tipo distinto de artículo, libro o capítulo, según su contrato.",
    how: "Cada barra es un tipo de producto y se divide en segmentos por tipo de contrato (leyenda); la longitud total es el número de profesores con ese tipo de producto.",
    look: "Qué tipos de producto hacen más los profesores según su tipo de contrato.",
    care: "Un profesor con productos de varios tipos aparece en cada uno. Los productos de creación vienen de otro registro y no se cruzan con estas obras.",
  },
};

const ENTITY_PANELS = ["p2", "p3", "p4", "p5", "p6", "p8", "p10", "p11", "p15", "p16", "p17", "p18", "p19"];

export const PANEL_HELP = Object.freeze(Object.fromEntries(Object.entries(HELP).map(([key, entry]) => [key, ENTITY_PANELS.includes(key) ? withDirect(entry) : entry])));
