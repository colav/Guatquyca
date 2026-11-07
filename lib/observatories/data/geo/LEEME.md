# Polígonos para los mapas del observatorio (B131, 7 nov 2026)

El frontend copia estos archivos a `lib/observatories/data/geo/`. No llevan conteos: los números salen del bundle. Se generaron con `out\b131\generar_geo.py` (shapely 2.2.0).

| Archivo | Features | Bytes (gzip) | Propiedades | Llave de cruce con el bundle |
|---|---|---|---|---|
| `world.json` | 215 | 359.431 (129.267) | `country_code`, `name` | `country_code` con `countries[].c` del T2 (ISO2) |
| `colombia.json` | 33 | 72.327 (20.613) | `DPTO` (DANE, 2 dígitos), `NOMBRE_DPT` (original), `nombre_t2` | `nombre_t2` con `depts` del T2 (27 con valor; `null` en Arauca, Putumayo, Guainía, Guaviare, Vaupés y Vichada); preferir cruzar por `DPTO` |
| `antioquia_subregiones.json` | 9 | 240.964 (77.757) | `subregion` | `subregion` con `subregs` del T2 y del T1 (mismos 9 nombres, con tilde) |
| `antioquia_municipios.json` | 125 | 775.693 (245.771) | `codigo_dane` (5 dígitos), `municipio`, `subregion` | `codigo_dane` con `obs_dim_municipio.codigo_dane`; `subregion` como arriba |

## Origen
- **world.json:** `quyca/assets/worldmap.json` (215 polígonos). **Fuente original no documentada.** Se quitaron `count` y `log_count`. Códigos corregidos por nombre: Romania → RO, Curacao (neth.) → CW, «Hk» → HK, «Mo» → MO. Siguen sin código «East timor», «Prince edward island» (provincia de Canadá) y «Tm» (un fragmento minúsculo a 120,1–120,4° E, 22,4–23,0° N; no es Turkmenistán, que ya existe como TM). Con esto 163 de los 170 países del T2 tienen contorno; sin contorno: TW, PS, GU, VA, GI, MC, MV (no se añadió ninguno).
- **colombia.json:** `quyca/assets/colombiamap.json` (33 departamentos). **Fuente original no documentada** (atributos `DPTO`, `AREA`, `PERIMETER`, `HECTARES`, que se quitaron salvo `DPTO`). `nombre_t2` según la tabla de B130 §2 (Bogotá y San Andrés a mano).
- **antioquia_*.json:** Marco Geoestadístico Nacional 2024 (MGN2024) del DANE, capa «Municipio» (servicio `https://portalgis.dane.gov.co/mparcgis/rest/services/MGN2024/Serv_CapasMGN_2024/FeatureServer/317`, filtro `dpto_ccdgo='05'`, 125 municipios, EPSG:4326). **Descargado el 2026-11-07T17:17:17Z.** Cada municipio se une a su subregión por `codigo_dane` (`obs_dim_municipio.subregion_antioquia`); las 9 subregiones son la unión de los municipios simplificados.

## Licencia
Los dos archivos de Antioquia derivan de datos del DANE. El elemento oficial del DANE en ArcGIS Online (`DatosDIG_DANE`, «Marco Geoestadístico Nacional (MGN) 2024 – Niveles Geográficos», id `513f6215f89f4cc183223598b5b74def`) dice que el DANE ofrece la información georreferenciada bajo licencia **Creative Commons** (menciona CC BY 4.0, Sección 3(a)(1)), reserva el derecho de autor, autoriza las modificaciones técnicas y pide citar: **«Departamento Administrativo Nacional de Estadística - DANE: www.dane.gov.co»**. Esa cita debe aparecer donde se muestre el mapa de Antioquia. Condiciones exactas por capa: no verificadas fuera de ese texto. Para `world.json` y `colombia.json` la licencia es desconocida.

## Simplificación
- Países y departamentos: tolerancia 0,01° (Douglas-Peucker con topología) y 3 decimales; 3 polígonos diminutos del mundial (Greenland, «Tm», «Mo») quedan como en el origen para no volverlos vacíos o inválidos. El mundial de origen ya era grueso (20.214 → 20.008 vértices); el ahorro viene de los decimales.
- Antioquia: `coverage_simplify` a 0,001° sobre los 125 municipios (los bordes compartidos se simplifican una sola vez: sin huecos ni superposiciones) y 5 decimales (≈ 1 m). 711.552 vértices del MGN → 38.270 (municipios) y 12.139 (subregiones).
- Si pesan mucho: se pueden regenerar con tolerancia 0,002°.
