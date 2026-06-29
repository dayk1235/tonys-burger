# RKS-003 — Restaurant Entities

**La Tercera Lección de la Restaurant Knowledge School**

| Campo | Valor |
| :--- | :--- |
| **ID** | RKS-003 |
| **Título** | Restaurant Entities |
| **Tipo** | Catálogo de Entidades del Dominio |
| **Dominio** | Operaciones de Restaurante |
| **Escuela** | Restaurant Knowledge School (RKS) |
| **Estado** | Fundamento Permanente |
| **Versión** | 1.0.0 |
| **Dependencias** | RKS-001 (Restaurant Ontology), RKS-002 (Restaurant Vocabulary), KFS-001 |
| **Precede** | RKS-004 (Restaurant Relationships) |
| **Nivel Cognitivo** | Nivel 2 — Entidades |
| **Audiencia** | Cognitive Core, Human Teachers, Interpreters |

---

## PREÁMBULO

### La Progresión del Conocimiento

La Restaurant Knowledge School avanza en capas. Cada capa responde una pregunta distinta y ninguna puede sustituir a la anterior.

| Documento | Pregunta | Nivel |
| :--- | :--- | :--- |
| RKS-001 | ¿Qué existe? | Nivel 0 — Ontología |
| RKS-002 | ¿Qué significa cada término? | Nivel 1 — Vocabulario |
| RKS-003 | ¿Qué entidades existen y cómo se describen? | Nivel 2 — Entidades |

RKS-001 estableció las categorías de existencia: agentes, espacios, objetos, artefactos, acuerdos, eventos y abstracciones. RKS-002 definió el significado operacional de 71 términos del dominio. RKS-003 materializa ese conocimiento en entidades: objetos del mundo real con identidad, atributos, relaciones, estados y ciclo de vida que el Cognitive Core puede reconocer, distinguir y razonar.

### Qué Es Este Documento

RKS-003 es el catálogo de entidades del dominio restaurante. Una entidad no es un concepto abstracto ni una palabra del vocabulario. Es algo que existe en la operación con identidad propia, que persiste en el tiempo, que cambia de estado y que participa en relaciones con otras entidades.

Una orden es una entidad. Tiene identidad (la orden #4521 sigue siendo la misma orden aunque pase de "recibida" a "entregada"). Un producto es una entidad. Tiene identidad independiente de su precio actual o su disponibilidad momentánea. Un cliente es una entidad. Sigue siendo el mismo cliente en su primera visita y en su centésima.

Este documento describe cada entidad con la profundidad necesaria para que el Cognitive Core pueda responder preguntas como: ¿Es esto la misma orden o una nueva? ¿Qué atributos necesito para reconocer esta entidad? ¿En qué estados puede estar? ¿De qué otras entidades depende mi razonamiento?

### Qué No Es Este Documento

Este NO es un modelo de datos. No hay tablas, campos tipados, claves primarias, JSON, SQL ni clases de programación.

Este NO es una especificación de software. No hay APIs, endpoints, bases de datos ni arquitectura técnica.

Este NO redefine la ontología ni el vocabulario. RKS-001 y RKS-002 son autoridades previas. RKS-003 construye sobre ellos sin contradecirlos.

Este NO es un documento de procesos. Los flujos de trabajo pertenecen a documentos futuros. Aquí solo se describe qué entidades existen y cómo se caracterizan.

### Qué Es una Entidad en Este Dominio

Una entidad del dominio restaurante posee las siguientes características:

1. **Identidad** — Puede distinguirse de otras instancias del mismo tipo. Dos órdenes distintas no se confunden aunque contengan los mismos productos.
2. **Atributos** — Posee propiedades que la describen: obligatorias (sin ellas deja de ser lo que es) y opcionales (enriquecen sin definir).
3. **Relaciones** — Se conecta con otras entidades del dominio de forma significativa.
4. **Estados** — Ocupa posiciones en un ciclo de vida reconocible.
5. **Persistencia** — Permanece reconocible a través de cambios de estado y del tiempo.
6. **Papel en eventos** — Participa en ocurrencias operativas sin ser ella misma un evento.

Un pago es un evento. El método de pago es una entidad de referencia. La orden es una entidad que participa en el pago. Esta distinción se respeta en todo el catálogo.

### Cómo Leer Este Documento

Las entidades están organizadas en siete partes que reflejan la estructura operativa del restaurante:

| Parte | Dominio | Entidades |
| :--- | :--- | :--- |
| I | Organización | Restaurante, Sucursal, Configuración Operacional |
| II | Oferta | Menú, Categoría, Producto, Platillo, Bebida, Combo, Ingrediente, Receta, Promoción, Descuento |
| III | Transacción | Orden, Ítem de Orden, Ticket, Pago, Método de Pago |
| IV | Cliente y Servicio | Cliente, Reserva, Mesa, Zona, Canal, Delivery, Pickup |
| V | Producción e Inventario | Cocina, Estación, Inventario, Movimiento de Inventario, Proveedor |
| VI | Personal | Empleado, Rol, Turno |
| VII | Medición y Retroalimentación | KPI, Feedback, Reclamación |

Cada entidad sigue exactamente la misma estructura de doce secciones definida en la especificación de este documento.

### Estructura de Cada Entidad

| Sección | Propósito |
| :--- | :--- |
| **Definición** | Qué es, qué no es, cómo existe en la operación. |
| **Propósito** | Por qué existe esta entidad en el dominio. |
| **Identidad** | Qué la hace la misma entidad a través del tiempo y los cambios. |
| **Atributos** | Propiedades obligatorias y opcionales (conceptuales, no tipadas). |
| **Relaciones** | Conexiones con otras entidades del dominio. |
| **Ciclo de Vida** | Estados naturales y transiciones. |
| **Restricciones** | Reglas del dominio que gobiernan la entidad. |
| **Ejemplos** | Instancias operacionales concretas. |
| **Errores Frecuentes** | Confusiones comunes y sus consecuencias. |
| **Knowledge Dependencies** | Entidades que el Cognitive Core debe conocer para razonar sobre esta. |
| **Cognitive Importance** | Prioridad cognitiva con justificación. |
| **Implicaciones para el Cognitive Core** | Cómo modifica el razonamiento del sistema. |

---

## PARTE I — ORGANIZACIÓN

Las entidades de organización definen el contenedor dentro del cual opera todo lo demás. Sin ellas, productos, órdenes y empleados carecen de contexto.

---

## Restaurante

### Definición

El **Restaurante** es la entidad que representa el sistema operativo completo de transformación y comercialización de alimentos y bebidas en un lugar determinado: produce, vende, sirve y cobra. Es la unidad de realidad donde confluyen cocina, salón, menú, personal, inventario y clientes.

**Qué no es:** El Restaurante no es la marca corporativa que puede poseer varios locales. No es la sucursal como unidad administrativa de una cadena — aunque en operación de local único coinciden. No es el edificio físico en sí — es el sistema que opera dentro de él. No es un menú ni una orden.

**Cómo existe en la operación:** El Restaurante existe mientras opera como facilitad de producción culinaria, venta al público y servicio al comensal. Es el "yo" operativo que el Cognitive Core identifica cuando razona sobre un local específico. Todo lo que ocurre — cada orden, cada turno, cada movimiento de inventario — ocurre dentro de un Restaurante.

### Propósito

Proporcionar el límite superior de contexto operativo. El Restaurante es el contenedor ontológico dentro del cual todas las demás entidades tienen sentido. Sin Restaurante no hay menú propio, no hay inventario propio, no hay empleados asignados.

### Identidad

La identidad del Restaurante no depende de su nombre comercial, que puede cambiar por rebranding. No depende de su menú actual, que rota con temporadas. No depende de su gerente, que puede ser sustituido.

La identidad del Restaurante se establece por su continuidad como sistema operativo en una ubicación con un propósito gastronómico persistente. Si un local cierra definitivamente y otro negocio distinto abre en el mismo edificio, es un Restaurante nuevo. Si el mismo negocio se muda de dirección manteniendo operación continua, puede considerarse continuidad según decisión del negocio — pero la ubicación es atributo identitario relevante.

Lo que NO cambia la identidad: cambio de menú, remodelación, cambio de personal, ampliación de horarios, adición de canal delivery.

Lo que SÍ crea entidad nueva: cierre permanente y apertura de operación distinta; división de un local en dos operaciones independientes.

### Atributos

#### Obligatorios

- Identificador único dentro del contexto del negocio
- Nombre operativo bajo el cual se conoce públicamente
- Ubicación física donde opera
- Estado operativo (activo, temporalmente cerrado, en remodelación, cerrado permanentemente)
- Capacidad de producción y servicio (cubiertos, canales atendidos)
- Horario de operación vigente

#### Opcionales

- Nombre comercial distinto al nombre de marca
- Tipo de restaurante (fine dining, casual, quick service, ghost kitchen)
- Año de apertura
- Licencias y permisos sanitarios vigentes
- Características de ambiente y posicionamiento
- Relación con marca o franquicia

### Relaciones

- Un Restaurante puede ser operado como una **Sucursal** de una marca
- Un Restaurante posee uno o más **Menús** activos
- Un Restaurante contiene **Cocina**, **Zonas** de servicio y **Mesas**
- Un Restaurante emplea **Empleados** en **Turnos**
- Un Restaurante mantiene **Inventario** y contrata **Proveedores**
- Un Restaurante recibe **Órdenes** de **Clientes**
- Un Restaurante opera bajo **Configuración Operacional**
- Un Restaurante mide desempeño mediante **KPIs**

### Ciclo de Vida

**Planificado** — Decisión de apertura, construcción o adecuación del local. Aún no opera.

**En apertura** — Primeras semanas de operación con menú y procesos en calibración.

**Activo** — Operación normal con servicio regular.

**Temporalmente suspendido** — Cierre por remodelación, temporada baja planificada o contingencia temporal.

**En declive** — Operación activa pero con señales de cierre inminente.

**Cerrado permanentemente** — Deja de operar. La entidad permanece en registro histórico.

### Restricciones

- Todo lo que opera dentro del dominio pertenece a un Restaurante — no existen órdenes, inventarios ni menús huérfanos.
- Un Restaurante activo debe tener al menos un canal de venta operativo.
- Un Restaurante activo debe tener personal mínimo para operar de forma segura y legal.
- La configuración operativa de un Restaurante no puede contradecir las leyes sanitarias y laborales de su jurisdicción.

### Ejemplos

- "Tony Burgers Centro" — restaurante activo con salón, pickup y delivery, 80 cubiertos.
- Cocina ghost "Tony Burgers Express" — restaurante delivery-only sin salón.
- Restaurante "La Terraza" cerrado permanentemente en 2024 — entidad histórica.

### Errores Frecuentes

- Confundir Restaurante con Marca — una marca puede tener diez restaurantes.
- Tratar cada turno como un restaurante distinto.
- Asumir que dos locales con el mismo nombre en ciudades distintas son la misma entidad.
- Ignorar que un ghost kitchen es un Restaurante completo aunque no tenga salón.

### Knowledge Dependencies

Para razonar sobre Restaurante, el Cognitive Core debe conocer:

- **Sucursal** — cuando el restaurante opera dentro de una cadena
- **Configuración Operacional** — reglas y parámetros que gobiernan la operación
- **Menú** — la oferta que define qué puede venderse
- **Canal** — los modos de servicio habilitados
- **Empleado** y **Turno** — capacidad humana disponible

### Cognitive Importance

★★★★★ **Fundamental**

El Restaurante es la unidad primaria de contexto. Todo razonamiento del Cognitive Core ocurre dentro del límite de un Restaurante específico. Sin esta entidad, ninguna otra tiene anclaje operativo.

### Implicaciones para el Cognitive Core

La entidad Restaurante establece el alcance de toda observación, predicción y decisión. El sistema razona "para este restaurante" — sus ventas, su inventario, su personal, sus tiempos. Cambiar de restaurante cambia completamente el contexto cognitivo. El Restaurante es el marco dentro del cual la verdad operativa se evalúa.

---

## Sucursal

### Definición

La **Sucursal** es la entidad que representa una unidad operativa y administrativa del negocio restaurantero dentro de una estructura que puede abarcar múltiples locales. Es el punto donde se consolidan resultados, se aplican políticas y se reporta desempeño a la organización matriz o franquiciante.

**Qué no es:** La Sucursal no es la marca completa. No es un departamento dentro del restaurante (cocina, salón). No es una zona del salón. En operación de local único sin cadena, la Sucursal puede coincidir con el Restaurante pero conceptualmente la Sucursal enfatiza la posición dentro de una red.

**Cómo existe en la operación:** La Sucursal existe cuando el negocio opera más de un local o cuando un local se administra como unidad con código, presupuesto y reportes propios. Es la entidad que aparece en reportes consolidados: "Sucursal Norte vendió X, Sucursal Sur vendió Y."

### Propósito

Permitir razonamiento multi-unidad sin perder granularidad local. La Sucursal es el puente entre la operación de un Restaurante individual y la estrategia de una marca o grupo.

### Identidad

La identidad de la Sucursal no depende de su gerente actual. No depende de sus ventas del mes. No depende del menú específico — dos sucursales pueden tener menús ligeramente distintos.

La identidad se establece por su designación como unidad administrativa reconocida por la organización, con identificador único dentro de la red. Una Sucursal que cierra deja de ser activa pero conserva identidad histórica.

Lo que NO cambia la identidad: cambio de gerente, cambio de menú, remodelación, cambio de horario.

Lo que SÍ crea entidad nueva: apertura de un local nuevo con nuevo código de sucursal. Una reubicación puede mantener el mismo código de sucursal si la organización lo define así.

### Atributos

#### Obligatorios

- Identificador único de sucursal dentro de la organización
- Nombre o alias de la sucursal
- Restaurante(s) que opera
- Estado (activa, en apertura, suspendida, cerrada)
- Ubicación geográfica
- Tipo de operación (propia, franquicia)

#### Opcionales

- Gerente responsable
- Fecha de apertura
- Metas de ventas y KPIs asignados
- Grupo o región a la que pertenece
- Nivel de autonomía en precios y promociones
- Datos de contacto administrativo

### Relaciones

- Una Sucursal opera uno o más **Restaurantes**
- Una Sucursal pertenece a una marca u organización matriz
- Una Sucursal reporta **KPIs**, **Ventas** e **Ingresos**
- Una Sucursal emplea **Empleados** y programa **Turnos**
- Una Sucursal puede tener **Configuración Operacional** propia o heredada
- Una Sucursal mantiene **Inventario** y relaciones con **Proveedores**

### Ciclo de Vida

**Autorizada** — Aprobada para apertura, aún no opera.

**En implementación** — Construcción, contratación, configuración pre-apertura.

**Activa** — Operando y reportando.

**En observación** — Activa pero con desempeño bajo revisión.

**Suspendida** — Cierre temporal por decisión corporativa.

**Cerrada** — Dejó de operar permanentemente. Registro histórico.

### Restricciones

- Una Sucursal activa debe estar vinculada al menos a un Restaurante operativo.
- Las políticas corporativas pueden limitar la autonomía de la Sucursal en precios, proveedores y promociones.
- Los datos de una Sucursal no deben mezclarse con otra en análisis sin etiquetado explícito.
- Una Sucursal cerrada no genera órdenes ni consume inventario.

### Ejemplos

- Sucursal TB-001 "Centro" — franquicia activa en zona metropolitana.
- Sucursal TB-014 "Aeropuerto" — operación propia con menú reducido y horario extendido.
- Sucursal TB-007 — cerrada en 2023, datos históricos preservados.

### Errores Frecuentes

- Tratar toda la cadena como una sola sucursal en análisis.
- No separar KPIs por sucursal en redes multi-local.
- Asumir que todas las sucursales comparten el mismo menú o configuración.
- Confundir sucursal con zona de delivery dentro del mismo local.

### Knowledge Dependencies

Para razonar sobre Sucursal, el Cognitive Core debe conocer:

- **Restaurante** — la operación física que la sucursal administra
- **Configuración Operacional** — políticas que aplican a esta unidad
- **KPI** — métricas de desempeño asignadas
- **Empleado** — dotación de personal
- **Menú** — oferta vigente en esta unidad

### Cognitive Importance

★★★★☆ **Alta**

En operación de local único, la Sucursal puede fusionarse conceptualmente con el Restaurante. En operación multi-local, la Sucursal es indispensable para razonamiento comparativo, consolidación y políticas descentralizadas.

### Implicaciones para el Cognitive Core

La entidad Sucursal habilita razonamiento jerárquico: consolidar resultados, comparar unidades, detectar outliers, aplicar políticas diferenciadas. Sin Sucursal, un negocio multi-local se razona incorrectamente como monolito.

---

## Configuración Operacional

### Definición

La **Configuración Operacional** es la entidad que agrupa los parámetros, políticas y reglas bajo los cuales un **Restaurante** o **Sucursal** opera: horarios, límites de descuento, canales habilitados, tiempos estándar de servicio, políticas de reservación, reglas de inventario y cualquier decisión estructural que no cambia con cada orden pero gobierna cómo se procesan.

**Qué no es:** La Configuración Operacional no es una orden individual. No es el menú — aunque el menú refleja algunas decisiones de configuración. No es un empleado ni un turno. No es un KPI — los KPIs miden; la configuración define.

**Cómo existe en la operación:** Existe como el conjunto de decisiones estables que el personal aplica día tras día. Cuando un gerente define que el delivery opera hasta las 23:00, que los descuentos máximos son 15% sin autorización, o que las reservaciones requieren depósito para grupos mayores a 8, está modificando la Configuración Operacional.

### Propósito

Capturar las reglas del juego operativo que no pertenecen a ninguna transacción individual pero determinan cómo se procesan todas las transacciones. Sin esta entidad, el Cognitive Core trataría cada excepción como regla y cada regla como excepción.

### Identidad

La identidad de la Configuración Operacional está vinculada al Restaurante o Sucursal que gobierna. No es una entidad global del dominio — cada local (o red, si se centraliza) tiene la suya.

La identidad no depende de un parámetro individual — cambiar el horario de apertura modifica un atributo pero no crea configuración nueva. Una reconfiguración mayor (cambio de modelo operativo de solo salón a multicanal) puede considerarse nueva versión de configuración, pero la entidad persiste.

Lo que NO cambia la identidad: ajuste de un parámetro, actualización de tiempo estándar, cambio de política de propinas.

Lo que puede crear nueva versión: migración de sucursal de menú corporativo a menú autónomo; cambio de modelo de franquicia a operación propia.

### Atributos

#### Obligatorios

- Restaurante o Sucursal a la que aplica
- Horarios de operación por canal
- Canales de venta habilitados
- Políticas de descuento y autorización
- Reglas de reservación
- Tiempos estándar de servicio prometidos

#### Opcionales

- Política de propinas y cargos por servicio
- Reglas de sustitución de ingredientes
- Límites de modificaciones por producto
- Configuración de turnos mínimos por franja
- Políticas de devolución y compensación
- Parámetros de alerta de inventario mínimo
- Reglas de pricing por canal

### Relaciones

- La Configuración Operacional pertenece a un **Restaurante** o **Sucursal**
- La Configuración Operacional gobierna cómo se procesan **Órdenes**, **Reservas** y **Descuentos**
- La Configuración Operacional define **Canales** habilitados (**Delivery**, **Pickup**, salón)
- La Configuración Operacional establece límites para **Empleados** según **Rol**
- La Configuración Operacional influye en qué **KPIs** son relevantes y sus metas

### Ciclo de Vida

**Definida** — Parámetros establecidos, aún no en vigor (pre-apertura).

**Vigente** — Aplicándose en operación actual.

**En revisión** — Cambios propuestos bajo evaluación.

**Modificada** — Actualización aplicada con fecha de vigencia.

**Obsoleta** — Reemplazada por nueva configuración. Preservada para referencia histórica.

### Restricciones

- La Configuración Operacional no puede contradecir leyes ni regulaciones aplicables.
- En franquicias, la configuración local puede estar limitada por manual de marca.
- Cambios en configuración deben ser trazables — afectan cómo se interpretan datos históricos.
- Parámetros de configuración no reemplazan decisiones que requieren criterio humano en el momento.

### Ejemplos

- Configuración de Sucursal Centro: salón 12:00–22:00, delivery 11:00–23:00, descuento máximo cajero 10%.
- Configuración de ghost kitchen: solo pickup y delivery, sin reservaciones, tiempo estándar entrega 35 minutos.
- Cambio de configuración: a partir del 1 de julio, reservaciones requieren 50% de depósito para grupos de 6+.

### Errores Frecuentes

- Tratar preferencias de un gerente como configuración no documentada.
- Aplicar configuración de una sucursal a otra sin verificar.
- No registrar cambios de configuración — imposibilita explicar variaciones históricas.
- Confundir configuración con promoción temporal.

### Knowledge Dependencies

Para razonar sobre Configuración Operacional, el Cognitive Core debe conocer:

- **Restaurante** o **Sucursal** — a quién aplica
- **Canal** — qué modos de servicio gobierna
- **Rol** y permisos de **Empleado** — quién puede modificar qué
- **Promoción** y **Descuento** — límites de política comercial
- **KPI** — metas que la configuración establece

### Cognitive Importance

★★★★☆ **Alta**

La Configuración Operacional no es visible en cada transacción pero determina la interpretación correcta de todas ellas. Sin ella, el Cognitive Core aplica reglas incorrectas o asume libertades que no existen.

### Implicaciones para el Cognitive Core

Esta entidad es el marco normativo local. Permite al sistema distinguir "esto es una excepción autorizada" de "esto es un error", "esto está dentro de política" de "esto requiere escalamiento". Es prerequisito para razonamiento sobre autorización, elegibilidad y cumplimiento.

---


## PARTE II — OFERTA

Las entidades de oferta definen qué vende el restaurante y cómo se estructura esa venta. Son artefactos comerciales persistentes: existen antes de cualquier orden, sobreviven a transacciones individuales y determinan qué puede solicitarse, producirse y cobrarse.

---

## Menú

### Definición

El **Menú** es la entidad que representa la especificación vigente de la oferta comercial de un **Restaurante**: el catálogo estructurado de productos disponibles para venta, con sus precios, categorías, descripciones y condiciones de disponibilidad. Es el artefacto que traduce la capacidad productiva del restaurante en promesa comercial al cliente.

**Qué no es:** El Menú no es una orden. No es el inventario de ingredientes. No es la carta impresa ni la pantalla digital — esos son portadores; el Menú es la especificación que portan. No es una receta individual — contiene productos que tienen recetas asociadas.

**Cómo existe en la operación:** El Menú existe como la oferta autorizada de un restaurante en un momento dado. Puede haber menú de desayuno, menú de comida, menú de delivery — cada uno es una instancia o vista del Menú. El personal consulta el Menú para saber qué puede ofrecer; el cliente lo consulta para saber qué puede pedir; la cocina lo consulta indirectamente a través de las órdenes que derivan de él.

### Propósito

Ser la fuente de verdad de la oferta comercial. Todo producto vendible debe estar en el Menú; todo lo que está en el Menú debe poder producirse o marcarse como no disponible. El Menú canaliza la demanda del cliente hacia la producción de la cocina.

### Identidad

La identidad del Menú no depende de su portador físico — el mismo Menú puede existir en papel, pantalla y memoria del mesero. No depende de los precios actuales — un cambio de precio modifica un atributo, no crea un Menú nuevo. No depende de la disponibilidad momentánea de productos individuales.

La identidad se establece por su vinculación a un Restaurante y su vigencia temporal o contextual (menú principal, menú de temporada, menú de desayuno). Un Menú de verano 2026 es distinto del Menú de invierno 2026 si la organización los trata como especificaciones separadas.

Lo que NO cambia la identidad: actualización de precios, adición o retiro de productos individuales, cambio de descripciones, marcado temporal de productos como no disponibles.

Lo que SÍ crea entidad nueva: lanzamiento de menú completamente nuevo con identidad propia; menú de canal separado (delivery) tratado como especificación independiente.

### Atributos

#### Obligatorios

- Identificador único dentro del Restaurante
- Restaurante al que pertenece
- Nombre o designación del menú (principal, desayuno, delivery, temporada)
- Estado de vigencia (activo, programado, retirado)
- Conjunto de productos incluidos
- Estructura de categorías

#### Opcionales

- Horario de vigencia (desayuno 7:00–12:00)
- Canal al que aplica exclusivamente
- Fecha de inicio y fin para menús temporales
- Versión o número de revisión
- Idioma o variantes regionales
- Restricciones dietéticas destacadas a nivel de menú

### Relaciones

- Un Menú pertenece a un **Restaurante**
- Un Menú contiene **Productos** organizados en **Categorías**
- Un Menú referencia **Precios** de cada producto
- Un Menú puede tener **Promociones** activas asociadas
- Un Menú condiciona qué puede incluirse en una **Orden**
- Un Menú se analiza mediante **KPIs** de popularidad y margen por producto

### Ciclo de Vida

**En diseño** — Productos y precios en definición, no visible al cliente.

**Programado** — Aprobado con fecha de activación futura.

**Activo** — Vigente y ofrecido al cliente.

**Parcialmente suspendido** — Activo pero con productos marcados como no disponibles.

**En rotación** — Sustitución planificada por menú de temporada.

**Retirado** — Ya no se ofrece. Preservado para referencia histórica y análisis.

### Restricciones

- Un producto en el Menú activo debe tener precio definido.
- Un producto en el Menú activo debe tener vía de producción conocida (receta o abastecimiento directo).
- El Menú activo debe ser coherente con la capacidad de la **Cocina** y el **Inventario**.
- Cambios de Menú deben ser deliberados — afectan capacitación, compras y análisis histórico.

### Ejemplos

- Menú Principal de Tony Burgers Centro — 52 productos en 8 categorías, activo todo el día.
- Menú Desayuno — 18 productos, vigente 7:00–12:00.
- Menú Delivery Verano 2026 — 35 productos optimizados para transporte, activo junio–agosto.

### Errores Frecuentes

- Tratar copia impresa desactualizada como Menú vigente.
- No sincronizar Menú entre canales (salón vs. app de delivery).
- Incluir productos sin receta ni costo definido.
- Confundir lista de especiales del día con Menú completo.

### Knowledge Dependencies

Para razonar sobre Menú, el Cognitive Core debe conocer:

- **Restaurante** — a quién pertenece la oferta
- **Categoría** — cómo se estructura
- **Producto** — qué se ofrece
- **Configuración Operacional** — horarios y canales de vigencia
- **Inventario** y **Receta** — qué puede producirse realmente

### Cognitive Importance

★★★★★ **Fundamental**

El Menú es el puente entre promesa comercial y capacidad operativa. Sin Menú no hay catálogo autoritativo; sin catálogo no hay órdenes válidas ni análisis de oferta.

### Implicaciones para el Cognitive Core

La entidad Menú define el universo de lo vendible. Todo razonamiento sobre demanda, disponibilidad, ingeniería de oferta y cumplimiento de órdenes referencia el Menú como autoridad. Una orden que contiene producto fuera del Menú activo es una anomalía que requiere explicación.

---

## Categoría

### Definición

La **Categoría** es la entidad que agrupa productos del **Menú** bajo una clasificación funcional o experiencial: entradas, platos fuertes, postres, bebidas, combos. Organiza la oferta para facilitar la elección del cliente y el análisis gerencial.

**Qué no es:** La Categoría no es un producto. No es una estación de cocina — aunque pueden correlacionarse. No es una zona del salón. No es un departamento contable del negocio.

**Cómo existe en la operación:** La Categoría existe en la estructura del Menú. El mesero navega por categorías al tomar la orden. Los reportes de ventas se desglosan por categoría. Las decisiones de discontinuación o promoción operan a nivel de categoría o producto dentro de categoría.

### Propósito

Estructurar la oferta en grupos significativos que faciliten navegación, análisis y decisiones de mix comercial sin fragmentar cada producto como universo aislado.

### Identidad

La identidad de la Categoría no depende de los productos que contiene — productos entran y salen sin que la categoría deje de ser la misma. No depende de su posición en el menú impreso.

La identidad se establece por su designación dentro del Menú de un Restaurante: "Bebidas" en el Menú de Tony Burgers Centro es siempre la misma categoría aunque los productos cambien.

Lo que NO cambia la identidad: agregar o quitar productos, reordenar productos, cambiar descripción de la categoría.

Lo que SÍ crea entidad nueva: fusión de dos categorías en una nueva; división de una categoría en dos con identidades distintas.

### Atributos

#### Obligatorios

- Identificador único dentro del Menú
- Menú al que pertenece
- Nombre de la categoría
- Posición u orden de presentación
- Estado (activa, oculta, retirada)

#### Opcionales

- Descripción para el cliente
- Horario de disponibilidad propio
- Imagen o icono representativo
- Categoría padre (si es subcategoría)
- Restricciones de edad (bebidas alcohólicas)

### Relaciones

- Una Categoría pertenece a un **Menú**
- Una Categoría contiene **Productos**
- Una Categoría puede contener subcategorías (entidad derivada de Categoría)
- Una Categoría agrega **Ventas** e **Ingresos** de sus productos
- Una Categoría puede tener **Promociones** específicas

### Ciclo de Vida

**Definida** — Creada en estructura de menú, aún sin productos.

**Activa** — Visible al cliente con productos asignados.

**Oculta** — Existe pero no se muestra (temporada baja, reestructuración).

**En reestructuración** — Productos siendo movidos a otras categorías.

**Retirada** — Eliminada del menú activo. Histórica.

### Restricciones

- Todo producto del Menú debe pertenecer al menos a una Categoría.
- Una Categoría activa visible al cliente debe contener al menos un producto disponible o esperado.
- Categorías deben ser mutuamente comprensibles para el cliente del restaurante.
- Reclasificar productos entre categorías afecta comparabilidad histórica de reportes.

### Ejemplos

- Categoría "Hamburguesas" con 8 productos en Menú Principal.
- Categoría "Bebidas Alcohólicas" con restricción de edad y horario.
- Categoría "Especiales del Chef" rotada mensualmente.

### Errores Frecuentes

- Categorías demasiado amplias que ocultan patrones de venta.
- Duplicar producto en múltiples categorías sin reglas claras.
- Confundir categoría de menú con categoría de inventario de almacén.
- Categoría vacía visible al cliente.

### Knowledge Dependencies

Para razonar sobre Categoría, el Cognitive Core debe conocer:

- **Menú** — estructura padre
- **Producto** — miembros de la categoría
- **KPI** — desempeño agregado
- **Promoción** — campañas dirigidas a categoría

### Cognitive Importance

★★★☆☆ **Media**

La Categoría es estructura organizativa, no unidad transaccional. Su importancia crece en menús extensos y análisis de mix de ventas, pero el razonamiento core de órdenes opera a nivel de producto.

### Implicaciones para el Cognitive Core

La entidad Categoría habilita agregación: ventas por grupo, popularidad por segmento, decisiones de expansión o reducción de oferta por familia de productos. Sin categorías, el análisis de mix se fragmenta en cientos de productos aislados.

---

## Producto

### Definición

El **Producto** es la entidad que representa un bien ofrecido comercialmente por el restaurante: la unidad de oferta con identidad propia, precio, especificación de producción y presencia en el **Menú**. Es la abstracción comercial bajo la cual se venden platillos, bebidas, combos y adicionales catalogados.

**Qué no es:** El Producto no es un ingrediente — el ingrediente es insumo. No es un ítem de orden — el ítem de orden es la instancia del producto en una transacción específica. No es la receta — la receta es la especificación de producción. No es la categoría del menú.

**Cómo existe en la operación:** El Producto existe en el catálogo del restaurante independientemente de si alguien lo ordena hoy. "Hamburguesa Clásica" es un Producto que existía ayer, existe hoy y existirá mañana aunque nadie la pida. Su precio, disponibilidad y popularidad cambian; su identidad persiste.

### Propósito

Proporcionar la unidad comercial persistente sobre la cual se razona demanda, costos, disponibilidad, popularidad y rentabilidad. El Producto es el átomo de la oferta.

### Identidad

La identidad del Producto no depende de su nombre comercial — un renaming no crea producto nuevo si la organización define continuidad. No depende de su precio actual. No depende de su disponibilidad momentánea. No depende del número de veces que se ha vendido.

La identidad se establece por su designación única dentro del catálogo del Restaurante. "SKU conceptual" o código interno que distingue este producto de todos los demás.

Lo que NO cambia la identidad: cambio de precio, cambio de descripción, cambio de receta (mejora), suspensión temporal, cambio de categoría.

Lo que SÍ crea entidad nueva: producto genuinamente distinto aunque similar ("Hamburguesa Clásica" vs. "Hamburguesa Premium" son productos distintos si se comercializan como tales); reformulación que la organización trata como discontinuación y reemplazo.

### Atributos

#### Obligatorios

- Identificador único en el catálogo del Restaurante
- Nombre comercial
- Restaurante o cadena que lo define
- Tipo de producto (platillo, bebida, combo, adicional)
- Precio de venta vigente
- Categoría del Menú a la que pertenece
- Estado de ciclo de vida

#### Opcionales

- Descripción para el cliente
- Imagen de referencia
- Receta asociada
- Tiempos estándar de preparación
- Restricciones dietéticas y alérgenos
- Variantes y tamaños disponibles
- Costo teórico de producción
- Indicadores de popularidad histórica

### Relaciones

- Un Producto pertenece a una **Categoría** dentro de un **Menú**
- Un Producto pertenece a un **Restaurante** (o catálogo de cadena)
- Un Producto puede ser un **Platillo**, **Bebida** o **Combo**
- Un Producto utiliza **Ingredientes** a través de su **Receta**
- Un Producto aparece como **Ítem de Orden** en **Órdenes**
- Un Producto tiene **Precio** y genera **Venta** e **Ingreso**
- Un Producto puede estar sujeto a **Promociones** y **Descuentos**
- Un Producto depende de **Inventario** para su **disponibilidad**

### Ciclo de Vida

**En desarrollo** — Concepto en definición, sin presencia en menú activo.

**Aprobado** — Listo para inclusión en menú.

**Disponible** — En menú activo y producible.

**Suspendido temporalmente** — En menú pero marcado como no disponible (86).

**Agotado** — Sin inventario para producir; indisponible hasta reabastecimiento.

**Descontinuado** — Retirado del menú activo; no se ofrece.

**Archivado** — Solo referencia histórica; no retornará al menú.

### Restricciones

- Un Producto no puede existir sin pertenecer a un Restaurante o catálogo de organización.
- Un Producto en menú activo debe tener precio definido.
- Un Producto producido en cocina debe tener Receta o especificación equivalente.
- Un Producto combo debe definir explícitamente sus componentes.

### Ejemplos

- Producto "Hamburguesa Clásica" — platillo, $180, categoría Hamburguesas, disponible.
- Producto "Combo Familiar" — combo, $450, incluye 2 hamburguesas + 2 papas + 2 refrescos.
- Producto "Aguacate Extra" — adicional, $35, aplicable a hamburguesas.

### Errores Frecuentes

- Confundir Producto con Ítem de Orden — el producto persiste; el ítem es instancia transaccional.
- Tratar ingrediente como producto — la harina no es producto; el pan sí.
- Crear productos duplicados por variante que debería ser atributo del mismo producto.
- No archivar productos descontinuados — pierde trazabilidad histórica.

### Knowledge Dependencies

Para razonar sobre Producto, el Cognitive Core debe conocer:

- **Menú** y **Categoría** — dónde se ofrece
- **Receta** e **Ingrediente** — cómo se produce y a qué costo
- **Inventario** — si puede producirse ahora
- **Precio**, **Promoción**, **Descuento** — condiciones comerciales
- **Ítem de Orden** — instancias en transacciones

### Cognitive Importance

★★★★★ **Fundamental**

El Producto es la unidad comercial central. Demanda, margen, popularidad, disponibilidad y producción convergen en esta entidad.

### Implicaciones para el Cognitive Core

La entidad Producto constituye la unidad persistente sobre la cual el sistema razona acerca de qué se vende, qué se puede vender, qué cuesta producir y qué genera rentabilidad. Toda orden se descompone en productos; todo análisis de menú se agrega desde productos.

---

## Platillo

### Definición

El **Platillo** es la entidad que representa un **Producto** de naturaleza alimentaria preparada en **Cocina**: comida sólida o semisólida que requiere transformación culinaria antes de servirse. Es subtipo de Producto con características productivas específicas.

**Qué no es:** El Platillo no es una Bebida. No es un Ingrediente crudo. No es un Combo — aunque puede ser componente de uno. No es la porción servida en una orden específica — es la identidad del producto gastronómico.

**Cómo existe en la operación:** El Platillo existe en el catálogo como producto comercial con receta, estación asignada y flujo de producción. "Tacos al Pastor" es un Platillo con identidad propia, independiente de cuántas órdenes lo incluyan hoy.

### Propósito

Distinguir la oferta alimentaria preparada de otros tipos de producto para razonar correctamente sobre producción culinaria, estaciones, tiempos de preparación y consumo de inventario.

### Identidad

La identidad del Platillo hereda la identidad del Producto del cual es subtipo. Los mismos criterios aplican: código único, continuidad a través de cambios de precio y receta.

Lo que NO cambia la identidad: ajuste de sazón en receta, cambio de presentación, cambio de porción estándar.

Lo que SÍ crea entidad nueva: platillo genuinamente distinto comercializado como producto separado.

### Atributos

#### Obligatorios

- Todos los atributos obligatorios de **Producto**
- Receta de producción
- Estación o estaciones de preparación
- Tiempo estándar de preparación

#### Opcionales

- Temperatura de servicio
- Indicadores de picor, dieta, alérgenos
- Variantes (tamaño, proteína)
- Complementos incluidos
- Compatibilidad con modificaciones estándar

### Relaciones

- Un Platillo es un tipo de **Producto**
- Un Platillo se define por una **Receta**
- Un Platillo consume **Ingredientes** del **Inventario**
- Un Platillo se prepara en **Estación** de **Cocina**
- Un Platillo aparece en **Ítems de Orden**
- Un Platillo puede ser componente de un **Combo**

### Ciclo de Vida

Hereda los estados de **Producto**: En desarrollo → Disponible → Suspendido/Agotado → Descontinuado → Archivado.

Estados adicionales operativos:
**En preparación activa** — Órdenes pendientes en cocina (estado operativo del momento, no del platillo como entidad).

### Restricciones

- Todo Platillo debe tener Receta documentada o equivalente operativo.
- Platillo sin ingredientes disponibles debe marcarse como no disponible.
- Platillo debe asignarse a estación capaz de producirlo.

### Ejemplos

- Platillo "Ensalada César" — preparación en estación de fríos, 6 minutos.
- Platillo "Pasta Carbonara" — estación de pastas, 14 minutos.
- Platillo "Papas Fritas" — estación de freidora, complemento vendible independiente.

### Errores Frecuentes

- Incluir bebidas en análisis de platillos.
- Platillo sin receta actualizada tras cambio de proveedor.
- Confundir guarnición incluida sin precio con platillo independiente.
- No registrar modificaciones estándar que afectan producción.

### Knowledge Dependencies

Para razonar sobre Platillo, el Cognitive Core debe conocer:

- **Producto** — entidad padre
- **Receta** e **Ingrediente** — producción y costo
- **Estación** y **Cocina** — dónde y cómo se produce
- **Inventario** — disponibilidad
- **Ítem de Orden** — demanda actual

### Cognitive Importance

★★★★★ **Fundamental**

Los platillos son el núcleo de la propuesta gastronómica y el principal generador de complejidad en cocina e inventario.

### Implicaciones para el Cognitive Core

El Platillo activa razonamiento de producción culinaria: capacidad de estación, consumo de insumos, tiempos, merma en preparación y correlación con satisfacción sensorial del consumidor.

---

## Bebida

### Definición

La **Bebida** es la entidad que representa un **Producto** de naturaleza líquida destinado al consumo por ingestión: refrescos, jugos, cafés, cervezas, cocteles y cualquier líquido ofrecido comercialmente. Es subtipo de Producto con dinámicas de producción, inventario y margen distintas a los platillos.

**Qué no es:** La Bebida no es un Platillo. No es un ingrediente líquido usado en recetas sin venta directa (el aceite no es Bebida). No es el acto de servir líquido — es el producto ofrecido.

**Cómo existe en la operación:** La Bebida existe en el catálogo con identidad propia. Puede requerir preparación (coctel, café) o servirse directamente desde inventario (refresco embotellado). Su rentabilidad y rotación siguen patrones diferentes a los alimentos sólidos.

### Propósito

Separar la oferta líquida de la sólida para razonar correctamente sobre barra, inventario de embotellados, regulaciones de alcohol y márgenes típicos de bebidas.

### Identidad

La identidad de la Bebida hereda los criterios de **Producto**. "Coca-Cola 355ml" mantiene identidad aunque cambie proveedor o precio de compra.

Lo que NO cambia la identidad: cambio de proveedor de embotellado, cambio de precio, cambio de presentación de envase equivalente.

Lo que SÍ crea entidad nueva: bebida comercializada como producto distinto ("Coca-Cola" vs. "Coca-Cola Zero" son productos distintos).

### Atributos

#### Obligatorios

- Todos los atributos obligatorios de **Producto**
- Tipo de bebida (preparada, embotellada, barril)
- Volumen o tamaño estándar
- Vía de producción o servicio (barra, cocina, inventario directo)

#### Opcionales

- Contenido alcohólico
- Receta (para preparadas)
- Temperatura de servicio
- Opciones de tamaño
- Restricciones de edad

### Relaciones

- Una Bebida es un tipo de **Producto**
- Una Bebida puede tener **Receta** (preparadas) o provenir de **Inventario** directo
- Una Bebida se prepara en barra o **Estación** de bebidas
- Una Bebida puede ser componente de **Combo**
- Una Bebida aparece en **Ítems de Orden**

### Ciclo de Vida

Hereda estados de **Producto**. Bebidas estacionales siguen el mismo ciclo con vigencia temporal explícita.

### Restricciones

- Bebidas alcohólicas sujetas a regulaciones de edad y horario.
- Bebida preparada requiere estación o rol capacitado.
- Bebida embotellada depende de inventario de unidades completas.

### Ejemplos

- Bebida "Limonada Natural" — preparada, estación de barra, $45.
- Bebida "Corona 355ml" — embotellada, inventario directo, $55.
- Bebida "Margarita Clásica" — preparada con receta, restricción de edad.

### Errores Frecuentes

- Clasificar salsas o caldos como bebidas.
- No incluir bebidas en análisis de ticket promedio.
- Tratar refill gratuito como nueva bebida en cada servicio.
- Ignorar márgenes distintos entre embotellada y preparada.

### Knowledge Dependencies

- **Producto**, **Receta**, **Inventario**, **Estación**, **Ítem de Orden**

### Cognitive Importance

★★★★☆ **Alta**

Las bebidas contribuyen desproporcionadamente al margen y al ticket; su clasificación incorrecta distorsiona análisis financiero.

### Implicaciones para el Cognitive Core

La Bebida activa razonamiento de barra, inventario de embotellados, regulaciones, márgenes y upselling en servicio.

---

## Combo

### Definición

El **Combo** es la entidad que representa un **Producto** compuesto que agrupa dos o más productos bajo identidad comercial única y precio integrado. Es subtipo de Producto con estructura de componentes definida y lógica de descomposición operativa.

**Qué no es:** El Combo no es una orden con múltiples productos elegidos libremente. No es una promoción — la promoción modifica condiciones; el combo es producto con estructura fija. No es un platillo con guarnición incluida si no se comercializa como paquete independiente.

**Cómo existe en la operación:** El Combo existe en el menú como opción única. Al ordenarse, se descompone internamente en componentes para producción e inventario, pero se cobra y reporta como unidad comercial.

### Propósito

Capturar la lógica de empaquetado comercial que incentiva mayor ticket mediante valor percibido y venta cruzada estructurada.

### Identidad

La identidad del Combo es la del **Producto** compuesto. "Combo #3" es siempre el mismo combo aunque cambien precios de componentes individuales.

Lo que NO cambia la identidad: cambio de precio del combo, sustitución de componente equivalente autorizada.

Lo que SÍ crea entidad nueva: reestructuración de componentes que la organización trata como nuevo combo.

### Atributos

#### Obligatorios

- Todos los atributos obligatorios de **Producto**
- Lista de componentes con cantidades
- Precio integrado del combo
- Reglas de sustitución permitidas

#### Opcionales

- Ahorro declarado vs. compra separada
- Restricciones de modificaciones por componente
- Disponibilidad por canal
- Imagen de presentación del paquete

### Relaciones

- Un Combo es un tipo de **Producto**
- Un Combo contiene **Platillos**, **Bebidas** y/o complementos
- Un Combo aparece en **Ítems de Orden** como unidad y se descompone en producción
- Un Combo puede participar en **Promociones** adicionales
- Un Combo depende de disponibilidad de todos sus componentes obligatorios

### Ciclo de Vida

Hereda estados de **Producto**. Combo no disponible si cualquier componente obligatorio está agotado.

### Restricciones

- Todo combo debe definir componentes explícitamente.
- Margen del combo es calculado, no suma trivial de componentes.
- Sustituciones deben seguir reglas declaradas.

### Ejemplos

- Combo "Ejecutivo" — sopa + plato fuerte + agua, $165.
- Combo "Familiar" — 2 pizzas grandes + 2L refresco, $520.
- Combo descontinuado "Verano 2025" — archivado.

### Errores Frecuentes

- Reportar venta de combo sin descomponer impacto en inventario.
- Tratar descuento porcentual sobre orden como combo.
- No validar disponibilidad de todos los componentes.

### Knowledge Dependencies

- **Producto**, **Platillo**, **Bebida**, **Inventario**, **Ítem de Orden**, **Promoción**

### Cognitive Importance

★★★★☆ **Alta**

Los combos influyen en ticket promedio y mix de productos; su descomposición incorrecta distorsiona inventario y márgenes.

### Implicaciones para el Cognitive Core

El Combo requiere razonamiento dual: identidad comercial única y descomposición operativa en componentes para producción, costo y disponibilidad.

---

## Ingrediente

### Definición

El **Ingrediente** es la entidad que representa la materia prima o componente semi-transformado que se consume en la producción de productos del restaurante. Es insumo, no oferta directa al cliente (salvo venta explícita como producto).

**Qué no es:** El Ingrediente no es un Producto terminado del menú. No es equipo de cocina. No es empaque. No es la Receta — es lo que la receta consume.

**Cómo existe en la operación:** El Ingrediente existe en el catálogo de insumos del restaurante con unidad de medida, costo y condiciones de almacenamiento. "Pechuga de pollo" es un Ingrediente con identidad persistente a través de compras, consumos y ajustes de inventario.

### Propósito

Conectar oferta comercial con realidad de insumos. Sin Ingrediente como entidad, no hay trazabilidad de costos, disponibilidad ni abastecimiento.

### Identidad

La identidad del Ingrediente no depende del lote de compra. No depende del proveedor actual — aunque cambiar proveedor puede cambiar atributos de calidad. No depende de la cantidad en inventario.

La identidad se establece por designación única en el catálogo de insumos del Restaurante o cadena.

Lo que NO cambia la identidad: cambio de proveedor, cambio de costo unitario, cambio de presentación de compra (caja vs. kilo).

Lo que SÍ crea entidad nueva: insumo genuinamente distinto ("Tomate saladette" vs. "Tomate cherry" si se gestionan por separado).

### Atributos

#### Obligatorios

- Identificador único en catálogo de insumos
- Nombre del ingrediente
- Unidad de medida operativa
- Restaurante o cadena que lo cataloga
- Condición de almacenamiento (seco, refrigerado, congelado)

#### Opcionales

- Costo unitario vigente
- Proveedor principal
- Vida útil o días de caducidad
- Alérgeno asociado
- Ingredientes sustitutos aceptados
- Nivel mínimo de reorden

### Relaciones

- Un Ingrediente se lista en **Recetas** con cantidades
- Un Ingrediente existe en **Inventario**
- Un Ingrediente se repone mediante **Proveedor** y **Movimiento de Inventario**
- Un Ingrediente bloquea **Productos** cuando está agotado
- Un Ingrediente genera **Merma** al manipularse

### Ciclo de Vida

**Catalogado** — Definido en sistema de insumos, sin stock.

**Activo** — En uso con stock o rotación regular.

**En revisión** — Evaluación de sustitución o cambio de proveedor.

**Descontinuado** — Ya no se compra ni usa en recetas activas.

**Archivado** — Solo referencia histórica.

### Restricciones

- Ingrediente en receta activa debe estar catalogado.
- Ingrediente perecedero requiere gestión de caducidad.
- Ingrediente agotado puede bloquear múltiples productos simultáneamente.

### Ejemplos

- Ingrediente "Pechuga de pollo" — refrigerado, unidad kg, proveedor principal Avícola Norte.
- Ingrediente "Aceite de oliva" — seco, unidad litro, usado en 14 recetas.
- Ingrediente descontinuado "Margarina X" — sustituida por mantequilla.

### Errores Frecuentes

- Confundir ingrediente con producto terminado.
- No descontar consumo al producir.
- Ignorar merma en gestión de ingrediente.
- Mismo ingrediente con múltiples identidades por error de catalogación.

### Knowledge Dependencies

- **Receta**, **Inventario**, **Movimiento de Inventario**, **Proveedor**, **Producto**

### Cognitive Importance

★★★★★ **Fundamental**

El Ingrediente es el nodo central entre menú e inventario. Toda disponibilidad y costo variable se deriva de ingredientes.

### Implicaciones para el Cognitive Core

El Ingrediente habilita razonamiento de costo teórico, disponibilidad de productos, reorden, merma y predicción de agotamiento.

---

## Receta

### Definición

La **Receta** es la entidad que representa la especificación completa de cómo producir un **Producto**: ingredientes con cantidades, pasos de preparación, tiempos, temperaturas, rendimiento esperado e instrucciones de presentación. Es el puente entre oferta comercial y ejecución en cocina.

**Qué no es:** La Receta no es el Menú. No es el Producto — aunque está vinculada a uno o más. No es la improvisación del cocinero. No es un proceso genérico sin especificación.

**Cómo existe en la operación:** La Receta existe como conocimiento codificado del restaurante. Puede estar documentada formalmente o transmitida operativamente, pero es la referencia que hace reproducible la producción de un producto.

### Propósito

Codificar conocimiento de producción para garantizar consistencia, calcular costos y planificar operaciones. La Receta es la fuente de verdad de cómo se hace cada producto producido.

### Identidad

La identidad de la Receta está vinculada al Producto que produce. La "Receta de Tacos al Pastor" es la misma entidad aunque se ajusten cantidades menores.

Lo que NO cambia la identidad: ajuste de sazón, optimización de paso, actualización de costo por cambio de precio de ingrediente.

Lo que SÍ crea entidad nueva: reformulación que produce producto distinto; receta de variante con identidad propia.

### Atributos

#### Obligatorios

- Identificador único
- Producto(s) que produce
- Lista de ingredientes con cantidades y unidades
- Rendimiento esperado (porciones, peso, volumen)
- Pasos de preparación

#### Opcionales

- Tiempos por paso
- Temperaturas de cocción
- Estación de ejecución
- Instrucciones de presentación
- Sub-recetas referenciadas
- Tolerancias de modificaciones
- Costo teórico calculado

### Relaciones

- Una Receta produce uno o más **Productos**
- Una Receta consume **Ingredientes**
- Una Receta se ejecuta en **Estación** de **Cocina**
- Una Receta determina **costo** teórico del producto
- Una Receta define **tiempo de preparación** estándar

### Ciclo de Vida

**Borrador** — En desarrollo culinario.

**Aprobada** — Validada para producción.

**Activa** — En uso operativo.

**En revisión** — Ajustes en evaluación.

**Reemplazada** — Sustituida por nueva versión; histórica.

**Retirada** — Producto descontinuado; receta archivada.

### Restricciones

- Producto producido en cocina debe tener Receta activa o equivalente.
- Receta sin ingredientes catalogados no permite cálculo de costo confiable.
- Modificaciones frecuentes no documentadas degradan la receta como referencia.

### Ejemplos

- Receta "Tacos al Pastor" — 3 piezas, 8 ingredientes, 12 minutos, estación de tacos.
- Receta "Salsa del Día" — sub-receta usada por 6 platillos, producción en lote.
- Receta reemplazada "Pasta Carbonara v1" — archivada tras reformulación.

### Errores Frecuentes

- Calcular costo sin incluir todos los ingredientes.
- Tratar descripción de menú como receta.
- No actualizar receta tras cambio de proveedor.
- Ignorar sub-recetas en costo del platillo.

### Knowledge Dependencies

- **Producto**, **Ingrediente**, **Estación**, **Cocina**, **Inventario**, **Movimiento de Inventario**

### Cognitive Importance

★★★★★ **Fundamental**

La Receta conecta oferta con costo, producción e inventario. Sin ella, el producto es promesa comercial sin sustancia operativa.

### Implicaciones para el Cognitive Core

La Receta habilita razonamiento de costo teórico, consumo por orden, tiempo de producción, sustitución de ingredientes y desviación por modificaciones.

---

## Promoción

### Definición

La **Promoción** es la entidad que representa un acuerdo comercial temporal con condiciones especiales que modifican la venta normal: precios reducidos, productos incluidos, restricciones de tiempo, canal o elegibilidad. Es construcción comercial con vigencia, no producto.

**Qué no es:** La Promoción no es un Producto. No es el precio permanente. No es un Descuento aplicado ad hoc sin estructura. No es fidelización en sí — aunque puede integrarse.

**Cómo existe en la operación:** La Promoción existe como campaña definida: "2x1 en tacos los miércoles", "envío gratis en pedidos mayores a $300". Tiene inicio, fin y reglas de elegibilidad. Modifica cómo se calcula el precio de órdenes elegibles.

### Propósito

Nombrar condiciones comerciales excepcionales que el restaurante activa para mover demanda, liquidar inventario o competir, distinguibles del precio regular.

### Identidad

La identidad de la Promoción no depende del número de órdenes que la usaron. No depende de su efectividad en ventas.

La identidad se establece por designación única de campaña: "Promo Verano 2026" es distinta de "Promo Verano 2025".

Lo que NO cambia la identidad: extensión de vigencia, ajuste de condiciones menores.

Lo que SÍ crea entidad nueva: campaña con reglas y nombre distintos.

### Atributos

#### Obligatorios

- Identificador único de promoción
- Nombre o descripción de la campaña
- Tipo de beneficio (precio especial, 2x1, producto gratis, envío gratis)
- Vigencia (inicio y fin)
- Productos, categorías u órdenes elegibles
- Estado (programada, activa, expirada, cancelada)

#### Opcionales

- Canales aplicables
- Horarios específicos (happy hour)
- Monto mínimo de orden
- Límite de usos por cliente
- Acumulabilidad con otras promociones
- Impacto presupuestado en margen

### Relaciones

- Una Promoción afecta **Productos**, **Combos** u **Órdenes**
- Una Promoción opera dentro de **Canales** y **horarios**
- Una Promoción puede vincularse a **Clientes** en **fidelización**
- Una Promoción modifica el **Ticket** final
- Una Promoción se mide en **KPIs** de efectividad

### Ciclo de Vida

**Diseñada** — En planificación.

**Programada** — Aprobada con fecha de inicio futura.

**Activa** — Aplicándose a órdenes elegibles.

**Pausada** — Temporalmente suspendida.

**Expirada** — Fin de vigencia alcanzado.

**Cancelada** — Terminada antes de fin planificado.

### Restricciones

- Promoción activa no convierte un producto en otro.
- Reglas de acumulación deben ser explícitas.
- Promoción fuera de vigencia no debe aplicarse.
- Promoción debe ser sostenible o deliberadamente subsidiada.

### Ejemplos

- Promoción "Miércoles 2x1 Tacos" — activa miércoles, categoría tacos.
- Promoción "Envío Gratis $300+" — solo delivery, activa todo el mes.
- Promoción expirada "Navidad 2025" — histórica.

### Errores Frecuentes

- Precio permanente reducido registrado como promoción.
- Aplicar promoción expirada por error.
- No separar ventas promocionales en análisis de margen.
- Confundir cupón de cliente con promoción del restaurante.

### Knowledge Dependencies

- **Producto**, **Combo**, **Orden**, **Ticket**, **Canal**, **Cliente**, **Configuración Operacional**

### Cognitive Importance

★★★★☆ **Alta**

Las promociones modifican precio efectivo y margen; ignorarlas distorsiona ingresos y rentabilidad.

### Implicaciones para el Cognitive Core

La Promoción activa razonamiento temporal, de elegibilidad y de margen efectivo. El sistema debe distinguir precio de lista de precio cobrado.

---

## Descuento

### Definición

El **Descuento** es la entidad que representa la reducción aplicada al monto de una **Orden** o **Ticket** respecto al precio de lista: porcentaje o monto fijo restado del total o de líneas específicas. Es la materialización de un beneficio económico en una transacción concreta.

**Qué no es:** El Descuento no es una Promoción — la promoción define las reglas; el descuento es la aplicación en una transacción. No es propina (flujo inverso). No es error de cobro. No es merma.

**Cómo existe en la operación:** El Descuento existe como línea o ajuste en un ticket específico: "10% por empleado", "$50 compensación por reclamación", "descuento de fidelización". Cada instancia está vinculada a una transacción.

### Propósito

Registrar y explicar por qué el monto cobrado difiere del precio de lista. Sin Descuento como entidad, la brecha entre venta bruta y neta es opaca.

### Identidad

Cada instancia de Descuento es única por su vinculación a un Ticket u Orden específica. "Descuento de $30 en ticket #8821" es una entidad de aplicación, distinta del "Descuento de $45 en ticket #8822".

El tipo de descuento (empleado, compensación, promocional) es categoría; cada aplicación es instancia.

Lo que NO cambia la identidad de una instancia: corrección de monto por error de captura (es la misma intención de descuento).

Lo que SÍ crea nueva instancia: cada aplicación en transacción distinta.

### Atributos

#### Obligatorios

- Identificador de la instancia
- Ticket u Orden a la que se aplica
- Tipo de descuento (promocional, compensación, empleado, fidelización)
- Monto o porcentaje aplicado
- Autorización según política

#### Opcionales

- Promoción que lo origina
- Empleado que lo autorizó
- Reclamación que lo motivó
- Justificación o nota
- Líneas específicas afectadas

### Relaciones

- Un Descuento se aplica a un **Ticket** u **Orden**
- Un Descuento puede originarse de una **Promoción**
- Un Descuento puede originarse de una **Reclamación**
- Un Descuento reduce **Ingresos** netos
- Un Descuento requiere **permiso** según **Rol**

### Ciclo de Vida

**Solicitado** — Propuesto, pendiente de autorización.

**Autorizado** — Aprobado según política.

**Aplicado** — Reflejado en ticket.

**Revertido** — Cancelado por corrección.

### Restricciones

- Descuento fuera de permiso del rol requiere escalamiento.
- Descuento debe quedar trazado en ticket.
- Descuentos acumulados no deben violar política de configuración operacional.

### Ejemplos

- Descuento 15% en ticket #4521 — promoción "Miércoles 2x1" aplicada parcialmente.
- Descuento $80 en ticket #4522 — compensación por reclamación de orden fría.
- Descuento 10% — beneficio empleado, autorizado por gerente.

### Errores Frecuentes

- Descuento sin registro en ticket.
- Confundir descuento con precio de lista promocional.
- No vincular descuento a promoción o reclamación origen.
- Descuentos recurrentes no analizados como patrón.

### Knowledge Dependencies

- **Ticket**, **Orden**, **Promoción**, **Reclamación**, **Rol**, **Configuración Operacional**

### Cognitive Importance

★★★★☆ **Alta**

Los descuentos explican la brecha entre venta bruta y neta; sin ellos, el margen aparente es ficticio.

### Implicaciones para el Cognitive Core

El Descuento permite reconciliar precio de lista con ingreso real, atribuir erosiones de margen y detectar abuso o políticas ineficaces.

---

## PARTE III — TRANSACCIÓN

Las entidades de transacción materializan el acuerdo comercial entre cliente y restaurante: qué se pide, qué se produce, qué se entrega y qué se cobra. Esta parte distingue con rigor tres capas que no deben confundirse:

| Entidad | Dimensión | Pregunta que responde |
| :--- | :--- | :--- |
| **Orden** | Operativa | ¿Qué se pidió y qué debe producirse y entregarse? |
| **Ticket** | Económica | ¿Cuánto se debe cobrar y por qué conceptos? |
| **Pago** | Liquidación | ¿Qué dinero se recibió efectivamente y con qué método? |

El **Ítem de Orden** descompone la orden en líneas rastreables, distintas del **Producto** del catálogo. El **Método de Pago** es entidad de referencia; el **Pago** es la instancia concreta de cobro.

---

## Orden

### Definición

La **Orden** es la entidad que representa el acuerdo comercial vigente entre el restaurante y un solicitante sobre qué productos se solicitan, en qué cantidad, con qué modificaciones, bajo qué condiciones de servicio y en qué canal. Es el origen de toda actividad productiva y de servicio posterior.

**Qué no es:** La Orden no es el **Ticket** — el ticket documenta el aspecto económico de cobro y puede generarse, dividirse o cerrarse en momentos distintos. No es el **Pago** — el pago liquida dinero; la orden puede existir antes, durante y después del cobro. No es la **Comanda** — la comanda es el instrumento de comunicación hacia cocina. No es la **Entrega** — la entrega es el acto de transferir producto; la orden persiste como registro del compromiso.

**Cómo existe en la operación:** La Orden existe desde el momento en que alguien solicita productos válidos del menú hasta que se considera cumplida, cancelada o cerrada operativamente. Un mesero la abre en mesa, un cliente la crea en app de delivery, un cajero la registra en mostrador de pickup. Cocina la produce. Servicio o logística la entrega. Caja la asocia a uno o más tickets. La Orden #4521 sigue siendo la misma orden aunque pase de "recibida" a "entregada", con ticket pendiente o pagado.

### Propósito

Formalizar el compromiso de producción y entrega que gobierna la operación. Sin Orden no hay qué preparar, qué empaquetar, qué servir, qué evaluar en satisfacción ni qué vincular a reclamaciones. La Orden es la unidad de trabajo que articula oferta, producción y servicio.

### Identidad

La identidad de la Orden no depende de su estado actual — una orden en preparación es la misma que cuando fue recibida. No depende del mesero que la tomó ni del cocinero que la preparó. No depende de si ya fue pagada o no.

La identidad se establece por su designación única dentro del **Restaurante** en un contexto operativo (turno, fecha de negocio o numeración continua). Dos solicitudes distintas del mismo cliente en la misma visita son dos órdenes distintas. Una modificación sustancial que reinicia el compromiso puede generar orden nueva según política del negocio.

Lo que NO cambia la identidad: cambio de estado, adición de ítems antes de iniciar producción, reasignación de mesero, cambio de estimado de tiempo.

Lo que SÍ puede crear orden nueva: cancelación total seguida de nueva solicitud independiente; división operativa explícita en dos compromisos de producción separados.

### Atributos

#### Obligatorios

- Identificador único de orden dentro del Restaurante
- Restaurante donde se origina
- Fecha y hora de creación
- Estado operativo (recibida, confirmada, en preparación, parcialmente lista, lista, en entrega, entregada, cancelada, cerrada)
- Al menos un **Ítem de Orden** válido
- **Canal** de servicio (salón, **Pickup**, **Delivery** u otro habilitado)
- Responsable de captura (mesero, cajero, sistema de pedidos)

#### Opcionales

- **Cliente** identificado o referencia anónima
- **Mesa** asociada (cuando aplica en salón)
- **Reserva** vinculada (cuando el cliente llega con reservación)
- Hora estimada de entrega o lista para recoger
- Instrucciones especiales de servicio o entrega
- Prioridad operativa (rush, cortesía, compensación)
- Referencia externa (plataforma de delivery, número de pedido agregador)
- Notas internas para cocina o servicio

### Relaciones

- Una Orden pertenece a un **Restaurante**
- Una Orden se compone de uno o más **Ítems de Orden**
- Una Orden se origina en un **Canal** (**Delivery**, **Pickup**, salón)
- Una Orden puede asociarse a un **Cliente**, una **Mesa** o una **Reserva**
- Una Orden genera comandas hacia **Cocina** y **Estaciones**
- Una Orden puede tener uno o más **Tickets** asociados
- Una Orden recibe uno o más **Pagos** que liquidan sus tickets
- Una Orden opera bajo **Configuración Operacional** y **Promociones** vigentes
- Una Orden puede originar **Reclamaciones** y alimentar **KPIs** de tiempo y cumplimiento

### Ciclo de Vida

**Borrador** — Solicitud iniciada pero no confirmada (carrito, pre-captura).

**Recibida** — Orden confirmada y aceptada por el restaurante.

**En preparación** — Al menos un ítem está en producción en cocina.

**Parcialmente lista** — Algunos ítems terminados, otros en curso.

**Lista** — Todos los ítems producidos; pendiente de entrega o recogida.

**En entrega** — Producto en tránsito o en camino a mesa (según canal).

**Entregada** — Producto transferido al cliente o consumidor autorizado.

**Cerrada** — Orden cumplida operativamente; ciclo de servicio concluido.

**Cancelada** — Compromiso de producción detenido antes de completarse; puede tener implicaciones económicas según política.

### Restricciones

- Una Orden debe contener al menos un ítem correspondiente a **Producto** o **Combo** disponible en el **Menú** vigente.
- Una Orden no puede iniciar producción sin canal definido.
- Modificaciones después de iniciar producción generan riesgo operativo y deben trazarse.
- Una Orden cancelada deja de generar obligación de producción pero puede mantener obligación de cobro según política.
- Una Orden en salón debe asociarse a **Mesa** o política explícita de mostrador/barra.
- Una Orden de **Delivery** requiere destino de entrega válido dentro de **Zona** habilitada.
- El cierre operativo de la Orden no implica automáticamente cobro completo — eso depende del **Ticket** y los **Pagos**.

### Ejemplos

- Orden #4521 — Mesa 12, 2 hamburguesas clásicas, 1 papas grandes, 3 refrescos, estado: en preparación.
- Orden #4522 — Delivery, dirección Colonia Centro, combo familiar, ticket abierto, pago pendiente.
- Orden #4523 — Pickup, cliente recogerá en 18 minutos, 1 ensalada y 2 aguas, pagada anticipadamente.
- Orden #4500 — Cancelada tras 8 minutos; cocina no había iniciado proteína.

### Errores Frecuentes

- Confundir Orden con **Ticket** y reportar ventas al abrir la orden en lugar de al cobrar.
- Tratar el **Pago** como sinónimo de Orden cerrada — una orden puede entregarse con ticket pendiente.
- No registrar modificaciones en la Orden y transmitir solo al producto genérico del menú.
- Abrir orden sin canal — imposibilita enrutar producción, empaque y promesa de tiempo.
- Cerrar orden sin verificar entrega completa de todos los **Ítems de Orden**.
- Duplicar órdenes al dividir cuenta sin claridad de compromiso de producción.

### Knowledge Dependencies

Para razonar sobre Orden, el Cognitive Core debe conocer:

- **Ítem de Orden** — composición de la solicitud
- **Producto**, **Combo**, **Menú** y **Disponibilidad** — validez de lo pedido
- **Canal**, **Mesa**, **Cliente** — contexto de servicio
- **Ticket** y **Pago** — dimensión económica separada
- **Configuración Operacional** — reglas de modificación, cancelación y autorización
- **Cocina** y tiempos de preparación — capacidad y cumplimiento

### Cognitive Importance

★★★★★ **Fundamental**

La Orden es la unidad de trabajo operativo del restaurante. Todo flujo productivo, de servicio y de satisfacción se ancla a ella. Confundirla con ticket o pago destruye la trazabilidad entre lo pedido, lo producido, lo entregado y lo cobrado.

### Implicaciones para el Cognitive Core

La entidad Orden habilita razonamiento sobre cumplimiento, tiempos de servicio, carga de cocina, errores de comunicación y satisfacción atribuible. El sistema debe mantener la Orden como eje operativo independiente del estado de cobro. Preguntas como "¿está lista la orden 4521?" y "¿está pagada la orden 4521?" son distintas y deben resolverse por entidades distintas.

---

## Ítem de Orden

### Definición

El **Ítem de Orden** es la entidad que representa una línea individual dentro de una **Orden**: una instancia solicitada de un **Producto** o **Combo** con cantidad, modificaciones, precio aplicado en el momento de la captura y estado propio de cumplimiento. Es la unidad atómica del compromiso comercial-operativo.

**Qué no es:** El Ítem de Orden no es el **Producto** del catálogo — el producto es la definición reutilizable en el menú; el ítem es la ocurrencia concreta en una orden específica. No es una **Receta** ni un **Ingrediente** — describe qué se vende y produce, no cómo se compone internamente salvo por modificaciones declaradas. No es una línea del **Ticket** aunque se refleje en él — el ticket agrupa aspecto económico; el ítem gobierna producción y entrega.

**Cómo existe en la operación:** Cada vez que se agrega "2× Hamburguesa Clásica, una sin cebolla, con extra queso" a una orden, nace un ítem de orden con identidad propia dentro de esa orden. Cocina puede marcarlo en preparación, listo o cancelado independientemente de otros ítems de la misma orden. Una orden con cinco ítems puede tener tres entregados y dos en cocina.

### Propósito

Descomponer la Orden en unidades rastreables de producción, entrega y reclamación. Sin Ítem de Orden, la operación solo ve un bloque indivisible y no puede manejar entregas parciales, cancelaciones selectivas ni discrepancias producto a producto.

### Identidad

La identidad del Ítem de Orden no depende del producto del menú en abstracto — depende de su posición como línea única dentro de una **Orden** específica. No se fusiona con otro ítem aunque pida el mismo producto con las mismas modificaciones: dos líneas "Hamburguesa Clásica sin cebolla" en la misma orden son dos ítems distintos si se capturaron por separado.

La identidad se establece por su identificador dentro de la orden o por su ordinal inmutable una vez confirmado. Si un ítem se cancela y se vuelve a agregar, según política puede ser ítem nuevo con nueva identidad.

Lo que NO cambia la identidad: cambio de estado de preparación, ajuste de precio por promoción aplicada retroactivamente antes de cierre, corrección de impresión de comanda.

Lo que SÍ crea ítem nuevo: nueva línea agregada a la orden; reemplazo explícito de ítem cancelado por política de re-captura.

### Atributos

#### Obligatorios

- Identificador dentro de la **Orden** madre
- Orden a la que pertenece
- Referencia al **Producto** o **Combo** solicitado
- Cantidad
- Precio unitario aplicado al momento de captura
- Estado del ítem (pendiente, en preparación, listo, entregado, cancelado)
- Nombre o descripción operativa legible para cocina y servicio

#### Opcionales

- **Modificaciones** (sin ingrediente, extra, sustitución)
- **Adicionales** y **Complementos** elegidos
- **Variante** o **Tamaño** seleccionado
- Notas de preparación específicas
- Estación o ruta de producción asignada
- Motivo de cancelación
- Descuento o promoción aplicada a nivel de línea
- Relación a ítem padre (cuando un **Combo** se descompone en sub-ítems)

### Relaciones

- Un Ítem de Orden pertenece a una **Orden**
- Un Ítem de Orden referencia un **Producto** o **Combo** del **Menú**
- Un Ítem de Orden puede incluir **Modificaciones**, **Adicionales** y **Extras**
- Un Ítem de Orden genera instrucciones en comanda hacia **Cocina** o **Estación**
- Un Ítem de Orden se refleja en línea de **Ticket** al cobrar
- Un Ítem de Orden puede ser objeto de **Reclamación** específica
- Un Ítem de Orden consume capacidad de preparación según **Receta** del producto

### Ciclo de Vida

**Pendiente** — Capturado en la orden, aún no enviado a producción.

**Enviado a cocina** — Comunicado a estación; en cola o preparación.

**En preparación** — En ejecución activa en cocina o barra.

**Listo** — Producción terminada; esperando entrega o recogida.

**Entregado** — Transferido al cliente o empaquetado para salida según canal.

**Cancelado** — Ya no debe producirse ni entregarse; puede requerir comunicación urgente a cocina.

### Restricciones

- Todo Ítem de Orden debe referenciar un producto o combo válido y disponible al momento de captura.
- Las modificaciones deben ser compatibles con el producto según política del menú.
- Un ítem cancelado después de iniciar preparación puede generar **Merma** — debe registrarse.
- La cantidad debe ser positiva; cantidad cero elimina el ítem.
- Ítems de combo pueden tener restricciones de descomposición para producción.
- El precio del ítem debe ser coherente con **Precio**, **Promoción** y **Canal** vigentes.

### Ejemplos

- Ítem #3 de Orden #4521 — 1× Hamburguesa Clásica, sin cebolla, extra queso, estado: en preparación.
- Ítem #1 de Orden #4522 — 1× Combo Familiar descompuesto en sub-ítems de producción.
- Ítem #2 de Orden #4523 — 2× Agua embotellada, estado: listo en mostrador pickup.
- Ítem cancelado — Ensalada César de Orden #4510, cancelado antes de envío a cocina.

### Errores Frecuentes

- Confundir Ítem de Orden con **Producto** y perder trazabilidad de modificaciones en una visita específica.
- No cancelar ítem en cocina cuando el cliente lo elimina — produce merma y reclamación.
- Agregar el mismo producto dos veces en una sola línea cuando las modificaciones difieren — debe ser ítem separado.
- Reflejar en ticket un ítem distinto al entregado por no actualizar la línea.
- Ignorar estado parcial de ítems y marcar orden completa prematuramente.

### Knowledge Dependencies

Para razonar sobre Ítem de Orden, el Cognitive Core debe conocer:

- **Orden** — contenedor del ítem
- **Producto**, **Combo**, **Modificación** y **Disponibilidad**
- **Receta** y **Estación** — implicaciones de producción
- **Ticket** — reflejo económico de la línea
- **Canal** — afecta presentación, empaque y elegibilidad
- **Promoción** y **Descuento** — precio efectivo por línea

### Cognitive Importance

★★★★★ **Fundamental**

El Ítem de Orden es el puente entre catálogo y operación concreta. Permite granularidad en producción, entregas parciales, reclamaciones precisas y análisis de mix de ventas por ocurrencia real, no solo por producto abstracto.

### Implicaciones para el Cognitive Core

El sistema debe razonar a nivel de línea cuando evalúa cumplimiento: "¿falta algo de la orden?" se responde ítem por ítem. Debe distinguir "el producto Hamburguesa Clásica existe en el menú" de "este ítem específico lleva sin cebolla y extra queso en la orden 4521". La agregación de ítems forma la Orden; la descomposición de productos combo forma sub-ítems con reglas propias.

---

## Ticket

### Definición

El **Ticket** es la entidad que representa el documento económico de cobro asociado a una o más **Órdenes**: el registro formal de qué se debe cobrar, con desglose de líneas, precios efectivos, descuentos, impuestos, cargos y total a pagar. Expresa la obligación económica, no el cumplimiento operativo ni la recepción de dinero.

**Qué no es:** El Ticket no es la **Orden** — la orden dice qué producir y entregar; el ticket dice qué cobrar. Puede abrirse mientras la orden sigue en preparación o cerrarse antes del pago. No es el **Pago** — el pago liquida el ticket; un ticket cerrado puede permanecer pendiente de pago. No es factura fiscal en jurisdicciones donde se distingue. No es propina al personal salvo que el modelo la incorpore explícitamente al documento.

**Cómo existe en la operación:** El Ticket existe como cuenta corriendo en salón, precuenta antes del cobro, o documento de cierre en pickup y delivery. El cajero cobra según ticket, no según orden directamente. El ticket puede imprimirse, mostrarse en pantalla o enviarse digitalmente. Ticket #T-8821 de la Orden #4521 documenta $485 a pagar aunque el pago ocurra minutos después por tarjeta.

### Propósito

Documentar con trazabilidad el aspecto económico de la transacción: qué líneas se cobran, a qué precio, con qué descuentos y cuál es el total adeudado. El Ticket es la evidencia de la venta para conciliación, reportes de ingresos y resolución de reclamaciones económicas.

### Identidad

La identidad del Ticket no depende de si ya fue pagado — un ticket pendiente sigue siendo el mismo ticket. No depende del método de pago utilizado eventualmente.

La identidad se establece por identificador único de ticket dentro del **Restaurante**. Un ticket principal puede vincularse a una orden; la división de cuenta (split) genera tickets hijos o tickets separados según política, cada uno con identidad propia.

Lo que NO cambia la identidad: aplicar descuento autorizado; agregar líneas mientras está abierto; cambio de estado de cobro de pendiente a pagado.

Lo que SÍ crea entidad nueva: split de cuenta en dos tickets independientes; reemisión tras anulación total del ticket original.

### Atributos

#### Obligatorios

- Identificador único de ticket
- **Restaurante** emisor
- **Orden** o conjunto de órdenes asociadas
- Líneas económicas derivadas de **Ítems de Orden** (producto, cantidad, precio unitario, subtotal)
- Subtotal antes de descuentos e impuestos
- Total a pagar
- Estado de cobro (abierto, cerrado, parcialmente pagado, pagado, anulado)
- Fecha y hora de emisión o apertura

#### Opcionales

- **Descuentos** y **Promociones** aplicadas con referencia
- Impuestos y cargos desglosados
- Propina sugerida, declarada o incluida
- Saldo pendiente tras pagos parciales
- **Empleado** cajero responsable del cierre
- Hora de cierre del ticket
- Motivo de anulación
- Vinculación a **Cliente** o comprador identificado
- Relación a ticket padre (en splits)

### Relaciones

- Un Ticket deriva de una o más **Órdenes**
- Un Ticket refleja **Ítems de Orden** con precios efectivos
- Un Ticket aplica **Descuentos** y **Promociones** según política
- Un Ticket es satisfecho por uno o más **Pagos**
- Un Ticket puede registrar múltiples **Métodos de Pago** si hay split
- Un Ticket lo procesa un **Empleado** con rol de cajero
- Un Ticket alimenta medición de ventas e ingresos al completarse el cobro
- Un Ticket puede originar **Reclamaciones** económicas

### Ciclo de Vida

**Abierto** — Cuenta corriendo; admite nuevas líneas mientras la orden lo permita.

**Cerrado** — Total definido; listo para cobro; no admite líneas sin reapertura autorizada.

**Parcialmente pagado** — Uno o más pagos aplicados; saldo pendiente.

**Pagado** — Obligación económica totalmente satisfecha.

**Anulado** — Invalidado con justificación; no representa cobro válido.

### Restricciones

- El Ticket debe coincidir con productos entregados o comprometidos según política, salvo ajuste documentado.
- Los descuentos en ticket requieren autorización según **Configuración Operacional**.
- Dividir ticket (split) divide el cobro, no necesariamente la **Orden** de producción.
- Ticket pagado cierra la obligación económica principal del documento.
- No confundir ticket cerrado con ingreso realizado — requiere **Pago** completado.
- Ticket anulado no debe contarse como venta efectiva.

### Ejemplos

- Ticket #T-8821 — Orden #4521, subtotal $420, descuento $35, total $485, estado: cerrado, pendiente de pago.
- Ticket #T-8821-P1 y #T-8821-P2 — cuenta dividida entre dos comensales de la misma mesa.
- Ticket con promoción "2x1" — líneas muestran precio de lista y descuento explícito.
- Ticket anulado y reemitido por error de captura de ítem.

### Errores Frecuentes

- Ticket no coincide con lo consumido o entregado — fuente principal de reclamaciones.
- Reportar ingresos al emitir ticket en lugar de al confirmar **Pago**.
- No reflejar promoción activa en las líneas del ticket.
- Split de ticket sin claridad de quién paga qué parte.
- Confundir ticket pendiente de delivery prepagado con ticket ya liquidado.
- Anular ticket sin reversar pagos asociados.

### Knowledge Dependencies

Para razonar sobre Ticket, el Cognitive Core debe conocer:

- **Orden** e **Ítem de Orden** — origen de líneas cobrables
- **Pago** y **Método de Pago** — liquidación del documento
- **Descuento**, **Promoción** y **Precio** — cálculo del total
- **Empleado** y **Configuración Operacional** — autorización de descuentos
- **Cliente** — comprador responsable del cobro

### Cognitive Importance

★★★★★ **Fundamental**

El Ticket es la evidencia económica de la transacción. Sin distinción clara entre Orden y Ticket, el sistema mezcla compromiso operativo con obligación de cobro y produce reportes de ventas incorrectos.

### Implicaciones para el Cognitive Core

El Ticket habilita conciliación orden-cobro, análisis de ticket promedio, detección de discrepancias económicas y atribución de descuentos. El sistema debe poder responder "¿cuánto se debe?" independientemente de "¿está pagado?" y de "¿está entregado?".

---

## Pago

### Definición

El **Pago** es la entidad que representa la instancia registrada de transferencia de valor monetario del comprador al **Restaurante** que satisface total o parcialmente un **Ticket**. Es la materialización del ingreso: el hecho de que el dinero (o equivalente autorizado) fue recibido o confirmado.

**Qué no es:** El Pago no es el **Ticket** — el ticket establece la deuda; el pago la reduce o elimina. No es la **Orden** — una orden puede entregarse con ticket pendiente o pagarse antes de la entrega según canal. No es el **Método de Pago** — el método es la referencia (efectivo, tarjeta); el pago es la ocurrencia concreta con monto y hora. No es propina al mesero salvo que el modelo operativo la canalice como pago al restaurante.

**Cómo existe en la operación:** El Pago existe como registro auditable: "Pago #P-9912 — $485 — tarjeta de crédito — 21:34 — Ticket #T-8821 — completado". Puede haber varios pagos contra un mismo ticket (split entre comensales, abono parcial). Un pago fallido no liquida el ticket. Un reembolso se modela como reversión del pago.

### Propósito

Confirmar que el ingreso ocurrió. Sin Pago registrado, hay obligación de cobro o entrega de producto, pero no certeza de que el restaurante recibió el valor. El Pago cierra el ciclo económico iniciado por el Ticket.

### Identidad

La identidad del Pago es única por cada transferencia registrada. Pago #P-9912 es distinto de Pago #P-9913 aunque ambos liquiden el mismo ticket o usen el mismo método.

La identidad no depende del método — un pago en efectivo y uno en tarjeta del mismo ticket son pagos distintos. Corrección administrativa del registro no crea pago nuevo si la transferencia real es la misma.

Lo que NO cambia la identidad: reclasificación del método en registro; asignación tardía a ticket correcto con trazabilidad.

Lo que SÍ crea entidad nueva: cada transferencia de valor independiente; cada reembolso como reversión vinculada.

### Atributos

#### Obligatorios

- Identificador único de pago
- **Ticket** al que se aplica (total o parcial)
- Monto pagado
- **Método de Pago** utilizado
- Fecha y hora de la transacción
- **Restaurante** receptor
- Estado (iniciado, completado, fallido, revertido)

#### Opcionales

- Referencia de autorización externa (banco, plataforma, voucher)
- **Empleado** que procesó el cobro
- **Cliente** o comprador identificado
- Propina incluida en el monto
- Moneda y tipo de cambio (si aplica)
- Motivo de fallo o reversión
- Vinculación a **Orden** para trazabilidad operativa
- Comisión o costo de procesamiento asociado al método

### Relaciones

- Un Pago satisface un **Ticket** total o parcialmente
- Un Pago utiliza un **Método de Pago**
- Un Pago puede vincularse a la **Orden** origen para análisis operativo
- Un Pago lo registra o procesa un **Empleado** cajero
- Un Pago puede asociarse a un **Cliente** comprador
- Un Pago completado materializa **Ingreso** para el Restaurante
- Un Pago revertido puede originar **Reclamación** o ajuste de **Ticket**

### Ciclo de Vida

**Iniciado** — Cobro en proceso (terminal esperando, transferencia pendiente).

**Completado** — Valor recibido o confirmado; aplica al ticket.

**Fallido** — Rechazado, cancelado o no completado; no liquida ticket.

**Revertido** — Reembolso, contracargo o anulación de pago previo completado.

### Restricciones

- El monto del pago no debe exceder el saldo pendiente del ticket salvo propina explícita según política.
- Varios pagos parciales deben sumar exactamente el total para cerrar el ticket.
- Pago completado es prerequisito para contar ingreso realizado — no el ticket solo.
- Reversiones deben vincularse al pago original con trazabilidad.
- Pago en canal prepago (app, plataforma) puede ocurrir antes de la entrega — el ticket refleja estado según modelo.
- Pago fallido no cambia el estado operativo de la **Orden**.

### Ejemplos

- Pago #P-9912 — $485, tarjeta crédito, Ticket #T-8821, completado a las 21:34.
- Dos pagos contra mismo ticket — $200 efectivo (P-9913) + $285 tarjeta (P-9914).
- Pago fallido — tarjeta rechazada; ticket permanece con saldo $485.
- Pago revertido — reembolso $120 por ítem no entregado, vinculado a P-9901.

### Errores Frecuentes

- Registrar venta o ingreso al imprimir ticket sin **Pago** completado.
- Confundir autorización bancaria pendiente con pago completado.
- No vincular pago al ticket correcto en operación multimesa.
- Tratar propina al mesero como pago al restaurante en reportes de ingreso.
- Omitir registro de pago en cobro externo por plataforma de delivery.
- Reembolso sin reversión de pago — distorsiona conciliación.

### Knowledge Dependencies

Para razonar sobre Pago, el Cognitive Core debe conocer:

- **Ticket** — obligación que liquida
- **Método de Pago** — medio utilizado
- **Orden** — contexto operativo del cobro
- **Empleado** — responsable del registro
- **Cliente** — comprador cuando está identificado
- **Canal** — anticipo vs. cobro al entregar

### Cognitive Importance

★★★★★ **Fundamental**

El Pago es el punto donde la venta se convierte en ingreso confirmado. Sin esta entidad, el sistema confunde intención de cobro, deuda documentada y dinero recibido.

### Implicaciones para el Cognitive Core

El Pago materializa ingresos, habilita conciliación financiera y distingue obligación de cobro de cobro efectivo. El sistema debe responder "¿cuánto se cobró?" solo con pagos completados, no con tickets cerrados ni órdenes entregadas.

---

## Método de Pago

### Definición

El **Método de Pago** es la entidad de referencia que representa el medio autorizado mediante el cual el comprador transfiere valor al **Restaurante**: efectivo, tarjeta de débito, tarjeta de crédito, transferencia bancaria, monedero digital, voucher corporativo, pago en plataforma externa. Es catálogo de opciones; no es la transacción en sí.

**Qué no es:** El Método de Pago no es el **Pago** — el pago es la instancia concreta con monto, hora y ticket asociado. No es el **Ticket** — el ticket documenta la deuda; el método solo clasifica cómo se liquidó. No es una **Promoción** ni un **Descuento**. No es la terminal física ni la app — son instrumentos que ejecutan un método configurado.

**Cómo existe en la operación:** El Método de Pago existe como opción habilitada en la **Configuración Operacional** del restaurante. El cajero selecciona método al registrar cada **Pago**. Algunos métodos aplican comisión, demoran en liquidarse o solo están permitidos en ciertos **Canales** (ej. pago en línea en delivery, efectivo en pickup).

### Propósito

Clasificar de forma estable cómo entró el dinero para conciliación bancaria, análisis de mix de cobro, cálculo de ingreso neto y preferencias del cliente. Sin esta entidad, todos los cobros son "dinero" sin distinción operativa ni financiera.

### Identidad

La identidad del Método de Pago es su designación reconocida en la configuración del negocio: "Efectivo", "Tarjeta Crédito", "Transferencia SPEI", "Pago App Rappi". Son entidades de referencia estables que persisten a través de miles de pagos individuales.

Lo que NO cambia la identidad: cambio de proveedor de terminal; ajuste de comisión; cambio de horario de liquidación.

Lo que SÍ crea entidad nueva: incorporación de un medio no aceptado antes (nueva billetera digital); método corporativo específico para cliente B2B.

### Atributos

#### Obligatorios

- Identificador único del método
- Nombre operativo del método
- **Restaurante** o cadena que lo habilita
- Estado (activo, suspendido, retirado)
- Tipo general (efectivo, tarjeta, transferencia, digital, voucher)

#### Opcionales

- Comisión o costo de procesamiento (% o monto fijo)
- Tiempo estándar de liquidación al banco
- Requiere referencia de autorización o folio
- Límites de monto mínimo o máximo
- **Canales** donde está permitido
- Requiere identificación del comprador
- Monedas aceptadas
- Responsable de conciliación (caja, administración, plataforma)

### Relaciones

- Un Método de Pago clasifica cada **Pago**
- Un Método de Pago se habilita en **Configuración Operacional**
- Un Método de Pago puede restringirse por **Canal** (**Delivery**, **Pickup**, salón)
- Un Método de Pago afecta el cálculo de ingreso neto tras comisiones
- Un Método de Pago puede asociarse a plataformas externas de delivery

### Ciclo de Vida

**Configurado** — Definido pero aún no en uso (pre-apertura).

**Habilitado** — Aceptado para cobros en operación.

**Suspendido** — Temporalmente no disponible (falla de terminal, mantenimiento).

**Retirado** — Ya no se acepta; pagos históricos conservan referencia.

### Restricciones

- Todo **Pago** completado debe clasificarse bajo un método activo.
- Métodos con comisión deben reflejarse en análisis de margen — no solo en ingreso bruto.
- Método suspendido no debe aparecer como opción de cobro.
- Restricciones por canal deben respetarse (no efectivo en prepago digital remoto).
- Cambios de métodos aceptados deben ser trazables para interpretar históricos.

### Ejemplos

- Método "Efectivo" — liquidación inmediata, sin comisión, todos los canales presenciales.
- Método "Tarjeta Crédito" — comisión 3.5%, liquidación 24–48h, requiere autorización.
- Método "Vale Corporativo" — solo clientes B2B autorizados, sin comisión bancaria.
- Método "Pago en App" — prepago en delivery, liquidación vía plataforma con comisión.

### Errores Frecuentes

- Agrupar "tarjeta" sin distinguir débito, crédito y prepago.
- Ignorar comisiones al reportar ingresos por método.
- Permitir método inactivo en interfaz de cobro.
- No restringir métodos incompatibles con canal (efectivo en pedido prepagado online).
- Atribuir pago de plataforma externa al método equivocado en conciliación.

### Knowledge Dependencies

Para razonar sobre Método de Pago, el Cognitive Core debe conocer:

- **Pago** — instancias que clasifica
- **Ticket** — contexto de cobro
- **Configuración Operacional** — habilitación y políticas
- **Canal** — restricciones por modo de servicio
- **Restaurante** — alcance de aceptación

### Cognitive Importance

★★★★☆ **Alta**

No gobierna producción ni entrega, pero es indispensable para conciliación financiera, análisis de costo de cobro y detección de fraude o mal clasificación. En operación multicanal con prepagos y plataformas, su precisión afecta la verdad del ingreso neto.

### Implicaciones para el Cognitive Core

El Método de Pago segmenta ingresos por medio de entrada, habilita cálculo de comisiones y explica diferencias entre venta registrada y efectivo disponible. El sistema debe distinguir "¿cómo se pagó?" de "¿cuánto se pagó?" y de "¿qué se debía?".

---

## PARTE IV — CLIENTE Y SERVICIO

Las entidades de cliente y servicio modelan quién compra, dónde se atiende y cómo fluye la experiencia desde la solicitud hasta la entrega. Esta parte conecta la transacción con el espacio físico (**Mesa**, **Zona**) y los modos de servicio (**Canal**, **Delivery**, **Pickup**).

**Delivery** y **Pickup** son entidades de canal — no órdenes ni entregas puntuales — sino configuraciones operativas persistentes con reglas, capacidades y métricas propias. El **Cliente** y la **Reserva** anclan la relación y la planificación; el **Canal** determina cómo se procesa cada orden.

---

## Cliente

### Definición

El **Cliente** es la entidad que representa a la persona o entidad que mantiene relación de compra con el **Restaurante**: ha realizado transacciones o manifiesta intención activa de compra identificable. Es el agente de demanda cuya satisfacción sostiene el negocio.

**Qué no es:** El Cliente no es el Visitante sin transacción. No es el Consumidor necesariamente — quien paga puede no ser quien come. No es la Orden. No es el Empleado.

**Cómo existe en la operación:** El Cliente existe como relación persistente cuando se identifica — por programa de lealtad, teléfono, historial de órdenes. Puede ser anónimo en transacción puntual pero deja de ser completamente anónimo al identificarse.

### Propósito

Establecer la unidad relacional de demanda para historial, fidelización, personalización y análisis de valor de vida.

### Identidad

La identidad del Cliente no depende del número de visitas. No depende del monto gastado en una transacción. No depende del canal utilizado.

La identidad se establece por identificador de cliente cuando existe: teléfono, email, ID de programa de lealtad. Cliente anónimo no tiene entidad Cliente persistente — solo transacciones aisladas.

Lo que NO cambia la identidad: cambio de nombre, cambio de preferencias, cambio de canal habitual.

Lo que SÍ crea entidad nueva: persona distinta; fusión incorrecta de dos personas — error de identidad, no nueva entidad.

### Atributos

#### Obligatorios

- Identificador de cliente (cuando identificado)
- Restaurante o cadena de contexto
- Estado (activo, inactivo, bloqueado)

#### Opcionales

- Nombre
- Teléfono, email
- Fecha de primera visita
- Frecuencia de visita
- Preferencias registradas
- Puntos o beneficios de fidelización
- Historial de órdenes
- Segmento (VIP, ocasional, corporativo)

### Relaciones

- Un Cliente realiza **Órdenes**
- Un Cliente genera **Tickets** y **Pagos**
- Un Cliente puede tener **Reservas**
- Un Cliente proporciona **Feedback** y **Reclamaciones**
- Un Cliente participa en **Promociones** de fidelización
- Un Cliente ocupa **Mesas** en salón

### Ciclo de Vida

**Prospecto** — Identificado sin transacción aún.

**Activo** — Con transacciones recientes.

**Recurrente** — Patrón de visitas establecido.

**Inactivo** — Sin transacciones en periodo prolongado.

**Recuperado** — Retorno tras inactividad.

**Bloqueado** — Restricción por conducta o fraude.

### Restricciones

- Cliente identificado requiere dato mínimo según política.
- No confundir múltiples personas con un solo cliente.
- Cliente bloqueado no debe recibir beneficios de fidelización.

### Ejemplos

- Cliente CL-8821 — María, 47 órdenes en 12 meses, programa lealtad activo.
- Cliente corporativo CL-C045 — Empresa con facturación mensual.
- Transacción anónima en mostrador — sin entidad Cliente persistente.

### Errores Frecuentes

- Tratar visitante como cliente en métricas de retención.
- Perder historial al cambiar de canal sin unificación.
- Confundir comprador con consumidor en perfil de preferencias.
- Duplicar cliente por teléfonos distintos sin merge.

### Knowledge Dependencies

- **Orden**, **Ticket**, **Reserva**, **Feedback**, **Reclamación**, **Promoción**

### Cognitive Importance

★★★★★ **Fundamental**

El Cliente es el eje de demanda, satisfacción y valor de vida del negocio.

### Implicaciones para el Cognitive Core

La entidad Cliente habilita personalización, predicción de retorno, segmentación y contexto relacional en cada interacción.

---

## Reserva

### Definición

La **Reserva** es la entidad que representa el acuerdo previo entre **Cliente** y **Restaurante** que garantiza o prioriza ocupación de **Mesa** o espacio en fecha y hora específicas bajo condiciones definidas.

**Qué no es:** La Reserva no es la Orden de comida — llega antes. No es lista de espera informal. No es el pago anticipado necesariamente.

**Cómo existe en la operación:** La Reserva existe como compromiso futuro: "Mesa para 6, sábado 21:00, nombre García." Reduce incertidumbre de afluencia y mejora experiencia planificada.

### Propósito

Planificar demanda presencial y comprometer capacidad del salón con anticipación.

### Identidad

La identidad de la Reserva no depende de si el cliente llegó. No depende de la mesa final asignada si se reasigna por operación.

La identidad se establece por identificador único de reserva.

Lo que NO cambia la identidad: cambio de mesa asignada; ajuste de hora con acuerdo.

Lo que SÍ crea entidad nueva: cada solicitud de reserva independiente.

### Atributos

#### Obligatorios

- Identificador único de reserva
- Restaurante
- Fecha y hora reservada
- Tamaño del grupo
- Nombre de contacto
- Estado

#### Opcionales

- Cliente identificado vinculado
- Mesa pre-asignada
- Zona preferida
- Depósito o garantía
- Ocasion especial
- Restricciones dietéticas del grupo
- Notas de servicio

### Relaciones

- Una Reserva pertenece a un **Restaurante**
- Una Reserva la realiza un **Cliente** o prospecto
- Una Reserva asigna o prioriza **Mesa** en **Zona**
- Una Reserva puede convertirse en **Orden** al llegar el cliente
- Una Reserva consume capacidad del salón en **horario** específico

### Ciclo de Vida

**Solicitada** — Pendiente de confirmación.

**Confirmada** — Aceptada por el restaurante.

**Modificada** — Cambio de hora, grupo o condiciones.

**En espera** — Cliente no ha llegado; dentro de tolerancia.

**Honrada** — Cliente llegó, mesa asignada, orden iniciada.

**No-show** — Cliente no llegó dentro de política.

**Cancelada** — Por cliente o restaurante antes del servicio.

### Restricciones

- Reserva no puede exceder capacidad del salón.
- No-show repetido puede afectar prioridad futura del cliente.
- Reservas grandes requieren coordinación con cocina.

### Ejemplos

- Reserva RSV-441 — 6 personas, sábado 21:00, mesa redonda, confirmada.
- Reserva RSV-442 — no-show registrado tras 20 min de tolerancia.
- Reserva corporativa RSV-C12 — 20 personas, menú pre-fijado.

### Errores Frecuentes

- Sobre-reservar sin buffer para walk-ins.
- No liberar mesa tras no-show tardío.
- Reserva sin tamaño de grupo correcto.
- No vincular reserva a orden al sentar.

### Knowledge Dependencies

- **Restaurante**, **Cliente**, **Mesa**, **Zona**, **Orden**, **Configuración Operacional**

### Cognitive Importance

★★★★☆ **Alta**

Crítica en restaurantes con servicio de reservación; menos relevante en quick service sin reservas.

### Implicaciones para el Cognitive Core

La Reserva habilita planificación de capacidad, riesgo de no-show y coordinación flujo reservado vs. espontáneo.

---

## Mesa

### Definición

La **Mesa** es la entidad que representa la unidad de acomodación en el salón donde un grupo de comensales se sienta, ordena, recibe productos y paga. Tiene identificador, capacidad y estado operativo propios.

**Qué no es:** La Mesa no es la Orden — varias órdenes pueden asociarse en turnos sucesivos. No es la Reserva — aunque la reserva puede asignarla. No es la Zona — la zona contiene mesas.

**Cómo existe en la operación:** La Mesa existe como recurso físico persistente: Mesa 14 siempre es Mesa 14 aunque hoy la usen los García y mañana los López.

### Propósito

Ser la unidad atómica de servicio presencial que conecta cliente, orden, servicio y cobro en espacio físico.

### Identidad

La identidad de la Mesa no depende de quién la ocupa. No depende de la orden actual.

La identidad se establece por identificador único de mesa dentro del Restaurante: número, nombre o código.

Lo que NO cambia la identidad: cambio de ubicación tras remodelación si se mantiene designación; cambio de capacidad por unión con otra mesa (puede crear configuración temporal documentada).

Lo que SÍ crea entidad nueva: mesa físicamente nueva con nuevo identificador.

### Atributos

#### Obligatorios

- Identificador único de mesa
- Restaurante
- Capacidad (número de cubiertos)
- Zona a la que pertenece
- Estado operativo

#### Opcionales

- Forma y ubicación descriptiva
- Mesa unible con otras
- Mesero asignado por turno
- Reserva actual vinculada
- Orden activa vinculada
- Características (ventana, accesible, VIP)

### Relaciones

- Una Mesa pertenece a una **Zona** del **Restaurante**
- Una Mesa recibe **Órdenes** y **Reservas**
- Una Mesa es atendida por **Empleado** (mesero)
- Una Mesa genera **Tickets** al cierre de cuenta
- Una Mesa afecta **tiempo de espera** y rotación del salón

### Ciclo de Vida

**Disponible** — Libre para asignar.

**Reservada** — Comprometida para horario futuro.

**Ocupada** — Comensales activos.

**En servicio activo** — Con orden en curso.

**Cuenta solicitada** — Pendiente de pago.

**En limpieza** — Post-turno, no asignable.

**Fuera de servicio** — Dañada o retirada temporalmente.

### Restricciones

- Mesa ocupada no disponible para nuevos comensales.
- Capacidad no debe excederse por seguridad y experiencia.
- Dos grupos no comparten mesa salvo reglas explícitas de comunales.

### Ejemplos

- Mesa 14 — capacidad 4, zona principal, ocupada desde 20:15.
- Mesa M-VENT-2 — ventana, reservada sábado 21:00.
- Mesas 10+11 unidas — capacidad temporal 8 para grupo grande.

### Errores Frecuentes

- Orden sin identificador de mesa en salón.
- Asignar grupo grande a mesa pequeña.
- No liberar mesa en sistema tras limpieza.
- Confundir mesa con cuenta — múltiples pagadores posibles.

### Knowledge Dependencies

- **Restaurante**, **Zona**, **Orden**, **Reserva**, **Empleado**, **Ticket**

### Cognitive Importance

★★★★☆ **Alta**

Central en servicio presencial; irrelevante en operaciones solo delivery.

### Implicaciones para el Cognitive Core

La Mesa habilita razonamiento de rotación, ocupación, asignación de meseros y tiempos de servicio en salón.

---

## Zona

### Definición

La **Zona** es la entidad que representa una subdivisión del espacio de servicio del **Restaurante**: sección del salón, terraza, barra, salón privado, área de pickup. Agrupa mesas y define contexto de servicio.

**Qué no es:** La Zona no es la Mesa. No es la Cocina. No es el Canal — aunque pickup puede tener zona física. No es la Categoría del menú.

**Cómo existe en la operación:** La Zona existe como organización del salón para asignación de meseros, reservaciones y análisis de ocupación: "Zona Terraza", "Zona Interior", "Barra".

### Propósito

Estructurar el espacio de servicio para asignación de personal, reservas y análisis de desempeño por área.

### Identidad

La identidad de la Zona no depende de las mesas que contiene — mesas pueden añadirse o retirarse.

La identidad se establece por designación única dentro del Restaurante.

Lo que NO cambia la identidad: reconfiguración de mesas dentro de la zona.

Lo que SÍ crea entidad nueva: nueva área física con identidad propia.

### Atributos

#### Obligatorios

- Identificador único de zona
- Restaurante
- Nombre de la zona
- Tipo (interior, exterior, barra, privado, pickup)
- Capacidad total de cubiertos

#### Opcionales

- Mesero responsable por turno
- Características de ambiente
- Restricciones (solo adultos, solo eventos)
- Horario de disponibilidad propio

### Relaciones

- Una Zona pertenece a un **Restaurante**
- Una Zona contiene **Mesas**
- Una Zona es atendida por **Empleados** (meseros)
- Una Zona recibe **Reservas** específicas
- Una Zona tiene métricas de ocupación y **tiempo de espera**

### Ciclo de Vida

**Activa** — En servicio normal.

**Cerrada temporalmente** — Clima, remodelación, evento privado.

**En reconfiguración** — Cambio de layout de mesas.

**Retirada** — Ya no existe como zona identificable.

### Restricciones

- Toda mesa de salón debe pertenecer a una Zona.
- Zona cerrada implica mesas no disponibles.
- Capacidad de zona es suma de mesas activas.

### Ejemplos

- Zona "Terraza" — 8 mesas, 32 cubiertos, mesero Juan.
- Zona "Privado" — eventos, reserva exclusiva.
- Zona "Pickup" — mostrador de recogida, sin mesas.

### Errores Frecuentes

- Mesas sin zona asignada.
- Capacidad de zona desactualizada tras cambio de layout.
- Confundir zona con canal de venta.

### Knowledge Dependencies

- **Restaurante**, **Mesa**, **Reserva**, **Empleado**, **Orden**

### Cognitive Importance

★★★☆☆ **Media**

Importante en salones grandes y con secciones; menos crítica en locales pequeños de una sola zona.

### Implicaciones para el Cognitive Core

La Zona habilita asignación de personal, análisis de ocupación por área y priorización de reservas.

---

## Canal

### Definición

El **Canal** es la entidad que representa el modo mediante el cual el **Cliente** accede al servicio del **Restaurante** y recibe productos: salón (dine-in), pickup, delivery, drive-thru, catering. Define el contexto operativo de la orden.

**Qué no es:** El Canal no es la Orden — la orden se realiza por un canal. No es la Zona — la zona es espacio físico; el canal es modo de servicio. Delivery y Pickup son canales específicos, no el canal genérico.

**Cómo existe en la operación:** El Canal existe como configuración de cómo el restaurante atiende: el mismo producto se produce pero se entrega distinto según canal. Precios, tiempos y empaque pueden variar.

### Propósito

Distinguir modos de servicio que alteran operación, promesas al cliente, pricing y análisis de desempeño.

### Identidad

La identidad del Canal es su designación estándar: "Salón", "Pickup", "Delivery". Son entidades de referencia estables por Restaurante.

Lo que NO cambia la identidad: ajuste de horario del canal.

Lo que SÍ crea entidad nueva: nuevo modo de servicio (ej. drive-thru añadido).

### Atributos

#### Obligatorios

- Identificador de canal
- Restaurante
- Nombre del canal
- Estado (habilitado, deshabilitado)

#### Opcionales

- Horario de operación del canal
- Precios diferenciados
- Tiempos estándar de servicio
- Menú específico del canal
- Restricciones de productos

### Relaciones

- Un Canal es utilizado por **Órdenes**
- Un Canal está definido en **Configuración Operacional**
- Un Canal puede tener entidades específicas **Delivery** y **Pickup**
- Un Canal afecta **Productos** disponibles y **presentación**
- Un Canal se mide en **KPIs** separados

### Ciclo de Vida

**Habilitado** — Aceptando órdenes.

**Limitado** — Operación reducida (solo algunos productos u horarios).

**Suspendido** — Temporalmente no disponible.

**Retirado** — Canal descontinuado.

### Restricciones

- Orden debe clasificarse bajo canal habilitado.
- Productos no aptos para canal deben restringirse.
- KPIs cross-canal requieren segmentación para comparación válida.

### Ejemplos

- Canal "Salón" — dine-in, mesas, servicio de mesero.
- Canal "Pickup" — para llevar, mostrador.
- Canal "Delivery" — entrega a domicilio, repartidor.

### Errores Frecuentes

- Mezclar ventas de canales distintos sin etiqueta.
- Mismo SLA para todos los canales.
- Producto de salón en delivery sin ajuste de empaque.

### Knowledge Dependencies

- **Restaurante**, **Orden**, **Configuración Operacional**, **Delivery**, **Pickup**, **Producto**

### Cognitive Importance

★★★★★ **Fundamental**

En operación multicanal, el canal determina flujo operativo, promesas y rentabilidad.

### Implicaciones para el Cognitive Core

El Canal segmenta todo razonamiento operativo: qué reglas aplican, qué tiempos prometer, qué productos ofrecer, cómo analizar desempeño.

---

## Delivery

### Definición

El **Delivery** es la entidad de canal que representa la operación persistente de entrega a domicilio del **Restaurante**: el conjunto de capacidades, reglas, recursos y promesas mediante los cuales las **Órdenes** se capturan con destino externo, producen, empaquetan, transportan y entregan fuera del establecimiento.

**Qué no es:** Delivery no es una **Orden** — las órdenes se procesan *por* el canal delivery. No es **Pickup** — pickup recoge en local; delivery lleva al domicilio. No es el repartidor individual — es la configuración operativa que los repartidores o terceros ejecutan. No es la entrega puntual de un pedido — es la entidad de canal con identidad propia que gobierna muchas entregas.

**Cómo existe en la operación:** Delivery existe como capacidad habilitada en **Configuración Operacional**: radio de cobertura, **Zonas** atendidas, tiempos prometidos, tarifas, menú y precios diferenciados, integración con plataformas. Tony Burgers Centro *tiene* un Delivery activo aunque en un momento dado haya cero órdenes en tránsito.

### Propósito

Modelar el canal de domicilio como entidad operativa con parámetros, restricciones, costos y métricas propias. Permite al Cognitive Core razonar sobre logística, SLA compuesto (preparación + tránsito), priorización en cocina multicanal y rentabilidad neta tras comisiones y envío.

### Identidad

La identidad del Delivery está vinculada al **Restaurante** (o **Sucursal**) que opera el canal. No es global del dominio — cada local puede tener delivery propio, tercerizado o inexistente.

La identidad no depende del repartidor de turno ni del volumen del día. Cambiar radio de 5 km a 7 km modifica atributos, no crea canal nuevo.

Lo que NO cambia la identidad: ajuste de tarifas, tiempos estándar, proveedor logístico.

Lo que puede crear nueva versión: migración de modelo propio a ghost delivery exclusivo; apertura de delivery en local que antes era solo salón.

### Atributos

#### Obligatorios

- **Restaurante** que opera el canal
- Identificador del canal Delivery
- Estado (planificado, activo, saturado, suspendido, descontinuado)
- **Zonas** o radio de cobertura habilitado
- Tiempo estándar de entrega prometido (preparación + tránsito)
- Modo de operación (repartidores propios, tercerizado, plataforma)

#### Opcionales

- Tarifa de envío o política de envío gratis
- Monto mínimo de orden
- Horario de operación específico del canal
- Menú o precios diferenciados para delivery
- Restricciones de **Productos** no aptos para transporte
- Integración con agregadores (Rappi, Uber Eats, etc.)
- Comisión de plataforma o costo logístico unitario
- Política de pago (anticipado, contra entrega)

### Relaciones

- Delivery es un **Canal** específico del **Restaurante**
- Delivery procesa **Órdenes** con dirección de destino en **Zona** válida
- Delivery comparte **Cocina** con salón y **Pickup** — compite por capacidad
- Delivery emplea **Empleados** repartidores o servicios externos
- Delivery utiliza empaque y presentación distintos al salón
- Delivery acepta **Métodos de Pago** según modelo (prepago, terminal móvil)
- Delivery se mide con **KPIs** de tiempo, satisfacción y rentabilidad por canal

### Ciclo de Vida

**Planificado** — Configuración en curso; aún no acepta órdenes.

**Activo** — Aceptando y cumpliendo entregas dentro de SLA normal.

**Saturado** — Operativo pero con tiempos extendidos por exceso de demanda o logística.

**Suspendido** — Temporalmente no disponible (clima, falta de repartidores, falla de plataforma).

**Descontinuado** — Canal cerrado permanentemente; datos históricos preservados.

### Restricciones

- Toda **Orden** clasificada como delivery debe tener destino dentro de cobertura.
- El tiempo prometido debe incluir preparación en **Cocina** — no solo tránsito.
- Productos con baja resistencia al transporte deben excluirse o ajustarse.
- Delivery tardío o producto frío/dañado es falla del canal completo, no solo del repartidor.
- Precios y promociones deben ser coherentes con costo logístico y comisiones.
- Fallas de plataforma externa no eximen trazabilidad operativa propia.

### Ejemplos

- Delivery TB Centro — radio 5 km, 35 min estándar, 4 repartidores propios, activo.
- Delivery vía plataforma — comisión 28%, menú con precios +15%, prepago obligatorio.
- Delivery suspendido — tormenta eléctrica, canal en estado suspendido 2 horas.
- Orden delivery corporativa a oficina — zona premium con SLA 45 min.

### Errores Frecuentes

- Prometer tiempo de entrega sin considerar cola de cocina en hora pico.
- Usar mismo menú y precios de salón ignorando comisión y empaque.
- Atribuir toda falla a plataforma externa sin registro de tiempos propios.
- No diferenciar órdenes delivery en producción multicanal — retrasa salón y pickup.
- Confundir dirección fuera de **Zona** con error de captura vs. política de cobertura.

### Knowledge Dependencies

Para razonar sobre Delivery, el Cognitive Core debe conocer:

- **Canal** — posición en taxonomía de modos de servicio
- **Orden**, **Ticket** y **Pago** — flujo transaccional del canal
- **Zona** — cobertura geográfica
- **Restaurante** y **Configuración Operacional**
- **Producto** — restricciones de transporte y empaque
- **Cocina** — capacidad compartida
- **KPI** — tiempos y rentabilidad

### Cognitive Importance

★★★★☆ **Alta**

Crítica en operación multicanal y ghost kitchens; secundaria en restaurantes solo salón. Donde existe, condiciona gran parte del volumen, la logística y el margen neto.

### Implicaciones para el Cognitive Core

Delivery habilita razonamiento de SLA compuesto, priorización de producción, calidad en tránsito, pricing por canal y detección de zonas o franjas con fallas sistemáticas. El sistema debe tratar Delivery como configuración persistente del canal, no como atributo accidental de una orden aislada.

---

## Pickup

### Definición

El **Pickup** es la entidad de canal que representa la operación persistente de recogida en establecimiento: las capacidades y reglas mediante las cuales el **Cliente** ordena productos y los recoge en el local — mostrador, ventanilla o punto curbside — sin consumir en **Mesa** ni requerir servicio de salón completo.

**Qué no es:** Pickup no es **Delivery** — no hay traslado a domicilio. No es salón (dine-in) — no ocupa mesa ni genera servicio de mesero continuo. No es la **Orden** — las órdenes se procesan *por* el canal pickup. No es la fila momentánea de clientes — es la configuración operativa que define cómo funciona esa fila y ese flujo.

**Cómo existe en la operación:** Pickup existe como canal habilitado con punto de recogida, tiempos estándar, política de identificación al entregar y **Zona** física de espera. Flujo típico: orden → producción en **Cocina** compartida → empaque → notificación → recogida. También llamado "para llevar" o takeout.

### Propósito

Modelar el canal para llevar como entidad operativa que amplía capacidad del restaurante sin mesas adicionales. Define promesas de tiempo, empaque, identificación de órdenes y manejo de órdenes no recogidas — variables distintas al salón y al delivery.

### Identidad

La identidad del Pickup está vinculada al **Restaurante** que ofrece el canal. Persiste independientemente del volumen diario de órdenes para llevar.

Lo que NO cambia la identidad: añadir curbside; cambio de mostrador de recogida; ajuste de tiempo estándar.

Lo que puede crear nueva versión: local que habilita pickup por primera vez; separación de pickup de mostrador general a ventanilla exclusiva con política distinta.

### Atributos

#### Obligatorios

- **Restaurante** que opera el canal
- Identificador del canal Pickup
- Estado (activo, saturado, suspendido, descontinuado)
- Punto de recogida designado
- Tiempo estándar de lista para recoger (incluye empaque)

#### Opcionales

- Modalidad curbside (recogida en auto sin entrar)
- Horario específico del canal
- Identificación obligatoria al recoger (nombre, código, últimos dígitos)
- **Zona** física de espera o estantes de órdenes listas
- **Empleado** dedicado a expedición pickup
- Política de tiempo límite antes de descarte (merma)
- **Métodos de Pago** aceptados (anticipado, al recoger)
- Menú restringido por productos no transportables

### Relaciones

- Pickup es un **Canal** específico del **Restaurante**
- Pickup procesa **Órdenes** sin **Mesa** asignada
- Pickup comparte **Cocina** con salón y **Delivery**
- Pickup utiliza **Zona** de recogida en el local
- Pickup requiere empaque distinto a **Presentación** de salón
- Pickup puede participar en **Promociones** exclusivas del canal
- Pickup se mide por tiempos de espera de recogida y tasa de no recogido

### Ciclo de Vida

**Planificado** — Canal en configuración pre-lanzamiento.

**Activo** — Aceptando y cumpliendo recogidas en tiempo normal.

**Saturado** — Cola de órdenes listas o en preparación extendida; tiempos superan estándar.

**Suspendido** — Temporalmente no disponible (solo salón, falta de personal de expedición).

**Descontinuado** — Canal cerrado; solo salón o delivery según configuración.

### Restricciones

- Toda orden pickup debe distinguirse claramente de órdenes de **Mesa** en comandas y expedición.
- El tiempo prometido debe incluir empaque — no solo preparación en cocina.
- Orden no recogida dentro del límite genera **Merma** y debe registrarse.
- Productos no aptos para transporte del cliente deben excluirse o empacarse específicamente.
- Entrega en pickup requiere identificación para evitar intercambio de órdenes.
- Pickup compite por atención de expedición con salón en horas pico.

### Ejemplos

- Pickup mostrador principal — tiempo estándar 15 min, pago al recoger, activo.
- Pickup curbside — cliente avisa por app, mesero lleva bolsa al estacionamiento.
- Orden pickup #4523 lista 18 min — notificación enviada, esperando recogida.
- Orden no recogida en 45 min — desechada, merma registrada, cliente notificado.

### Errores Frecuentes

- Mezclar orden pickup con orden de mesa en comanda o estante de entrega.
- No incluir tiempo de empaque en promesa al cliente.
- Entregar producto con presentación de salón sin empaque adecuado.
- No identificar orden al recoger — riesgo de entrega errónea.
- No notificar cuando la orden está lista — cola invisible para el cliente.
- Ignorar órdenes no recogidas en análisis de merma.

### Knowledge Dependencies

Para razonar sobre Pickup, el Cognitive Core debe conocer:

- **Canal** — taxonomía de modos de servicio
- **Orden**, **Ticket** y **Pago** — flujo del canal
- **Restaurante**, **Zona** y **Configuración Operacional**
- **Cocina** — capacidad compartida y tiempos
- **Producto** — idoneidad para transporte del cliente
- **KPI** — tiempos de espera y merma por no recogido

### Cognitive Importance

★★★★☆ **Alta**

Amplía capacidad efectiva sin cubiertos; crítico en fast casual y multicanal. Menos relevante en fine dining solo salón, pero esencial donde existe volumen para llevar.

### Implicaciones para el Cognitive Core

Pickup habilita razonamiento de capacidad sin mesa, colas de recogida, empaque, cannibalización vs. salón y costo de órdenes no recogidas. El sistema debe clasificar automáticamente órdenes bajo este canal y aplicar reglas de tiempo, identificación y merma distintas al dine-in y al delivery.

---

## PARTE V — PRODUCCIÓN E INVENTARIO

Las entidades de producción e inventario conectan la oferta comercial con la realidad física: lo que se puede vender depende de lo que se puede producir, y lo que se puede producir depende de lo que hay en existencia. Sin estas entidades, el Cognitive Core razonaría sobre menús y órdenes como si la materia prima fuera infinita y la cocina fuera un punto abstracto.

---

## Cocina

### Definición

La **Cocina** es la entidad que representa el espacio de producción culinaria dentro de un **Restaurante**: el lugar donde ingredientes se transforman en platillos, bebidas preparadas y componentes listos para servir. Es el subsistema donde convergen recetas, estaciones, personal, equipamiento e inventario para cumplir las órdenes recibidas.

**Qué no es:** La Cocina no es una orden individual ni una comanda. No es un empleado — aunque empleados operan dentro de ella. No es el inventario — aunque consume inventario. No es una estación aislada: la Cocina es el contenedor que agrupa estaciones. No es el menú — el menú define qué debe producirse; la Cocina es donde ocurre la producción.

**Cómo existe en la operación:** La Cocina existe como espacio físico delimitado con flujo de trabajo reconocible: recepción de comandas, preparación, cocción, emplatado, entrega a expedición o servicio. Opera en fases según el día — mise en place, servicio, cierre — y su estado determina si el restaurante puede cumplir demanda en tiempo y calidad.

### Propósito

Proporcionar el marco espacial y operativo de la producción gastronómica. La Cocina es el punto donde la promesa comercial del menú se convierte en producto tangible. Sin esta entidad, el Cognitive Core no puede razonar sobre capacidad productiva, cuellos de botella, tiempos de preparación ni desviaciones de calidad.

### Identidad

La identidad de la Cocina no depende de quién cocina hoy. No depende de las órdenes en curso. No depende del menú vigente — aunque el menú define qué produce.

La identidad se establece por su continuidad como espacio de producción dentro de un Restaurante específico. Una Cocina que se remodela por completo pero mantiene su función en el mismo local conserva identidad. Si un local deja de tener área de producción culinaria y solo recalienta producto externo, la entidad Cocina puede dejar de existir operacionalmente y ser sustituida por un modelo distinto.

Lo que NO cambia la identidad: cambio de equipamiento, reconfiguración de estaciones, cambio de chef ejecutivo, ampliación de superficie.

Lo que SÍ puede crear entidad nueva: apertura de cocina satélite independiente con flujo y ubicación propios; conversión del local a modelo sin producción en sitio.

### Atributos

#### Obligatorios

- Restaurante al que pertenece
- Identificador único dentro del restaurante
- Estado operativo (activa, en preparación, en servicio, en cierre, fuera de servicio)
- Capacidad productiva estimada (órdenes simultáneas o unidades por hora)
- Estaciones que contiene
- Horario o fases operativas vinculadas al servicio

#### Opcionales

- Tipo de cocina (caliente, fría, repostería, bar, expedición)
- Superficie y distribución física
- Equipamiento principal disponible
- Estándares de tiempo por familia de productos
- Políticas de seguridad alimentaria y sanidad
- Responsable de cocina asignado
- Certificaciones o inspecciones vigentes

### Relaciones

- La Cocina pertenece a un **Restaurante**
- La Cocina contiene una o más **Estaciones**
- La Cocina recibe **Órdenes** y sus **Ítems de Orden** para producción
- La Cocina consume **Inventario** según **Recetas** de **Productos**, **Platillos** y **Bebidas**
- La Cocina es operada por **Empleados** en **Turnos** con **Roles** definidos
- La Cocina se rige por **Configuración Operacional** (tiempos estándar, prioridades)
- La Cocina genera **Movimientos de Inventario** por consumo y **merma**
- La Cocina impacta **KPIs** de tiempo de preparación, merma y satisfacción

### Ciclo de Vida

**Diseñada** — Planeada antes de apertura; layout y equipamiento definidos pero aún no opera.

**En calibración** — Primeras semanas de operación con ajuste de tiempos, estaciones y flujos.

**Operativa** — Produce regularmente según demanda del menú.

**Saturada** — Opera al límite de capacidad; riesgo de retrasos y errores.

**En mantenimiento** — Parcial o totalmente fuera de servicio por limpieza profunda, reparación o remodelación.

**Inactiva** — Restaurante cerrado o modelo sin producción en sitio. Entidad histórica o suspendida.

### Restricciones

- Toda producción culinaria del restaurante ocurre en su Cocina o en un espacio explícitamente definido como extensión de ella.
- Una Cocina operativa debe tener al menos una estación funcional y personal capacitado.
- La Cocina no puede producir lo que el **Inventario** no permite, salvo sustitución autorizada.
- Los estándares de inocuidad y temperatura no pueden suspenderse por presión de demanda.
- La capacidad de la Cocina limita la promesa de tiempos del restaurante en todos los **Canales**.

### Ejemplos

- Cocina principal de Tony Burgers Centro — estaciones grill, freidora, ensamble y expedición, 45 órdenes/hora pico.
- Cocina de ghost kitchen — solo producción para delivery y pickup, sin salón.
- Cocina en mantenimiento parcial — freidora fuera de servicio; menú reducido temporalmente.

### Errores Frecuentes

- Tratar cada comanda como una cocina distinta.
- Ignorar que la cocina satélite de catering es entidad separada si opera con inventario propio.
- Medir capacidad solo por número de empleados sin considerar estaciones y equipamiento.
- Asumir que la cocina puede cumplir el menú completo cuando inventario o equipamiento están limitados.
- Confundir expedición con cocina completa — expedición organiza salida pero no siempre produce.

### Knowledge Dependencies

Para razonar sobre Cocina, el Cognitive Core debe conocer:

- **Restaurante** — contexto superior
- **Estación** — unidades de producción dentro de la cocina
- **Receta** y **Producto** — qué debe producirse y cómo
- **Inventario** — disponibilidad de insumos
- **Orden** e **Ítem de Orden** — demanda a satisfacer
- **Empleado**, **Rol** y **Turno** — capacidad humana
- **Configuración Operacional** — tiempos y reglas

### Cognitive Importance

★★★★★ **Fundamental**

La Cocina es el motor de cumplimiento de la promesa gastronómica. Sin ella, el Cognitive Core puede vender pero no puede explicar si la operación es viable, ni predecir tiempos, ni detectar causas de insatisfacción ligadas a producción.

### Implicaciones para el Cognitive Core

La entidad Cocina ancla el razonamiento de capacidad, congestión y calidad operativa. Permite al sistema correlacionar demanda con recursos productivos, anticipar retrasos cuando la cocina se acerca a saturación, y explicar incidencias por limitaciones reales de espacio, equipo o personal — no solo por errores aislados.

---

## Estación

### Definición

La **Estación** es la entidad que representa una unidad funcional de trabajo dentro de la **Cocina** dedicada a un conjunto específico de tareas de producción: parrilla, freidora, ensaladas, postres, bar, emplatado o expedición. Es el punto donde un tipo de preparación se concentra con equipamiento, insumos y habilidades particulares.

**Qué no es:** La Estación no es la Cocina completa. No es un empleado — aunque un empleado se asigna a ella. No es un producto ni una receta. No es un turno. No es inventario general — aunque puede tener insumos posicionados en su área.

**Cómo existe en la operación:** La Estación existe como zona delimitada con responsabilidad productiva clara. Cuando una orden llega, sus ítems se distribuyen por estaciones según receta. Cada estación produce su parte; la coordinación entre estaciones determina si la orden sale completa y a tiempo.

### Propósito

Descomponer la producción culinaria en unidades razonables para asignación de personal, medición de desempeño y detección de cuellos de botella. Sin estaciones, la cocina sería un bloque indivisible imposible de optimizar.

### Identidad

La identidad de la Estación no depende del empleado asignado hoy. No depende de la orden en curso. No depende del menú completo — aunque el menú define qué estaciones se activan.

La identidad se establece por su designación persistente dentro de una Cocina: "estación parrilla", "estación fría", "bar". Si se reubica físicamente pero conserva función y nombre operativo, persiste. Si se elimina la freidora y esa zona pasa a otro uso, la estación freidora deja de existir.

Lo que NO cambia la identidad: cambio de cocinero asignado, cambio de equipamiento equivalente, ajuste de productos que pasa por la estación.

Lo que SÍ crea entidad nueva: creación de una estación nueva con función distinta; fusión de dos estaciones en una con identidad operativa nueva.

### Atributos

#### Obligatorios

- Cocina a la que pertenece
- Identificador o nombre operativo de la estación
- Tipo o familia de producción (caliente, fría, bar, expedición, etc.)
- Estado (activa, inactiva, en mantenimiento)
- Productos o familias de productos que atiende

#### Opcionales

- Equipamiento asignado
- Empleado o rol responsable por turno
- Insumos posicionados en mise en place
- Tiempo estándar de ciclo por producto
- Capacidad simultánea (unidades en paralelo)
- Orden de prioridad en congestión
- Ubicación física dentro de la cocina

### Relaciones

- La Estación pertenece a una **Cocina**
- La Estación es operada por **Empleados** con **Roles** específicos
- La Estación produce ítems de **Órdenes** según **Recetas**
- La Estación consume **Inventario** local o central
- La Estación colabora con otras estaciones para completar una orden
- La Estación se programa en **Turnos**
- La Estación contribuye a **KPIs** de tiempo y merma por tipo de producción

### Ciclo de Vida

**Definida** — Establecida en diseño de cocina antes de operar.

**Activa** — Recibe comandas y produce regularmente.

**Congestionada** — Demanda supera capacidad; cola interna creciente.

**Detenida** — Fuera de servicio por falla de equipo, falta de insumo crítico o ausencia de personal.

**Reconfigurada** — Cambio de función o equipamiento con nueva asignación de productos.

**Retirada** — Deja de existir en la cocina. Registro histórico.

### Restricciones

- Toda estación activa debe pertenecer a una cocina identificada.
- Un producto asignado a una estación debe tener receta compatible con su equipamiento y habilidad requerida.
- No se puede asignar producción a estación inactiva sin reasignación explícita.
- La suma de carga de estaciones no puede exceder la demanda real de órdenes sin generar retraso sistémico.
- En turnos de baja dotación, la configuración de estaciones activas debe ajustarse a personal disponible.

### Ejemplos

- Estación Parrilla — hamburguesas y proteínas a la plancha, capacidad 12 piezas simultáneas.
- Estación Fría — ensaladas y toppings sin cocción.
- Estación Bar — bebidas preparadas y coctelería.
- Estación Expedición — arma órdenes completas y verifica antes de salida.

### Errores Frecuentes

- Nombrar cada cocinero como estación — la estación es lugar/función, no persona.
- No actualizar qué productos van a cada estación cuando cambia el menú.
- Medir tiempos solo a nivel cocina sin desglose por estación — oculta cuellos de botella.
- Asumir que una estación detenida solo afecta un producto cuando bloquea combos completos.
- Confundir estación de servicio (salón) con estación de cocina.

### Knowledge Dependencies

Para razonar sobre Estación, el Cognitive Core debe conocer:

- **Cocina** — contenedor superior
- **Receta** y **Producto** — qué se produce en cada estación
- **Orden** e **Ítem de Orden** — demanda distribuida
- **Empleado** y **Rol** — quién opera la estación
- **Inventario** — insumos disponibles en el punto de uso
- **Turno** — cuándo la estación está dotada

### Cognitive Importance

★★★★☆ **Alta**

La Estación es el nivel de granularidad correcto para diagnosticar congestión productiva. Sin ella, el Cognitive Core ve retrasos en cocina pero no sabe si el problema es parrilla, freidora o expedición.

### Implicaciones para el Cognitive Core

Esta entidad habilita razonamiento distribuido de producción: priorizar comandas por estación crítica, recomendar reasignación de personal, detectar productos mal enrutados y explicar demoras con precisión causal. Es prerequisito para optimización operativa fina dentro de la cocina.

---

## Inventario

### Definición

El **Inventario** es la entidad que representa el conjunto de existencias físicas de insumos, productos semielaborados, bebidas, empaques y suministros que un **Restaurante** mantiene para operar: lo que hay disponible para producir, servir y empacar en un momento dado, medido en unidades y valor.

**Qué no es:** El Inventario no es una compra pendiente de recibir — eso es abastecimiento futuro. No es un producto del menú ofrecido al cliente — es lo que hay en almacén, cámara o barra. No es un movimiento individual — los movimientos modifican inventario pero no son el inventario. No es el costo teórico de una receta — es existencia real o registrada.

**Cómo existe en la operación:** El Inventario existe como saldo agregado por ítem almacenable en ubicaciones del restaurante. Sube con entradas de proveedor y baja con consumo en producción, venta directa de bebidas embotelladas, mermas y ajustes. Se consulta antes de prometer disponibilidad y se reconcilia con conteos físicos.

### Propósito

Materializar la disponibilidad física que condiciona toda la operación. El Inventario conecta compras con producción y ventas: sin saldo confiable, el restaurante vende lo que no puede entregar o deja de vender lo que sí tiene.

### Identidad

La identidad del Inventario no es la cantidad de hoy — las cantidades cambian constantemente. No es el valor monetario del día — fluctúa con precios y movimientos.

La identidad se establece por el vínculo persistente entre un **Restaurante** (o **Sucursal**) y un ítem inventariable específico en una ubicación de almacenamiento reconocida. "Inventario de carne molida en cámara fría de Sucursal Centro" es una entidad; su saldo es atributo variable.

Lo que NO cambia la identidad: cambio de cantidad, cambio de costo unitario, cambio de proveedor habitual.

Lo que SÍ crea entidad nueva: nuevo ítem inventariable registrado; inventario en nueva ubicación si se rastrea por separado; inventario de otra sucursal.

### Atributos

#### Obligatorios

- Restaurante o Sucursal al que pertenece
- Ítem inventariable (ingrediente, bebida, empaque, insumo)
- Unidad de medida operativa
- Cantidad actual registrada
- Ubicación de almacenamiento

#### Opcionales

- Costo unitario promedio o último costo
- Valor total de existencia
- Nivel mínimo o punto de reorden
- Nivel máximo recomendado
- Fecha de último conteo físico
- Lote o fecha de caducidad (si aplica)
- Proveedor principal asociado
- Categoría de rotación (alta, media, baja)
- Tolerancia de merma esperada

### Relaciones

- El Inventario pertenece a un **Restaurante** o **Sucursal**
- El Inventario referencia **Ingredientes** y otros insumos de la oferta
- El Inventario se incrementa por **Movimientos de Inventario** de entrada
- El Inventario se reduce por movimientos de salida, **merma** y consumo ligado a **Órdenes**
- El Inventario se abastece mediante **Proveedores**
- El Inventario condiciona disponibilidad de **Productos** en el **Menú**
- El Inventario se compara contra **Recetas** para planificación
- El Inventario alimenta **KPIs** de food cost, rotación y quiebre de stock

### Ciclo de Vida

**Inicializado** — Ítem registrado por primera vez con saldo de apertura.

**En nivel normal** — Dentro de rangos operativos entre mínimo y máximo.

**Bajo mínimo** — Requiere reabastecimiento; riesgo de agotamiento.

**Agotado** — Saldo cero o insuficiente para producir; productos pueden quedar no disponibles.

**Sobre stock** — Exceso respecto al máximo; riesgo de caducidad o capital inmovilizado.

**En conteo** — Bajo reconciliación física; saldo temporalmente incierto.

**Obsoleto o dado de baja** — Ítem discontinuado; solo referencia histórica.

### Restricciones

- Todo consumo en producción debe reflejarse en inventario — operación sin descuento genera fantasmas de disponibilidad.
- Inventario negativo indica error de registro, no existencia física real.
- Ítems perecederos deben respetar caducidad aunque el saldo sea positivo.
- El inventario de una sucursal no debe mezclarse con otro sin transferencia explícita.
- Ajustes de inventario requieren justificación — no son sustituto de compra o producción.

### Ejemplos

- Inventario de pan brioche — 240 piezas en dry storage, reorden a 80.
- Inventario de cerveza embotellada en barra — 48 unidades, rotación alta.
- Inventario de empaque delivery — cajas medianas, saldo crítico en fin de semana.

### Errores Frecuentes

- Confundir inventario teórico de receta con existencia real.
- No descontar merma ni consumo por prueba de cocina.
- Tratar compra en tránsito como inventario disponible.
- Unificar inventarios de sucursales distintas en análisis sin etiquetar.
- Ignorar caducidad porque el saldo numérico es positivo.

### Knowledge Dependencies

Para razonar sobre Inventario, el Cognitive Core debe conocer:

- **Ingrediente** y **Producto** — qué se almacena y para qué
- **Receta** — cuánto se consume por unidad vendida
- **Movimiento de Inventario** — cómo cambia el saldo
- **Proveedor** — fuente de reabastecimiento
- **Orden** — demanda que consume inventario
- **Configuración Operacional** — mínimos y alertas
- **KPI** — métricas de costo y rotación

### Cognitive Importance

★★★★★ **Fundamental**

El Inventario es la verdad material detrás del menú. Sin esta entidad, el Cognitive Core promete disponibilidad sin anclaje físico y no puede anticipar quiebres, calcular food cost real ni detectar fugas.

### Implicaciones para el Cognitive Core

La entidad Inventario convierte la oferta comercial en restricciones verificables. Permite al sistema alertar antes del agotamiento, explicar indisponibilidades, correlacionar ventas con consumo y detectar desviaciones entre lo que debería existir y lo que existe tras merma, robo o error de registro.

---

## Movimiento de Inventario

### Definición

El **Movimiento de Inventario** es la entidad que registra un cambio trazable en el saldo de un **Inventario** específico: cada ocasión en que entra, sale, se pierde o se corrige existencia por una causa identificable. Es la unidad atómica de trazabilidad del inventario.

**Qué no es:** El Movimiento de Inventario no es el saldo acumulado — modifica el saldo pero no lo reemplaza. No es una orden de compra — aunque la recepción de compra genera un movimiento de entrada. No es una orden de cliente — aunque la producción genera movimiento de salida. No es el proveedor ni el empleado — aunque registra quién o qué lo originó.

**Cómo existe en la operación:** Cada movimiento ocurre en un instante operativo con tipo, cantidad, ítem y motivo. Entrada cuando llega mercancía del proveedor. Salida cuando la cocina consume para producir o cuando se vende un ítem de inventario directo. Merma cuando hay desperdicio, caducidad o pérdida no vendible. Ajuste cuando un conteo físico corrige diferencia entre sistema y realidad.

### Propósito

Hacer auditable cada variación de existencia. Sin movimientos, el inventario es solo un número sin historia — imposible explicar discrepancias, calcular merma real o atribuir responsabilidad.

### Identidad

La identidad de un Movimiento de Inventario no depende del saldo resultante del inventario. No depende del proveedor en general — solo del evento específico.

Cada movimiento es único por su ocurrencia: dos entradas del mismo ítem el mismo día son movimientos distintos si ocurren en recepciones separadas. La identidad se establece por registro irreversible de un cambio en un inventario en un momento dado con un tipo definido.

Lo que NO cambia la identidad: corrección que anula y reemplaza mediante contra-movimiento vinculado — el original sigue siendo el mismo registro histórico.

Lo que SÍ crea entidad nueva: cada recepción, cada consumo, cada merma registrada, cada ajuste de conteo.

### Atributos

#### Obligatorios

- Identificador único del movimiento
- Inventario afectado
- Tipo de movimiento (entrada, salida, merma, ajuste)
- Cantidad y unidad de medida
- Fecha y momento de ocurrencia
- Saldo resultante o referencia al saldo posterior
- Motivo o causa operativa

#### Opcionales

- Empleado que registró o autorizó
- Proveedor asociado (en entradas)
- Orden o producción asociada (en salidas)
- Documento de recepción o factura de referencia
- Lote o caducidad (si aplica)
- Costo unitario al momento del movimiento
- Comentario o evidencia de merma
- Movimiento de corrección vinculado (si hubo error)

### Relaciones

- El Movimiento de Inventario modifica un **Inventario**
- El Movimiento de Entrada suele originarse de recepción de **Proveedor**
- El Movimiento de Salida se vincula a **Cocina**, **Receta** u **Orden**
- El Movimiento de Merma se relaciona con **KPIs** de desperdicio
- El Movimiento de Ajuste cierra brecha tras conteo físico
- El Movimiento es registrado por un **Empleado** con **Rol** autorizado
- Los movimientos consolidados explican variaciones de costo y disponibilidad

### Ciclo de Vida

**Registrado** — Capturado con tipo, cantidad y motivo.

**Validado** — Revisado y aceptado como parte del saldo oficial.

**Vinculado** — Asociado a documento origen (compra, orden, conteo).

**Corregido** — Error detectado; se genera contra-movimiento sin borrar historial.

**Consolidado** — Incorporado a reportes de periodo (consumo, merma, entradas).

**Archivado** — Antiguo pero consultable para auditoría histórica.

### Restricciones

- Todo cambio de saldo debe expresarse como movimiento — no hay ajuste silencioso.
- Los tipos permitidos son entrada, salida, merma y ajuste — no deben mezclarse sin clasificación clara.
- Merma no puede usarse para corregir errores de conteo — eso es ajuste.
- Salida por consumo debe ser coherente con producción o venta registrada.
- Entrada debe corresponder a recepción real — inventario ficticio distorsiona food cost y disponibilidad.
- Movimientos no se eliminan — se contrarrestan con movimientos inversos documentados.

### Ejemplos

- Entrada: recepción de 20 kg de carne molida del proveedor Cárnicos del Norte.
- Salida: consumo de 0.18 kg de carne por hamburguesa clásica producida en turno noche.
- Merma: 3 kg de lechuga descartada por caducidad en cámara fría.
- Ajuste: +2 unidades de salsa tras conteo semanal — diferencia con sistema.

### Errores Frecuentes

- Registrar consumo como ajuste para ocultar desviación de receta.
- Usar merma para robos sin investigación ni categoría correcta.
- No generar salida al producir — inventario inflado y food cost falso.
- Duplicar entrada por recepción y por factura como dos eventos independientes sin vínculo.
- Confundir movimiento con inventario — el movimiento es evento; el inventario es estado.

### Knowledge Dependencies

Para razonar sobre Movimiento de Inventario, el Cognitive Core debe conocer:

- **Inventario** — saldo que se modifica
- **Ingrediente** — qué ítem se mueve
- **Proveedor** — origen de entradas
- **Orden**, **Receta** y **Cocina** — origen de salidas
- **Empleado** y **Rol** — autorización y responsabilidad
- **KPI** — merma, consumo, variación de costo
- **Configuración Operacional** — políticas de registro y tolerancias

### Cognitive Importance

★★★★★ **Fundamental**

El Movimiento de Inventario es la narrativa del inventario. Sin movimientos, el Cognitive Core ve cantidades pero no puede explicar por qué cambiaron ni detectar patrones de fuga o ineficiencia.

### Implicaciones para el Cognitive Core

Esta entidad habilita trazabilidad causal completa del inventario: reconstruir historial, auditar merma, validar recepciones, detectar consumo anómalo por estación o turno, y separar pérdida operativa de error de registro. Es la base del razonamiento sobre integridad de existencias.

---

## Proveedor

### Definición

El **Proveedor** es la entidad que representa una organización o persona externa al **Restaurante** que suministra bienes o servicios necesarios para operar: ingredientes, bebidas, empaques, equipamiento, mantenimiento o insumos de limpieza. Es el punto de entrada de recursos del exterior hacia la operación.

**Qué no es:** El Proveedor no es un empleado. No es un cliente. No es un movimiento de inventario — aunque sus entregas lo generan. No es una compra individual a vendedor ocasional sin relación recurrente. No es la plataforma de delivery que entrega órdenes a clientes.

**Cómo existe en la operación:** El Proveedor existe como contraparte estable con la que el restaurante negocia precios, plazos, calidad y frecuencia de entrega. Aparece en órdenes de compra, recepciones, facturas y evaluaciones de desempeño. Su confiabilidad condiciona si el menú puede mantenerse completo.

### Propósito

Representar la dependencia del restaurante respecto al abastecimiento externo. Casi ningún restaurante produce sus propios insumos; el Proveedor es el eslabón que conecta la operación con la cadena de suministro.

### Identidad

La identidad del Proveedor no depende de una entrega específica. No depende del precio de hoy — los precios son atributos variables. No depende del contacto comercial asignado.

La identidad se establece por su designación como fuente reconocida de suministro con identificador único en el contexto del negocio. "Cárnicos del Norte" sigue siendo el mismo proveedor aunque cambie su lista de precios. Un proveedor que cesa operaciones conserva identidad histórica.

Lo que NO cambia la identidad: cambio de precios, cambio de días de entrega, cambio de representante de ventas.

Lo que SÍ crea entidad nueva: nuevo proveedor registrado; fusión empresarial tratada como nuevo actor si el negocio lo define así.

### Atributos

#### Obligatorios

- Identificador único de proveedor
- Nombre o razón social
- Categoría de suministro (proteínas, produce, bebidas, empaque, servicios, etc.)
- Estado (activo, suspendido, en evaluación, dado de baja)
- Restaurante(s) o sucursal(es) que abastece

#### Opcionales

- Datos de contacto y representante
- Condiciones de pago y crédito
- Días y ventanas de entrega
- Pedido mínimo y lead time
- Lista de ítems que suministra
- Calificación de calidad y cumplimiento
- Contrato o acuerdo marco vigente
- Proveedor de respaldo para categoría crítica
- Ubicación o zona de cobertura logística

### Relaciones

- El Proveedor abastece **Inventario** del **Restaurante** o **Sucursal**
- El Proveedor genera **Movimientos de Inventario** de entrada al recibirse mercancía
- El Proveedor suministra **Ingredientes** y otros insumos usados en **Recetas**
- El Proveedor es evaluado con **KPIs** de cumplimiento, calidad y precio
- El Proveedor interactúa con **Empleados** de compras, recepción y cocina
- El Proveedor se rige por **Configuración Operacional** y políticas de la **Sucursal**
- La indisponibilidad del Proveedor afecta disponibilidad de **Productos** en el **Menú**

### Ciclo de Vida

**Prospecto** — Identificado como opción, aún no autorizado para compras.

**Activo** — Suministrando regularmente con relación establecida.

**Preferente** — Principal fuente para una categoría de insumo.

**En observación** — Activo pero con incumplimientos recientes bajo revisión.

**Suspendido** — Temporalmente no autorizado para nuevos pedidos.

**Inactivo** — Relación terminada; solo historial de compras y recepciones.

### Restricciones

- Toda entrada de inventario de compra debe poder atribuirse a un proveedor o documentar excepción explícita.
- Un proveedor suspendido no debe recibir pedidos sin reactivación autorizada.
- Cambio de proveedor para ítem crítico requiere validación de calidad y receta.
- En franquicias, la libertad de elegir proveedor puede estar limitada por contrato de marca.
- Evaluación de proveedor debe basarse en hechos de entrega, no solo en precio unitario.

### Ejemplos

- Cárnicos del Norte — proveedor activo de proteínas, entrega martes y viernes.
- Distribuidora de empaques EcoPack — proveedor preferente de cajas delivery.
- Proveedor local de produce — en observación por dos entregas incompletas.

### Errores Frecuentes

- Tratar compra única en supermercado como proveedor estratégico sin registro.
- No vincular recepción al proveedor correcto — distorsiona evaluación y trazabilidad.
- Asumir que un distribuidor y un productor son la misma entidad sin verificar.
- Ignorar proveedor de respaldo hasta el agotamiento del principal.
- Confundir plataforma de delivery con proveedor de insumos.

### Knowledge Dependencies

Para razonar sobre Proveedor, el Cognitive Core debe conocer:

- **Inventario** y **Ingrediente** — qué se compra y almacena
- **Movimiento de Inventario** — entradas por recepción
- **Restaurante** y **Sucursal** — unidad que compra
- **Producto** y **Menú** — impacto de quiebre de suministro
- **Configuración Operacional** — políticas de compra
- **KPI** — cumplimiento, food cost, rotación
- **Empleado** y **Rol** — quién autoriza compras y recepciones

### Cognitive Importance

★★★★☆ **Alta**

El Proveedor es la frontera externa de control del restaurante. Sin esta entidad, el Cognitive Core trata el abastecimiento como magia instantánea y no puede gestionar riesgo de suministro ni optimizar costos de compra.

### Implicaciones para el Cognitive Core

La entidad Proveedor habilita razonamiento de dependencia y riesgo: anticipar quiebres por lead time, comparar fuentes, evaluar trade-offs calidad-precio-puntualidad, y explicar indisponibilidades del menú por fallas aguas arriba. Conecta operación interna con la economía externa.

---

## PARTE VI — PERSONAL

Las entidades de personal representan la capacidad humana que ejecuta la operación. Un restaurante sin empleados es un espacio vacío; con empleados mal definidos en roles y turnos, es un sistema imposible de coordinar. Estas entidades permiten al Cognitive Core razonar sobre quién hace qué, cuándo y con qué autoridad.

---

## Empleado

### Definición

El **Empleado** es la entidad que representa a una persona que trabaja para el **Restaurante** o **Sucursal** bajo acuerdo laboral: aporta trabajo, habilidad y criterio a cambio de compensación. Es el agente humano que cocina, sirve, cobra, supervisa, reparte y mantiene la operación en funcionamiento.

**Qué no es:** El Empleado no es un cliente, aunque coma en el local en descanso. No es un proveedor. No es un rol abstracto — una persona concreta ocupa roles. No es un turno — el turno es el periodo de trabajo; el empleado persiste entre turnos. No es el dueño que actúa solo como inversionista sin función operativa.

**Cómo existe en la operación:** El Empleado existe desde su alta en la dotación hasta su baja. Tiene nombre operativo, roles asignados, turnos programados, permisos y desempeño observable. Aparece en comandas, cajas, recepciones de inventario, atención a mesas y resolución de incidencias.

### Propósito

Materializar la capacidad laboral humana del restaurante. Toda producción, servicio y control requiere personas identificables con competencias y disponibilidad. Sin empleados como entidades, el sistema asume capacidad infinita e inmediata.

### Identidad

La identidad del Empleado no depende del turno de hoy. No depende del rol que desempeña esta semana — puede cambiar de función. No depende de su desempeño puntual.

La identidad se establece por la continuidad de la relación laboral con el negocio: la misma persona con el mismo identificador de empleado desde contratación hasta terminación. Si la persona es recontratada tras baja prolongada, puede ser nueva entidad según política del negocio.

Lo que NO cambia la identidad: cambio de rol, cambio de sucursal asignada, ascenso, cambio de turno habitual.

Lo que SÍ crea entidad nueva: nueva contratación; recontratación tratada como nuevo expediente.

### Atributos

#### Obligatorios

- Identificador único de empleado
- Nombre operativo
- Restaurante o Sucursal de adscripción principal
- Estado laboral (activo, en inducción, suspendido, de baja, terminado)
- Rol(es) que puede desempeñar
- Fecha de inicio de relación laboral

#### Opcionales

- Habilidades y certificaciones (manipulación de alimentos, bar, caja)
- Disponibilidad habitual
- Turno preferente o restricciones horarias
- Supervisor directo
- Historial de desempeño o capacitación
- Datos de contacto
- Autorizaciones especiales (descuentos, ajustes de inventario)
- Costo laboral referencial por hora o salario

### Relaciones

- El Empleado pertenece a un **Restaurante** o **Sucursal**
- El Empleado desempeña uno o más **Roles**
- El Empleado trabaja en **Turnos** programados
- El Empleado opera en **Cocina**, **Estaciones** o zonas de servicio
- El Empleado registra **Movimientos de Inventario**, **Pagos**, **Tickets**
- El Empleado atiende **Clientes**, **Reservas** y **Mesas**
- El Empleado puede recibir o resolver **Reclamaciones**
- El Empleado contribuye a **KPIs** de productividad, tiempos y satisfacción

### Ciclo de Vida

**En reclutamiento** — Candidato en proceso, aún no activo operativamente.

**En inducción** — Contratado, en capacitación inicial con supervisión reforzada.

**Activo** — Desempeña funciones con autonomía según rol.

**En capacitación continua** — Activo con entrenamiento para nuevas funciones.

**Suspendido** — Temporalmente sin turnos por disciplina o investigación.

**De baja** — Ausencia temporal (incapacidad, permiso) sin terminación.

**Terminado** — Relación laboral finalizada. Registro histórico.

### Restricciones

- Todo empleado activo debe tener al menos un rol definido.
- Acciones que afectan dinero, inventario o compensaciones requieren rol autorizado.
- Un empleado no puede estar en dos turnos superpuestos en la misma sucursal.
- Menores de edad y permisos laborales locales restringen roles y horarios.
- Empleado terminado no debe aparecer en programación futura sin recontratación explícita.

### Ejemplos

- María López — empleada activa, roles mesera y hostess, Sucursal Centro.
- Carlos Ruiz — cocinero de línea, estación parrilla, turno nocturno.
- Ana Torres — gerente de turno con autorización de descuentos hasta 15%.

### Errores Frecuentes

- Tratar usuario del sistema sin vínculo laboral como empleado.
- No actualizar roles tras promoción — permisos desalineados.
- Programar empleado terminado por error de calendario.
- Confundir repartidor de plataforma externa con empleado del restaurante.
- Asumir que todo el personal presente en cocina tiene el mismo nivel de autoridad.

### Knowledge Dependencies

Para razonar sobre Empleado, el Cognitive Core debe conocer:

- **Rol** — qué puede hacer y autorizar
- **Turno** — cuándo está disponible
- **Restaurante** y **Sucursal** — dónde opera
- **Cocina**, **Estación**, **Mesa** — dónde se asigna
- **Configuración Operacional** — políticas de personal
- **Orden**, **Pago**, **Inventario** — acciones que ejecuta
- **KPI** — métricas de desempeño

### Cognitive Importance

★★★★★ **Fundamental**

El Empleado es el ejecutor de casi toda acción operativa. Sin esta entidad, el Cognitive Core describe procesos sin agentes responsables ni restricciones de capacidad humana.

### Implicaciones para el Cognitive Core

La entidad Empleado ancla accountability y capacidad: quién autorizó un descuento, quién registró merma, quién atendió una mesa, cuántas personas hay en servicio. Permite detectar sobrecarga, asignar tareas coherentes con rol y explicar variaciones de desempeño por dotación.

---

## Rol

### Definición

El **Rol** es la entidad que representa un conjunto definido de responsabilidades, competencias y autorizaciones dentro del **Restaurante**: la función que un **Empleado** puede desempeñar y lo que esa función permite hacer, decidir y supervisar.

**Qué no es:** El Rol no es la persona — varios empleados pueden compartir rol. No es un turno — el turno es temporal; el rol es estructural. No es un puesto en nómina con salario — aunque suelen correlacionar. No es un permiso de sistema aislado — el rol agrupa permisos con sentido operativo.

**Cómo existe en la operación:** El Rol existe como definición estable del negocio: cajero, cocinero, mesero, gerente de turno, repartidor, almacenista. Cuando un empleado inicia turno como cajero, opera bajo las reglas de ese rol. Los roles determinan quién puede abrir caja, aprobar descuentos, ajustar inventario o cerrar turno.

### Propósito

Estructurar la división del trabajo y los límites de autoridad. Sin roles, cada empleado sería intercambiable sin restricciones — inaceptable en operaciones con dinero, alimentos y seguridad.

### Identidad

La identidad del Rol no depende de quién lo ocupa hoy. No depende del turno. No depende del restaurante en operaciones donde el rol es corporativo — aunque puede tener variaciones locales.

La identidad se establece por su designación nominal única en el contexto organizacional: "Gerente de Turno", "Cocinero de Línea", "Cajero". Si se redefine ampliamente la función con nuevo nombre operativo, puede constituir rol nuevo.

Lo que NO cambia la identidad: ajuste de permisos menores, adición de tarea compatible, cambio de empleado asignado.

Lo que SÍ crea entidad nueva: creación de rol no existente ("Expediter", "Barista Lead"); fusión de dos roles en uno con identidad nueva.

### Atributos

#### Obligatorios

- Identificador único de rol
- Nombre del rol
- Ámbito de aplicación (restaurante, sucursal, marca)
- Responsabilidades principales
- Autorizaciones que otorga (operativas, financieras, inventario)
- Estado (activo, obsoleto)

#### Opcionales

- Nivel jerárquico o reporta a
- Roles que puede supervisar
- Estaciones o zonas típicas de asignación
- Certificaciones requeridas
- Límites numéricos (descuento máximo, ajuste de inventario)
- Compatibilidad con otros roles en mismo turno
- Descripción de tareas estándar

### Relaciones

- El Rol es desempeñado por **Empleados**
- El Rol opera en **Turnos** con expectativas distintas según franja
- El Rol define quién actúa en **Cocina**, **Estaciones**, caja o servicio
- El Rol determina quién registra **Movimientos de Inventario** o **Pagos**
- El Rol establece quién resuelve **Reclamaciones** o autoriza compensaciones
- El Rol se alinea con **Configuración Operacional** de permisos
- El Rol se evalúa mediante **KPIs** relevantes a su función

### Ciclo de Vida

**Definido** — Creado en estructura organizacional antes de asignarse.

**Activo** — En uso con empleados asignados.

**En revisión** — Funciones o permisos bajo actualización.

**Restringido** — Temporalmente con permisos reducidos por política.

**Obsoleto** — Reemplazado por otro rol; no asignable a nuevos empleados.

**Retirado** — Fuera de catálogo; referencia histórica en registros.

### Restricciones

- Toda acción sensible debe mapear a un rol autorizado — no a individuos ad hoc.
- Un empleado sin rol activo no debe ejecutar funciones que requieran autorización.
- Roles con autoridad financiera deben tener límites explícitos alineados a configuración.
- Separación de funciones críticas (caja vs. inventario) según política antifraude del negocio.
- Rol obsoleto no se asigna en nueva programación.

### Ejemplos

- Rol Cajero — cobra órdenes, abre y cierra caja, descuentos hasta 10%.
- Rol Cocinero de Línea — produce en estación asignada, registra merma operativa.
- Rol Gerente de Turno — supervisa turno, autoriza compensaciones y ajustes mayores.

### Errores Frecuentes

- Dar permisos individuales sin rol — imposible de auditar y escalar.
- Confundir rol con turno ("turno de cajero" es turno con rol cajero).
- Asumir que gerente puede todo sin límites documentados.
- No retirar rol obsoleto del catálogo — asignaciones inválidas.
- Mezclar rol operativo con cargo administrativo de nómina sin distinguir autorizaciones.

### Knowledge Dependencies

Para razonar sobre Rol, el Cognitive Core debe conocer:

- **Empleado** — quién desempeña el rol
- **Turno** — cuándo aplica la responsabilidad
- **Configuración Operacional** — límites y políticas
- **Orden**, **Pago**, **Descuento** — acciones autorizadas
- **Inventario** y **Movimiento de Inventario** — permisos de ajuste
- **Reclamación** — niveles de resolución
- **KPI** — métricas por función

### Cognitive Importance

★★★★☆ **Alta**

El Rol es la gramática de autoridad y responsabilidad. Sin roles, el Cognitive Core no puede validar si una acción estaba permitida ni recomendar escalamiento correcto.

### Implicaciones para el Cognitive Core

La entidad Rol permite validación normativa en tiempo real: ¿puede este empleado aprobar este descuento? ¿quién debe resolver esta reclamación? ¿qué estaciones puede operar? Convierte permisos dispersos en estructura cognitiva coherente.

---

## Turno

### Definición

El **Turno** es la entidad que representa un periodo definido de trabajo dentro del **Restaurante** o **Sucursal** durante el cual un conjunto de **Empleados** con **Roles** específicos está programado para operar: la unidad temporal que organiza la dotación diaria o semanal.

**Qué no es:** El Turno no es el empleado. No es el rol en abstracto — es la instancia temporal donde el rol se cumple. No es el horario de apertura del restaurante — aunque se alinea con él. No es una orden de servicio ni un ticket de venta.

**Cómo existe en la operación:** El Turno existe como bloque en la programación: matutino 07:00–15:00, vespertino 15:00–23:00, o turno partido en fines de semana. Agrupa quién cocina, quién atiende mesas, quién está en caja. Al abrir y cerrar turno, se entregan responsabilidades, cajas e inventarios críticos.

### Propósito

Coordinar la disponibilidad humana en el tiempo. La demanda del restaurante varía por hora y día; los turnos alinean capacidad laboral con esa variación y establecen ventanas de accountability.

### Identidad

La identidad del Turno no depende de las ventas del periodo. No depende de qué empleado lo cubre en caso de relevo — aunque el relevo modifica asignaciones.

Cada instancia de turno es única: el turno matutino del lunes 15 de marzo no es el del martes 16, aunque compartan plantilla. La identidad se establece por combinación de sucursal, fecha, franja horaria definida y tipo de turno en la programación.

Lo que NO cambia la identidad: cambio de empleado por ausencia con sustituto; extensión de una hora por congestión.

Lo que SÍ crea entidad nueva: cada bloque programado distinto en fecha y franja.

### Atributos

#### Obligatorios

- Identificador único del turno
- Restaurante o Sucursal
- Fecha y franja horaria (inicio y fin programados)
- Tipo de turno (matutino, vespertino, nocturno, completo, etc.)
- Estado (programado, en curso, cerrado, cancelado)
- Empleados asignados con sus roles

#### Opcionales

- Responsable de turno o gerente de turno
- Dotación mínima requerida vs. asignada
- Estaciones y zonas cubiertas
- Ventas o métricas del turno al cierre
- Incidencias registradas en el periodo
- Hora real de apertura y cierre operativo
- Costo laboral del turno
- Notas de entrega entre turnos

### Relaciones

- El Turno pertenece a un **Restaurante** o **Sucursal**
- El Turno asigna **Empleados** en **Roles**
- El Turno cubre **Cocina**, **Estaciones**, salón y caja
- El Turno procesa **Órdenes** y genera **Ventas** en su ventana
- El Turno registra **Movimientos de Inventario** y mermas del periodo
- El Turno concentra **Reclamaciones** y **Feedback** recibidos en franja
- El Turno alimenta **KPIs** por hora, productividad y labor cost

### Ciclo de Vida

**Programado** — Definido en schedule futuro con dotación planificada.

**Confirmado** — Empleados notificados y aceptados para la fecha.

**En apertura** — Inicio de entrega de área, caja o estación.

**En curso** — Operación activa bajo responsabilidad del turno.

**En cierre** — Conciliación de caja, inventarios críticos, entrega al siguiente turno.

**Cerrado** — Finalizado con registro de resultados.

**Cancelado** — No operó por cierre del local o evento excepcional.

### Restricciones

- Turnos superpuestos del mismo empleado en la misma sucursal no son válidos.
- Apertura de caja requiere rol autorizado y turno en curso o apertura formal.
- Cierre de turno debe documentar entrega a siguiente responsable o cierre de local.
- Dotación por debajo del mínimo de configuración activa alerta o restricción de menú/canales.
- Métricas históricas deben etiquetarse por turno para comparación válida.

### Ejemplos

- Turno matutino Sucursal Centro — lunes 15/03, 07:00–15:00, 8 empleados, gerente Ana Torres.
- Turno vespertino fin de semana — alta dotación en cocina y caja por demanda esperada.
- Turno cancelado — cierre por contingencia climática; local no abrió.

### Errores Frecuentes

- Mezclar métricas de dos turnos en un solo bucket sin frontera temporal.
- Programar turno sin rol crítico (caja o cocina) cubierto.
- No registrar hora real de cierre — distorsiona KPIs de productividad.
- Tratar horario del restaurante como turno sin empleados asignados.
- Ignorar entrega entre turnos — pierde continuidad de incidencias abiertas.

### Knowledge Dependencies

Para razonar sobre Turno, el Cognitive Core debe conocer:

- **Empleado** y **Rol** — quién trabaja y con qué función
- **Restaurante**, **Sucursal** y **Configuración Operacional**
- **Cocina** y **Estación** — capacidad productiva del periodo
- **Orden**, **Ticket**, **Pago** — actividad transaccional
- **Inventario** — consumo y merma por franja
- **KPI** — metas por turno
- **Reclamación** y **Feedback** — experiencia en ventana temporal

### Cognitive Importance

★★★★☆ **Alta**

El Turno es la unidad temporal de accountability operativa. Sin turnos, el Cognitive Core agrega datos sin saber en qué condiciones de dotación ocurrieron.

### Implicaciones para el Cognitive Core

La entidad Turno permite análisis contextualizado: comparar desempeño entre franjas, detectar sobrecarga en noches con dotación reducida, atribuir incidencias al periodo correcto y planificar personal según patrones históricos por turno.

---

## PARTE VII — MEDICIÓN Y RETROALIMENTACIÓN

Las entidades de medición y retroalimentación cierran el ciclo entre operación y mejora. Producir y vender no basta: el restaurante debe saber si cumple metas y qué perciben quienes lo experimentan. Estas entidades traducen realidad operativa en señales evaluables y voces del cliente en conocimiento accionable.

---

## KPI

### Definición

El **KPI** (indicador clave de desempeño) es la entidad que representa una métrica prioritaria seleccionada para evaluar si una dimensión crítica del **Restaurante** o **Sucursal** alcanza el nivel esperado: ticket promedio, tiempo de preparación, porcentaje de merma, tasa de reclamaciones, órdenes por hora o food cost.

**Qué no es:** El KPI no es cualquier dato disponible — es métrica con relevancia estratégica y meta definida. No es un reporte completo. No es un objetivo vago ("mejorar servicio"). No es la venta cruda sin contexto — aunque puede derivarse de ventas. No es un evento aislado.

**Cómo existe en la operación:** El KPI existe como definición vigente con nombre, fórmula conceptual, meta, frecuencia de medición y alcance. Se monitorea en turno, día, semana o mes. Cuando se desvía de la meta, activa atención del gerente o del Cognitive Core.

### Propósito

Concentrar atención en pocas señales que importan. La operación genera datos abundantes; los KPIs filtran ruido y alinean **Empleados**, procesos y decisiones con resultados medibles.

### Identidad

La identidad del KPI no depende del valor de hoy — los valores cambian cada periodo. No depende de una sucursal si el KPI es corporativo — aunque puede tener instancias por sucursal.

La identidad se establece por su definición nominal y alcance: "Food Cost % Sucursal Centro" es distinto de "Tiempo Promedio Entrega Delivery Red". Cambiar la fórmula de forma sustancial puede crear versión nueva del KPI, pero el indicador con mismo nombre y definición persiste.

Lo que NO cambia la identidad: cambio de meta; cambio de valor medido en un periodo.

Lo que SÍ crea entidad nueva: nuevo indicador con definición distinta; KPI homónimo con fórmula incompatible sin continuidad documentada.

### Atributos

#### Obligatorios

- Identificador único del KPI
- Nombre del indicador
- Definición operativa de qué mide
- Alcance (restaurante, sucursal, canal, turno, estación)
- Meta o rango objetivo
- Frecuencia de medición (por turno, diaria, semanal, mensual)
- Estado (activo, en revisión, suspendido)

#### Opcionales

- Fórmula o componentes conceptuales
- Umbral de alerta (amarillo, rojo)
- Responsable del indicador
- Fuente de datos operativos que alimenta el KPI
- Benchmark histórico o entre sucursales
- Relación con incentivos o evaluación de personal
- Fecha de última revisión de definición
- Versión de definición

### Relaciones

- El KPI evalúa **Restaurante**, **Sucursal**, **Canal** o **Turno**
- El KPI puede medir **Ventas**, tiempos de **Orden**, **merma** de **Inventario**
- El KPI monitorea **Reclamaciones** y **Feedback** agregados
- El KPI refleja desempeño de **Cocina**, **Estaciones** y **Empleados**
- El KPI se define en **Configuración Operacional** o política corporativa
- El KPI guía respuesta ante desviaciones con **Roles** responsables
- El KPI conecta operación con metas de **marca** o **franquicia**

### Ciclo de Vida

**Propuesto** — Identificado como candidato, aún no oficial.

**Activo** — En monitoreo regular con meta vigente.

**En alerta** — Desviación significativa respecto a meta.

**En revisión** — Definición o meta bajo reevaluación.

**Suspendido** — Temporalmente fuera de dashboard por cambio operativo.

**Retirado** — Reemplazado por otro indicador; histórico preservado.

### Restricciones

- KPI sin meta es dato, no indicador — debe tener objetivo explícito.
- Demasiados KPIs activos diluyen foco — priorizar pocos críticos.
- La definición debe ser estable en el periodo comparado — cambios rompen tendencia.
- KPI debe ser medible con datos confiables de la operación.
- Optimizar un KPI no debe contradecir otros críticos sin reconocimiento explícito (velocidad vs. calidad).

### Ejemplos

- KPI: tiempo promedio de entrega delivery < 35 minutos, medición diaria.
- KPI: food cost < 32% de ventas, revisión semanal por sucursal.
- KPI: tasa de reclamaciones < 2% de órdenes, monitoreo mensual.

### Errores Frecuentes

- Llamar KPI a cualquier columna de un reporte.
- Cambiar definición sin versionar — histórico incomparable.
- Fijar meta irreal que incentiva manipulación de datos.
- Medir KPI de sucursal con datos mezclados de otra unidad.
- Optimizar velocidad de cocina degradando satisfacción sin balance explícito.

### Knowledge Dependencies

Para razonar sobre KPI, el Cognitive Core debe conocer:

- **Orden**, **Ticket**, **Pago** — ventas y tiempos
- **Inventario** y **Movimiento de Inventario** — food cost y merma
- **Cocina**, **Estación**, **Turno** — desempeño operativo
- **Reclamación** y **Feedback** — experiencia del cliente
- **Configuración Operacional** — metas y umbrales
- **Empleado** y **Rol** — accountability
- **Sucursal** — alcance comparativo

### Cognitive Importance

★★★★☆ **Alta**

El KPI es la brújula de desempeño. Sin KPIs definidos, el Cognitive Core describe la operación sin criterio de éxito ni detección sistemática de desviación.

### Implicaciones para el Cognitive Core

La entidad KPI habilita razonamiento evaluativo: detectar anomalías, priorizar alertas, correlacionar métricas, evaluar impacto de cambios y recomendar intervenciones con base en brecha respecto a meta — no en intuición.

---

## Feedback

### Definición

El **Feedback** es la entidad que representa cualquier retroalimentación expresada por un **Cliente** (o por quien vivió la experiencia) sobre su percepción del **Restaurante**: opiniones, valoraciones, comentarios, sugerencias o reconocimientos sobre comida, servicio, ambiente, tiempos o valor. Es la voz del comensal capturada para escuchar y aprender.

**Qué no es:** El Feedback no es una **Reclamación** — aunque puede ser negativo. La reclamación exige resolución de un problema concreto; el feedback puede ser neutro, positivo o constructivo sin solicitud formal de compensación. No es un KPI — aunque los KPIs pueden agregar feedback. No es una orden ni un pago.

**Cómo existe en la operación:** El Feedback existe cuando alguien comunica su percepción: encuesta post-visita, comentario en tablet, valoración de estrellas al pagar, nota al mesero, reseña pública o respuesta de satisfacción por mensaje. Puede ser breve ("todo excelente") o detallado ("la hamburguesa estaba bien pero el servicio fue lento").

### Propósito

Capturar la experiencia del cliente más allá de la transacción económica. Las ventas dicen qué compraron; el feedback dice qué sintieron. Sin esta entidad, el restaurante optimiza números sin entender percepción.

### Identidad

La identidad del Feedback no depende del sentimiento — el mismo cliente puede dar feedback positivo y negativo en momentos distintos. No depende del canal de venta de la orden asociada.

Cada instancia de feedback es única: dos comentarios del mismo cliente el mismo día son entidades distintas si son comunicaciones separadas. La identidad se establece por registro de una expresión de percepción en un momento dado con origen identificable.

Lo que NO cambia la identidad: reclasificación interna de sentimiento; vinculación posterior a una orden.

Lo que SÍ crea entidad nueva: cada encuesta respondida, cada comentario registrado, cada reseña publicada como unidad capturada.

### Atributos

#### Obligatorios

- Identificador único del feedback
- Origen (encuesta, comentario en local, reseña externa, mensaje, etc.)
- Fecha y momento de captura
- Contenido o resumen de la retroalimentación
- Sentimiento o polaridad (positivo, neutro, negativo, mixto)
- Restaurante o Sucursal referida

#### Opcionales

- Cliente asociado (si identificado)
- Orden o visita vinculada
- Canal de servicio (salón, delivery, pickup)
- Puntuación numérica (estrellas, NPS, escala)
- Aspectos mencionados (comida, servicio, tiempo, ambiente, precio)
- Empleado o turno en contexto
- Respuesta del restaurante
- Etiquetas temáticas para análisis
- Visibilidad (privada, pública)

### Relaciones

- El Feedback proviene de un **Cliente** o visitante
- El Feedback referencia **Restaurante** o **Sucursal**
- El Feedback puede vincularse a **Orden**, **Mesa** o **Canal**
- El Feedback describe experiencia de **Productos**, servicio y tiempos
- El Feedback se contrasta con **KPIs** de satisfacción
- El Feedback negativo severo puede escalar a **Reclamación**
- El Feedback es atendido por **Empleados** con **Roles** de servicio o gerencia
- El Feedback informa mejoras en **Cocina**, **Menú** y **Configuración Operacional**

### Ciclo de Vida

**Capturado** — Registrado desde encuesta, comentario o plataforma.

**Clasificado** — Sentimiento y temas asignados para análisis.

**Revisado** — Visto por personal o sistema; priorizado si es crítico.

**Respondido** — El restaurante acusa recibo o agradece (especialmente en reseñas públicas).

**Escalado** — Convertido en reclamación si requiere resolución formal.

**Archivado** — Incorporado a histórico y tendencias de satisfacción.

### Restricciones

- Feedback no sustituye reclamación cuando hay daño que exige compensación o investigación formal.
- Reseñas públicas son feedback con visibilidad externa — requieren protocolo de respuesta distinto.
- Feedback anónimo limita seguimiento individual pero conserva valor agregado.
- No toda crítica leve es reclamación — forzar escalamiento frustra al cliente y al staff.
- Agregación de feedback debe respetar periodo y sucursal para comparación válida.

### Ejemplos

- Encuesta post-pedido delivery: 5 estrellas, "llegó caliente y completo".
- Comentario en local: "música muy alta, comida buena" — neutro/mixto.
- Reseña pública: 4 estrellas elogiando hamburguesa, sugiere más opciones veganas.

### Errores Frecuentes

- Tratar todo feedback negativo como reclamación — sobrecarga proceso formal.
- Ignorar feedback positivo — pierde refuerzo de prácticas que funcionan.
- No vincular feedback a turno o estación — imposible diagnosticar causa.
- Responder genéricamente a reseñas sin abordar el punto mencionado.
- Confundir NPS del mes con un único feedback — uno es agregado, otro es instancia.

### Knowledge Dependencies

Para razonar sobre Feedback, el Cognitive Core debe conocer:

- **Cliente** — quién expresa la percepción
- **Orden**, **Canal**, **Mesa** — contexto de la experiencia
- **Producto**, **Cocina**, **Empleado** — objetos de la opinión
- **Reclamación** — cuándo escalar
- **KPI** — satisfacción agregada
- **Turno** — cuándo ocurrió la experiencia
- **Restaurante** y **Sucursal** — alcance

### Cognitive Importance

★★★★☆ **Alta**

El Feedback es la señal cualitativa complementaria a los números. Sin él, el Cognitive Core optimiza métricas que el cliente puede percibir distinto.

### Implicaciones para el Cognitive Core

La entidad Feedback habilita razonamiento sobre experiencia percibida: detectar tendencias de satisfacción, identificar temas recurrentes, distinguir queja informal de caso formal, priorizar respuesta pública y cerrar el ciclo entre operación y percepción del comensal.

---

## Reclamación

### Definición

La **Reclamación** es la entidad que representa una expresión formal de insatisfacción del **Cliente** ante un fallo concreto en la experiencia con el **Restaurante**: comida incorrecta o de mala calidad, espera excesiva, cobro erróneo, incidente de servicio o incumplimiento de lo prometido, con expectativa de reconocimiento, corrección o compensación.

**Qué no es:** La Reclamación no es **Feedback** genérico — aunque puede originarse de feedback negativo. No es una sugerencia de mejora sin agravio. No es una pregunta operativa ("¿lleva gluten?"). No es una orden nueva. No es un KPI — aunque las reclamaciones se miden como tasa.

**Cómo existe en la operación:** La Reclamación existe cuando el cliente manifiesta que algo salió mal y espera que el restaurante actúe: mesero recibe queja en mesa, cliente llama tras delivery incompleto, gerente atiende caso de cobro duplicado. Se documenta, se clasifica, se resuelve y se cierra con compensación, disculpa, reproducción del producto o escalamiento.

### Propósito

Canalizar la insatisfacción con impacto real en un proceso de resolución. Las reclamaciones son señales de falla operativa y oportunidad de recuperar confianza. Sin esta entidad, los problemas graves se diluyen en comentarios generales sin trazabilidad ni cierre.

### Identidad

La identidad de la Reclamación no depende del estado de resolución — abierta y cerrada son la misma reclamación. No depende de la compensación final otorgada.

Cada caso es único: dos problemas del mismo cliente en la misma visita pueden ser una o dos reclamaciones según si son incidentes separados. La identidad se establece por registro de un agravio específico con expectativa de respuesta del restaurante.

Lo que NO cambia la identidad: cambio de estado de abierta a resuelta; aumento de compensación en negociación.

Lo que SÍ crea entidad nueva: cada incidente documentado como caso formal distinto.

### Atributos

#### Obligatorios

- Identificador único de la reclamación
- Cliente o comensal afectado
- Restaurante o Sucursal
- Fecha y momento del incidente o reporte
- Descripción del problema
- Categoría (calidad de comida, tiempo, exactitud, servicio, cobro, entrega, etc.)
- Severidad (leve, moderada, grave, crítica)
- Estado (abierta, en investigación, resuelta, cerrada sin acción, escalada)

#### Opcionales

- Orden asociada
- Productos o ítems involucrados
- Canal (salón, delivery, pickup)
- Empleado que recibió o resolvió
- Turno en contexto
- Compensación otorgada (reemplazo, descuento, reembolso)
- Tiempo hasta resolución
- Causa raíz identificada
- Acción preventiva derivada
- Evidencia (foto, ticket)

### Relaciones

- La Reclamación es presentada por un **Cliente**
- La Reclamación afecta a **Restaurante** o **Sucursal**
- La Reclamación se vincula a **Orden**, **Ítem de Orden** o **Pago**
- La Reclamación puede originarse desde **Feedback** negativo escalado
- La Reclamación es atendida por **Empleados** según **Rol** y autorización
- La Reclamación puede generar **Descuento**, reembolso o reproducción en **Cocina**
- La Reclamación alimenta **KPIs** de tasa de reclamación y recuperación
- La Reclamación revela fallas en **Cocina**, **Inventario**, **Canal** o **Configuración Operacional**

### Ciclo de Vida

**Reportada** — Cliente expresa agravio; caso registrado.

**Clasificada** — Categoría y severidad asignadas.

**En investigación** — Se reconstruye qué ocurrió con cocina, caja o delivery.

**En resolución** — Se ejecuta compensación o corrección acordada.

**Resuelta** — Cliente recibe solución; caso cerrado satisfactoriamente.

**Escalada** — Requiere gerencia superior o área corporativa.

**Cerrada sin acción** — Caso infundado o fuera de alcance; documentado igualmente.

### Restricciones

- Toda reclamación grave debe documentarse aunque se resuelva en el momento.
- Compensación debe respetar límites de **Rol** y **Configuración Operacional**.
- Resolución no borra el registro — el histórico alimenta prevención.
- Reclamación de inocuidad o alérgenos tiene prioridad y protocolo elevado.
- No confundir cancelación de orden con reclamación — pueden coexistir pero son distintas.

### Ejemplos

- Reclamación por hamburguesa cruda — severidad grave, reemplazo y disculpa del gerente.
- Reclamación por delivery incompleto — falta bebida en orden #8832, reenvío sin costo.
- Reclamación por cobro duplicado en tarjeta — escalada a caja y administración.

### Errores Frecuentes

- Resolver en mesa sin registrar — pierde patrón detectable de fallas.
- Tratar sugerencia amable como reclamación — burocratiza innecesariamente.
- Otorgar compensación fuera de política sin documentar excepción.
- No vincular reclamación a producto o estación — no hay aprendizaje operativo.
- Cerrar caso sin causa raíz en incidentes recurrentes.

### Knowledge Dependencies

Para razonar sobre Reclamación, el Cognitive Core debe conocer:

- **Cliente** — quién reporta
- **Orden**, **Pago**, **Producto** — qué falló
- **Feedback** — origen posible de escalamiento
- **Empleado**, **Rol**, **Turno** — quién atiende y quién estaba en contexto
- **Cocina**, **Canal**, **Delivery** — dónde ocurrió la falla
- **Descuento** y **Configuración Operacional** — límites de compensación
- **KPI** — tasas y tiempos de resolución

### Cognitive Importance

★★★★☆ **Alta**

La Reclamación es la señal de alarma operativa con obligación de cierre. Sin esta entidad, el Cognitive Core ve satisfacción baja pero no casos accionables con responsabilidad y resolución.

### Implicaciones para el Cognitive Core

La entidad Reclamación habilita razonamiento de recuperación de servicio: priorizar por severidad, validar compensaciones, detectar patrones por producto o turno, medir efectividad de resolución y alimentar prevención en cocina, logística y capacitación.

---

## APÉNDICE A — CATÁLOGO DE ENTIDADES

| Parte | Dominio | Entidades |
| :--- | :--- | :--- |
| I | Organización | Restaurante, Sucursal, Configuración Operacional |
| II | Oferta | Menú, Categoría, Producto, Platillo, Bebida, Combo, Ingrediente, Receta, Promoción, Descuento |
| III | Transacción | Orden, Ítem de Orden, Ticket, Pago, Método de Pago |
| IV | Cliente y Servicio | Cliente, Reserva, Mesa, Zona, Canal, Delivery, Pickup |
| V | Producción e Inventario | Cocina, Estación, Inventario, Movimiento de Inventario, Proveedor |
| VI | Personal | Empleado, Rol, Turno |
| VII | Medición y Retroalimentación | KPI, Feedback, Reclamación |

**Total: 36 entidades del dominio restaurante.**

---

## APÉNDICE B — CORRESPONDENCIA ENTIDAD ↔ ONTOLOGÍA (RKS-001)

| Entidad RKS-003 | Concepto(s) ontológico(s) RKS-001 |
| :--- | :--- |
| Restaurante | Restaurant (Space) |
| Sucursal | Restaurant / Business (Space / Abstraction) |
| Configuración Operacional | Constraint, Schedule (Abstraction) |
| Menú | Menu (Artifact) |
| Categoría | Menu structure (Artifact) |
| Producto, Platillo, Bebida, Combo | Menu Item (Artifact) |
| Ingrediente | Ingredient (Object) |
| Receta | Recipe (Artifact) |
| Promoción | Promotion (Agreement) |
| Descuento | Discount (Abstraction) |
| Orden | Order (Agreement) |
| Ítem de Orden | Order Line (Agreement) |
| Ticket | Transaction record (Event / Abstraction) |
| Pago | Payment (Event) |
| Método de Pago | Payment method (Abstraction) |
| Cliente | Customer (Agent) |
| Reserva | Reservation (Agreement) |
| Mesa | Table (Object / Space) |
| Zona | Dining Area (Space) |
| Canal | Fulfillment method (Abstraction) |
| Delivery | Delivery (Event) |
| Pickup | Takeout / Service (Event) |
| Cocina | Kitchen (Space) |
| Estación | Station (Space) |
| Inventario | Inventory (Abstraction) |
| Movimiento de Inventario | Inventory movement / Production consumption (Event) |
| Proveedor | Supplier (Agent) |
| Empleado | Employee (Agent) |
| Rol | Employee capability / Task assignment (Abstraction) |
| Turno | Shift (Abstraction) |
| KPI | Metric (Abstraction) |
| Feedback | Review / Survey response (Abstraction) |
| Reclamación | Complaint (Abstraction) |

Esta correspondencia no redefine la ontología. Establece cómo las entidades operacionales del dominio se anclan en las categorías de existencia definidas en RKS-001.

---

## APÉNDICE C — VERIFICACIÓN DE COMPLETITUD

| Requisito | Estado |
| :--- | :--- |
| 36 entidades mínimas definidas con las 12 secciones obligatorias | ✅ (36 de 36) |
| Parte I — Organización (3 entidades) | ✅ |
| Parte II — Oferta (10 entidades) | ✅ |
| Parte III — Transacción (5 entidades) | ✅ |
| Parte IV — Cliente y Servicio (7 entidades) | ✅ |
| Parte V — Producción e Inventario (5 entidades) | ✅ |
| Parte VI — Personal (3 entidades) | ✅ |
| Parte VII — Medición y Retroalimentación (3 entidades) | ✅ |
| Identidad, Atributos, Ciclo de Vida y Knowledge Dependencies por entidad | ✅ |
| Movimiento de Inventario con tipos entrada, salida, merma, ajuste | ✅ |
| Feedback distinto de Reclamación | ✅ |
| Producto ≠ Ítem de Orden ≠ Ticket ≠ Orden explícitamente distinguidos | ✅ |
| Definiciones operacionales con profundidad, no superficiales | ✅ |
| Sin especificación de software ni tecnología | ✅ |
| Sin referencias a IA, embeddings ni MCP | ✅ |
| Anclaje en RKS-001 y RKS-002 sin redefinir ontología ni vocabulario | ✅ |
| Listo como referencia para Cognitive Core y RKS-004+ | ✅ |

---

## APÉNDICE D — METADATOS DEL DOCUMENTO

| Campo | Valor |
| :--- | :--- |
| **ID** | RKS-003 |
| **Título** | Restaurant Entities |
| **Tipo** | Catálogo de Entidades del Dominio |
| **Dominio** | Operaciones de Restaurante |
| **Escuela** | Restaurant Knowledge School |
| **Nivel Cognitivo** | Nivel 2 — Entidades |
| **Estado** | Fundamento Permanente |
| **Versión** | 1.0.0 |
| **Creado** | 2026-06-28 |
| **Autor** | Chief Product Architect |
| **Dependencias** | RKS-001, RKS-002, KFS-001 |
| **Precede** | RKS-004 (Restaurant Relationships) |
| **Documentos relacionados** | RKS-001, RKS-002, KFS-001, THE_CONSTITUTION_OF_RESTAURANT_OS.md |
| **Estado de validación** | Teórico (pendiente de aplicación en RKS-004 y módulos de inteligencia) |
| **Confianza** | Alta — derivado de ontología RKS-001, vocabulario RKS-002 y operación restaurante establecida |
| **Extensión** | ~4,000 líneas, 36 entidades, 7 partes |

---

*Fin de RKS-003 — Restaurant Entities*

*La ontología dice qué existe. El vocabulario dice qué significa. Las entidades dicen qué persiste, cambia y se relaciona en la operación.*

*Cada entidad del dominio gastronómico tiene ahora identidad, atributos, estados y relaciones que el Cognitive Core puede reconocer para razonar sobre cualquier restaurante.*

*Siguiente: RKS-004 — Restaurant Relationships*