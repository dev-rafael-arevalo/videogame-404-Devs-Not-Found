# Cuestionario de definición

Responde debajo de cada pregunta (o marca la opción). Lo que quede sin responder lo deciden los
agentes con el **valor por defecto** indicado.

## Visión y alcance

1. **Título definitivo:** ¿*SYS://RESTORE*, *404: Devs Not Found* (el nombre del repo) u otro? → Por defecto: *SYS://RESTORE*
2. **Plataforma:** ¿solo navegador (web en Docker) o también escritorio (por ejemplo, empaquetado con Tauri)? → Por defecto: *solo web*
3. **Duración objetivo de una partida completa:** ¿30 min, 1 h, 2 h? → Por defecto: *~1 h (3 actos × 4–5 tickets)*
4. **Fecha o hito de entrega** del slice vertical:
5. **Público:** ¿gente que programa, estudiantes o público general? Define cuánta jerga técnica usar. → Por defecto: *estudiantes y juniors*

## Lore y personajes

6. **Protagonista:** ¿nombre, género o apariencia? ¿O se deja personalizable? → Por defecto: *"Dev", neutro, sin personalización*
7. ¿Te gustan **PATO** (pato de goma asistente), **CRON** (sistema de tickets), **El Recolector** (antagonista) y **Marga** (la senior)? ¿Cambios?
8. **Tono:** ¿más humor de oficina o más melancolía post-apocalíptica? → Por defecto: *70% humor, 30% melancolía*
9. **Finales:** ¿uno solo o varios según las personas rescatadas? → Por defecto: *uno, con epílogo variable*

## Jugabilidad

10. **Fallar un plazo:** ¿se reintenta el ticket (rollback) o hay game over real? → Por defecto: *rollback, se reintenta y baja el puntaje*
11. ¿**Modo sin presión** (sin plazos), por accesibilidad? → Por defecto: *sí, en opciones*
12. **Terminal del acto 3:** ¿solo simulada (lo seguro y simple) o con Python real en el navegador vía Pyodide? → Por defecto: *simulada*
13. ¿Qué **comandos** debe aprender a usar quien juega? (propuesta: `ls`, `cd`, `cat`, `python -m venv`, `pip install`, `python puente.py`)
14. **Controles:** ¿hace falta soporte de gamepad o táctil? → Por defecto: *teclado y mouse solamente*
15. **Idiomas:** ¿solo español o también inglés? → Por defecto: *español, con textos en JSON listos para traducir*

## Arte

16. **Paleta:** ¿una existente (Sweetie 16, Endesga 32) o propia? → Por defecto: *Sweetie 16 y un verde fósforo para la terminal*
17. **Herramienta:** ¿Aseprite (pago, unos USD 20) o LibreSprite/Piskel (gratis)?
18. ¿Quién hace el arte: una persona del equipo, encargo externo, IA como referencia o packs CC0 para empezar?

## Música

19. **Herramienta:** ¿FamiStudio (NES auténtico) o BeepBox (web, rápido)? → Por defecto: *FamiStudio*
20. ¿Quién compone? ¿Se aceptan pistas CC0/CC-BY de terceros como placeholder?

## Técnica y despliegue

21. **¿Dónde se publica** el contenedor? (local, VPS, Render/Fly.io, GitHub Pages sin Docker) → Por defecto: *local con Docker*
22. **Equipo:** ¿quién tiene cada rol (Lead, Narrativa, Música, Arte, Desarrollo)? Ver [CONTRIBUTING.md](../CONTRIBUTING.md).
23. ¿Hace falta **guardar partidas en la nube** o un ranking? (esto implicaría backend) → Por defecto: *no, solo localStorage*
24. ¿Analítica o telemetría? → Por defecto: *ninguna*
