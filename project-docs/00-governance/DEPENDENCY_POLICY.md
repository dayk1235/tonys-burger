# 14 - POLÍTICA DE CONTROL DE DEPENDENCIAS (DEPENDENCY POLICY)

Este documento define las reglas de control para la adición, actualización o remoción de librerías externas (paquetes npm) en el proyecto **Tony Burgers**. Su cumplimiento estricto evita vulnerabilidades de seguridad, inestabilidades en la compilación y el engrosamiento innecesario del tamaño del bundle.

---

## 1. Ley de Control de Dependencias (Obligatorio)

### LAW_011 - DEPENDENCY CONTROL
Prohibido instalar dependencias sin autorización.
Toda dependencia debe:
- justificarse
- documentarse
- registrarse

---

## 2. Listado de Dependencias Oficialmente Aprobadas

Cualquier paquete npm no listado a continuación se considera **no autorizado**. El uso de un paquete no autorizado provocará el rechazo automático de la entrega.

### Dependencias de Producción (`dependencies`):
*   `react`: Core de la interfaz de usuario.
*   `react-dom`: Motor de renderizado en DOM para web.
*   `lucide-react`: Set de iconos ligero y flexible en formato SVG.
*   `clsx`: Utilidad para formateo de clases condicionales.
*   `tailwind-merge`: Utilidad para evitar colisiones de estilos en clases Tailwind.

### Dependencias de Desarrollo (`devDependencies`):
*   `typescript`: Tipado y compilador estático.
*   `vite`: Entorno y servidor de desarrollo rápido.
*   `postcss`: Procesador de CSS utilizado por Tailwind.
*   `autoprefixer`: Autoprefijador de CSS integrado.
*   `tailwindcss`: Compilador utilitario de estilos.

---

## 3. Plantilla de Solicitud de Adición de Dependencia

Si una tarea futura requiere de manera ineludible la adopción de una biblioteca externa (ej. `framer-motion` para animaciones complejas de UI), el agente de IA debe presentar una propuesta formal al usuario humano utilizando la siguiente plantilla estructurada antes de ejecutar cualquier comando de instalación:

```markdown
### PROPUESTA DE DEPENDENCIAS (LAW_011)

*   **Nombre del Paquete:** [Ej. framer-motion]
*   **Versión Propuesta:** [Ej. ^11.x]
*   **Tipo de Dependencia:** [Producción / Desarrollo]
*   **Tamaño Aprox. Bundle:** [Ej. 30 KB Gzipped]

#### A) Justificación
[Explicar detalladamente por qué se requiere esta librería y qué alternativas nativas u existentes en el proyecto fueron descartadas].

#### B) Impacto Técnico y de Compilación
[Detallar si requiere cambios en archivos de configuración como vite.config.ts, si introduce dependencias transitorias pesadas o si afecta negativamente al build].
```

---

## 4. Registro y Bloqueo de Versiones

*   **Exactitud de Versión:** Toda dependencia agregada al `package.json` debe definir una versión exacta o con rango de compatibilidad controlado de manera estricta.
*   **Bloqueo de Lockfile:** Cualquier comando npm que altere el archivo `package-lock.json` debe ejecutarse únicamente bajo el entorno seguro tras la aprobación formal de la propuesta. El lockfile debe ser guardado y comiteado de forma limpia junto con la modificación en el `package.json`.
