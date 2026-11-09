/**
 * Help of the panels of the Board 1, for the button (i) of each card (F100, D-221). Provisional texts: Luis and Gabriel approve them.
 * Structure: `what` (one sentence), `how` (what each axis, colour or size means), `look` (one or two useful readings) and `care`
 * (limits). No figure is written by hand (D-174) and the methodological notes of the foot are not repeated.
 *
 * `review: "F101"` marks the entries that must be reviewed when the calculator takes 2010–2025 (F101); it is not shown.
 */
export const PANEL_HELP = Object.freeze({
  axisTopics: {
    what: "Los tópicos de los Ejes Temáticos que eligió y cuánta producción tiene cada uno con los filtros actuales.",
    how: "Cada fila es un tópico del eje; el número es la cantidad de productos de la UdeA cuyo tópico principal es ese. Si eligió varios ejes, la tabla los separa.",
    look: "Qué tópicos concentran la producción del eje y cuáles no tienen ninguna (aparecen con cero).",
    care: "Hay productos que el eje reúne aunque su tópico principal no sea uno de los del eje: se muestran aparte, en «otros productos asignados al eje».",
  },
  p1: {
    review: "F101",
    what: "Cada punto es un tópico (o un campo, subcampo o dominio, según la dimensión elegida): compara cuánto produce la UdeA con cuánto la citan.",
    how: [
      "Eje horizontal: número de productos de la UdeA en el tópico. Eje vertical: citas. Ambos están en escala logarítmica: cada marca multiplica la anterior, no le suma.",
      "El tamaño del punto es el FWCI normalizado por tópico y año: cada producto se compara con el promedio mundial de citas de su tópico en su mismo año de publicación, y ese promedio mundial es la referencia. El color es la categoría de capacidad; haga clic en una categoría de la leyenda para dejar solo esa.",
    ],
    look: "Los puntos grandes arriba y a la derecha son tópicos con mucha producción y mucho impacto; los pequeños y a la izquierda, tópicos de poca presencia. Haga clic en un punto para ver su detalle debajo.",
    care: "La tendencia marcada con asterisco es indicativa: se apoya en pocos productos.",
  },
  p2: {
    review: "F101",
    what: "Cuenta cuántos tópicos (o campos, subcampos o dominios) caen en cada categoría de capacidad frente a la institución de referencia.",
    how: [
      "Cada barra es una categoría; su longitud es la cantidad de unidades de la dimensión elegida que la cumplen. Haga clic en una barra para filtrar el tablero por esa categoría.",
      "La categoría sale de dos cosas: la razón de capacidad (citas de la UdeA frente a las del referente) y la tendencia de la producción (creciente, estable o decreciente). La tabla de reglas de abajo dice cómo se combinan.",
    ],
    look: "Qué categorías concentran más unidades y cuántas están en «sin producción» o en presencia puntual.",
    care: "La categoría depende del referente elegido (Colombia o el mundo).",
  },
  p3: {
    what: "Los grupos de investigación con más productos en los tópicos que dejan los filtros.",
    how: "Cada barra es un grupo; su longitud es el número de productos del grupo dentro de los tópicos filtrados. Los grupos van del que más produce al que menos.",
    look: "Cuántos grupos concentran la producción y si el tema depende de uno o de muchos.",
    care: "Un producto de varios grupos cuenta en cada uno: las barras no se suman entre sí.",
  },
  p4: {
    what: "Los Ejes Temáticos públicos ordenados por cuántos productos de la UdeA tienen asignados.",
    how: "Cada barra es un eje y su longitud el número de productos. La asignación de un producto a un eje tiene un nivel de confianza (alta, media o baja); el filtro «Incluir baja» decide si entran las de confianza baja.",
    look: "Qué ejes concentran la producción y cuáles apenas aparecen.",
    care: "Un producto puede estar en varios ejes. La asignación es de nuestra metodología y no tiene validación humana.",
  },
  p6: {
    what: "Las metas, retos, programas o estrategias de los documentos de política y a cuántos Ejes Temáticos se asocia cada uno.",
    how: "Cada barra es una meta; su longitud es el número de Ejes Temáticos asociados. Cambia con el documento y el eje elegidos.",
    look: "Qué metas tocan muchos ejes y cuáles pocos.",
    care: "No mide producción: no cambia con los filtros de años, centro, tema, ODS ni unidad.",
  },
  p7: {
    what: "Cómo se reparten los productos filtrados según su tipo, el cuartil de su revista y la ruta de acceso.",
    how: "Son tres anillos que parten de los mismos productos filtrados. Cada porción es la parte que cae en esa clase; al pasar el cursor se ve la cantidad.",
    look: "La proporción de artículos frente a otros tipos, la presencia en los cuartiles altos y cuánto es de acceso abierto.",
    care: "El cuartil solo existe para productos en revistas con cuartil Scimago; los demás quedan fuera de ese anillo. Los tipos dependen de la fuente.",
  },
  p8: {
    what: "Cuántos productos tiene la UdeA en cada Objetivo de Desarrollo Sostenible.",
    how: "Cada rectángulo es un objetivo y su área es proporcional al número de productos. Haga clic en uno para acotar el tablero a ese objetivo.",
    look: "Los rectángulos grandes marcan los objetivos con más producción.",
    care: "Una obra puede tener varios objetivos, y las que no tienen objetivo no están en el gráfico.",
  },
  p9: {
    what: "Dónde se menciona Antioquia en la producción: cuántos productos se asocian a cada subregión.",
    how: "Cada subregión se pinta por su número de productos; el color más oscuro es más producción. Al pasar el cursor aparece el detalle, con los productos de autores adscritos a los Programas de Regionalización.",
    look: "Qué subregiones tienen más o menos presencia en la producción.",
    care: "Es una aproximación: las bases no traen la ubicación de la investigación, solo menciones en el título. No es dónde se hizo el trabajo.",
  },
  p10: {
    what: "Las organizaciones no académicas que firman productos junto con la UdeA, ordenadas por número de productos.",
    how: "Cada fila es una organización; la columna de productos es cuántos firma con la UdeA, según los filtros. El tipo de actor (empresa, gobierno, etc.) sale de la clasificación de ROR y OpenAlex, del catálogo revisado de organizaciones de la Universidad y, cuando esas fuentes no lo dicen, de reglas sobre el nombre.",
    look: "Con qué tipo de actores colabora más la UdeA y cuáles organizaciones se repiten.",
    care: "{calidad} Se excluyen las universidades y las instituciones universitarias.",
  },
});
