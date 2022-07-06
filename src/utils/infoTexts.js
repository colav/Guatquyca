import openAccess from '../media/openAccess.png';

export const infoTexts = {
  OpenAccess: (
    <div>
      A partir de los datos disponibles en{' '}
      <a href="https://unpaywall.org/" target="_blank" rel="noreferrer">
        Unpaywall
      </a>{' '}
      se clasifican los artículos que tienen alguna caracterización de su
      circulación: gold (disponible con pago y sin pago de APC), green
      (disponible en repositorios institucionales y temáticos), hybrid (acceso
      cerrado y pago de APC) y bronze (acceso abierto en el sitio web). Este
      indicador permite tomar decisiones respecto a las políticas
      institucionales de pagos de APC o el diseño de estrategias de circulación
      de los resultados investigativos.
      <img
        style={{ width: '100%', marginTop: '15px' }}
        src={openAccess}
        alt="Gráfico de Open Access"
      />
    </div>
  ),
  BiblioSource: (
    <div>
      Se presenta toda la producción histórica, de acuerdo al filtro elegido,
      disponible en las plataformas Lens, Scopus, Google Académico y Web of
      Science y sus traslapes. El número de productos desarrollados por la
      institución y la presencia en diferentes bases de datos orientan
      decisiones sobre cuotas de producción, instrumentos de fomento para la
      publicación investigativa y los contrastes entre las diferentes áreas de
      conocimiento en sus límites y potencialidades en la publicación de
      resultados de investigación.
    </div>
  ),
  TotalCitations: (
    <div>
      Las citas son capturadas de Google Scholar y se consideran aquellas que
      han sido normalizadas y depuradas.
    </div>
  ),
  HIndex: (
    <div>
      El índice H que se ha calculado está basado en la totalidad de artículos
      con la afiliación institucional de la organización que se esté observando.
      Esto implica que el cálculo del H aplica al número más grande de h
      artículos con afiliación institucional que fueron citados por lo menos h
      veces cada uno. El índice H es una medida adecuada para contrastar el peso
      de la trayectoria en producción de documentos y la frecuencia de citas
      recibidas. Es una medida que adquiere más sentido cuando se pone en
      contraste con el H de otros investigadores de la institución, entre
      dependencias o entre organizaciones que tengan características similares
      en sus formas de producción.
      <br />
      Más información:{' '}
      <a
        href="https://www.pnas.org/content/102/46/16569?pagewanted=all"
        target="_blank"
        rel="noreferrer"
      >
        An index to quantify an individual's scientific research output
      </a>
    </div>
  ),
  H5Index: (
    <div>
      El índice H5 es el índice H calculado para la totalidad de artículos
      publicados en un período de 5 años. El H presentado aquí únicamente
      considera información que expresa la afiliación institucional de la
      organización que se está observando. El índice H5 permite hacer un corte
      temporal que permite observar el desempeño del H en la producción más
      reciente.
      <br />
      Más información:{' '}
      <a
        href="https://scholar.google.com/intl/es/scholar/metrics.html#metrics"
        target="_blank"
        rel="noreferrer"
      >
        Google Scholar Metrics
      </a>
    </div>
  ),
  YearlyCitations: (
    <div>
      Totalidad de citas obtenidas por toda la producción histórica con
      afiliación institucional distribuidas por año y capturadas de Google
      Scholar.Los artículos fueron obtenidos de las bases de datos: Web of
      Science, Scopus, Lens, Google Scholar, Scielo, Microsoft Academic y las
      bases de datos institucionales con producción de los autores.
    </div>
  ),
  YearlyAPC: (
    <div>
      El cargo por procesamiento de artículos (APC) es el valor pagado por
      publicar artículos en revistas científicas que lo cobran. Los datos de
      costo por artículo son obtenidos de la base de datos DOAJ. Este cálculo
      proyecta una aproximación al valor pagado pues los valores se obtienen en
      moneda local y se normalizan con el valor de la tasa de cambio del año
      2012. De otro lado, los datos obtenidos son los valores reportados por lo
      que se cobra por un artículo en la revista y no un registro de las
      facturas generadas por la transacción.
    </div>
  ),
  AccessAPC: (
    <div>
      Se presentan los pagos de APC hechos, distribuido en las diferentes
      ofertas de rutas de acceso de las revistas. Este indicador presenta
      insumos para la construcción de estrategias de publicación institucional.
    </div>
  ),
  FacultyAPC: (
    <div>
      Se presenta la distribución de los costos de publicación de artículos
      distribuidos por Facultad. El cargo por procesamiento de artículos (APC)
      es el valor pagado por publicar artículos en revistas científicas que lo
      cobran. Los datos de costo por artículo son obtenidos de la base de datos
      DOAJ. Este cálculo proyecta una aproximación al valor pagado pues los
      valores se obtienen en moneda local y se normalizan con el valor de la
      tasa de cambio del año 2012. De otro lado, los datos obtenidos son los
      valores reportados por lo que se cobra por un artículo en la revista y no
      un registro de las facturas generadas por la transacción.
    </div>
  ),
  DepartmentAPC: (
    <div>
      Se presenta la distribución de los costos de publicación de artículos
      distribuidos por Departamento. El cargo por procesamiento de artículos
      (APC) es el valor pagado por publicar artículos en revistas científicas
      que lo cobran. Los datos de costo por artículo son obtenidos de la base de
      datos DOAJ. Este cálculo proyecta una aproximación al valor pagado pues
      los valores se obtienen en moneda local y se normalizan con el valor de la
      tasa de cambio del año 2012. De otro lado, los datos obtenidos son los
      valores reportados por lo que se cobra por un artículo en la revista y no
      un registro de las facturas generadas por la transacción.
    </div>
  ),
  GroupAPC: (
    <div>
      Se presenta la distribución de los costos de publicación de artículos
      distribuidos por grupos de investigación. El cargo por procesamiento de
      artículos (APC) es el valor pagado por publicar artículos en revistas
      científicas que lo cobran. Los datos de costo por artículo son obtenidos
      de la base de datos DOAJ. Este cálculo proyecta una aproximación al valor
      pagado pues los valores se obtienen en moneda local y se normalizan con el
      valor de la tasa de cambio del año 2012. De otro lado, los datos obtenidos
      son los valores reportados por lo que se cobra por un artículo en la
      revista y no un registro de las facturas generadas por la transacción.
    </div>
  ),
  PublisherAPC: (
    <div>
      Se presenta la distribución de los costos de publicación de artículos
      distribuidos por Editorial acreedora. El cargo por procesamiento de
      artículos (APC) es el valor pagado por publicar artículos en revistas
      científicas que lo cobran. Los datos de costo por artículo son obtenidos
      de la base de datos DOAJ. Este cálculo proyecta una aproximación al valor
      pagado pues los valores se obtienen en moneda local y se normalizan con el
      valor de la tasa de cambio del año 2012. De otro lado, los datos obtenidos
      son los valores reportados por lo que se cobra por un artículo en la
      revista y no un registro de las facturas generadas por la transacción.
    </div>
  ),
  TotalProduction: (
    <div>
      Se presenta el total histórico de artículos publicados por los egresados
      de los programas de posgrado de la Universidad de Antioquia. Los artículos
      son tomados de las bases de datos Web of Science, Scopus, Lens, Google
      Scholar, Scielo, Microsoft Academic y las bases de datos institucionales
      con producción de los autores.
    </div>
  ),
  GraduatesOrg: (
    <div>
      Se presenta una gráfica con la distribución de los autores egresados de
      posgrados por tipo de organización de la que hace parte.
    </div>
  ),
  GraduatesGeo: (
    <div>
      Se presenta una gráfica con la distribución geográfica de los autores
      egresados de acuerdo a la localización de la organización a las que están
      afiliados.
    </div>
  ),
  InvCol: (
    <div>
      Un colegio invisible está compuesto por todos los autores que se
      relacionan a través de citas o coautorías y representan la comunidad
      temática alrededor de un problema o programa de investigación. La
      detección de colegios invisibles representa una forma más precisa de
      definir los campos de conocimiento en los que participa la institución,
      pues pasa del nivel descriptivo del área de conocimiento al de problemas o
      programas de investigación específicos. Se presentan los colegios
      invisibles en los que participan los egresados representados a través de
      las palabras más frecuentes que aparecen en los textos relacionados por
      citas y coautorías.
    </div>
  ),
  InvColCit: (
    <div>
      Se presentan la totalidad de citas que han recibido los textos que se
      producen en el marco de un colegio invisible. Los textos considerados para
      identificar los colegios corresponden a la totalidad de artículos
      colombianos y sus citas disponibles en bases de datos Web of Science,
      Scopus, Lens, Google Scholar, Scielo y Microsoft Academic.
    </div>
  ),
  InvColArtIns: (
    <div>
      Se presentan la totalidad de artículos que ha publicado la institución en
      el marco de la producción del colegio invisible observado. Los textos
      considerados para identificar los colegios corresponden a la totalidad de
      artículos colombianos y sus citas disponibles en bases de datos Web of
      Science, Scopus, Lens, Google Scholar, Scielo y Microsoft Academic.
    </div>
  ),
  InvColArtTot: (
    <div>
      Se presentan la totalidad de artículos que ha publicado Colombia en el
      marco de la producción del colegio invisible observado. Los textos
      considerados para identificar los colegios corresponden a la totalidad de
      artículos colombianos y sus citas disponibles en bases de datos Web of
      Science, Scopus, Lens, Google Scholar, Scielo y Microsoft Academic.
    </div>
  ),
  InvColArtYea: (
    <div>
      Se presenta una gráfica que distribuye temporalmente la producción de
      artículos en el colegio invisible observado. El propósito de esta gráfica
      es explorar visualmente si un colegio está en trayectoria de emergencia,
      crecimiento, estabilización o decrecimiento de acuerdo al volumen de
      producción anual. Los textos considerados para identificar los colegios
      corresponden a la totalidad de artículos colombianos y sus citas
      disponibles en bases de datos Web of Science, Scopus, Lens, Google
      Scholar, Scielo y Microsoft Academic.
    </div>
  ),
};
