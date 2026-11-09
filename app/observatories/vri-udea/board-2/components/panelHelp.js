/**
 * Help of the panels of the Board 2, for the button (i) of each card (F100, D-221). Provisional texts: Luis and Gabriel approve them.
 * Structure: `what`, `how`, `look` and `care`. No figure is written by hand (D-174); the notes below each chart (method, coverage,
 * small samples) are not repeated here.
 */
export const PANEL_HELP = Object.freeze({
  p1: {
    what: "Los grupos de investigación de la UdeA que publican en más subcampos del conocimiento distintos.",
    how: "Cada barra es un grupo y su longitud es el número de subcampos en los que tiene artículos. El texto de la etiqueta añade en cuántos campos distintos está: publicar en campos diferentes es la señal más fuerte de transdisciplina.",
    look: "Qué grupos cubren más subcampos y si lo hacen dentro de un solo campo o entre campos.",
    care: "Mide dónde publica el grupo, no si trabaja con otras disciplinas. Solo aparecen grupos con varios subcampos.",
  },
  p2: {
    what: "Con qué otros grupos de la UdeA colabora cada grupo, y cuánto.",
    how: [
      "Cada círculo es un grupo; su tamaño crece con el número de grupos con los que colabora. El color es el de su centro de investigación (leyenda sobre el gráfico). Cada línea une dos grupos y es más gruesa cuanto más productos comparten.",
      "La envolvente gris agrupa a los grupos que más colaboran entre sí («comunidad»); no coincide necesariamente con un centro: una comunidad con varios colores reúne grupos de áreas distintas.",
    ],
    look: "Qué comunidades son densas, qué grupos hacen de puente entre comunidades y cuáles colaboran sobre todo dentro de su propio centro.",
    care: "Solo se dibujan los grupos con más colaboración y las líneas con más productos compartidos. Acerque el zoom para ver los nombres que no caben; al pasar el cursor por un círculo o una línea aparece el detalle.",
  },
  p3: {
    what: "Las organizaciones no académicas que más productos firman junto con la UdeA, y de qué tipo son esos productos.",
    how: "Cada barra es una organización; su longitud es el número de productos que firma con la UdeA y los colores separan el tipo de producto (leyenda: artículos, capítulos, libros y apropiación social). El sector de la organización se estima por reglas sobre su nombre.",
    look: "Qué organizaciones colaboran más y en qué tipo de producto (artículos, libros, capítulos, apropiación social).",
    care: "La clasificación del sector es una estimación y puede equivocarse. Aparecen solo las organizaciones con más productos.",
  },
  p4: {
    what: "En qué sector no académico están las organizaciones con las que la UdeA firma productos.",
    how: "Cada porción del anillo es un sector y su tamaño es la parte de los productos que tiene al menos una organización de ese sector. Al pasar el cursor se ve la cantidad.",
    look: "Con qué sectores (empresa, gobierno, sin ánimo de lucro, salud, otros) hay más colaboración.",
    care: "Un producto con coautores de varios sectores cuenta en cada uno: las porciones no suman el total de productos.",
  },
  p5a: {
    what: "Cómo cambia año a año el número de artículos de la UdeA.",
    how: "El eje horizontal son los años y el vertical el número de artículos; cada línea es una serie de las que muestra la leyenda.",
    look: "Si la producción crece, se estanca o cae, y desde qué año cambia la pendiente.",
    care: "Los últimos años pueden estar incompletos: una caída al final puede deberse a datos que aún no se publican, no a menos producción.",
  },
  p5b: {
    what: "Cómo cambian año a año los libros, los capítulos, la apropiación social y los proyectos (y las patentes, si la base las trae).",
    how: "El eje horizontal son los años y el vertical el número de registros; cada línea es un tipo de producto. Haga clic en la leyenda para comparar solo algunas series.",
    look: "Qué tipos crecen y cuáles se estancan, y si las series suben juntas.",
    care: "Cada serie tiene su propia fecha de referencia (por ejemplo, el año de inicio de los proyectos) y sus propios años incompletos. Los productos sin año no entran en la línea.",
  },
  p6: {
    what: "Cuántas colaboraciones de la UdeA involucran a la empresa y al gobierno a la vez (triple hélice, con la academia).",
    how: "Cada tarjeta es una medida: el número grande es la cantidad de registros (artículos, proyectos o patentes) que cumplen la condición que dice su rótulo, y el texto de debajo aclara qué se cuenta.",
    look: "En qué tipo de registro (bibliográfico, proyectos, tecnología) pesa más la colaboración triple.",
    care: "Un registro cuenta solo si cumple todas las condiciones de la tarjeta. Con pocos registros las cifras cambian mucho con cada filtro.",
  },
  p7: {
    what: "Cuántas colaboraciones de la UdeA suman, además, a organizaciones sin ánimo de lucro (cuádruple hélice).",
    how: "Cada tarjeta es una medida: el número grande es la cantidad de registros que cumplen la condición que dice su rótulo, y el texto de debajo aclara qué se cuenta.",
    look: "En qué tipo de registro pesa más la colaboración con la sociedad civil.",
    care: "Un registro cuenta solo si cumple todas las condiciones de la tarjeta. Con pocos registros las cifras cambian mucho con cada filtro.",
  },
  p8: {
    what: "Cuántos productos y proyectos mencionan la investigación-acción participativa.",
    how: "Cada tarjeta es una medida: el número grande es la cantidad de registros que mencionan el término, y el texto de debajo aclara qué se cuenta.",
    look: "Si el enfoque participativo aparece más en productos o en proyectos.",
    care: "Se busca el término en el título de los productos y en el nombre, los objetivos o las palabras clave de los proyectos: es una aproximación y puede dejar fuera trabajos que no usan esas palabras.",
  },
  p9: {
    what: "Con qué departamentos de Colombia colabora la UdeA, medido por los productos con coautores de instituciones de cada departamento.",
    how: "Cada departamento se pinta según el número de productos; el color más oscuro es más productos. La escala de color es logarítmica: un paso de color es una multiplicación, no una suma.",
    look: "Qué departamentos concentran las colaboraciones y cuáles casi no aparecen.",
    care: "El departamento es el de la institución del coautor, no el del lugar donde se hizo el trabajo. No cuentan los coautores de la propia UdeA.",
  },
  p9b: {
    what: "Cuánta producción y cuántos proyectos de la UdeA se asocian a cada subregión de Antioquia.",
    how: "Cada subregión se pinta según su número de registros; el color más oscuro es más. Las pestañas de arriba cambian entre proyectos por lugar de ejecución, proyectos con aportante externo y productos que mencionan la subregión.",
    look: "Qué subregiones tienen más presencia y cuáles apenas aparecen.",
    care: "Para los productos es una aproximación: se basa en menciones de la subregión o de sus municipios en el título. Los proyectos usan su lugar de ejecución.",
  },
  p10: {
    what: "Con qué países colabora la UdeA, medido por los productos con coautores de instituciones de cada país.",
    how: "El mapa pinta cada país según el número de productos (más oscuro es más); la tabla de la derecha da el mismo conteo en orden. Pase el cursor por un país para ver su cifra.",
    look: "Qué países concentran la colaboración y qué regiones del mundo casi no aparecen.",
    care: "El país es el de la institución del coautor. Los países sin contorno en el mapa se listan en la ayuda «?» del panel y aparecen solo en la tabla.",
  },
  p11: {
    what: "Qué parte de la colaboración internacional es con el Norte global y qué parte con el Sur global.",
    how: "Las tarjetas dan el total de productos con coautoría de cada lado. Las barras dividen esos productos por región del mundo y los colores distinguen el Norte y el Sur (leyenda).",
    look: "Si la colaboración se inclina hacia el Norte o hacia el Sur, y qué regiones pesan más dentro de cada lado.",
    care: "Las regiones que forman cada lado están en la nota bajo el gráfico.",
  },
  p13: {
    what: "En qué dominios del conocimiento trabajan los grupos que colaboran con actores no académicos.",
    how: "Cada fila es un grupo y las columnas son el número de libros, capítulos y productos de apropiación social hechos con actores no académicos, su total y, como referencia, los hechos con cualquier coautor externo. Las pestañas filtran por dominio de conocimiento.",
    look: "Qué grupos son los que más cooperan con la sociedad y con qué actor lo hacen.",
    care: "El dominio es el dominante en la producción del grupo. Aquí no cuentan los artículos, solo libros, capítulos y apropiación social.",
  },
  p14: {
    what: "Con qué tipo de organización colabora la UdeA en los tópicos de cada Eje Temático público.",
    how: "Cada barra es un eje (use las pestañas para cambiar de documento o agenda) y se divide en segmentos por tipo de organización (leyenda). Cada segmento es el número de productos con al menos una organización de ese tipo.",
    look: "Qué ejes tienen más colaboración no académica y con qué sector.",
    care: "El total de cada barra suma presencias por sector, no productos únicos: un producto con dos sectores cuenta dos veces.",
  },
  p15: {
    what: "Las entidades que más financian o cofinancian proyectos de la UdeA y a qué sector pertenecen.",
    how: "Cada barra es una entidad; su longitud es el número de proyectos que financia y el color es su sector (leyenda). Al pasar el cursor se ven los aportes en dinero y en especie.",
    look: "Qué entidades sostienen más proyectos y cuánto aportan en dinero y en especie.",
    care: "La clasificación del sector es una estimación. Solo se muestran las entidades con más proyectos y no se cuentan las entidades de la propia Universidad.",
  },
});
