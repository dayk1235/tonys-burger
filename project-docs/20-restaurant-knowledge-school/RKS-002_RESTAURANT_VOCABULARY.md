# RKS-002 — Restaurant Vocabulary

**La Segunda Lección de la Restaurant Knowledge School**

| Campo | Valor |
| :--- | :--- |
| **ID** | RKS-002 |
| **Título** | Restaurant Vocabulary |
| **Tipo** | Vocabulario Operacional del Dominio |
| **Dominio** | Operaciones de Restaurante |
| **Escuela** | Restaurant Knowledge School (RKS) |
| **Estado** | Fundamento Permanente |
| **Versión** | 1.0.0 |
| **Dependencias** | RKS-001 (Restaurant Ontology), KFS-001 (Knowledge Framework Specification) |
| **Precede** | RKS-003 (Restaurant Entities), RKS-004 (Restaurant Relationships) |
| **Nivel Cognitivo** | Nivel 1 — Vocabulario |
| **Audiencia** | Cognitive Core, Human Teachers, Interpreters |

---

## PREÁMBULO

### Por Qué Existe Este Documento

RKS-001 definió qué existe en la realidad llamada "Restaurante." Estableció las categorías ontológicas, los conceptos fundamentales y las relaciones de existencia. Pero saber que algo existe no es lo mismo que saber qué significa en la operación diaria.

RKS-002 es el lenguaje operacional del restaurante.

Este documento enseña al Cognitive Core cómo interpretar cada palabra del dominio gastronómico cuando aparece en un menú, en una comanda, en un reporte de ventas, en una queja de cliente o en una decisión de gerencia. No define qué existe — eso ya lo hizo RKS-001. Define qué significa cada término cuando el restaurante opera.

### Qué Es Este Documento

RKS-002 es un vocabulario operacional. Cada término está definido para responder siete preguntas implícitas en la estructura del documento:

1. ¿Qué es?
2. ¿Qué no es?
3. ¿Cómo se utiliza?
4. ¿Con qué otros conceptos se relaciona?
5. ¿En qué decisiones participa?
6. ¿Qué errores de interpretación son comunes?
7. ¿Qué información aporta al razonamiento del sistema?

Este documento no es un diccionario. Un diccionario ofrece definiciones breves y genéricas. Este documento ofrece definiciones operacionales: el significado que un término tiene cuando afecta producción, servicio, costos, satisfacción o rentabilidad.

### Qué No Es Este Documento

Este NO es un documento de software. No hay tipos de datos, esquemas, APIs ni especificaciones técnicas.

Este NO es un documento de procesos. No describe flujos de trabajo, procedimientos operativos ni manuales de capacitación.

Este NO es un documento de estrategia. No prescribe mejores prácticas ni recomendaciones de negocio.

Este NO redefine la ontología. RKS-001 es la autoridad sobre qué existe. RKS-002 es la autoridad sobre qué significa cada término en la operación.

### Cómo Leer Este Documento

El vocabulario está organizado en siete dominios operacionales que reflejan las áreas donde el lenguaje del restaurante se utiliza con mayor frecuencia y mayor riesgo de malinterpretación:

| Parte | Dominio | Términos |
| :--- | :--- | :--- |
| I | Productos | 14 |
| II | Menú | 9 |
| III | Operación | 10 |
| IV | Cliente | 10 |
| V | Servicio | 9 |
| VI | Personal | 9 |
| VII | Negocio | 10 |

Cada término sigue exactamente la misma estructura:

| Sección | Propósito |
| :--- | :--- |
| **Definición** | Naturaleza esencial del término, qué no es, y cómo se utiliza en la operación. |
| **Propósito** | Por qué este término existe en el lenguaje del restaurante y qué función cumple. |
| **Relaciones** | Conexiones operacionales con otros conceptos del vocabulario y la ontología. |
| **Restricciones** | Límites, condiciones y reglas que gobiernan el uso correcto del término. |
| **Ejemplos** | Instancias concretas que ilustran el uso correcto en contexto operacional. |
| **Errores frecuentes** | Malinterpretaciones comunes y sus consecuencias en el razonamiento. |
| **Implicaciones para el Cognitive Core** | Qué información aporta este término al razonamiento del sistema. |

### Relación con RKS-001

Cada término de este vocabulario se ancla en uno o más conceptos ontológicos de RKS-001. La ontología dice qué existe; el vocabulario dice cómo se nombra, se distingue y se opera en la realidad del restaurante. Cuando un término del vocabulario corresponde a un concepto ontológico, la definición operacional lo extiende sin contradecirlo.

---

## PARTE I — PRODUCTOS

Los productos son la materia comercial del restaurante: lo que se ofrece, se produce, se vende y se consume. Esta sección define el lenguaje para describir qué se vende y cómo se compone.

---

## Producto

### Definición

Un **producto** es cualquier bien ofrecido por el restaurante que puede ser seleccionado, producido, entregado y cobrado como parte de una transacción comercial. Es la categoría más amplia de la oferta: abarca platillos, bebidas, combos, adicionales y cualquier artículo con identidad comercial propia.

**Qué no es:** Un producto no es un ingrediente (el ingrediente es insumo, no oferta). No es un servicio abstracto como "buena atención." No es un descuento ni una promoción — esos modifican el precio o las condiciones, pero no son productos en sí. No es un proceso interno como "preparación" o "cocción."

**Cómo se utiliza:** El restaurante cataloga productos en el menú, los produce en cocina, los registra en órdenes y los analiza en reportes de ventas. Cada producto tiene identidad, precio asociado y especificación de producción. El término "producto" se usa cuando se habla de la oferta en general, sin distinguir tipo.

### Propósito

Proporcionar el término paraguas bajo el cual se organiza toda la oferta comercial del restaurante. Sin el concepto de producto, no hay unidad de análisis para ventas, costos, popularidad ni disponibilidad.

### Relaciones

- Un producto se ofrece en el **menú**.
- Un producto se ordena en una **orden**.
- Un producto se produce mediante una **receta**.
- Un producto tiene un **precio** y un **costo**.
- Un producto puede tener **variantes**, **tamaños** y **modificaciones**.
- Un platillo, bebida o combo son tipos específicos de producto.

### Restricciones

- Todo producto debe tener identidad única dentro del catálogo del restaurante.
- Todo producto debe poder asociarse a un precio de venta, aunque sea cero en promociones.
- Un producto que no puede producirse con los recursos actuales no está disponible, pero sigue siendo producto.
- Los productos descontinuados permanecen en el historial; dejan de estar en el menú activo.

### Ejemplos

- "La hamburguesa clásica" es un producto.
- "Coca-Cola 355 ml" es un producto.
- "Combo familiar" es un producto compuesto.
- "Salsa extra" puede ser producto si tiene precio y entrada en menú.

### Errores frecuentes

- Tratar ingredientes como productos (la harina no es producto; el pan sí).
- Confundir producto con categoría de menú ("Entradas" no es producto).
- Asumir que todo lo que aparece en una orden es producto (propinas, cargos por servicio no lo son).
- Usar "producto" y "platillo" como sinónimos universales.

### Implicaciones para el Cognitive Core

El término producto es la unidad fundamental de agregación comercial. Permite razonar sobre catálogo, mix de ventas, disponibilidad general y desempeño de la oferta sin forzar una clasificación prematura por tipo.

---

## Platillo

### Definición

Un **platillo** es un producto de naturaleza alimentaria sólida o semisólida, preparado en cocina y destinado al consumo como comida. Es la unidad principal de la oferta gastronómica: entradas, platos fuertes, postres y acompañamientos que requieren preparación culinaria.

**Qué no es:** Un platillo no es una bebida. No es un ingrediente crudo vendido tal cual (una manzana en un mercado no es platillo de restaurante). No es un combo en sí mismo — el combo es un empaquetado de productos; los platillos son sus componentes. No es la receta: la receta es la especificación; el platillo es la oferta comercial.

**Cómo se utiliza:** El platillo aparece en el menú con nombre, descripción y precio. Se ordena individualmente o como parte de un combo. Se produce en estaciones de cocina según su receta. Se mide por popularidad, costo y margen.

### Propósito

Distinguir la oferta alimentaria preparada del resto de productos. El platillo es el corazón de la propuesta gastronómica y el principal generador de complejidad operativa en cocina.

### Relaciones

- Un platillo es un tipo de **producto**.
- Un platillo se define por una **receta**.
- Un platillo consume **ingredientes** en su producción.
- Un platillo pertenece a una **categoría** del menú.
- Un platillo puede tener **variantes**, **presentaciones**, **tamaños** y **modificaciones**.
- Un platillo se prepara en una **estación** de cocina.

### Restricciones

- Todo platillo debe tener receta documentada o implícita para ser reproducible.
- Un platillo sin ingredientes disponibles no está en **disponibilidad**, aunque siga en el menú.
- La misma preparación con diferente presentación puede ser el mismo platillo o variantes según definición del restaurante.
- Los platillos de temporada siguen siendo platillos; su vigencia es temporal.

### Ejemplos

- "Tacos al pastor (3 piezas)" es un platillo.
- "Ensalada César" es un platillo.
- "Pasta carbonara" es un platillo.
- "Papas fritas" como guarnición independiente con precio propio es un platillo.

### Errores frecuentes

- Incluir bebidas bajo "platillos" en reportes.
- Confundir platillo con porción servida (la porción es cantidad; el platillo es identidad).
- Tratar guarniciones incluidas sin precio como platillos separados.
- Asumir que postres no son platillos.

### Implicaciones para el Cognitive Core

Platillo activa razonamiento de producción culinaria: tiempos de preparación, estaciones requeridas, consumo de inventario, merma en preparación y satisfacción sensorial del consumidor.

---

## Bebida

### Definición

Una **bebida** es un producto de naturaleza líquida destinado al consumo por ingestión. Incluye bebidas preparadas en el restaurante (café, jugos, cocteles) y bebidas servidas sin transformación significativa (refrescos embotellados, cervezas).

**Qué no es:** Una bebida no es un platillo. No es un ingrediente usado en recetas aunque sea líquido (el aceite no es bebida). No es un complemento sólido. No es el acto de servir líquido — es el producto ofrecido.

**Cómo se utiliza:** Las bebidas se listan en secciones específicas del menú o en carta de bebidas. Tienen flujos de producción distintos: bar, estación de café, o servicio directo desde inventario. Su rentabilidad y rotación siguen patrones diferentes a los platillos.

### Propósito

Separar la oferta líquida de la oferta alimentaria sólida. Las bebidas tienen dinámicas de costo, preparación, inventario y margen que requieren vocabulario y análisis propios.

### Relaciones

- Una bebida es un tipo de **producto**.
- Una bebida puede tener **receta** (coctel, café especial) o ser producto terminado (refresco embotellado).
- Una bebida se almacena en **inventario** con reglas distintas a ingredientes perecederos.
- Una bebida puede ser **complemento** de un platillo o **adicional** en un combo.
- Una bebida tiene **tamaño** como dimensión frecuente (chico, mediano, grande).

### Restricciones

- Bebidas alcohólicas y no alcohólicas comparten categoría de bebida pero tienen restricciones legales y operativas distintas.
- Una bebida incluida en combo no pierde su identidad como bebida.
- Bebidas con preparación requieren estación o rol asignado (bartender, barista).
- La disponibilidad de bebidas embotelladas depende de inventario; la de preparadas depende de insumos y capacidad.

### Ejemplos

- "Limonada natural" — bebida preparada.
- "Cerveza Corona" — bebida de inventario.
- "Margarita clásica" — bebida preparada con receta.
- "Agua de garrafón" — bebida servida sin costo directo al cliente en algunos contextos.

### Errores frecuentes

- Clasificar salsas líquidas o caldos como bebidas.
- Ignorar bebidas en análisis de ticket promedio.
- Tratar refill de café como producto nuevo en cada servicio.
- Confundir bebida del menú con ingrediente de coctelería no vendido por separado.

### Implicaciones para el Cognitive Core

Bebida activa razonamiento de barra, inventario de embotellados, márgenes altos típicos, upselling en servicio y regulaciones de edad o consumo responsable.

---

## Combo

### Definición

Un **combo** es un producto compuesto que agrupa dos o más productos (platillos, bebidas, complementos) bajo una identidad comercial única y un precio integrado, generalmente inferior a la suma de sus componentes por separado.

**Qué no es:** Un combo no es una orden con múltiples productos elegidos libremente — eso es una orden compuesta. No es una promoción genérica: la promoción modifica condiciones; el combo es un producto con estructura definida. No es un platillo con guarnición incluida si no se comercializa como paquete independiente.

**Cómo se utiliza:** El combo aparece en menú como opción única ("Combo #3: hamburguesa + papas + refresco"). Al ordenarse, descompone internamente en sus componentes para producción e inventario, pero se cobra y se reporta como unidad comercial.

### Propósito

Capturar la lógica de empaquetado comercial que incentiva mayor ticket mediante valor percibido. El combo es un mecanismo de venta cruzada estructurada.

### Relaciones

- Un combo es un tipo de **producto**.
- Un combo contiene platillos, bebidas y/o **complementos**.
- Un combo tiene **precio** propio, distinto de la suma de componentes.
- Un combo puede participar en **promociones** adicionales.
- Un combo genera **producción** en múltiples **estaciones**.

### Restricciones

- Todo combo debe definir explícitamente sus componentes y cantidades.
- Sustituciones dentro del combo (cambiar refresco por jugo) son **modificaciones** con reglas propias.
- El margen del combo es calculado, no sumado trivialmente de componentes.
- Un combo no disponible si cualquier componente obligatorio no está disponible.

### Ejemplos

- "Menú del día: sopa + plato fuerte + agua" — combo.
- "Paquete familiar: 2 pizzas grandes + 2 litros de refresco" — combo.
- "Desayuno ejecutivo: huevos + frijoles + café + pan" — combo.

### Errores frecuentes

- Reportar ventas de combo sin descomponer impacto en inventario por componente.
- Tratar descuento porcentual sobre orden como combo.
- No registrar sustituciones que alteran costo del combo.
- Asumir que combo siempre es más rentable que venta separada.

### Implicaciones para el Cognitive Core

Combo requiere razonamiento dual: identidad comercial única y descomposición operativa. Afecta ticket promedio, mix de productos, márgenes compuestos y disponibilidad condicionada por múltiples insumos.

---

## Promoción

### Definición

Una **promoción** es un acuerdo comercial temporal que modifica las condiciones normales de venta — precio, productos incluidos, restricciones de tiempo o canal — con el propósito de incentivar demanda. Es una construcción comercial, no un producto.

**Qué no es:** Una promoción no es un producto. No es el precio permanente de un platillo. No es un descuento operativo por error o compensación a cliente. No es fidelización en sí misma — aunque puede integrarse con programas de lealtad.

**Cómo se utiliza:** Las promociones se activan por calendario ("martes de 2x1"), por canal ("solo delivery"), por producto ("hamburguesa a precio especial") o por condición ("compra mayor a $500, postre gratis"). Afectan cómo se calcula el precio final de una orden sin cambiar necesariamente la identidad de los productos.

### Propósito

Nombrar las condiciones comerciales excepcionales que el restaurante aplica para mover demanda, liquidar inventario o competir. Sin vocabulario de promoción, el sistema confunde precio normal con precio temporal.

### Relaciones

- Una promoción afecta **productos**, **combos** o **órdenes** completas.
- Una promoción opera dentro de **horarios** y canales definidos.
- Una promoción modifica **precio** efectivo, no siempre precio de lista.
- Una promoción puede vincularse a **fidelización**.
- Una promoción genera **ventas** con márgenes distintos al precio regular.

### Restricciones

- Toda promoción debe tener vigencia definida: inicio, fin o condición de activación.
- Promociones acumulables o excluyentes deben declararse explícitamente.
- Una promoción activa no convierte un producto en otro producto.
- Promociones que violan margen mínimo son decisiones de negocio, no errores de sistema.

### Ejemplos

- "2x1 en tacos los miércoles" — promoción temporal por producto.
- "Envío gratis en pedidos mayores a $300" — promoción por canal y monto.
- "Happy hour: cerveza a mitad de precio de 5 a 7 pm" — promoción por horario.

### Errores frecuentes

- Registrar producto con precio promocional permanente como promoción.
- No separar ingresos promocionales de ingresos regulares en análisis.
- Aplicar promoción expirada por error de configuración de **horario**.
- Confundir cupón de cliente con promoción del restaurante.

### Implicaciones para el Cognitive Core

Promoción activa razonamiento temporal, de elegibilidad y de margen efectivo. El sistema debe distinguir precio de lista de precio cobrado y atribuir ventas a campañas específicas.

---

## Adicional

### Definición

Un **adicional** es un producto o componente opcional que el cliente puede agregar a un producto base durante la orden, ampliando la oferta estándar sin cambiar la identidad del producto principal. Está previsto en la estructura del menú.

**Qué no es:** Un adicional no es una modificación de preparación ("sin cebolla"). No es un extra si el menú no lo distingue — en muchos restaurantes adicional y extra se usan como sinónimos, pero operacionalmente el adicional está catalogado en menú. No es un complemento incluido en el precio base.

**Cómo se utiliza:** El menú lista adicionales disponibles para ciertos productos: "Agregar queso +$25", "Agregar tocino +$30". Se seleccionan en el momento de la orden y afectan producción, costo y precio.

### Propósito

Distinguir las extensiones comerciales catalogadas de las modificaciones de preparación. Los adicionales son oportunidades de upselling estructuradas.

### Relaciones

- Un adicional es un tipo de **producto** o subproducto del menú.
- Un adicional se agrega a un platillo o **combo** base.
- Un adicional tiene **precio** propio.
- Un adicional consume **ingredientes** adicionales.
- Un adicional incrementa **costo** y **margen** del ítem ordenado.

### Restricciones

- Solo adicionales definidos en menú pueden agregarse sin convertirse en **modificación** no estándar.
- Adicionales incompatibles con el producto base deben estar restringidos.
- Disponibilidad del adicional depende de inventario de sus ingredientes.
- El límite de adicionales por producto puede estar definido operacionalmente.

### Ejemplos

- "Agregar aguacate a la hamburguesa" — adicional catalogado.
- "Extra shot de espresso en latte" — adicional en bebida.
- "Agregar queso a las papas" — adicional sobre complemento.

### Errores frecuentes

- No cargar adicional al inventario consumido.
- Tratar adicional incluido gratis como adicional de menú.
- Confundir adicional con ingrediente de receta base.
- Permitir adicionales no definidos sin clasificarlos como modificación especial.

### Implicaciones para el Cognitive Core

Adicional activa razonamiento de upselling, costo incremental, impacto en ticket y restricciones de compatibilidad producto-adicional.

---

## Extra

### Definición

Un **extra** es una porción suplementaria de un componente ya presente en el producto, solicitada por el cliente y generalmente con costo adicional. Enfatiza cantidad adicional, no un componente nuevo.

**Qué no es:** Un extra no es un adicional de componente nuevo (el tocino es adicional; "extra tocino" es más cantidad). No es una modificación de preparación. No es un complemento independiente. No es gratuito por defecto — "extra" implica generalmente cobro.

**Cómo se utiliza:** El cliente pide "extra salsa", "extra queso", "extra porción de papas". El restaurante define si estos extras tienen precio fijo, se cobran como adicional o se niegan operacionalmente.

### Propósito

Capturar solicitudes de incremento de cantidad que afectan costo, porcionamiento y satisfacción del cliente, distinguiéndolas de adiciones de nuevos componentes.

### Relaciones

- Un extra modifica la **porción** de un **ingrediente** o **complemento** existente.
- Un extra puede tener **precio** asociado o ser cortesía operativa.
- Un extra afecta **costo** variable del producto.
- Un extra se registra en la **orden** como nota o línea según sistema operativo.

### Restricciones

- Extras no catalogados requieren decisión operativa: cobrar, negar o absorber costo.
- Exceso de extras puede violar estándar de **receta** y **presentación**.
- Extras gratuitos repetidos erosionan **margen** sin quedar registrados.
- La línea entre extra y adicional debe definirse por restaurante.

### Ejemplos

- "Extra salsa verde" — más cantidad de salsa incluida.
- "Extra queso en pizza" — incremento de ingrediente existente.
- "Extra refill de café" — porción adicional de bebida.

### Errores frecuentes

- No diferenciar extra de adicional en menú y cobro.
- Absorber costo de extras sin medir frecuencia.
- Tratar "extra" en nombre de producto ("extra grande") como solicitud de porción.
- No comunicar a cocina la diferencia entre extra pagado y cortesía.

### Implicaciones para el Cognitive Core

Extra activa razonamiento de porcionamiento, costo incremental por ingrediente, patrones de solicitud del cliente y desviación de estándar de receta.

---

## Complemento

### Definición

Un **complemento** es un producto o componente que acompaña al platillo principal para completar la experiencia de comida, ya sea incluido en el precio o vendido por separado. Su función es acompañar, balancear o completar — no ser el centro de la orden.

**Qué no es:** Un complemento no es el platillo principal. No es un adicional si ya viene incluido sin costo separado. No es un ingrediente interno de la receta invisible para el cliente (el pan dentro del sandwich no es complemento — es parte del platillo).

**Cómo se utiliza:** Las guarniciones — arroz, frijoles, ensalada, papas — son complementos típicos. Pueden venir incluidos ("platillo con guarnición a elegir") o venderse aparte. El cliente elige complemento entre opciones o recibe complemento fijo.

### Propósito

Nombrar el rol funcional de acompañamiento en la estructura de la comida. El complemento afecta percepción de valor, saciedad y equilibrio nutricional percibido.

### Relaciones

- Un complemento puede ser **producto** independiente o componente incluido.
- Un complemento acompaña a un **platillo** o **combo**.
- Un complemento tiene **receta** y **costo** propios.
- Un complemento puede ser elegido entre opciones en el **menú**.
- Un complemento se produce en **estación** de cocina, a veces distinta al platillo principal.

### Restricciones

- Complementos incluidos no deben duplicarse como productos cobrados en la misma orden.
- Opciones de complemento ("elige arroz o ensalada") deben ser mutuamente excluyentes salvo definición contraria.
- Complemento no disponible puede requerir sustitución o afectar disponibilidad del platillo que lo incluye.
- Complementos fijos no requieren elección del cliente.

### Ejemplos

- "Arroz blanco" como guarnición del pollo — complemento incluido.
- "Ensalada verde" vendida aparte — complemento independiente.
- "Pan de cortesía" — complemento incluido sin precio.

### Errores frecuentes

- Clasificar complemento incluido como producto de venta separada en reportes.
- No registrar sustitución de complemento solicitada por cliente.
- Confundir complemento con adicional (el complemento completa; el adicional extiende).
- Ignorar costo de complementos incluidos en análisis de margen del platillo.

### Implicaciones para el Cognitive Core

Complemento activa razonamiento de valor percibido, costo incluido vs. explícito, opciones de elección del cliente y disponibilidad en cadena con platillo principal.

---

## Ingrediente

### Definición

Un **ingrediente** es cualquier materia prima o componente preparado que se consume en la producción de platillos, bebidas y complementos. Es insumo, no oferta directa al cliente (salvo venta explícita como producto).

**Qué no es:** Un ingrediente no es un producto terminado ofrecido en menú (salvo excepción comercial). No es equipo de cocina. No es empaque. No es la receta — es lo que la receta consume.

**Cómo se utiliza:** Los ingredientes se compran a **proveedores**, se almacenan en **inventario**, se asignan a **recetas** con cantidades definidas, y se consumen en **producción**. Su costo determina el costo del producto. Su disponibilidad determina qué puede producirse.

### Propósito

Proporcionar el vocabulario de insumos que conecta compras, inventario, producción y costos. Sin ingrediente como concepto operacional, no hay trazabilidad de por qué un platillo cuesta lo que cuesta.

### Relaciones

- Un ingrediente se lista en una **receta** con cantidad y unidad.
- Un ingrediente se abastece mediante **abastecimiento** de **proveedores**.
- Un ingrediente existe en **inventario** con niveles y rotación.
- Un ingrediente genera **merma** al manipularse o caducar.
- Un ingrediente puede sustituirse con reglas de **modificación** o contingencia.

### Restricciones

- Todo ingrediente en receta debe tener unidad de medida operativa (kg, pza, lt).
- Ingredientes perecederos tienen vida útil que afecta disponibilidad.
- Un ingrediente agotado puede bloquear múltiples productos simultáneamente.
- Ingredientes alérgenos tienen restricciones de información al cliente.

### Ejemplos

- "Pechuga de pollo" — ingrediente proteico.
- "Tomate" — ingrediente fresco.
- "Aceite de oliva" — ingrediente de uso general.
- "Salsa preelaborada" — ingrediente semi-transformado.

### Errores frecuentes

- Confundir ingrediente con producto terminado.
- No descontar ingrediente de inventario al producir.
- Usar ingrediente y adicional como sinónimos.
- Ignorar merma del ingrediente en cálculo de costo.

### Implicaciones para el Cognitive Core

Ingrediente es el nodo central de costo variable, disponibilidad de productos, abastecimiento y predicción de agotamiento. Conecta menú con inventario y proveedores.

---

## Receta

### Definición

Una **receta** es la especificación completa de cómo producir un producto: ingredientes con cantidades, pasos de preparación, tiempos, temperaturas, rendimiento esperado e instrucciones de **presentación**. Es el puente entre oferta comercial y ejecución en cocina.

**Qué no es:** Una receta no es el menú (el menú vende; la receta produce). No es un ingrediente. No es la improvisación del cocinero — es el estándar replicable. No es un proceso genérico de "cocinar."

**Cómo se utiliza:** Cocina ejecuta recetas para cada orden. Costos se calculan desde recetas. Inventario se planifica según demanda de productos y sus recetas. Capacitación de personal se basa en dominio de recetas.

### Propósito

Codificar el conocimiento de producción para garantizar consistencia, calcular costos y planificar operaciones. La receta es la fuente de verdad de cómo se hace cada producto.

### Relaciones

- Una receta define la producción de un **platillo**, **bebida** o **complemento**.
- Una receta consume **ingredientes** en cantidades específicas.
- Una receta se ejecuta en una **estación** por un **cocinero**.
- Una receta tiene **costo** calculado y **tiempo de preparación** asociado.
- Una receta puede tener **variantes** y tolerar **modificaciones**.

### Restricciones

- Toda receta debe producir un rendimiento definido (porciones, litros, piezas).
- Receta sin ingredientes disponibles no puede ejecutarse aunque el producto esté en menú.
- Modificaciones que alteran receta significativamente deben registrarse.
- Recetas de contingencia (sustitución de ingrediente) deben estar documentadas o ser decisión de gerencia.

### Ejemplos

- Receta de "Tacos al pastor" con cantidades por 3 piezas.
- Receta de "Margarita" con proporciones de tequila, triple sec y limón.
- Receta de mise en place: "Salsa del día" preparada en lote.

### Errores frecuentes

- Calcular costo sin incluir todos los ingredientes (especias, aceites, guarniciones).
- No actualizar receta cuando cambia proveedor o precio de ingrediente.
- Tratar descripción de menú como receta.
- Ignorar sub-recetas (salsas, caldos) en costo del platillo.

### Implicaciones para el Cognitive Core

Receta activa razonamiento de costo teórico, consumo de inventario por orden, tiempo de producción, capacidad de estación y desviación por modificaciones.

---

## Variante

### Definición

Una **variante** es una versión alternativa de un producto base que mantiene identidad reconocible pero difiere en composición, intensidad o característica definitoria. Las variantes están catalogadas, no son improvisaciones del cliente.

**Qué no es:** Una variante no es una modificación ad hoc ("sin sal"). No es un tamaño — el tamaño es dimensión de porción; la variante cambia naturaleza o perfil. No es un producto completamente distinto.

**Cómo se utiliza:** "Pollo al grill / crispy / adobado" son variantes del mismo producto base. El menú las presenta como opciones predefinidas con posible diferencia de precio y receta.

### Propósito

Distinguir alternativas catalogadas que comparten identidad comercial de modificaciones libres. Las variantes estructuran la oferta sin multiplicar productos independientes.

### Relaciones

- Una variante pertenece a un **producto** o **platillo** base.
- Una variante puede tener **receta** distinta o ajuste de receta base.
- Una variante puede tener **precio** diferenciado.
- Una variante afecta **producción** en **estación** específica.
- Una variante se selecciona en la **orden**.

### Restricciones

- Variantes deben estar definidas en **menú**; solicitudes fuera de catálogo son modificaciones.
- No toda diferencia de preparación es variante — debe ser oferta establecida.
- Disponibilidad puede variar por variante según ingredientes.
- Reportes deben poder agregar variantes al producto base o separarlas según análisis.

### Ejemplos

- "Pizza: delgada / gruesa / sin gluten" — variantes de masa.
- "Café: americano / espresso" — variantes de preparación.
- "Sopa: de tortilla / de fideo" — variantes si comparten categoría "sopa del día."

### Errores frecuentes

- Crear productos separados en lugar de variantes, fragmentando análisis.
- No diferenciar variante de modificación en comanda a cocina.
- Precio de variante sin receta de costo actualizada.
- Confundir variante con presentación.

### Implicaciones para el Cognitive Core

Variante activa razonamiento de opciones predefinidas, recetas alternativas, márgenes diferenciados y agregación de demanda bajo producto padre.

---

## Presentación

### Definición

La **presentación** es la forma en que un producto se sirve y se muestra al cliente: disposición en el plato, recipiente utilizado, guarnición visual, temperatura de servicio y elementos decorativos. Es la dimensión sensorial y visual de la entrega.

**Qué no es:** La presentación no es el sabor ni la receta en sí — es cómo se manifiesta. No es el tamaño de porción (eso es **tamaño**). No es el empaque de delivery, aunque se relaciona en canal de **entrega**.

**Cómo se utiliza:** La presentación se especifica en receta (plating), se ejecuta en **preparación** final y se evalúa en **satisfacción** del cliente. Estándares de presentación definen consistencia de marca.

### Propósito

Capturar la dimensión de experiencia visual y de servicio que afecta percepción de calidad y valor, independiente del sabor o del costo de ingredientes.

### Relaciones

- La presentación es parte de la **receta** y del estándar del **platillo**.
- La presentación usa **complementos** visuales (guarnición decorativa).
- La presentación difiere por canal: **salón** vs. **delivery**.
- La presentación afecta **tiempo de preparación** (plating).
- La presentación influye en **satisfacción** y **reclamaciones**.

### Restricciones

- Presentación en delivery puede requerir empaque que altera estándar de salón.
- Desviación de presentación es defecto de calidad, no modificación válida salvo solicitud.
- Presentación no debe ocultar ingredientes relevantes para alérgenos o preferencias.
- Estándares de presentación deben ser reproducibles por **cocinero** capacitado.

### Ejemplos

- Servir corte de carne con vegetales en disposición específica.
- Café en taza de porcelana vs. vaso desechable según canal.
- Postre con menta y fruta como elemento decorativo.

### Errores frecuentes

- Ignorar presentación en estándares de delivery.
- Confundir presentación con porción (tamaño).
- No especificar presentación en receta, dejando variabilidad excesiva.
- Tratar queja estética como queja de sabor.

### Implicaciones para el Cognitive Core

Presentación activa razonamiento de estándares de calidad, diferencias por canal, tiempo de plating y correlación con satisfacción y reclamaciones visuales.

---

## Tamaño

### Definición

El **tamaño** es la dimensión de porción o volumen de un producto: pequeño, mediano, grande, individual, familiar. Modifica cantidad entregada, precio y frecuentemente receta o factor de escala.

**Qué no es:** El tamaño no es una variante de sabor o preparación. No es presentación. No es un combo — aunque combos pueden tener tamaños en sus componentes.

**Cómo se utiliza:** Bebidas y platillos se ofrecen en tamaños con precios escalados. El cliente elige tamaño al ordenar. Cocina produce según especificación de tamaño. Costos y márgenes varían por tamaño.

### Propósito

Estructurar la oferta en escalones de porción que capturan distintos niveles de demanda y disposición a pagar.

### Relaciones

- El tamaño modifica un **producto** o **bebida** sin cambiar identidad base.
- El tamaño afecta **precio**, **costo** y **receta** (factor de escala).
- El tamaño se selecciona en la **orden**.
- El tamaño impacta **presentación** y recipiente.
- El tamaño influye en **popularidad** por segmento de cliente.

### Restricciones

- Todo tamaño debe tener especificación de porción (ml, gr, piezas).
- Tamaños deben mantener proporción coherente de precio vs. costo.
- Tamaño no disponible (ej. vaso grande agotado) es restricción de **disponibilidad**.
- "Tamaño único" es válido — no todo producto tiene múltiples tamaños.

### Ejemplos

- "Refresco chico / mediano / grande."
- "Pizza individual / mediana / familiar."
- "Café solo / doble."

### Errores frecuentes

- Escalar precio sin escalar costo correctamente.
- Confundir tamaño con variante.
- No comunicar a cocina el tamaño en **comanda**.
- Reportar todos los tamaños como un solo producto sin desglose.

### Implicaciones para el Cognitive Core

Tamaño activa razonamiento de elasticidad de demanda, márgenes por escala, consumo de inventario proporcional y análisis de mix por porción.

---

## Modificación

### Definición

Una **modificación** es un cambio solicitado por el cliente a la preparación estándar de un producto: exclusiones, sustituciones, ajustes de cocción o instrucciones especiales. No está necesariamente catalogada en menú.

**Qué no es:** Una modificación no es una variante catalogada. No es un adicional (agrega; la modificación altera). No es una promoción. No es error de cocina — es solicitud previa a producción.

**Cómo se utiliza:** El cliente pide "sin cebolla", "bien cocido", "cambiar papas por ensalada." La solicitud se registra en la orden, se comunica en **comanda** y cocina ejecuta con desviación controlada de **receta**.

### Propósito

Capturar la personalización de la oferta estándar que afecta producción, costo, riesgo de error y satisfacción.

### Relaciones

- Una modificación afecta un **platillo**, **bebida** o **combo** en una **orden**.
- Una modificación se comunica en **comanda** a **cocina**.
- Una modificación puede alterar **costo** e **ingredientes** consumidos.
- Una modificación puede generar **errores** si no se ejecuta correctamente.
- Una modificación se distingue de **variante** y **adicional**.

### Restricciones

- Modificaciones imposibles (alérgeno, sin ingrediente estructural) deben rechazarse o escalarse.
- Modificaciones con impacto en precio deben cobrarse según política.
- Modificaciones no ejecutadas generan **reclamaciones** válidas.
- Volumen excesivo de modificaciones indica problema de oferta o comunicación de menú.

### Ejemplos

- "Hamburguesa sin pepinillos."
- "Huevos revueltos, no estrellados."
- "Cambiar arroz por ensalada" — modificación con posible cargo.

### Errores frecuentes

- No transmitir modificación a cocina.
- Tratar modificación como variante en reportes.
- No ajustar inventario cuando modificación sustituye ingrediente.
- Confundir modificación con extra o adicional.

### Implicaciones para el Cognitive Core

Modificación activa razonamiento de desviación de receta, riesgo operativo, costo real vs. teórico, patrones de preferencia del cliente y fuente de reclamaciones.

---

## PARTE II — MENÚ

El menú es el artefacto que traduce la oferta del restaurante en lenguaje comercial. Esta sección define los términos que estructuran, precifican y disponibilizan los productos.

---

## Menú

### Definición

El **menú** es la especificación completa de lo que el restaurante ofrece para venta: productos, precios, categorías, descripciones y condiciones de disponibilidad. Es simultáneamente documento comercial para el cliente, especificación de producción para cocina y base de análisis financiero.

**Qué no es:** El menú no es la orden. No es el inventario. No es la receta completa — aunque referencia productos que tienen receta. No es el cartón físico ni la pantalla — esos son portadores; el menú es la especificación.

**Cómo se utiliza:** El menú se publica al cliente, guía las órdenes, define qué puede venderse y estructura el análisis de desempeño por producto y categoría.

### Propósito

Ser la fuente de verdad de la oferta comercial. Todo lo que no está en menú no debería venderse; todo lo que está en menú debe poder producirse o marcarse como no disponible.

### Relaciones

- El menú contiene **productos** organizados en **categorías** y **subcategorías**.
- El menú define **precios** y condiciones de **disponibilidad**.
- El menú referencia **recetas** de producción.
- El menú puede incluir **promociones** activas.
- El menú opera dentro de **horarios** de servicio.

### Restricciones

- Un restaurante puede tener múltiples menús (desayuno, comida, cena, delivery) con vigencias distintas.
- Producto en menú sin receta o costo definido es oferta incompleta.
- Cambios de menú deben ser deliberados — afectan operación, capacitación y análisis histórico.
- El menú activo en un momento dado depende de horario y canal.

### Ejemplos

- Menú principal de comida con 45 productos.
- Menú de desayuno disponible 7:00–12:00.
- Menú exclusivo para delivery con empaques específicos.

### Errores frecuentes

- Tratar copia impresa desactualizada como menú vigente.
- No sincronizar menú entre canales (salón vs. delivery).
- Incluir productos sin precio definido.
- Confundir menú con carta de vinos o lista de especiales del día sin integrar.

### Implicaciones para el Cognitive Core

Menú es el marco de referencia para toda orden, análisis de ventas, disponibilidad y decisiones de ingeniería de oferta. Es el catálogo autoritativo del restaurante.

---

## Categoría

### Definición

Una **categoría** es la agrupación de primer nivel dentro del menú que organiza productos por tipo funcional o experiencia de consumo: entradas, platos fuertes, postres, bebidas, etc.

**Qué no es:** Una categoría no es un producto. No es una estación de cocina — aunque pueden correlacionarse. No es un departamento contable.

**Cómo se utiliza:** Las categorías estructuran la navegación del cliente, el diseño del menú, los reportes de ventas y las decisiones de mix de oferta.

### Propósito

Organizar la oferta en grupos significativos que faciliten elección del cliente, análisis gerencial y asignación operativa.

### Relaciones

- Una categoría contiene **productos** y puede contener **subcategorías**.
- Una categoría agrupa **platillos**, **bebidas** u otros productos.
- Una categoría tiene desempeño medible en **ventas** y **popularidad**.
- Una categoría puede tener **horario** de disponibilidad propio.

### Restricciones

- Todo producto debe pertenecer al menos a una categoría.
- Categorías deben ser mutuamente comprensibles para el cliente.
- Reclasificar productos entre categorías afecta comparabilidad histórica.
- Categorías vacías no deben mostrarse al cliente.

### Ejemplos

- "Entradas", "Sopas", "Platos fuertes", "Postres", "Bebidas."
- "Desayunos" como categoría con horario matutino.

### Errores frecuentes

- Categorías demasiado amplias que ocultan patrones de venta.
- Duplicar producto en múltiples categorías sin reglas claras.
- Confundir categoría de menú con categoría de inventario.
- Cambiar categorías sin actualizar reportes históricos.

### Implicaciones para el Cognitive Core

Categoría activa razonamiento de mix de ventas, comparación entre grupos de oferta, diseño de menú y detección de categorías subperformantes.

---

## Subcategoría

### Definición

Una **subcategoría** es la agrupación de segundo nivel dentro de una categoría que refina la organización: dentro de "Bebidas" → "Refrescos", "Jugos", "Cervezas"; dentro de "Platos fuertes" → "Carnes", "Pescados", "Vegetarianos".

**Qué no es:** Una subcategoría no es una categoría independiente del menú raíz. No es un producto. No es un filtro temporal.

**Cómo se utiliza:** Las subcategorías facilitan navegación en menús extensos y permiten análisis más granular sin fragmentar la estructura principal.

### Propósito

Refinar la organización del menú cuando las categorías principales serían demasiado amplias para decisión o navegación eficiente.

### Relaciones

- Una subcategoría pertenece a una **categoría** padre.
- Una subcategoría contiene **productos**.
- Una subcategoría hereda restricciones de **disponibilidad** de su categoría salvo excepción.
- Una subcategoría tiene métricas de **ventas** y **popularidad** propias.

### Restricciones

- No todo menú requiere subcategorías — su uso responde a complejidad de oferta.
- Profundidad excesiva de categorización dificulta experiencia del cliente.
- Producto en subcategoría incorrecta distorsiona análisis de segmento.

### Ejemplos

- Bebidas → Vinos → Tintos / Blancos / Rosados.
- Postres → Pasteles / Helados / Frutas.

### Errores frecuentes

- Crear subcategorías con un solo producto sin valor organizacional.
- Usar subcategoría y categoría como intercambiables en reportes.
- Subcategorías que el cliente no percibe en el menú físico.

### Implicaciones para el Cognitive Core

Subcategoría permite análisis de nicho dentro de categorías amplias y detección de patrones específicos (ej. crecimiento de opciones vegetarianas).

---

## Disponibilidad

### Definición

La **disponibilidad** es el estado operativo que indica si un producto puede ordenarse y producirse en un momento y canal dados. Un producto en menú puede no estar disponible; un producto disponible debe poder entregarse.

**Qué no es:** La disponibilidad no es el horario del restaurante completo — es por producto o categoría. No es popularidad. No es existencia en inventario crudo — un ingrediente puede existir pero no estar prepado.

**Cómo se utiliza:** Cocina o gerencia marca productos como agotados. El menú digital oculta o marca no disponibles. Las órdenes rechazan productos sin disponibilidad. La disponibilidad cambia intra-día.

### Propósito

Conectar la oferta teórica del menú con la capacidad real de entrega en el momento presente.

### Relaciones

- La disponibilidad afecta **productos**, **combos** y **promociones**.
- La disponibilidad depende de **inventario**, **preparación** y capacidad de **estación**.
- La disponibilidad varía por **horario** y canal (**salón**, **delivery**).
- La indisponibilidad genera sustituciones, **reclamaciones** o pérdida de **venta**.

### Restricciones

- Disponibilidad debe actualizarse en tiempo operativo relevante.
- Combo no disponible si cualquier componente obligatorio no está disponible.
- Producto disponible implica capacidad de producir y entregar — no solo existencia de ingrediente en almacén.
- Disponibilidad histórica es dato valioso para planificación.

### Ejemplos

- "Aguacate agotado" → platillos con aguacate no disponibles.
- Producto de temporada fuera de temporada — no disponible por definición.
- Estación de freidora fuera de servicio → productos fritos no disponibles.

### Errores frecuentes

- Aceptar orden de producto no disponible.
- No restaurar disponibilidad cuando inventario se repone.
- Confundir "no en menú" con "no disponible."
- No registrar causas de indisponibilidad para análisis.

### Implicaciones para el Cognitive Core

Disponibilidad activa razonamiento en tiempo real: qué puede venderse ahora, impacto en ventas perdidas, correlación con inventario y predicción de agotamientos.

---

## Horario

### Definición

El **horario** es la especificación temporal que define cuándo el restaurante, un menú, una categoría o un producto está activo. Gobierna la vigencia de la oferta y la operación del servicio.

**Qué no es:** El horario no es el tiempo de espera del cliente. No es el turno de un empleado — aunque se relacionan. No es la duración de preparación.

**Cómo se utiliza:** El restaurante define horarios de apertura, menús por tiempo (desayuno, comida), promociones por franja (happy hour) y disponibilidad de productos por día de la semana.

### Propósito

Estructurar la operación en el tiempo: cuándo se vende qué, cuándo hay personal, cuándo aplican promociones.

### Relaciones

- El horario del restaurante delimita **órdenes** posibles.
- El horario activa menús, **categorías** y **promociones** específicas.
- El horario coordina **turnos** de **personal**.
- El horario afecta **producción** planificada (prep antes de servicio).
- El horario interactúa con **reservaciones**.

### Restricciones

- Horarios deben ser explícitos y comunicados al cliente.
- Excepciones (días festivos, cierres) deben registrarse.
- Orden fuera de horario es inválida o requiere excepción de gerencia.
- Horarios distintos por canal (delivery más amplio) deben definirse por separado.

### Ejemplos

- Restaurante abierto 8:00–22:00.
- Menú de desayuno 8:00–12:00.
- Promoción 2x1 solo viernes y sábado noche.

### Errores frecuentes

- Aplicar promoción fuera de horario configurado.
- No ajustar horario en días festivos.
- Confundir hora de cierre con hora de última orden.
- Horarios de cocina más cortos que horarios de servicio sin comunicación.

### Implicaciones para el Cognitive Core

Horario activa razonamiento temporal: elegibilidad de oferta, planificación de demanda por franja, staffing y detección de patrones por momento del día.

---

## Precio

### Definición

El **precio** es el valor monetario asignado a un producto, adicional, combo o servicio que el restaurante cobra al cliente. Es la expresión comercial del valor de la oferta en el momento de la transacción.

**Qué no es:** El precio no es el costo. No es el margen — aunque se deriva de la relación precio-costo. No es el monto de la orden completa — es atributo del producto o línea. No es propina.

**Cómo se utiliza:** El menú fija precios de lista. Las promociones modifican precio efectivo. La orden registra precio cobrado por línea. Reportes agregan precio en ventas e ingresos.

### Propósito

Establecer el valor de intercambio de la oferta. El precio conecta producto con ingreso y es variable principal de decisiones comerciales.

### Relaciones

- El precio pertenece a **productos**, **adicionales**, **combos** y **tamaños**.
- El precio se modifica por **promociones** y **fidelización**.
- El precio contrasta con **costo** para calcular **margen**.
- El precio suma en **ventas** e **ingresos** de la **orden**.
- El precio influye en **popularidad** y percepción de valor.

### Restricciones

- Precio debe ser positivo salvo promoción explícita de cortesía.
- Cambio de precio debe ser trazable para análisis histórico.
- Precio en menú debe incluir o excluir impuestos según jurisdicción — consistencia obligatoria.
- Precio de combo no debe confundirse con suma de componentes.

### Ejemplos

- Hamburguesa a $180 en menú.
- Adicional de queso +$25.
- Precio efectivo $90 con 50% de promoción.

### Errores frecuentes

- Confundir precio de lista con precio cobrado.
- No registrar descuentos en línea de orden.
- Precio desactualizado en un canal.
- Calcular margen con precio en lugar de ingreso neto post-descuento.

### Implicaciones para el Cognitive Core

Precio activa razonamiento de ingresos, elasticidad, impacto de promociones, ticket promedio y comparación con costo para rentabilidad.

---

## Costo

### Definición

El **costo** es el valor monetario de los recursos consumidos para producir y entregar un producto o operar el restaurante. En contexto de producto, es principalmente la suma de **ingredientes** según **receta**; en contexto operativo, incluye mano de obra, energía y otros recursos.

**Qué no es:** El costo no es el precio. No es la merma en sí — la merma contribuye al costo. No es el gasto de marketing. No es costo fijo del local — eso es categoría distinta en negocio.

**Cómo se utiliza:** Se calcula por producto desde receta. Se compara con precio para margen. Se agrega en análisis de rentabilidad. Se actualiza cuando cambian precios de ingredientes o proveedores.

### Propósito

Cuantificar lo que cuesta producir la oferta. Sin costo, no hay margen, no hay decisión informada de precio ni evaluación de rentabilidad por producto.

### Relaciones

- El costo de producto deriva de **ingredientes** en **receta**.
- El costo contrasta con **precio** para obtener **margen**.
- El costo se incrementa por **merma**, **extras** y **modificaciones**.
- El costo variable se suma en **utilidad** del periodo.
- El costo depende de **proveedor** y condiciones de **abastecimiento**.

### Restricciones

- Costo teórico (receta) y costo real (consumo efectivo) pueden diferir — ambos son válidos con propósito distinto.
- Costo debe actualizarse cuando cambian precios de insumos.
- Costo de combo requiere descomposición por componente.
- Costo sin receta documentada es estimación, no dato autoritativo.

### Ejemplos

- Costo de taco al pastor: $28 (ingredientes + factor de merma).
- Costo incrementado por modificación que agrega ingrediente premium.
- Costo de bebida embotellada: precio de compra al proveedor.

### Errores frecuentes

- Usar costo desactualizado de ingredientes.
- Ignorar merma y porciones irregulares en costo real.
- Confundir costo variable de producto con costo fijo de operación.
- No incluir complementos incluidos en costo del platillo.

### Implicaciones para el Cognitive Core

Costo activa razonamiento de rentabilidad, sensibilidad a precios de insumos, impacto de merma y decisiones de precio y oferta.

---

## Margen

### Definición

El **margen** es la diferencia entre el **precio** de venta y el **costo** de un producto, expresada en valor absoluto o porcentaje. Representa la ganancia bruta por unidad vendida antes de costos fijos y gastos operativos.

**Qué no es:** El margen no es la utilidad total del negocio. No es el ingreso bruto — es la diferencia unitaria o por línea. No es markup solamente — aunque se relaciona.

**Cómo se utiliza:** Se calcula por producto para decisiones de menú. Se analiza por categoría. Se compara entre productos para ingeniería de menú. Se erosiona con promociones y extras no cobrados.

### Propósito

Medir la rentabilidad unitaria de la oferta. El margen guía qué productos empujar, cuáles repricing y cuáles eliminar.

### Relaciones

- El margen se deriva de **precio** menos **costo**.
- El margen varía por **tamaño**, **variante** y **promoción**.
- El margen se agrega en **ventas** para contribución total.
- El margen se compara con **popularidad** en matrices de menú.
- El margen se erosiona por **merma** y **extras** no cobrados.

### Restricciones

- Margen negativo en producto es señal de alerta — puede ser intencional en promoción.
- Margen debe calcularse con precio efectivo cobrado, no solo precio de lista.
- Margen de combo no es promedio simple de componentes.
- Alta popularidad con bajo margen requiere análisis distinto a baja popularidad con alto margen.

### Ejemplos

- Producto a $100 con costo $35 → margen $65 (65%).
- Promoción reduce margen efectivo a 40%.
- Bebida embotellada: margen alto, costo bajo.

### Errores frecuentes

- Optimizar solo por margen ignorando popularidad.
- Calcular margen sin incluir complementos incluidos.
- Confundir margen bruto con utilidad neta.
- No recalcular margen tras cambio de proveedor.

### Implicaciones para el Cognitive Core

Margen activa razonamiento de ingeniería de menú, trade-offs promoción-rentabilidad, productos estrella vs. perros, y decisiones de discontinuación.

---

## Popularidad

### Definición

La **popularidad** es la medida de demanda de un producto, categoría o segmento: con qué frecuencia y en qué volumen los clientes lo ordenan en un periodo dado. Es comportamiento observable, no preferencia declarada.

**Qué no es:** La popularidad no es satisfacción — un producto puede ser popular y generar quejas. No es rentabilidad. No es disponibilidad. No es calidad culinaria en sí.

**Cómo se utiliza:** Se mide en unidades vendidas, porcentaje de órdenes que lo incluyen, o ranking dentro de categoría. Informa producción, inventario, destacados en menú y decisiones de continuidad.

### Propósito

Cuantificar qué compra el mercado. La popularidad conecta oferta con demanda real y prioriza recursos operativos.

### Relaciones

- La popularidad se mide sobre **productos** y **categorías**.
- La popularidad interactúa con **margen** en decisiones de menú.
- La popularidad afecta planificación de **inventario** y **preparación**.
- La popularidad varía por **horario**, canal y **sucursal**.
- La popularidad se correlaciona con **frecuencia** de clientes que lo piden.

### Restricciones

- Popularidad requiere periodo definido para comparación.
- Producto no disponible tiene popularidad observada truncada — interpretar con cautela.
- Lanzamientos recientes no tienen historial de popularidad comparable.
- Popularidad por canal puede diferir significativamente.

### Ejemplos

- Taco al pastor: 340 unidades vendidas en la semana — #1 en popularidad.
- Postre menos pedido: 2% de órdenes lo incluyen.
- Bebida más popular en horario de comida vs. cena.

### Errores frecuentes

- Confundir popularidad con rentabilidad.
- Descontinuar producto con nicho leal pero bajo volumen sin análisis.
- No segmentar popularidad por canal o horario.
- Atribuir caída de popularidad a calidad sin revisar disponibilidad o precio.

### Implicaciones para el Cognitive Core

Popularidad activa razonamiento de demanda, forecast de producción, posicionamiento en menú, detección de tendencias y correlación con estacionalidad.

---

## PARTE III — OPERACIÓN

La operación es el conjunto de actividades que transforman una orden en producto entregado. Esta sección define el lenguaje del flujo productivo interno.

---

## Orden

### Definición

Una **orden** es el acuerdo comercial entre cliente y restaurante que especifica qué productos se solicitan, en qué cantidad, con qué modificaciones, a qué precio y bajo qué condiciones de entrega. Es el punto de origen de toda actividad operativa posterior.

**Qué no es:** La orden no es el ticket de cobro — aunque se relacionan. No es la comanda física — la comanda es el instrumento de comunicación a cocina. No es la transacción de pago completada. No es la entrega en sí.

**Cómo se utiliza:** El cliente o el mesero crea la orden. Cocina la produce. Servicio la entrega. Caja la cobra. La orden persiste como registro de lo acordado y su estado de cumplimiento.

### Propósito

Formalizar el compromiso de producción y entrega. Sin orden no hay qué producir, qué cobrar ni qué evaluar en satisfacción.

### Relaciones

- Una orden contiene **productos**, **modificaciones**, **adicionales** y **combos**.
- Una orden genera **comandas** a **cocina**.
- Una orden se asocia a **cliente**, **mesa** o canal de **entrega**.
- Una orden produce **ventas** e **ingresos** al completarse el pago.
- Una orden tiene tiempos: **espera**, **preparación**, **entrega**.

### Restricciones

- Orden debe contener al menos un producto o combo válido y disponible.
- Orden modificada después de iniciar producción genera riesgo de error.
- Orden cancelada deja de generar obligación de producción pero puede generar **reclamación** o política de cobro.
- Orden en curso tiene estado: recibida, en preparación, lista, entregada, cerrada.

### Ejemplos

- Orden de mesa 12: 2 hamburguesas, 1 papas, 3 refrescos.
- Orden de delivery con dirección y productos.
- Orden para llevar (pickup) con hora estimada.

### Errores frecuentes

- Confundir orden con ticket de pago.
- No registrar modificaciones en la orden.
- Orden sin asociación a mesa o canal en salón.
- Cerrar orden sin verificar entrega completa.

### Implicaciones para el Cognitive Core

Orden es la unidad de trabajo operativo: origen de producción, registro de venta, base de tiempos de servicio y trazabilidad de satisfacción o reclamación.

---

## Ticket

### Definición

Un **ticket** es el registro formal de la transacción económica asociada a una orden: líneas de productos, precios, descuentos, impuestos, total a pagar y estado de pago. Es el documento de cobro.

**Qué no es:** El ticket no es la orden completa en sentido operativo — puede generarse al cierre. No es la comanda de cocina. No es factura fiscal en jurisdicciones donde se distingue. No es propina.

**Cómo se utiliza:** Se genera al solicitar o cerrar cuenta. El cajero cobra según ticket. El ticket documenta la venta para **ingresos** y reportes. Puede imprimirse o enviarse digitalmente.

### Propósito

Documentar el aspecto económico de la transacción. El ticket es la evidencia de qué se cobró y cómo se calculó el total.

### Relaciones

- Un ticket deriva de una **orden**.
- Un ticket lista **productos** con **precio** efectivo.
- Un ticket refleja **promociones** y descuentos.
- Un ticket registra **ventas** e **ingresos**.
- Un ticket lo procesa el **cajero**.

### Restricciones

- Ticket debe coincidir con productos entregados salvo ajuste documentado.
- Descuentos en ticket requieren autorización según política.
- Ticket pagado cierra obligación económica principal de la orden.
- Ticket dividido (split) divide cobro, no necesariamente la orden de producción.

### Ejemplos

- Ticket de $485 con desglose de productos e IVA.
- Ticket con descuento de fidelización aplicado.
- Ticket dividido entre dos compradores en la misma mesa.

### Errores frecuentes

- Ticket no coincide con lo consumido — fuente de reclamaciones.
- No reflejar promoción en ticket.
- Confundir ticket pendiente con ticket pagado en reportes de ingresos.
- Dividir ticket sin claridad de responsabilidad de pago.

### Implicaciones para el Cognitive Core

Ticket activa razonamiento de ingresos, conciliación orden-cobro, análisis de ticket promedio y detección de discrepancias económicas.

---

## Comanda

### Definición

Una **comanda** es la comunicación operativa de una orden (o parte de ella) hacia **cocina** o **estación** de producción. Traduce la orden del lenguaje comercial al lenguaje de preparación: qué hacer, cuánto, cómo y para dónde.

**Qué no es:** La comanda no es el ticket de cobro. No es la orden completa siempre — puede dividirse por estación. No es la receta — referencia productos a producir. No es el producto terminado.

**Cómo se utiliza:** Se imprime, muestra en pantalla o verbaliza a cocina. Incluye productos, modificaciones, mesa o canal, prioridad. Cocina marca avance según comanda.

### Propósito

Sincronizar front-of-house con back-of-house. La comanda es el instrumento que inicia y guía la producción.

### Relaciones

- Una comanda deriva de una **orden**.
- Una comanda llega a **estación** o **cocina** específica.
- Una comanda incluye **modificaciones** y **extras**.
- Una comanda referencia **productos** a **preparar**.
- Una comanda se asocia a **mesa**, pickup o **delivery**.

### Restricciones

- Comanda incompleta genera producción incorrecta.
- Modificaciones no transmitidas en comanda son error operativo grave.
- Comanda de estación incorrecta retrasa producción.
- Comanda cancelada debe comunicarse inmediatamente a cocina.

### Ejemplos

- Comanda impresa: "Mesa 5 — 2× Tacos al pastor (1 sin cebolla) — 1× Agua."
- Comanda en pantalla de bar: bebidas de mesa 8.
- Comanda de delivery con identificador de pedido.

### Errores frecuentes

- Modificaciones en orden no reflejadas en comanda.
- Enviar comanda a estación equivocada.
- No cancelar comanda cuando cliente cancela producto.
- Comanda ilegible o incompleta en impresión.

### Implicaciones para el Cognitive Core

Comanda activa razonamiento de flujo cocina-servicio, errores de comunicación, tiempos de preparación por estación y trazabilidad de modificaciones.

---

## Preparación

### Definición

La **preparación** es el conjunto de actividades que transforman **ingredientes** en producto terminado según **receta**, incluyendo mise en place, cocción, ensamblaje y **presentación**. Es la ejecución productiva.

**Qué no es:** La preparación no es el almacenamiento en inventario. No es la entrega al cliente. No es el pedido al proveedor. No es el lavado de trastes posterior.

**Cómo se utiliza:** Cocina prepara en respuesta a comandas y anticipación de demanda (prep anticipado). La preparación consume inventario, genera merma y ocupa tiempo de **cocinero** y **estación**.

### Propósito

Nombrar el proceso central del restaurante: la transformación culinaria que cumple la orden.

### Relaciones

- La preparación ejecuta **recetas** de **platillos**, **bebidas** y **complementos**.
- La preparación ocurre en **cocina** y **estaciones**.
- La preparación consume **ingredientes** del **inventario**.
- La preparación genera **merma** y tiene **tiempo de preparación**.
- La preparación responde a **comandas**.

### Restricciones

- Preparación debe seguir receta salvo **modificación** autorizada.
- Prep anticipado tiene vida útil — afecta calidad y merma.
- Capacidad de preparación limita throughput del restaurante.
- Preparación simultánea excesiva degrada calidad y tiempos.

### Ejemplos

- Preparar mise en place de vegetales antes del servicio.
- Cocción de proteína a la plancha según comanda.
- Ensamblaje y plating de platillo terminado.

### Errores frecuentes

- No descontar inventario al preparar.
- Confundir prep anticipado con producto terminado listo indefinidamente.
- Ignorar modificaciones en preparación.
- No registrar merma de preparación.

### Implicaciones para el Cognitive Core

Preparación activa razonamiento de capacidad productiva, consumo de inventario, tiempos, calidad y cuellos de botella por estación.

---

## Estación

### Definición

Una **estación** es el área de trabajo dentro de **cocina** dedicada a un tipo específico de **preparación**: plancha, freidora, ensaladas, postres, barra de bebidas. Tiene equipo, ingredientes prepados y personal asignado.

**Qué no es:** La estación no es la cocina completa. No es el almacén. No es la mesa del comensal. No es el puesto del mesero en salón.

**Cómo se utiliza:** Cada producto según receta se asigna a estación. Las comandas se enrutan por estación. El carga de trabajo se balancea entre estaciones.

### Propósito

Estructurar la división de labor en cocina para paralelizar producción y especializar habilidades.

### Relaciones

- Una estación está contenida en **cocina**.
- Una estación produce **productos** específicos.
- Una estación recibe **comandas** filtradas.
- Una estación la opera un **cocinero**.
- Una estación tiene capacidad y **tiempo de preparación** característico.

### Restricciones

- Producto sin estación asignada no tiene flujo de producción claro.
- Estación inactiva (equipo falla, sin personal) bloquea productos de esa estación.
- Sobrecarga de estación genera cuello de botella y aumenta **tiempo de espera**.
- Estaciones deben coordinarse para órdenes multi-componente.

### Ejemplos

- Estación de plancha: hamburguesas, carnes.
- Estación de freidora: papas, empanizados.
- Estación de fríos: ensaladas, ceviches.

### Errores frecuentes

- Enrutar comanda a estación incorrecta.
- No balancear carga entre estaciones en rush.
- Estación sin mise en place suficiente al inicio de servicio.
- Confundir estación con rol de empleado.

### Implicaciones para el Cognitive Core

Estación activa razonamiento de cuellos de botella, capacidad paralela, tiempos por tipo de producto y asignación de personal especializado.

---

## Cocina

### Definición

La **cocina** es el espacio y sistema de **producción** del restaurante donde ocurre la **preparación** de alimentos y bebidas que requieren transformación culinaria. Es el centro operativo de back-of-house.

**Qué no es:** La cocina no es el salón. No es el almacén completo — aunque puede tener área de almacenamiento. No es la oficina administrativa. No es el área de lavado exclusivamente.

**Cómo se utiliza:** La cocina recibe comandas, ejecuta recetas, coordina estaciones, entrega productos terminados a servicio o empaque. Su eficiencia determina tiempos y calidad.

### Propósito

Delimitar el subsistema productivo del restaurante. La cocina es donde la oferta del menú se vuelve realidad física.

### Relaciones

- La cocina contiene **estaciones**.
- La cocina ejecuta **preparación** de **productos**.
- La cocina consume **inventario** de **ingredientes**.
- La cocina recibe **comandas** y entrega a servicio o **entrega**.
- La cocina la operan **cocineros** en **turnos**.

### Restricciones

- Capacidad de cocina limita volumen de órdenes simultáneas.
- Cocina cerrada o fuera de horario bloquea producción aunque salón esté abierto.
- Seguridad alimentaria y sanidad son restricciones no negociables.
- Cocina de delivery-only (ghost kitchen) opera sin salón pero mantiene lógica productiva.

### Ejemplos

- Cocina de restaurante full-service con 5 estaciones.
- Cocina de dark kitchen solo para pedidos de delivery.
- Cocina central que abastece múltiples sucursales.

### Errores frecuentes

- Medir desempeño solo en salón ignorando restricciones de cocina.
- Sobrecargar cocina sin ajustar menú o staffing.
- No coordinar cierre de cocina con últimas órdenes.
- Confundir cocina con toda el área de back-of-house incluyendo lavado.

### Implicaciones para el Cognitive Core

Cocina activa razonamiento de throughput, capacidad máxima, calidad de producción, consumo de inventario y correlación con tiempos de espera del cliente.

---

## Producción

### Definición

La **producción** es la salida del sistema de cocina: productos terminados listos para entrega, medida en unidades, lotes o velocidad por periodo. Es el resultado de la preparación, no el proceso en sí.

**Qué no es:** La producción no es la preparación en abstracto — es output. No es venta — un producto producido puede no venderse si se desecha. No es inventario de ingredientes.

**Cómo se utiliza:** Se planifica según demanda esperada. Se mide en platos por hora, unidades por turno. Se compara con órdenes pendientes para detectar déficit o exceso.

### Propósito

Cuantificar la capacidad de transformación del restaurante. Producción conecta esfuerzo de cocina con cumplimiento de órdenes.

### Relaciones

- La producción resulta de **preparación** en **cocina**.
- La producción cumple **comandas** y **órdenes**.
- La producción consume **ingredientes** y genera **merma**.
- La producción excedente puede convertirse en **merma** si no se vende.
- La producción se limita por **estaciones** y **personal**.

### Restricciones

- Producción debe alinearse con demanda — sobreproducción genera merma.
- Producción insuficiente genera tiempos de espera y cancelaciones.
- Calidad de producción debe cumplir estándar de receta y presentación.
- Producción anticipada tiene horizonte de frescura.

### Ejemplos

- 45 platillos producidos en hora pico.
- Producción anticipada de salsas para el turno.
- Producción detenida por falla de equipo de estación.

### Errores frecuentes

- Confundir producción con ventas.
- Sobreproducir sin demanda — merma evitable.
- No medir producción por estación para detectar cuellos de botella.
- Producción que no cumple modificaciones de comanda.

### Implicaciones para el Cognitive Core

Producción activa razonamiento de balance demanda-capacidad, eficiencia operativa, merma por sobreproducción y planificación de turnos.

---

## Inventario

### Definición

El **inventario** es el registro y estado de los **ingredientes** y productos terminados almacenados disponibles para **producción** y servicio. Incluye cantidades, ubicación, rotación y condición.

**Qué no es:** El inventario no es el menú. No es la orden en curso. No es el equipo de cocina. No es el valor contable completo del negocio — es stock operativo.

**Cómo se utiliza:** Se recibe de **abastecimiento**, se consume en preparación, se cuenta periódicamente, se ajusta por **merma**. Determina **disponibilidad** de productos.

### Propósito

Visibilizar qué insumos existen para producir. Sin inventario trazable, no hay control de costos, disponibilidad ni planificación de compras.

### Relaciones

- El inventario contiene **ingredientes** y productos de reventa (bebidas embotelladas).
- El inventario se repone por **abastecimiento** de **proveedores**.
- El inventario se consume en **preparación** y **producción**.
- El inventario se reduce por **merma**.
- El inventario condiciona **disponibilidad** del **menú**.

### Restricciones

- Inventario negativo indica error de registro o robo — no es estado válido operacionalmente.
- Conteo físico debe reconciliarse con registro teórico.
- Inventario perecedero tiene fecha de caducidad.
- Inventario mínimo dispara necesidad de abastecimiento.

### Ejemplos

- 15 kg de pechuga de pollo en refrigeración.
- Inventario de refrescos embotellados en almacén.
- Inventario teórico vs. físico con varianza del 3%.

### Errores frecuentes

- No descontar consumo al producir.
- Confundir inventario con productos terminados listos para servir.
- Ignorar merma en ajustes de inventario.
- No alertar cuando inventario bloquea productos del menú.

### Implicaciones para el Cognitive Core

Inventario activa razonamiento de disponibilidad, reorden, costo de capital inmovilizado, merma y predicción de agotamiento por demanda.

---

## Merma

### Definición

La **merma** es la pérdida de **ingredientes** o productos por deterioro, caducidad, derrame, error de preparación, porcionamiento excesivo, devolución o desecho. Es consumo que no genera **venta**.

**Qué no es:** La merma no es costo de ingrediente vendido correctamente. No es robo necesariamente — aunque el robo es pérdida distinta. No es la comida que el cliente pagó y no terminó.

**Cómo se utiliza:** Se registra para ajustar **inventario** y analizar **costo** real. Se categoriza por causa para acciones correctivas. Se presupuesta como porcentaje esperado de operación.

### Propósito

Cuantificar pérdida operativa de insumos. La merma explica diferencias entre costo teórico y real y erosiona **margen**.

### Relaciones

- La merma reduce **inventario**.
- La merma incrementa **costo** efectivo de **productos**.
- La merma ocurre en **preparación**, almacenamiento y servicio.
- La merma se relaciona con **producción** excesiva.
- La merma es KPI operativo y financiero.

### Restricciones

- Toda merma significativa debe registrarse para análisis honesto.
- Merma inevitable (cascos, evaporación) difiere de merma evitable (error).
- No registrar merma oculta problemas de compras, capacitación o porcionamiento.
- Merma alta en ingrediente premium impacta desproporcionadamente el margen.

### Ejemplos

- Verduras caducadas desechadas.
- Lote de salsa quemada en preparación.
- Porciones de proteína superiores al estándar de receta.

### Errores frecuentes

- No registrar merma — inventario ficticio.
- Confundir merma con consumo normal de producción.
- Atribuir toda varianza de inventario a merma sin investigar robo o error de conteo.
- Ignorar merma en cálculo de costo de platillo.

### Implicaciones para el Cognitive Core

Merma activa razonamiento de eficiencia, desviación costo teórico-real, alertas por ingrediente, impacto en margen y priorización de capacitación o ajuste de receta.

---

## Abastecimiento

### Definición

El **abastecimiento** es el proceso de obtener **ingredientes** y suministros del **proveedor** para reponer **inventario**. Incluye pedido, recepción, verificación de calidad y registro de entrada.

**Qué no es:** El abastecimiento no es la producción en cocina. No es la venta al cliente. No es el pago al proveedor necesariamente — aunque se relaciona. No es el almacenamiento a largo plazo en sí.

**Cómo se utiliza:** Se planifica según consumo proyectado y niveles mínimos. Se ejecuta en ciclos regulares o de emergencia. La recepción actualiza inventario y costos de insumos.

### Propósito

Mantener continuidad de producción mediante reposición predecible de insumos. El abastecimiento conecta el restaurante con su cadena de suministro.

### Relaciones

- El abastecimiento involucra **proveedores**.
- El abastecimiento repone **inventario** de **ingredientes**.
- El abastecimiento afecta **costo** de productos.
- El abastecimiento condiciona **disponibilidad** futura.
- El abastecimiento se planifica con base en **ventas** y **producción** proyectadas.

### Restricciones

- Abastecimiento tardío genera indisponibilidad de productos.
- Recepción debe verificar cantidad y calidad antes de aceptar.
- Abastecimiento de emergencia suele tener mayor costo.
- Dependencia de un solo proveedor es riesgo operativo.

### Ejemplos

- Pedido semanal de proteínas al distribuidor.
- Compra de emergencia de aguacate por proveedor local.
- Recepción de 50 cajas de refresco con actualización de inventario.

### Errores frecuentes

- Pedir sin considerar inventario actual ni demanda proyectada.
- No actualizar costo al recibir insumo con precio distinto.
- Aceptar insumo en mal estado que generará merma.
- Confundir abastecimiento con traspaso entre sucursales.

### Implicaciones para el Cognitive Core

Abastecimiento activa razonamiento de reorden, lead time, riesgo de proveedor, costo de insumos y continuidad de oferta del menú.

---

## PARTE IV — CLIENTE

El cliente es el agente cuya demanda sostiene al restaurante. Esta sección define los términos que describen quién compra, quién consume y cómo se relaciona con el negocio en el tiempo.

---

## Cliente

### Definición

Un **cliente** es la persona o entidad que mantiene una relación de compra con el restaurante: ha realizado al menos una transacción o manifiesta intención activa de compra. Es el concepto relacional que persiste más allá de una visita individual.

**Qué no es:** El cliente no es necesariamente el **consumidor** — quien paga puede no ser quien come. No es el **visitante** que solo observa. No es el empleado ni el proveedor. No es la orden — es quien la origina.

**Cómo se utiliza:** El restaurante identifica clientes para historial, fidelización, resolución de quejas y análisis de valor de vida. Un cliente puede ser anónimo en transacción puntual pero deja de ser anónimo si se identifica.

### Propósito

Establecer la unidad relacional de demanda. El cliente es el eje de ingresos, satisfacción y estrategia comercial.

### Relaciones

- Un cliente realiza **órdenes** y genera **ventas**.
- Un cliente tiene **historial**, **preferencias** y **frecuencia**.
- Un cliente expresa **satisfacción** o **reclamaciones**.
- Un cliente participa en **fidelización**.
- Un cliente puede ser **comprador** y/o **consumidor**.

### Restricciones

- Cliente potencial sin transacción es visitante con intención — categoría intermedia.
- Cliente identificado requiere datos mínimos según política (teléfono, programa de lealtad).
- Trato a cliente no debe depender de una sola interacción aislada sin contexto.
- Cliente corporativo o evento puede ser entidad, no persona física.

### Ejemplos

- María, quien ordena delivery cada semana — cliente recurrente.
- Primera visita con registro en programa de lealtad — cliente nuevo identificado.
- Empresa que contrata catering semanal — cliente corporativo.

### Errores frecuentes

- Tratar toda transacción anónima como cliente sin distinción de visitante.
- Confundir cliente con comensal de mesa sin identificar quién paga.
- No vincular reclamación al historial del cliente.
- Perder historial al cambiar de canal (salón vs. app).

### Implicaciones para el Cognitive Core

Cliente activa razonamiento de segmentación, valor de vida, predicción de retorno, personalización de oferta y priorización en resolución de conflictos.

---

## Visitante

### Definición

Un **visitante** es una persona presente en el entorno del restaurante o en contacto con su oferta sin haber completado ni comprometido una compra. Puede estar evaluando, esperando acompañante o simplemente transitando.

**Qué no es:** El visitante no es cliente hasta que inicia o completa transacción. No es empleado en funciones de trabajo. No es proveedor en entrega. No es el consumidor de una orden ya pagada por otro.

**Cómo se utiliza:** Se reconoce en salón (persona que espera mesa sin orden), en vitrina (quien lee menú exterior) o en web (sesión sin checkout). La conversión de visitante a cliente es métrica comercial.

### Propósito

Distinguir presencia de intención de compra. El visitante representa oportunidad potencial y, si se va sin comprar, abandono medible.

### Relaciones

- Un visitante puede convertirse en **cliente** al ordenar.
- Un visitante puede ocupar capacidad del **salón** sin generar **ingresos**.
- Un visitante puede influir en percepción de **popularidad** (cola visible).
- Un visitante puede tener **preferencias** observadas antes de comprar.

### Restricciones

- Visitante con reservación tiene compromiso parcial — categoría híbrida.
- Tiempo excesivo como visitante sin conversión puede indicar barrera (precio, espera).
- No todo entrante al local es visitante (personal, inspectores).
- Visitante digital (bounce en menú online) difiere de visitante físico pero comparte lógica.

### Ejemplos

- Persona revisando menú en entrada sin entrar.
- Grupo esperando mesa disponible.
- Usuario que abandona carrito en app de pedidos.

### Errores frecuentes

- Contar visitantes como clientes en métricas de tráfico.
- Ignorar tasa de conversión visitante → cliente.
- No distinguir visitante de cliente en análisis de afluencia.
- Asumir que todo comensal en mesa ajena es visitante — puede ser consumidor invitado.

### Implicaciones para el Cognitive Core

Visitante activa razonamiento de conversión, abandono, capacidad ocupada sin ingreso y efectividad de primera impresión (menú, precio, tiempo de espera visible).

---

## Comprador

### Definición

El **comprador** es la persona o entidad que autoriza y realiza el **pago** de una **orden**. Es el responsable económico de la transacción, independientemente de quién consuma los productos.

**Qué no es:** El comprador no es siempre quien come — un padre compra, hijos consumen. No es el restaurante. No es el mesero — actúa como intermediario. No es el proveedor en sentido inverso.

**Cómo se utiliza:** Se identifica al cerrar **ticket**: quien paga efectivo, tarjeta o cuenta corporativa. Importa para facturación, programas de lealtad y análisis de gasto por persona.

### Propósito

Separar la dimensión económica de la dimensión de consumo. El comprador determina ingresos y puede diferir del consumidor en preferencias y reclamaciones.

### Relaciones

- El comprador paga el **ticket** de una **orden**.
- El comprador puede ser **cliente** identificado o anónimo.
- El comprador puede no ser **consumidor** de todos los productos.
- El comprador acumula beneficios de **fidelización** si está identificado.
- El comprador puede presentar **reclamación** por cobro incorrecto.

### Restricciones

- En mesa compartida puede haber múltiples compradores (cuenta dividida).
- Comprador menor de edad con restricciones en bebidas alcohólicas.
- Comprador corporativo requiere datos fiscales distintos.
- El comprador autoriza monto — cobro superior es reclamación válida.

### Ejemplos

- Mamá paga la cuenta familiar — compradora, no necesariamente consumidora principal.
- Empleado de empresa paga con tarjeta corporativa.
- Cliente de delivery que paga en línea al ordenar.

### Errores frecuentes

- Atribuir preferencias del consumidor al comprador en análisis.
- Programa de lealtad vinculado al consumidor en lugar del comprador.
- No permitir split de ticket entre compradores.
- Confundir comprador con titular de reservación.

### Implicaciones para el Cognitive Core

Comprador activa razonamiento de ingresos atribuidos, lealtad, facturación, ticket promedio por pagador y reclamaciones económicas.

---

## Consumidor

### Definición

El **consumidor** es la persona que ingiere o utiliza el producto ordenado. Es el receptor sensorial de la experiencia gastronómica, aunque no haya pagado.

**Qué no es:** El consumidor no es necesariamente el **comprador**. No es el restaurante. No es el repartidor que solo transporta. No es el grupo abstracto — son individuos con experiencia propia.

**Cómo se utiliza:** La satisfacción se evalúa desde la experiencia del consumidor. Alergias y restricciones dietéticas aplican al consumidor. Porciones pueden dimensionarse por número de consumidores.

### Propósito

Anclar la evaluación de calidad y experiencia en quien realmente recibe el producto, no solo en quien paga.

### Relaciones

- El consumidor recibe producto de **orden** vía **entrega** o servicio en **mesa**.
- El consumidor expresa **satisfacción** o **reclamación** sobre calidad.
- El consumidor puede tener **preferencias** y restricciones.
- El consumidor puede diferir del **comprador** y del **cliente** identificado.
- El consumidor define demanda real de porciones en mesa compartida.

### Restricciones

- Modificaciones por alergia protegen al consumidor — error es riesgo grave.
- Satisfacción del consumidor no pagador importa en experiencia grupal.
- Niños como consumidores implican restricciones de menú y seguridad.
- Consumidor de delivery no observa ambiente de salón — evalúa otros atributos.

### Ejemplos

- Niños consumiendo menú infantil pagado por padre.
- Invitados en cena corporativa — consumidores múltiples, comprador único.
- Cliente que ordena para tercero en delivery — comprador distinto de consumidor.

### Errores frecuentes

- Medir satisfacción solo con quien paga.
- Ignorar restricciones del consumidor no visible al tomar orden.
- Porciones inadecuadas para número de consumidores en mesa.
- Confundir consumidor con cliente en programa de preferencias.

### Implicaciones para el Cognitive Core

Consumidor activa razonamiento de experiencia sensorial, seguridad alimentaria, satisfacción real vs. pagada y personalización de preparación.

---

## Frecuencia

### Definición

La **frecuencia** es la regularidad con la que un **cliente** interactúa comercialmente con el restaurante: número de visitas, órdenes o transacciones en un periodo definido.

**Qué no es:** La frecuencia no es popularidad de un producto. No es el horario del restaurante. No es la velocidad de servicio. No es lealtad emocional — es comportamiento medible.

**Cómo se utiliza:** Se calcula como visitas por mes, días entre visitas, órdenes por semana. Segmenta clientes en ocasionales, regulares y VIP. Informa predicción de demanda y valor de vida.

### Propósito

Cuantificar hábito de compra. La frecuencia distingue tráfico casual de relación sostenida con el negocio.

### Relaciones

- La frecuencia describe comportamiento de **cliente**.
- La frecuencia se registra en **historial**.
- La frecuencia alta correlaciona con **fidelización**.
- La frecuencia caída es señal de riesgo de churn.
- La frecuencia varía por canal y **sucursal**.

### Restricciones

- Frecuencia requiere identificación del cliente para precisión.
- Una visita con múltiples órdenes (bar + comedor) puede contarse según regla definida.
- Frecuencia de cliente corporativo difiere de consumidor individual.
- Comparar frecuencia requiere periodos equivalentes.

### Ejemplos

- Cliente que ordena 3 veces por semana — alta frecuencia.
- Cliente que visita una vez cada dos meses — baja frecuencia.
- Caída de frecuencia tras incidente de servicio.

### Errores frecuentes

- Confundir frecuencia de producto con frecuencia de cliente.
- No detectar caída de frecuencia como alerta temprana.
- Calcular frecuencia sin unificar canales del mismo cliente.
- Período demasiado corto para conclusiones estables.

### Implicaciones para el Cognitive Core

Frecuencia activa razonamiento de retención, predicción de visita, segmentación RFM y detección de churn.

---

## Preferencia

### Definición

La **preferencia** es la inclinación observable o declarada de un **cliente** o **consumidor** hacia ciertos **productos**, **variantes**, **modificaciones**, canales o experiencias de servicio.

**Qué no es:** La preferencia no es una orden actual — es patrón o declaración. No es popularidad global. No es restricción médica obligatoria — aunque puede superponerse (alergia). No es satisfacción.

**Cómo se utiliza:** Se infiere del historial de órdenes, se captura en perfil o se expresa en el momento ("siempre pido sin picante"). Informa recomendaciones, preparación anticipada y personalización.

### Propósito

Capturar gusto y tendencia individual para mejorar experiencia y eficiencia operativa.

### Relaciones

- La preferencia pertenece a **cliente** o **consumidor**.
- La preferencia se refleja en **historial** de **órdenes**.
- La preferencia guía **modificaciones** recurrentes.
- La preferencia interactúa con **menú** y **oferta**.
- La preferencia puede expresarse en **reclamación** si se ignora.

### Restricciones

- Preferencia inferida no es certeza — puede cambiar.
- Preferencia declarada debe distinguirse de inferida.
- Alergia es restricción de seguridad, no preferencia opcional.
- Preferencias conflictivas en grupo requieren resolución por orden.

### Ejemplos

- Cliente siempre pide salsa aparte — preferencia operativa.
- Preferencia por canal delivery sobre salón.
- Historial muestra orden recurrente de platillo vegetariano.

### Errores frecuentes

- Ignorar preferencia registrada en nueva visita.
- Tratar preferencia como permanente sin validación.
- Confundir preferencia de comprador con consumidor en mesa compartida.
- No distinguir preferencia de restricción alimentaria.

### Implicaciones para el Cognitive Core

Preferencia activa razonamiento de personalización, recomendación de productos, anticipación en preparación y detección de desalineación oferta-gusto.

---

## Historial

### Definición

El **historial** es el registro acumulado de interacciones de un **cliente** con el restaurante: órdenes pasadas, pagos, reclamaciones, reservaciones, canales utilizados y beneficios de fidelización.

**Qué no es:** El historial no es la orden actual. No es el inventario. No es la receta. No es opinión genérica sin hechos registrados.

**Cómo se utiliza:** Consulta antes de atender cliente recurrente. Análisis de valor de vida. Resolución de disputas con evidencia. Entrenamiento de patrones de **preferencia** y **frecuencia**.

### Propósito

Proveer memoria relacional del negocio con el cliente. Sin historial, cada interacción es primera vez.

### Relaciones

- El historial pertenece a **cliente** identificado.
- El historial contiene **órdenes**, **tickets**, **reclamaciones**.
- El historial alimenta **frecuencia**, **preferencia** y **fidelización**.
- El historial varía por **sucursal** si no está unificado.
- El historial informa **satisfacción** longitudinal.

### Restricciones

- Historial fragmentado por canal reduce valor.
- Retención de historial sujeta a política de privacidad del negocio.
- Cliente anónimo no tiene historial vinculable salvo heurísticas.
- Historial debe ser consistente y no editable sin auditoría.

### Ejemplos

- Historial muestra 47 órdenes en 12 meses, ticket promedio $320.
- Registro de reclamación resuelta hace 3 meses.
- Historial de reservaciones con no-shows repetidos.

### Errores frecuentes

- No consultar historial ante reclamación recurrente.
- Historial desconectado entre sucursales de misma marca.
- Perder historial en migración de sistemas.
- Inferir satisfacción sin eventos en historial.

### Implicaciones para el Cognitive Core

Historial activa razonamiento de contexto relacional, valor de vida, riesgo de cliente, personalización y evidencia en disputas.

---

## Satisfacción

### Definición

La **satisfacción** es el grado en que la experiencia del **cliente** o **consumidor** cumple o supera sus expectativas respecto a comida, servicio, tiempo, precio y ambiente. Es evaluación subjetiva con indicadores observables.

**Qué no es:** La satisfacción no es popularidad de producto. No es el pago completado — se puede pagar insatisfecho. No es ausencia de reclamación — muchos insatisfechos no reclaman. No es margen del restaurante.

**Cómo se utiliza:** Se mide por encuestas, reseñas, propinas, repetición de visita y ausencia de quejas. Informa capacitación, ajustes de menú y estándares de servicio.

### Propósito

Capturar el resultado humano de la operación. La satisfacción predice retención y recomendación.

### Relaciones

- La satisfacción evalúa **productos**, **servicio**, **tiempos** y **precio**.
- La satisfacción se contrasta con **reclamación**.
- La satisfacción alta correlaciona con **frecuencia** y **fidelización**.
- La satisfacción se expresa en **historial** del **cliente**.
- La satisfacción varía por canal y expectativas.

### Restricciones

- Satisfacción es multidimensional — buena comida con mal servicio es mixta.
- Expectativas dependen de segmento y precio posicionado.
- Satisfacción instantánea puede diferir de reflexiva (días después).
- Un incidente grave puede destruir satisfacción de experiencia por lo demás buena.

### Ejemplos

- Cliente califica 9/10 en rapidez y sabor.
- Propina generosa como señal de satisfacción en salón.
- Cliente repite sin quejar — satisfacción inferida.

### Errores frecuentes

- Medir solo satisfacción con comida ignorando tiempo o trato.
- Asumir satisfacción por ausencia de reclamación formal.
- No vincular satisfacción baja con datos de orden específica.
- Comparar satisfacción entre canales sin ajustar expectativas.

### Implicaciones para el Cognitive Core

Satisfacción activa razonamiento de retención, atribución de causa (cocina vs. servicio), alertas de deterioro y correlación con tiempos y modificaciones incumplidas.

---

## Reclamación

### Definición

Una **reclamación** es la expresión formal o informal de insatisfacción o perjuicio por parte del **cliente**, **comprador** o **consumidor**, respecto a producto, servicio, cobro, tiempo o experiencia. Solicita reconocimiento o remedio.

**Qué no es:** La reclamación no es un cumplido. No es una modificación preventiva en la orden. No es feedback constructivo genérico sin perjuicio percibido. No es una orden nueva.

**Cómo se utiliza:** Se registra con descripción, orden asociada y resolución. Puede resultar en reembolso, reproducción de platillo, descuento o disculpa. Alimenta análisis de calidad y capacitación.

### Propósito

Canalizar insatisfacción en acción correctiva trazable. Las reclamaciones no resueltas erosionan fidelidad y reputación.

### Relaciones

- La reclamación se vincula a **orden**, **producto** o **ticket**.
- La reclamación contrasta con **satisfacción**.
- La reclamación se registra en **historial** del **cliente**.
- La reclamación puede involucrar **modificaciones** no cumplidas.
- La reclamación genera costo (rehacer, reembolsar) y **merma**.

### Restricciones

- Toda reclamación merece registro aunque resolución sea simple.
- Reclamaciones recurrentes del mismo cliente indican problema sistémico.
- Resolución debe ser proporcional y consistente con política.
- Reclamación falsa o abusiva existe — requiere criterio de gerencia.

### Ejemplos

- "Mi hamburguesa llegó fría" — reclamación de producto.
- "Cobraron adicional no autorizado" — reclamación económica.
- "Esperamos 50 minutos" — reclamación de tiempo.

### Errores frecuentes

- No registrar reclamación resuelta informalmente.
- Resolver sin identificar causa raíz (cocina, servicio, sistema).
- Tratar reclamación como aislada ignorando historial.
- No vincular reclamación a comanda o modificaciones.

### Implicaciones para el Cognitive Core

Reclamación activa razonamiento de fallas operativas, costo de servicio, patrones por producto o turno, riesgo de cliente y prioridad de remedio.

---

## Fidelización

### Definición

La **fidelización** es el conjunto de mecanismos y estado relacional que incentivan al **cliente** a repetir compras y preferir el restaurante sobre alternativas. Combina programas formales (puntos, membresías) con hábito y satisfacción sostenida.

**Qué no es:** La fidelización no es una sola transacción. No es descuento puntual sin relación — eso es **promoción**. No es satisfacción momentánea aislada. No es captura forzada de datos.

**Cómo se utiliza:** Programas acumulan beneficios por **frecuencia** y gasto. Comunicaciones personalizadas retienen clientes. La fidelización se mide en retención y share of wallet.

### Propósito

Transformar clientes ocasionales en recurrentes mediante valor acumulado y relación continua.

### Relaciones

- La fidelización opera sobre **clientes** identificados.
- La fidelización usa **historial** y **preferencias**.
- La fidelización ofrece beneficios distintos de **promociones** generales.
- La fidelización depende de **satisfacción** sostenida.
- La fidelización genera **ventas** recurrentes predecibles.

### Restricciones

- Fidelización sin calidad operativa fracasa — el programa no compensa mala experiencia.
- Beneficios deben ser sostenibles para **margen**.
- Fidelización por sucursal vs. marca requiere definición clara.
- Cliente fidelizado insatisfecho es riesgo reputacional amplificado.

### Ejemplos

- Programa: cada 10 órdenes, una bebida gratis.
- Cliente VIP con línea directa y reservación prioritaria.
- Tarjeta de sellos en local físico.

### Errores frecuentes

- Confundir promoción masiva con fidelización relacional.
- Programa de puntos sin identificar cliente en cada visita.
- Ignorar cliente fidelizado en momento de **reclamación**.
- Medir inscripciones al programa sin medir retención real.

### Implicaciones para el Cognitive Core

Fidelización activa razonamiento de retención, valor de vida, elegibilidad de beneficios, riesgo de churn en clientes de alto valor y ROI de programas.

---

## PARTE V — SERVICIO

El servicio es la dimensión de entrega y experiencia entre producción y satisfacción del cliente. Esta sección define el lenguaje de espacios, tiempos y canales de entrega.

---

## Salón

### Definición

El **salón** es el área del restaurante destinada a recibir, acomodar y atender al **cliente** en el consumo presencial: mesas, circulación, ambiente y servicio de mesa. Es el escenario de la experiencia dine-in.

**Qué no es:** El salón no es la **cocina**. No es el área de pickup ni el punto de empaque para delivery. No es el estacionamiento. No es la marca en abstracto.

**Cómo se utiliza:** El salón tiene capacidad medida en mesas y cubiertos. Se organiza en secciones para **meseros**. El estado del salón (lleno, disponible, en limpieza) determina **tiempo de espera** y **reservaciones**.

### Propósito

Delimitar el espacio de experiencia presencial del cliente. El salón es donde se materializa el servicio y la percepción de marca en vivo.

### Relaciones

- El salón contiene **mesas**.
- El salón es atendido por **meseros**.
- El salón aloja **clientes** y **visitantes**.
- El salón contrasta con canales **pickup** y **delivery**.
- El salón tiene **capacidad** y **horario** de operación.

### Restricciones

- Capacidad de salón limita cubiertos simultáneos.
- Salón lleno genera cola de **visitantes** y presión en cocina.
- Configuración de salón afecta eficiencia de servicio y rotación.
- Salón cerrado con cocina abierta implica solo canales alternativos.

### Ejemplos

- Salón principal con 20 mesas y 80 cubiertos.
- Terraza como extensión de salón en temporada.
- Salón reorganizado para evento privado.

### Errores frecuentes

- Medir ocupación sin considerar tiempo de rotación de mesa.
- Sobrerreservar ignorando capacidad real del salón.
- Confundir salón con todo el local incluyendo cocina y baños.
- No coordinar ritmo de salón con capacidad de cocina.

### Implicaciones para el Cognitive Core

Salón activa razonamiento de capacidad, ocupación, rotación de mesas, equilibrio demanda-servicio y experiencia presencial.

---

## Mesa

### Definición

La **mesa** es la unidad de acomodación en el **salón** donde un grupo de **clientes** o **consumidores** se sienta, ordena, recibe productos y paga. Tiene identificador, capacidad y estado operativo.

**Qué no es:** La mesa no es la orden — varias órdenes pueden asociarse a una mesa en turnos sucesivos. No es el ticket. No es la reservación — aunque la reservación asigna mesa. No es el mostrador de pickup.

**Cómo se utiliza:** El mesero toma orden por mesa. Cocina recibe comanda con identificador de mesa. La cuenta se cierra por mesa o dividida. La mesa rota entre turnos de comensales.

### Propósito

Ser la unidad atómica de servicio presencial. La mesa conecta cliente, orden, servicio y cobro en espacio físico.

### Relaciones

- La mesa está en **salón**.
- La mesa recibe **órdenes** y **comandas** identificadas.
- La mesa es atendida por **mesero** asignado.
- La mesa puede tener **reservación**.
- La mesa genera **ticket** al cierre.

### Restricciones

- Mesa ocupada no está disponible para nuevos comensales.
- Capacidad de mesa no debe excederse por seguridad y experiencia.
- Mesa sucia o en limpieza no es asignable.
- Unir mesas es operación que altera capacidad temporal.

### Ejemplos

- Mesa 14, capacidad 4, ocupada desde las 20:15.
- Mesa de ventana reservada para aniversario.
- Mesa en limpieza post-turno.

### Errores frecuentes

- Enviar comanda sin identificador de mesa en salón.
- Asignar grupo grande a mesa pequeña.
- No liberar mesa en sistema al terminar limpieza.
- Confundir mesa con cuenta — una mesa puede dividir múltiples pagadores.

### Implicaciones para el Cognitive Core

Mesa activa razonamiento de rotación, asignación, tiempos de ocupación, carga del mesero y trazabilidad orden-servicio.

---

## Reservación

### Definición

Una **reservación** es el acuerdo previo entre **cliente** y restaurante que garantiza o prioriza ocupación de **mesa** (o espacio) en fecha y hora específicas, bajo condiciones definidas.

**Qué no es:** La reservación no es la orden de comida — llega antes. No es lista de espera informal. No es reservación de producto. No es el pago anticipado necesariamente.

**Cómo se utiliza:** El cliente reserva por teléfono, app o en persona. El restaurante asigna mesa o bloquea capacidad. La reservación reduce incertidumbre de afluencia y mejora experiencia planificada.

### Propósito

Planificar demanda presencial y comprometer capacidad del salón con anticipación.

### Relaciones

- La reservación asigna o prioriza **mesa** en **salón**.
- La reservación la hace un **cliente** identificado.
- La reservación opera en **horario** específico.
- La reservación no cumplida (no-show) afecta capacidad y costo de oportunidad.
- La reservación puede convertirse en **orden** al llegar el cliente.

### Restricciones

- Reservación excede capacidad es inválida.
- Política de tolerancia (15 min de gracia) debe definirse.
- No-show repetido puede afectar prioridad futura del cliente.
- Reservaciones grandes requieren coordinación con cocina.

### Ejemplos

- Reservación para 6 personas, sábado 21:00, mesa redonda.
- Reservación con depósito para evento privado.
- Cliente no llega — no-show registrado.

### Errores frecuentes

- Sobre-reservar sin buffer para walk-ins.
- No liberar mesa reservada tras no-show tardío.
- Reservación sin tamaño de grupo correcto.
- No vincular reservación a orden al sentar — pierde trazabilidad.

### Implicaciones para el Cognitive Core

Reservación activa razonamiento de planificación de capacidad, riesgo de no-show, asignación de mesas y coordinación flujo reservado vs. espontáneo.

---

## Entrega

### Definición

La **entrega** es el acto de transferir el producto terminado al **consumidor** o receptor autorizado, completando la obligación de la **orden** respecto al producto. Es el momento de handoff, independiente del canal.

**Qué no es:** La entrega no es la producción. No es el pago — puede ocurrir antes o después según canal. No es el transporte en sí para delivery — es la entrega al destinatario final.

**Cómo se utiliza:** En salón, el mesero entrega a la mesa. En pickup, se entrega en mostrador. En delivery, el repartidor entrega en domicilio. La entrega marca producto como recibido por cliente.

### Propósito

Marcar el cumplimiento físico de la orden hacia el cliente. Sin entrega registrada, la orden puede estar producida pero no completada en servicio.

### Relaciones

- La entrega completa una **orden** o línea de orden.
- La entrega ocurre tras **preparación** y **producción**.
- La entrega en salón es función del **mesero**.
- La entrega en delivery es función del **repartidor**.
- La entrega incorrecta o tardía genera **reclamación**.

### Restricciones

- Entrega debe coincidir con comanda y modificaciones.
- Producto entregado en mal estado es falla de entrega o producción.
- Entrega parcial debe registrarse explícitamente.
- Temperatura y presentación son parte de calidad de entrega.

### Ejemplos

- Mesero sirve platillos en mesa 7 — entrega en salón.
- Cliente recibe bolsa en mostrador — entrega pickup.
- Repartidor entrega pedido en puerta — entrega delivery.

### Errores frecuentes

- Marcar orden completa sin verificar entrega de todos los ítems.
- Entregar producto de otra mesa u orden.
- Confundir salida de cocina con entrega al cliente.
- No registrar hora de entrega para medir tiempos.

### Implicaciones para el Cognitive Core

Entrega activa razonamiento de cumplimiento de orden, tiempos finales de servicio, errores de routing y satisfacción en punto de contacto final.

---

## Pickup

### Definición

El **pickup** es el canal de servicio donde el **cliente** o tercero autorizado recoge la **orden** en el establecimiento sin consumir en **salón**. También llamado "para llevar" o "takeout."

**Qué no es:** El pickup no es delivery — no hay traslado a domicilio. No es dine-in en salón. No es compra en retail de productos empaquetados de estantería sin preparación.

**Cómo se utiliza:** El cliente ordena en mostrador, app o teléfono. Cocina produce. El cliente recoge en mostrador o ventanilla. Pago puede ser anticipado o al recoger.

### Propósito

Servir demanda sin ocupar mesa ni requerir servicio de mesa completo. El pickup amplía capacidad efectiva del restaurante.

### Relaciones

- El pickup genera **órdenes** sin **mesa**.
- El pickup requiere **empaque** distinto a **presentación** de salón.
- El pickup tiene **tiempo de preparación** y espera de recogida.
- El pickup comparte **cocina** con otros canales.
- El pickup puede participar en **promociones** específicas.

### Restricciones

- Orden pickup lista debe notificarse al cliente.
- Productos no aptos para transporte pueden excluirse de pickup.
- Pickup no recogido genera producto desechado — merma y costo.
- Cola de pickup compite por atención con salón.

### Ejemplos

- Cliente ordena por app y recoge en 20 minutos.
- Mostrador de takeout con fila de órdenes listas.
- Pickup en auto (curbside) sin entrar al local.

### Errores frecuentes

- Mezclar orden pickup con orden de mesa en comanda.
- No considerar tiempo de empaque en promesa al cliente.
- Producto diseñado para salón entregado en pickup sin empaque adecuado.
- No identificar orden al recoger — riesgo de entrega errónea.

### Implicaciones para el Cognitive Core

Pickup activa razonamiento de capacidad sin mesa, tiempos de promesa, empaque, cola de recogida y cannibalización vs. salón.

---

## Delivery

### Definición

El **delivery** es el canal de servicio donde el restaurante o su operador transporta la **orden** al domicilio o ubicación del **cliente** para **entrega** allí. El consumo ocurre fuera del establecimiento.

**Qué no es:** El delivery no es pickup. No es servicio de mesa. No es venta a proveedor. No es el marketplace de terceros en sí — es el canal de entrega a domicilio que puede operarse propio o por plataforma.

**Cómo se utiliza:** El cliente ordena con dirección. Cocina produce y empaqueta. **Repartidor** o servicio externo transporta. Se mide **tiempo de entrega** y calidad en tránsito.

### Propósito

Capturar demanda fuera del local físico. El delivery extiende el mercado del restaurante más allá de la capacidad del salón.

### Relaciones

- El delivery genera **órdenes** con ubicación de destino.
- El delivery depende de **repartidor** o servicio logístico.
- El delivery compite y comparte **cocina** con salón y pickup.
- El delivery tiene **tiempo de entrega** prometido.
- El delivery usa empaque y a veces **precio** diferenciado.

### Restricciones

- Radio de entrega y zonas deben definirse.
- Productos con baja resistencia al transporte tienen restricciones.
- Tiempo prometido debe incluir preparación y tránsito.
- Delivery tardío o frío es falla de canal completa.

### Ejemplos

- Pedido a domicilio con repartidor propio.
- Pedido vía plataforma externa con entrega tercerizada.
- Delivery corporativo a oficina en radio definido.

### Errores frecuentes

- Prometer tiempo de entrega sin considerar carga de cocina.
- No ajustar receta o empaque para resistencia en tránsito.
- Atribuir falla de plataforma externa sin trazabilidad propia.
- Mismo menú sin precios diferenciados pese a comisión o logística extra.

### Implicaciones para el Cognitive Core

Delivery activa razonamiento de logística, radio, tiempos compuestos, calidad en tránsito, pricing por canal y priorización de producción multi-canal.

---

## Tiempo de espera

### Definición

El **tiempo de espera** es la duración que el **cliente** o **visitante** permanece aguardando antes de recibir servicio, producto o atención, medida desde el momento de solicitud o llegada hasta el inicio de la experiencia deseada.

**Qué no es:** El tiempo de espera no es el tiempo de preparación en cocina completo — aunque contribuye. No es el tiempo de entrega en tránsito para delivery. No es el tiempo de ocupación de mesa después de comer.

**Cómo se utiliza:** Se mide para mesa disponible, producto listo en pickup, primer servicio tras sentarse, o respuesta en mostrador. Es driver principal de **satisfacción** y abandono.

### Propósito

Cuantificar la fricción temporal experimentada por el cliente antes del valor entregado.

### Relaciones

- El tiempo de espera afecta **satisfacción** y conversión de **visitante**.
- El tiempo de espera en salón depende de **mesas** y **reservaciones**.
- El tiempo de espera total incluye **tiempo de preparación** y colas.
- El tiempo de espera alto presiona **reclamaciones**.
- El tiempo de espera varía por **horario** y canal.

### Restricciones

- Espera medida debe tener punto de inicio claro (llegada, orden colocada).
- Espera percibida puede exceder espera cronometrada sin comunicación.
- Metas de espera difieren por tipo de restaurante y expectativa de precio.
- Espera en cocina visible al cliente afecta percepción aunque no sea "antes del servicio."

### Ejemplos

- 25 minutos de espera para mesa en viernes noche.
- 8 minutos desde orden hasta primer platillo en mesa.
- Cliente abandona fila de pickup tras 15 minutos.

### Errores frecuentes

- Medir solo preparación ignorando espera previa a cocina.
- No comunicar espera estimada — amplifica percepción negativa.
- Confundir tiempo de espera con tiempo total de experiencia.
- No segmentar espera por canal.

### Implicaciones para el Cognitive Core

Tiempo de espera activa razonamiento de capacidad, staffing, abandono, correlación con hora pico y priorización operativa para reducir fricción.

---

## Tiempo de preparación

### Definición

El **tiempo de preparación** es la duración desde que **cocina** recibe la **comanda** hasta que el **producto** está terminado y listo para **entrega** o empaque. Es el tiempo productivo de la orden en back-of-house.

**Qué no es:** El tiempo de preparación no incluye espera previa a que cocina reciba la orden. No es tiempo de tránsito en delivery. No es tiempo que el cliente espera mesa. No es shelf life del producto.

**Cómo se utiliza:** Se estima por producto según **receta** y carga de **estación**. Se promete al cliente en pickup y delivery. Se compara con estándar para detectar retrasos.

### Propósito

Medir la eficiencia productiva y alimentar promesas de servicio realistas.

### Relaciones

- El tiempo de preparación depende de **receta**, **estación** y carga.
- El tiempo de preparación suma al **tiempo de espera** total del cliente.
- El tiempo de preparación varía por **modificaciones** y volumen rush.
- El tiempo de preparación se define por **producto** en **menú**.
- El tiempo de preparación excedido genera **reclamaciones**.

### Restricciones

- Prep anticipado reduce tiempo de preparación percibido pero tiene límites de frescura.
- Orden compleja con múltiples estaciones toma el máximo paralelo, no la suma simple.
- Tiempo de preparación prometido debe incluir cola si cocina está saturada.
- Productos con tiempos muy distintos en misma orden requieren coordinación.

### Ejemplos

- Hamburguesa: 8 minutos estándar en plancha.
- Orden de 4 platillos en hora pico: 22 minutos reales vs. 12 estándar.
- Bebida preparada en bar: 3 minutos.

### Errores frecuentes

- Usar tiempo teórico de receta ignorando cola de comandas.
- No actualizar promesa cuando cocina está saturada.
- Medir desde orden colocada mezclando espera de transmisión a cocina.
- Ignorar modificaciones que alargan preparación.

### Implicaciones para el Cognitive Core

Tiempo de preparación activa razonamiento de capacidad de cocina, cuellos de botella, promesas dinámicas y atribución de retrasos.

---

## Tiempo de entrega

### Definición

El **tiempo de entrega** es la duración total desde que el **cliente** confirma la **orden** en canal **delivery** hasta que recibe el producto en destino. Incluye preparación, empaque, despacho y tránsito.

**Qué no es:** El tiempo de entrega no es solo tránsito del repartidor. No aplica igual a pickup o salón — es específico del canal a domicilio. No es el horario programado de entrega futura en catering — aunque se relaciona.

**Cómo se utiliza:** Se promete al ordenar ("30-45 min"). Se mide para cumplimiento de SLA. Impacta **satisfacción** y reorden en delivery.

### Propósito

Definir la métrica de cumplimiento del canal delivery de extremo a extremo.

### Relaciones

- El tiempo de entrega incluye **tiempo de preparación**.
- El tiempo de entrega depende de **repartidor** y distancia.
- El tiempo de entrega se compara con promesa al **cliente**.
- El tiempo de entrega compite con carga de **cocina** y otros canales.
- El tiempo de entrega excedido eleva **reclamaciones** en delivery.

### Restricciones

- Zona lejana tiene tiempo de entrega mayor — debe modelarse.
- Condiciones externas (clima, tráfico) afectan componente de tránsito.
- Múltiples paradas del repartidor aumentan tiempo de entrega percibido.
- Entrega antes de tiempo con producto no listo es falla distinta a retraso.

### Ejemplos

- Promesa 35 min, entrega real 41 min — incumplimiento leve.
- Pico de órdenes delivery retrasa todos los tiempos de entrega.
- Entrega en 18 min con cocina vacía y repartidor inmediato.

### Errores frecuentes

- Prometer tiempo de entrega sin mirar cola de cocina.
- Medir solo tránsito ignorando preparación.
- Mismo SLA para todas las zonas geográficas.
- No ajustar promesa dinámicamente en hora pico.

### Implicaciones para el Cognitive Core

Tiempo de entrega activa razonamiento de SLA por zona, priorización multi-canal, asignación de repartidores y predicción de cumplimiento.

---

## PARTE VI — PERSONAL

El personal es la capacidad humana que ejecuta la operación. Esta sección define los términos que describen quién trabaja, en qué función, con qué autoridad y en qué momento.

---

## Empleado

### Definición

Un **empleado** es la persona con relación laboral formal con el restaurante o su **sucursal**, que ejecuta tareas operativas, administrativas o de supervisión a cambio de compensación.

**Qué no es:** El empleado no es el **cliente**. No es el **proveedor** externo. No es el contratista independiente sin relación laboral. No es el **rol** — el rol es la función; el empleado es la persona.

**Cómo se utiliza:** Los empleados se asignan a **turnos** y **roles**. Ejecutan producción, servicio, cobro y gestión. Su desempeño afecta tiempos, calidad y costo laboral.

### Propósito

Nombrar la capacidad humana organizada del restaurante. Sin empleados no hay ejecución sostenida de la operación.

### Relaciones

- Un empleado ocupa uno o más **roles** por **turno**.
- Un empleado trabaja en **sucursal** específica o rota.
- Un empleado genera costo laboral en **costo variable** o fijo según contrato.
- Un empleado opera **estaciones**, **mesas** o funciones de **entrega**.
- Un empleado tiene **permisos** según rol.

### Restricciones

- Empleado presente sin rol asignado es capacidad ociosa.
- Empleado sin permiso no debe ejecutar funciones restringidas (descuentos, cancelaciones).
- Dotación mínima por turno es restricción operativa y legal.
- Ausentismo impacta capacidad de **cocina** y **salón**.

### Ejemplos

- Plantilla de 24 empleados en sucursal centro.
- Empleado de medio tiempo solo en fin de semana.
- Gerente con contrato fijo y horario extendido.

### Errores frecuentes

- Contar presentes sin considerar roles cubiertos.
- Asignar tareas sin verificar permiso.
- No vincular desempeño operativo a turno específico.
- Confundir empleado con usuario de sistema sin relación laboral.

### Implicaciones para el Cognitive Core

Empleado activa razonamiento de staffing, costo laboral, cobertura de roles, ausentismo y atribución de desempeño por persona y turno.

---

## Cocinero

### Definición

Un **cocinero** es el **empleado** cuyo **rol** principal es ejecutar **preparación** y **producción** en **cocina** o **estación**, siguiendo **recetas** y **comandas**.

**Qué no es:** El cocinero no es el mesero. No es el gerente salvo que asuma función operativa. No es el repartidor. No es el proveedor de ingredientes.

**Cómo se utiliza:** El cocinero recibe comandas, produce productos, coordina con estaciones, comunica tiempos a expo. Su habilidad y carga determinan **tiempo de preparación** y calidad.

### Propósito

Identificar la función productiva central del back-of-house.

### Relaciones

- El cocinero opera **estación** en **cocina**.
- El cocinero ejecuta **recetas** y **modificaciones** de **comanda**.
- El cocinero consume **ingredientes** del **inventario**.
- El cocinero contribuye a **merma** por error o sobreporcionamiento.
- El cocinero trabaja en **turno** con otros cocineros.

### Restricciones

- Cocinero sin mise en place no puede cumplir tiempos estándar.
- Especialización por estación limita flexibilidad.
- Certificaciones de manipulación de alimentos son requisito operativo.
- Sobrecarga de comandas por cocinero degrada calidad.

### Ejemplos

- Cocinero de plancha en turno de comida.
- Prep cook que solo ejecuta mise en place.
- Chef que supervisa y produce en estación crítica.

### Errores frecuentes

- Medir productividad solo por platos sin calidad o merma.
- Asignar estación sin habilidad correspondiente.
- No transmitir modificaciones al cocinero correcto.
- Confundir título "chef" con rol operativo específico sin definir.

### Implicaciones para el Cognitive Core

Cocinero activa razonamiento de capacidad productiva, asignación de estación, errores de preparación y correlación carga-calidad.

---

## Cajero

### Definición

Un **cajero** es el **empleado** cuyo **rol** principal es registrar, cobrar y cerrar transacciones económicas: generar y procesar **tickets**, aplicar **promociones** autorizadas y entregar comprobantes.

**Qué no es:** El cajero no es el cocinero. No es el mesero completo — aunque en operaciones pequeñas unifique funciones. No es el gerente salvo permiso explícito. No es el cliente.

**Cómo se utiliza:** El cajero recibe solicitud de cobro, verifica orden, procesa pago, registra **ventas** e **ingresos**. Puede operar mostrador de **pickup**.

### Propósito

Asegurar que el aspecto económico de la operación se registre correctamente y con autorización adecuada.

### Relaciones

- El cajero procesa **ticket** de **orden**.
- El cajero aplica **promociones** y descuentos con **permiso**.
- El cajero registra **ingresos** y **ventas**.
- El cajero interactúa con **comprador**.
- El cajero puede identificar **cliente** en **fidelización**.

### Restricciones

- Descuentos fuera de permiso son violación operativa.
- Descuadre de caja requiere investigación.
- Cobro debe coincidir con productos entregados.
- Cajero no debe modificar comanda de cocina sin flujo definido.

### Ejemplos

- Cajero en mostrador cobra orden para llevar.
- Cajero aplica descuento de empleado autorizado.
- Cajero cierra turno con arqueo de caja.

### Errores frecuentes

- Ticket no coincide con orden entregada.
- Promoción aplicada incorrectamente.
- No identificar cliente en programa de lealtad al cobrar.
- Confundir propina con ingreso del restaurante en registro.

### Implicaciones para el Cognitive Core

Cajero activa razonamiento de integridad de ingresos, aplicación correcta de promociones, conciliación orden-cobro y detección de discrepancias.

---

## Gerente

### Definición

Un **gerente** es el **empleado** con **rol** de supervisión y decisión operativa o administrativa: autoriza excepciones, resuelve **reclamaciones**, ajusta **disponibilidad**, gestiona **personal** y protege **utilidad** del periodo.

**Qué no es:** El gerente no es el dueño necesariamente — aunque puede coincidir. No es cualquier empleado senior sin **permisos** formales. No es el cliente. No es consultor externo sin autoridad interna.

**Cómo se utiliza:** El gerente desbloquea situaciones fuera de política estándar, valida descuentos, decide 86 de producto, coordina turnos, analiza **KPIs** y comunica con **sucursal** o **marca**.

### Propósito

Concentrar autoridad de decisión que no puede descentralizarse sin riesgo.

### Relaciones

- El gerente supervisa **empleados** y **turnos**.
- El gerente resuelve **reclamaciones** y autoriza compensaciones.
- El gerente modifica **disponibilidad** y excepciones de **menú**.
- El gerente analiza **ventas**, **merma** y **margen**.
- El gerente reporta a **sucursal** o dirección de **marca**.

### Restricciones

- Permisos del gerente tienen límites según política de **franquicia** o corporativo.
- Decisiones del gerente deben dejar trazabilidad en casos económicos.
- Gerente ausente en rush transfiere autoridad o paraliza excepciones.
- Gerente operativo no debe confundirse con gerente solo administrativo.

### Ejemplos

- Gerente aprueba rehacer platillo tras reclamación.
- Gerente retira producto del menú por inventario agotado.
- Gerente ajusta dotación por ausentismo de cocineros.

### Errores frecuentes

- Resolver reclamación sin registro — pierde aprendizaje sistémico.
- Microgestionar sin delegar a roles operativos.
- No escalar patrón recurrente a nivel **marca**.
- Confundir gerente de turno con gerente de sucursal en permisos.

### Implicaciones para el Cognitive Core

Gerente activa razonamiento de excepciones, escalamiento, autorización, patrones que requieren intervención humana y accountability operativa.

---

## Mesero

### Definición

Un **mesero** es el **empleado** cuyo **rol** principal es atender **clientes** en **salón**: tomar **órdenes**, transmitir **comandas**, realizar **entrega** en **mesa**, anticipar necesidades y facilitar cierre de **ticket**.

**Qué no es:** El mesero no es el cocinero. No es el cajero dedicado en operaciones que separan funciones — aunque puede cobrar. No es el repartidor. No es el host necesariamente — aunque puede combinar recepción.

**Cómo se utiliza:** El mesero gestiona sección de mesas, registra modificaciones, comunica tiempos, propone **adicionales** y representa la experiencia de servicio presencial.

### Propósito

Ser el agente principal de la experiencia de servicio en salón y el puente entre cliente y cocina.

### Relaciones

- El mesero atiende **mesas** en **salón**.
- El mesero captura **órdenes** y **modificaciones**.
- El mesero coordina **entrega** de productos.
- El mesero influye en **satisfacción** y ticket mediante sugerencias.
- El mesero colabora con **cocina** vía **comanda**.

### Restricciones

- Mesero sobrecargado de mesas degrada tiempos y satisfacción.
- Error en toma de orden es fuente principal de fallas en cocina.
- Mesero debe conocer **disponibilidad** actual del menú.
- Propinas y trato al cliente son sensibles a carga de trabajo.

### Ejemplos

- Mesero con sección de 6 mesas en turno de cena.
- Mesero registra "sin gluten" como modificación crítica.
- Mesero sugiere postre — upselling de **producto**.

### Errores frecuentes

- Orden mal capturada sin confirmación con cliente.
- No comunicar 86 de producto antes de que cliente ordene.
- Asignación desigual de mesas entre meseros.
- Confundir mesero con runner que solo entrega sin tomar orden.

### Implicaciones para el Cognitive Core

Mesero activa razonamiento de carga de servicio, calidad de captura de orden, upselling, satisfacción en salón y errores de transmisión a cocina.

---

## Repartidor

### Definición

Un **repartidor** es el **empleado** (o colaborador asignado) cuyo **rol** principal es transportar **órdenes** de **delivery** desde el restaurante hasta el destino del **cliente** y completar la **entrega**.

**Qué no es:** El repartidor no es el cocinero. No es el mesero. No es el proveedor de insumos. No es la plataforma de delivery en abstracto — es quien ejecuta el tramo final.

**Cómo se utiliza:** El repartidor recibe pedido empaquetado, navega a dirección, entrega al cliente, puede cobrar o confirmar pago según modelo. Su eficiencia define componente de tránsito del **tiempo de entrega**.

### Propósito

Ejecutar la logística de última milla del canal delivery.

### Relaciones

- El repartidor completa **entrega** de **orden** delivery.
- El repartidor afecta **tiempo de entrega** y **satisfacción**.
- El repartidor coordina con cocina momento de despacho.
- El repartidor puede ser **empleado** propio o tercero.
- El repartidor transporta producto con requisitos de temperatura y empaque.

### Restricciones

- Múltiples pedidos por viaje requieren secuencia que no degrade calidad.
- Repartidor sin pedido listo genera espera ociosa o producto frío en cola.
- Zona de cobertura limita asignación.
- Seguridad del repartidor y del producto son restricciones operativas.

### Ejemplos

- Repartidor propio con 3 pedidos en ruta optimizada.
- Repartidor espera en cocina porque orden no está lista.
- Entrega fallida por dirección incorrecta del cliente.

### Errores frecuentes

- Despachar pedido antes de estar completo por presión de repartidor.
- No considerar tránsito en promesa de **tiempo de entrega**.
- Entregar pedido equivocado por falta de identificación.
- Medir desempeño solo por viajes sin calidad de entrega.

### Implicaciones para el Cognitive Core

Repartidor activa razonamiento de rutas, despacho coordinado, SLA de tránsito, fallas de entrega y capacidad del canal delivery.

---

## Turno

### Definición

Un **turno** es el bloque de **tiempo** laboral en que un **empleado** está programado y disponible para desempeñar sus **roles** en la **sucursal**. Es la unidad de planificación de personal.

**Qué no es:** El turno no es el horario de apertura del restaurante completo — puede ser subconjunto. No es la orden de producción. No es el servicio de un cliente. No es el rol en sí.

**Cómo se utiliza:** Se asignan empleados a turnos (matutino, vespertino, cierre). La dotación del turno determina capacidad de **cocina** y **salón** en esa franja.

### Propósito

Estructurar la disponibilidad humana en el tiempo para coincidir con demanda esperada.

### Relaciones

- Un turno contiene **empleados** con **roles** definidos.
- Un turno cubre **horario** operativo específico.
- Un turno limita capacidad de **producción** y servicio.
- Un turno genera costo laboral del periodo.
- Un turno se correlaciona con **ventas** y **KPIs** de esa franja.

### Restricciones

- Turno subdotado en hora pico genera **tiempo de espera** excesivo.
- Turno sobredotado erosiona **utilidad** sin retorno.
- Cambios de turno requieren permisos y actualización de cobertura.
- Turno de apertura requiere prep antes de recibir clientes.

### Ejemplos

- Turno de cocina 11:00–17:00 con 4 cocineros.
- Turno de cierre con gerente, 2 meseros y 1 cajero.
- Turno extendido en día festivo por demanda proyectada.

### Errores frecuentes

- Programar turno sin alinear a **horario** de mayor demanda.
- No registrar ausencias — turno planificado vs. real divergen.
- Mismo staffing para día lunes y sábado sin ajuste.
- Confundir turno individual con turno de operación completa del local.

### Implicaciones para el Cognitive Core

Turno activa razonamiento de staffing óptimo, costo laboral por franja, capacidad efectiva y correlación demanda-personal.

---

## Rol

### Definición

Un **rol** es el conjunto definido de funciones, responsabilidades y **permisos** asignados a un **empleado** en un contexto operativo: cocinero, mesero, cajero, gerente, repartidor, host.

**Qué no es:** El rol no es la persona — un empleado puede cambiar de rol. No es el turno — el rol define qué hace, el turno cuándo. No es el puesto de trabajo legal necesariamente.

**Cómo se utiliza:** Al iniciar turno, el empleado asume rol. El rol determina qué acciones puede ejecutar en el sistema operativo del restaurante y qué métricas le aplican.

### Propósito

Delimitar responsabilidad y autoridad operativa. Los roles evitan ambigüedad sobre quién produce, quién cobra y quién decide.

### Relaciones

- Un **empleado** desempeña uno o más roles por **turno**.
- Un rol tiene **permisos** asociados.
- Un rol opera recursos: **estación**, **mesa**, ruta de **delivery**.
- Un rol contribuye a **KPIs** específicos (tiempo de preparación, ticket, entregas).
- Un rol se define por la **sucursal** o política de **marca**.

### Restricciones

- Rol sin permiso no ejecuta acciones restringidas aunque sea implícito en práctica.
- Multi-rol en turno corto requiere priorización clara.
- Rol mal asignado (cocinero como cajero sin capacitación) genera errores.
- Roles deben cubrir todas las funciones críticas del turno.

### Ejemplos

- Empleado con rol "mesero" en turno noche.
- Gerente con roles supervisión + autorización de descuentos.
- Empleado polivalente: cajero y pickup en turno bajo volumen.

### Errores frecuentes

- Permisos ampliados informalmente sin actualizar rol.
- Rol definido en documento pero no en operación real.
- No distinguir rol de expo vs. cocinero de estación en métricas.
- Asumir que mismo título implica mismos permisos en todas las sucursales.

### Implicaciones para el Cognitive Core

Rol activa razonamiento de autorización, responsabilidad por acción, cobertura funcional y desempeño por tipo de trabajo.

---

## Permiso

### Definición

Un **permiso** es la autorización explícita para que un **empleado** en un **rol** ejecute acciones que exceden la operación estándar: aplicar descuentos, cancelar órdenes, modificar **precios**, autorizar **merma** excepcional o acceder a reportes financieros.

**Qué no es:** El permiso no es el rol completo — es capacidad específica dentro o fuera del rol. No es una orden del cliente. No es una política escrita sin enforcement operativo.

**Cómo se utiliza:** El sistema o protocolo verifica permiso antes de acción sensible. Permisos se asignan por rol y nivel jerárquico.

### Propósito

Controlar riesgo operativo y económico mediante autorización granular.

### Relaciones

- Un permiso se asigna a **rol** o **empleado** específico.
- Un permiso habilita acciones sobre **ticket**, **orden**, **inventario**, **menú**.
- Un permiso sin **gerente** puede bloquear resolución de **reclamación**.
- Un permiso mal usado afecta **margen** e **ingresos**.
- Un permiso puede variar por **sucursal** y **franquicia**.

### Restricciones

- Acción sin permiso debe rechazarse o escalar.
- Permisos temporales deben expirar.
- Auditoría de acciones con permiso elevado es obligatoria.
- Permiso no implica obligación de ejecutar — es capacidad, no mandato.

### Ejemplos

- Permiso "descuento hasta 10%" para cajero.
- Permiso "86 producto" para gerente de turno.
- Permiso "ver reporte de ventas" para administrador de sucursal.

### Errores frecuentes

- Descuento aplicado sin permiso ni registro.
- Permisos heredados de empleado anterior no revocados.
- Mismos permisos en franquicia que violan manual de **marca**.
- Confundir contraseña de sistema con permiso de negocio definido.

### Implicaciones para el Cognitive Core

Permiso activa razonamiento de autorización, auditoría, prevención de fraude, escalamiento y políticas diferenciadas por rol y sucursal.

---

## PARTE VII — NEGOCIO

El negocio es la dimensión económica y organizacional que sostiene la operación del restaurante. Esta sección define el lenguaje de estructura, finanzas y medición de desempeño.

---

## Sucursal

### Definición

Una **sucursal** es la unidad operativa concreta de la **marca** o negocio: un local con **salón**, **cocina**, **personal**, **menú** activo e **inventario** propios, ubicado en un sitio específico.

**Qué no es:** La sucursal no es la marca completa. No es el almacén central de distribución necesariamente. No es el proveedor. No es una **orden** — es donde las órdenes ocurren.

**Cómo se utiliza:** Cada sucursal opera con **horarios**, dotación y desempeño propios. Reporta **ventas**, **KPIs** y **utilidad**. Puede compartir menú con otras sucursales o tener variaciones locales.

### Propósito

Ser la unidad de operación y análisis primaria del negocio restaurantero multi-local.

### Relaciones

- Una sucursal pertenece a **marca** o negocio.
- Una sucursal emplea **personal** y atiende **clientes**.
- Una sucursal tiene **inventario**, **proveedores** y **ventas** propios.
- Una sucursal puede ser **franquicia** u operada directamente.
- Una sucursal compara desempeño con otras sucursales.

### Restricciones

- Datos de sucursal no deben mezclarse sin etiqueta — pierde trazabilidad.
- Políticas de **marca** pueden imponer restricciones a sucursal.
- Cierre temporal de sucursal no es cierre de marca completa.
- Sucursal nueva no tiene **historial** comparable hasta periodo estable.

### Ejemplos

- Sucursal "Centro" con 80 cubiertos y delivery propio.
- Sucursal en centro comercial con menú reducido.
- Sucursal cerrada por remodelación — sin operación.

### Errores frecuentes

- Agregar ventas de todas las sucursales sin desglose para decisiones locales.
- Aplicar benchmark de una sucursal a otra con contexto distinto.
- No unificar identidad de **cliente** entre sucursales de misma marca.
- Confundir sucursal con zona de delivery dentro de misma cocina ghost.

### Implicaciones para el Cognitive Core

Sucursal activa razonamiento de contexto local, comparación entre unidades, políticas diferenciadas y atribución de desempeño geográfico.

---

## Marca

### Definición

La **marca** es la identidad comercial, reputación y promesa consistente que agrupa uno o más restaurantes bajo nombre, estándares y experiencia reconocibles por el **cliente**.

**Qué no es:** La marca no es una sucursal individual. No es el menú en sí — aunque lo expresa. No es el logo solamente — es el conjunto de expectativas. No es el **proveedor**.

**Cómo se utiliza:** La marca define estándares de calidad, diseño de menú base, políticas de **fidelización** y comunicación. El cliente elige la marca antes que la sucursal específica en muchos casos.

### Propósito

Unificar identidad y expectativa más allá de un solo local. La marca es el activo relacional con el mercado.

### Relaciones

- Una marca opera múltiples **sucursales** o **franquicias**.
- Una marca define **menú** base y estándares operativos.
- Una marca acumula reputación de **satisfacción** y **reclamaciones**.
- Una marca negocia con **proveedores** a nivel corporativo.
- Una marca mide **KPIs** consolidados y por unidad.

### Restricciones

- Inconsistencia entre sucursales daña marca más que falla local aislada.
- Cambios de marca afectan todas las sucursales vinculadas.
- Marca fuerte no compensa operación crónica deficiente en sucursal.
- Submarcas requieren vocabulario explícito para no mezclar identidades.

### Ejemplos

- Cadena "Tony Burgers" con 12 sucursales y menú unificado.
- Marca premium vs. marca económica del mismo grupo.
- Rebranding que actualiza identidad sin cerrar operaciones.

### Errores frecuentes

- Evaluar marca solo por una sucursal atípica.
- Romper estándar de marca localmente sin documentar excepción.
- No separar KPIs de marcas distintas en mismo grupo.
- Confundir marca con franquicia — pueden ser conceptos relacionados pero distintos.

### Implicaciones para el Cognitive Core

Marca activa razonamiento de consistencia, reputación agregada, políticas corporativas y decisión que trasciende sucursal individual.

---

## Franquicia

### Definición

Una **franquicia** es el modelo en que un operador independiente ejecuta una **sucursal** bajo **marca** ajena, siguiendo manual operativo y estándares definidos por el franquiciante a cambio de regalías y cumplimiento.

**Qué no es:** La franquicia no es sucursal corporativa propia. No es licencia de producto sin operación restaurante. No es el **proveedor**. No es la **marca** en su totalidad — es forma de operar la marca.

**Cómo se utiliza:** El franquiciado opera día a día; el franquiciante define menú base, proveedores obligatorios, marketing y auditoría. Decisiones locales tienen límites contractuales.

### Propósito

Distinguir operación bajo licencia de operación directa, con implicaciones en permisos, costos y control.

### Relaciones

- Una franquicia opera una **sucursal** de **marca** licenciada.
- Una franquicia sigue estándares de **menú**, **proveedor** y **KPI**.
- Una franquicia genera **ventas** e **ingresos** con estructura de regalías.
- Una franquicia tiene **gerente** local con límites de **permiso**.
- Una franquicia reporta desempeño al franquiciante.

### Restricciones

- Desviación de estándar de marca puede violar contrato de franquicia.
- Promociones locales pueden requerir aprobación del franquiciante.
- Proveedores obligatorios limitan flexibilidad de **abastecimiento** y **costo**.
- Datos operativos pueden compartirse contractualmente con franquiciante.

### Ejemplos

- Franquicia de hamburguesas con menú 80% fijo y 20% local.
- Auditoría de marca detecta desviación en porcionamiento.
- Franquiciado con 3 sucursales de la misma marca.

### Errores frecuentes

- Tratar franquicia como sucursal propia en políticas de precio.
- No registrar regalías en análisis de **utilidad** del franquiciado.
- Imponer promoción corporativa sin considerar contexto local.
- Confundir franquiciante con **proveedor**.

### Implicaciones para el Cognitive Core

Franquicia activa razonamiento de cumplimiento de estándar, límites de decisión local, reporting contractual y comparación franquicia vs. corporativo.

---

## Proveedor

### Definición

Un **proveedor** es la entidad externa que suministra **ingredientes**, bebidas embotelladas, empaques o servicios necesarios para la operación, mediante relación comercial recurrente de **abastecimiento**.

**Qué no es:** El proveedor no es el **cliente**. No es el **empleado**. No es la plataforma de delivery. No es una compra única sin relación — eso es transacción puntual, no proveedor establecido.

**Cómo se utiliza:** El restaurante negocia precios, plazos y calidad. Los pedidos de **abastecimiento** van al proveedor. El desempeño del proveedor afecta **costo**, **inventario** y **disponibilidad**.

### Propósito

Nombrar el vínculo de entrada de insumos al sistema restaurante. El proveedor es dependencia crítica de continuidad.

### Relaciones

- Un proveedor suministra **ingredientes** y materiales.
- Un proveedor alimenta **abastecimiento** e **inventario**.
- Un proveedor determina **costo** variable de productos.
- Un proveedor puede ser exclusivo por **marca** o **franquicia**.
- Un proveedor fallido bloquea **productos** del **menú**.

### Restricciones

- Dependencia de proveedor único es riesgo operativo.
- Calidad inconsistente del proveedor genera **merma** y **reclamaciones**.
- Cambio de proveedor requiere actualizar **recetas**, costos y posible sabor.
- Plazos de entrega del proveedor definen lead time de reorden.

### Ejemplos

- Distribuidor semanal de proteínas y lácteos.
- Proveedor exclusivo de tortillas para cadena.
- Proveedor de emergencia cuando principal falla.

### Errores frecuentes

- No actualizar costo al cambiar precio del proveedor.
- Seleccionar proveedor solo por precio ignorando confiabilidad.
- Confundir proveedor logístico de delivery con proveedor de alimentos.
- No evaluar impacto de proveedor en **disponibilidad** histórica.

### Implicaciones para el Cognitive Core

Proveedor activa razonamiento de riesgo de suministro, variación de costo, lead time, calidad de insumo y continuidad de menú.

---

## Costo fijo

### Definición

El **costo fijo** es el gasto que el restaurante incurre independientemente del volumen de **ventas** en un periodo: renta, salarios base contractuales, seguros, depreciación de equipo, licencias.

**Qué no es:** El costo fijo no es el **costo** variable de ingredientes por producto. No es **merma** puntual. No es compra de insumo que escala con producción. No es propina del personal.

**Cómo se utiliza:** Se presupuesta mensualmente. Se cubre con **margen** contribuido por ventas. Determina punto de equilibrio mínimo de operación.

### Propósito

Separar compromisos económicos constantes de costos que escalan con actividad. Esencial para entender **utilidad** real.

### Relaciones

- El costo fijo contrasta con **costo variable**.
- El costo fijo se cubre con **ingresos** y **margen** agregado.
- El costo fijo pertenece a **sucursal** o negocio.
- El costo fijo afecta decisión de apertura, **horario** y tamaño de operación.
- El costo fijo impacta **utilidad** aunque **ventas** sean cero (local cerrado con renta).

### Restricciones

- Clasificar costo como fijo vs. variable requiere criterio consistente.
- Costo "fijo" puede cambiar por renegociación (renta, contrato).
- Sucursal pequeña con alto fijo es más vulnerable a baja demanda.
- No todo salario es fijo — parte variable por horas extras es **costo variable**.

### Ejemplos

- Renta mensual del local: $85,000.
- Licencia de software administrativo anual prorrateada.
- Salario base de gerente de sucursal.

### Errores frecuentes

- Calcular rentabilidad de producto incluyendo prorrateo incorrecto de fijo.
- Ignorar costo fijo al evaluar cerrar un **horario** de baja venta.
- Tratar marketing estacional como fijo cuando es discrecional.
- No separar fijo por sucursal en análisis consolidado de **marca**.

### Implicaciones para el Cognitive Core

Costo fijo activa razonamiento de punto de equilibrio, viabilidad de sucursal, decisión de horarios y presión sobre margen mínimo requerido.

---

## Costo variable

### Definición

El **costo variable** es el gasto que escala con el volumen de **producción** y **ventas**: **ingredientes** consumidos, empaques de **delivery**, comisiones por pedido, horas extras ligadas a rush, **merma** operativa.

**Qué no es:** El costo variable no es la renta. No es el salario fijo base. No es inversión en equipo — eso es capital, no costo variable operativo del periodo en sentido estricto.

**Cómo se utiliza:** Se calcula por producto (**costo** de receta) y se agrega por periodo. Afecta **margen** unitario directamente. Crece con cada **orden** adicional.

### Propósito

Conectar actividad operativa con erosión económica proporcional. Sin costo variable trazado, el margen por producto es ilusorio.

### Relaciones

- El costo variable incluye **ingredientes** de **receta**.
- El costo variable aumenta con **merma** y **extras** no cobrados.
- El costo variable escala con **ventas** y canal (**delivery** con empaque).
- El costo variable contrasta con **costo fijo** en **utilidad**.
- El costo variable depende de **proveedor** y precio de insumos.

### Restricciones

- Costo variable teórico (receta) vs. real (consumo + merma) deben distinguirse.
- Promoción que reduce precio sin reducir costo variable comprime margen.
- Canal con mayor costo variable (delivery) requiere **precio** o volumen compensatorio.
- No escala linealmente si hay desperdicio fijo por lote — modelar con cuidado.

### Ejemplos

- Costo variable de platillo vendido: $42 en ingredientes.
- Comisión 25% sobre pedido delivery — costo variable del canal.
- Empaque y cubiertos por orden pickup.

### Errores frecuentes

- Ignorar merma en costo variable real.
- No incluir comisiones de canal en margen por **orden** delivery.
- Usar costo de ingrediente desactualizado.
- Confundir costo variable con costo total del producto incluyendo prorrateo de fijo.

### Implicaciones para el Cognitive Core

Costo variable activa razonamiento de margen contribuido, sensibilidad a volumen, impacto de promociones y comparación de rentabilidad por canal.

---

## Utilidad

### Definición

La **utilidad** es el resultado económico positivo o negativo de un periodo: **ingresos** menos **costos** fijos y variables y gastos operativos. Es lo que queda al negocio después de pagar la operación.

**Qué no es:** La utilidad no es **venta** bruta. No es **margen** de un producto — es resultado agregado del negocio. No es flujo de caja necesariamente. No es propina del personal.

**Cómo se utiliza:** Se calcula por periodo (día, semana, mes) y por **sucursal**. Informa viabilidad, bonos de **gerente** e inversiones. Utilidad negativa es pérdida.

### Propósito

Medir si la operación genera valor económico sostenible más allá de la actividad comercial.

### Relaciones

- La utilidad deriva de **ingresos** menos costos totales.
- La utilidad depende de **ventas**, **margen**, **costo fijo** y **costo variable**.
- La utilidad varía por **sucursal**, canal y **horario**.
- La utilidad se erosiona por **merma**, descuentos y **reclamaciones** costosas.
- La utilidad es objetivo superior que **KPIs** operativos aislados.

### Restricciones

- Utilidad de corto plazo puede sacrificarse por inversión — interpretar con horizonte.
- Utilidad sin desglose por sucursal oculta unidades deficitarias.
- Mejorar **satisfacción** sin margen puede elevar utilidad por retención — no es automático.
- Utilidad contable vs. operativa puede diferir — definir cuál usa el razonamiento.

### Ejemplos

- Sucursal con utilidad mensual de $120,000 tras todos los costos.
- Día festivo: ventas altas pero utilidad baja por staffing extra y promoción agresiva.
- Utilidad negativa en sucursal nueva en meses de ramp-up.

### Errores frecuentes

- Confundir ventas record con utilidad alta.
- Ignorar costo fijo al celebrar margen unitario fuerte en bajo volumen.
- No atribuir utilidad por canal (delivery puede vender mucho y aportar poco).
- Optimizar **KPI** operativo que no correlaciona con utilidad.

### Implicaciones para el Cognitive Core

Utilidad activa razonamiento de sostenibilidad económica, trade-offs operativos, cierre de sucursales deficitarias y priorización de acciones con impacto en resultado final.

---

## Ingresos

### Definición

Los **ingresos** son el dinero que entra al negocio por actividad comercial del restaurante en un periodo: pagos de **clientes** por **órdenes**, antes de deducir costos. Es la medida del flujo de entrada económica por ventas.

**Qué no es:** Los ingresos no son **utilidad**. No incluyen propinas destinadas al personal salvo que el modelo las retenga el negocio. No son préstamos ni inversión de socios. No son ventas pendientes de cobro si no se reconocen según política.

**Cómo se utiliza:** Se registran al cobrar **ticket**. Se agregan por día, sucursal, canal. Se comparan contra presupuesto y periodos anteriores.

### Propósito

Cuantificar la entrada económica generada por la operación comercial.

### Relaciones

- Los ingresos provienen de **ventas** cobradas.
- Los ingresos se componen de **precios** de **productos**, menos descuentos.
- Los ingresos alimentan cobertura de **costo fijo** y generación de **utilidad**.
- Los ingresos se segmentan por **sucursal**, canal y **categoría**.
- Los ingresos se correlacionan con **popularidad** y tráfico de **clientes**.

### Restricciones

- Ingreso reconocido debe alinearse con política de cobro (anticipado vs. entregado).
- Devoluciones y cancelaciones reducen ingresos del periodo.
- Ingresos sin desglose de descuento ocultan efecto de **promociones**.
- Comparar ingresos requiere ajuste por días equivalentes o estacionalidad.

### Ejemplos

- Ingresos del martes: $28,400 en sucursal norte.
- Ingresos de delivery representan 35% del total semanal.
- Reembolso reduce ingresos del día en que se procesa.

### Errores frecuentes

- Confundir ingresos con ventas brutas sin descontar devoluciones.
- Incluir propinas del mesero en ingresos del restaurante.
- No separar ingresos por canal para análisis de rentabilidad.
- Comparar ingresos de sucursales de tamaños distintos sin normalizar.

### Implicaciones para el Cognitive Core

Ingreso activa razonamiento de desempeño comercial, tendencias, estacionalidad, efecto de promociones y capacidad de cubrir costos.

---

## Ventas

### Definición

Las **ventas** son las transacciones comerciales completadas en las que productos del **menú** se entregan o comprometen a **clientes** a cambio de pago. Es la actividad comercial medida en unidades, tickets u órdenes.

**Qué no es:** Las ventas no son ingresos cobrados necesariamente — pueden medirse como órdenes completadas. No son visitas sin compra. No son producción sin entrega comercial. No son metas abstractas — son hechos comerciales.

**Cómo se utiliza:** Se cuentan en unidades por **producto**, número de **órdenes**, o monto. Alimentan análisis de **popularidad**, forecast y desempeño de **personal**.

### Propósito

Medir la actividad comercial del restaurante en sus dimensiones de volumen y valor.

### Relaciones

- Las ventas generan **ingresos** al cobrarse.
- Las ventas consumen **inventario** vía **producción**.
- Las ventas se analizan por **producto**, **categoría**, canal y **sucursal**.
- Las ventas reflejan **popularidad** y efectividad de **promociones**.
- Las ventas son insumo de múltiples **KPIs**.

### Restricciones

- Venta registrada debe definir si es al ordenar, entregar o cobrar.
- Venta cancelada antes de producción puede no contarse según política.
- Ventas a costo cero (cortesía) son ventas con ingreso cero — clasificar explícitamente.
- Comparar ventas requiere mismo periodo y alcance de sucursales.

### Ejemplos

- 142 órdenes completadas el viernes.
- 89 unidades de taco al pastor vendidas.
- Ventas de categoría bebidas: 22% del total del día.

### Errores frecuentes

- Contar orden cancelada como venta.
- Mezclar unidades vendidas con monto sin etiqueta clara.
- No desglosar ventas por canal en operación multicanal.
- Atribuir venta a producto equivocado por error de registro.

### Implicaciones para el Cognitive Core

Venta activa razonamiento de volumen, mix de productos, efectividad comercial, correlación con operación y base para predicción de demanda.

---

## KPI

### Definición

Un **KPI** (indicador clave de desempeño) es la métrica seleccionada para evaluar si una dimensión crítica del negocio o la operación alcanza el nivel esperado: ticket promedio, tiempo de **preparación**, **merma** %, NPS, órdenes por hora, **margen** food cost.

**Qué no es:** Un KPI no es cualquier dato — es métrica prioritaria con meta. No es objetivo estratégico vago ("ser los mejores"). No es **venta** cruda sin contexto. No es informe completo — es señal concentrada.

**Cómo se utiliza:** Se define meta por **sucursal** y periodo. Se monitorea en turno, día, semana. Desviación activa investigación o acción del **gerente**.

### Propósito

Convertir operación compleja en señales accionables. Los KPIs alinean **personal** y decisiones con resultados medibles.

### Relaciones

- Un KPI puede medir **ventas**, **satisfacción**, **tiempo de espera**, **merma**, **utilidad**.
- Un KPI se descompone por **sucursal**, canal, **turno** y **categoría**.
- Un KPI conecta operación con **marca** y estándares de **franquicia**.
- Un KPI mal elegido optimiza métrica que no eleva **utilidad**.
- Un KPI se revisa contra **historial** y benchmark.

### Restricciones

- Demasiados KPIs diluyen foco — priorizar pocos críticos.
- KPI sin meta es solo dato, no indicador.
- KPI debe ser medible con datos confiables — basura entra, basura sale.
- KPI de una sucursal no siempre aplica a otra sin ajuste de meta.

### Ejemplos

- KPI: tiempo promedio de **entrega** delivery < 35 min.
- KPI: food cost < 32% de **ventas**.
- KPI: **reclamaciones** < 2% de órdenes.

### Errores frecuentes

- Optimizar KPI local que daña otro (velocidad vs. **satisfacción**).
- KPI sin vínculo con **utilidad** — actividad vanidosa.
- Cambiar definición de KPI sin actualizar histórico.
- Castigar sucursal por KPI fuera de su control (tráfico del centro comercial).

### Implicaciones para el Cognitive Core

KPI activa razonamiento de desviación, priorización de alertas, correlación entre métricas, accountability por **rol** y evaluación de intervenciones.

---

## APÉNDICE A — MAPA DE VOCABULARIO POR DOMINIO

| Dominio | Términos |
| :--- | :--- |
| **Productos** | producto, platillo, bebida, combo, promoción, adicional, extra, complemento, ingrediente, receta, variante, presentación, tamaño, modificación |
| **Menú** | menú, categoría, subcategoría, disponibilidad, horario, precio, costo, margen, popularidad |
| **Operación** | orden, ticket, comanda, preparación, estación, cocina, producción, inventario, merma, abastecimiento |
| **Cliente** | cliente, visitante, comprador, consumidor, frecuencia, preferencia, historial, satisfacción, reclamación, fidelización |
| **Servicio** | salón, mesa, reservación, entrega, pickup, delivery, tiempo de espera, tiempo de preparación, tiempo de entrega |
| **Personal** | empleado, cocinero, cajero, gerente, mesero, repartidor, turno, rol, permiso |
| **Negocio** | sucursal, marca, franquicia, proveedor, costo fijo, costo variable, utilidad, ingresos, ventas, KPI |

**Total: 71 términos operacionales definidos.**

---

## APÉNDICE B — CORRESPONDENCIA VOCABULARIO ↔ ONTOLOGÍA (RKS-001)

| Término RKS-002 | Concepto(s) ontológico(s) RKS-001 |
| :--- | :--- |
| producto, platillo, bebida, combo | Menu Item (Artifact) |
| promoción | Promotion (Agreement) |
| ingrediente | Ingredient (Object) |
| receta | Recipe (Artifact) |
| menú | Menu (Artifact) |
| orden | Order (Agreement) |
| ticket, ventas, ingresos | Transaction, Revenue (Event / Abstraction) |
| comanda | Derivado operativo de Order → Kitchen |
| cocina, estación, salón, mesa | Kitchen, Station, Dining Area, Table (Space) |
| cliente | Customer (Agent) |
| empleado, cocinero, mesero, etc. | Employee (Agent) |
| proveedor | Supplier (Agent) |
| inventario | Inventory (Abstraction) |
| merma | Waste (Abstraction) |
| reservación | Reservation (Agreement) |
| delivery, pickup, entrega | Delivery, Takeout, Service (Event) |
| sucursal, marca | Restaurant, Business (Space / Abstraction) |
| costo, margen, utilidad, KPI | Cost, Profit, Metric (Abstraction) |

Esta correspondencia no redefine la ontología. Establece cómo el lenguaje operacional se ancla en lo que existe.

---

## APÉNDICE C — VERIFICACIÓN DE COMPLETITUD

| Requisito | Estado |
| :--- | :--- |
| 71 términos mínimos cubiertos | ✅ |
| Estructura uniforme en todos los términos | ✅ |
| Definiciones operacionales, no superficiales | ✅ |
| Sin especificación de software ni tecnología | ✅ |
| Sin referencias a IA, embeddings ni MCP | ✅ |
| Anclaje en RKS-001 sin redefinir ontología | ✅ |
| Listo como referencia para Cognitive Core | ✅ |

---

## APÉNDICE D — METADATOS DEL DOCUMENTO

| Campo | Valor |
| :--- | :--- |
| **ID** | RKS-002 |
| **Título** | Restaurant Vocabulary |
| **Tipo** | Vocabulario Operacional del Dominio |
| **Dominio** | Operaciones de Restaurante |
| **Escuela** | Restaurant Knowledge School |
| **Nivel Cognitivo** | Nivel 1 — Vocabulario |
| **Estado** | Fundamento Permanente |
| **Versión** | 1.0.0 |
| **Creado** | 2026-06-28 |
| **Autor** | Chief Product Architect |
| **Dependencias** | RKS-001, KFS-001 |
| **Precede** | RKS-003 (Restaurant Entities), RKS-004 (Restaurant Relationships) |
| **Documentos relacionados** | RKS-001, KFS-001, THE_CONSTITUTION_OF_RESTAURANT_OS.md |
| **Estado de validación** | Teórico (pendiente de aplicación en RKS-003+) |
| **Confianza** | Alta — derivado de ontología RKS-001 y operación restaurante establecida |

---

*Fin de RKS-002 — Restaurant Vocabulary*

*La ontología dice qué existe. El vocabulario dice qué significa.*

*Cada palabra del dominio gastronómico tiene ahora un significado operacional que el Cognitive Core puede usar para interpretar cualquier restaurante.*

*Siguiente: RKS-003 — Restaurant Entities*