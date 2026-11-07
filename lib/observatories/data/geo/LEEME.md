> Copia de `out\geo\LEEME.md` (B131, B132, B133) para el frontend (F81, F81b). Aquí **no** está `antioquia_municipios.json` (173 KB, sin uso todavía). Se copiaron `world.json` (B133, Natural Earth), `colombia.json` y `antioquia_subregiones.json` (B132) el 7 nov 2026.

# Polígonos para los mapas del observatorio (B131; Antioquia y departamentos de B132; mundo de B133, 7 nov 2026)

El frontend copia estos archivos a `lib/observatories/data/geo/`. No llevan conteos: los números salen del bundle. Versión B132 (simplificada con mapshaper 0.7.101, comando en `out\b132\simplificar.sh`); la versión de B131 (shapely) está en `out\b131\geo_anterior\`.

| Archivo | Features | Bytes (gzip) | Propiedades | Llave de cruce con el bundle |
|---|---|---|---|---|
| `world.json` | 247 | 424.215 (150.261) | `country_code`, `name` | `country_code` con `countries[].c` del T2 (ISO2; 170 de 170 con contorno) |
| `colombia.json` | 33 | 111.635 (31.135) | `DPTO` (DANE, 2 dígitos), `NOMBRE_DPT` (original), `nombre_t2` | `nombre_t2` con `depts` del T2 (27 con valor; `null` en Arauca, Putumayo, Guainía, Guaviare, Vaupés y Vichada); preferir cruzar por `DPTO` |
| `antioquia_subregiones.json` | 9 | 53.629 (15.101) | `subregion` | `subregion` con `subregs` del T2 y del T1 (mismos 9 nombres, con tilde) |
| `antioquia_municipios.json` | 125 | 172.572 (47.960) | `codigo_dane` (5 dígitos), `municipio`, `subregion` | `codigo_dane` con `obs_dim_municipio.codigo_dane`; `subregion` como arriba |

## Origen
- **world.json (B133):** **Natural Earth**, «Admin 0 – Countries», escala 1:50m (repositorio público `nvkelso/natural-earth-vector`, `geojson/ne_50m_admin_0_countries.geojson`, VERSION 5.2.0-pre; último commit del archivo 9380cca83d, 13 may 2022; descargado el 2026-11-07T19:51:03Z), **dominio público**. `country_code` = `ISO_A2_EH`, `name` = `NAME` (inglés). Complementos del mismo proyecto: Vaticano, Mónaco y Gibraltar desde 1:10m (`ne_10m_admin_0_countries.geojson`) y Guayana Francesa, Guadalupe, Martinica, Reunión y Mayotte desde los «map subunits» 1:50m (`ne_50m_admin_0_map_subunits.geojson`), recortados de Francia (y Vaticano/Mónaco de sus vecinos). Sin Antártida (el T2 no tiene `AQ`). Quedan 77 países que el T2 no usa. Tres polígonos sin código ISO en Natural Earth quedan con `country_code` vacío: Somaliland, N. Cyprus y Siachen Glacier; Australia, «Indian Ocean Ter.» y «Ashmore and Cartier Is.» comparten `AU`. Natural Earth dibuja Taiwán y Palestina como unidades propias; no se agrega ningún texto político. El mundial de quyca (B131/B132) está en `out\b132\geo_anterior\`.
- **colombia.json:** `quyca/assets/colombiamap.json` (33 departamentos). **Fuente original no documentada** (atributos `DPTO`, `AREA`, `PERIMETER`, `HECTARES`, que se quitaron salvo `DPTO`). `nombre_t2` según la tabla de B130 §2 (Bogotá y San Andrés a mano).
- **antioquia_*.json:** Marco Geoestadístico Nacional 2024 (MGN2024) del DANE, capa «Municipio» (servicio `https://portalgis.dane.gov.co/mparcgis/rest/services/MGN2024/Serv_CapasMGN_2024/FeatureServer/317`, filtro `dpto_ccdgo='05'`, 125 municipios, EPSG:4326). **Descargado el 2026-11-07T17:17:17Z.** Cada municipio se une a su subregión por `codigo_dane` (`obs_dim_municipio.subregion_antioquia`); las 9 subregiones son la unión de los municipios simplificados.

## Licencia
Los dos archivos de Antioquia derivan de datos del DANE. El elemento oficial del DANE en ArcGIS Online (`DatosDIG_DANE`, «Marco Geoestadístico Nacional (MGN) 2024 – Niveles Geográficos», id `513f6215f89f4cc183223598b5b74def`) dice que el DANE ofrece la información georreferenciada bajo licencia **Creative Commons** (menciona CC BY 4.0, Sección 3(a)(1)), reserva el derecho de autor, autoriza las modificaciones técnicas y pide citar: **«Departamento Administrativo Nacional de Estadística - DANE: www.dane.gov.co»**. Esa cita debe aparecer donde se muestre el mapa de Antioquia. Condiciones exactas por capa: no verificadas fuera de ese texto. `world.json` es de Natural Earth (dominio público); para `colombia.json` la licencia es desconocida (viene de quyca).

## Simplificación (B132)
Herramienta: `mapshaper` 0.7.101 (npm), `-simplify <p>% keep-shapes` (Visvalingam; los bordes compartidos se simplifican una sola vez; ningún polígono desaparece). Medidas con `shapely`.
- **Municipios:** desde el MGN original (711.552 vértices), 1,2 % (`precision=0.0001`) → 8.641 vértices; error de área por municipio máx. 1,46 %, mediana 0,17 %; área total −0,005 %; 125 de 125, 0 inválidos, 0 superposiciones, 0 huecos.
- **Subregiones:** `-dissolve subregion` de esos municipios (los bordes coinciden); 9 features, 2.962 vértices, 0 superposiciones y 0 huecos; −0,88 % de área frente a Antioquia de `colombia.json`.
- **Países (B133):** `mapshaper` 0.7.101, `-simplify 20% keep-shapes` (`precision=0.001`) sobre la base compuesta (94.713 vértices) → 23.860 vértices; los 84 países que perdían más del 3 % de su área recuperan una geometría menos simplificada (50 %, 75 % o la de origen); error de área máx. 2,99 %, mediana 0,25 %. Hay 19 superposiciones de borde entre vecinos (máx. 0,047 grados²) por esa restauración; el 3 % ahorra 100 KB pero llega a 2 grados².
- **Departamentos:** 2 % (`precision=0.001`) → 6.714 vértices; cinco departamentos (San Andrés, Bogotá y otros tres) recuperan una geometría menos simplificada; error máx. 2,85 %, mediana 0,57 %.
- Para volver a la versión de B131: copiar desde `out\b131\geo_anterior\`.
