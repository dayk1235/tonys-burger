# 01 - VISIÓN DEL PROYECTO: Tony Burgers

Este documento define la visión estratégica, el alcance y los límites del proyecto **Tony Burgers**. Actúa como la estrella guía para todo el desarrollo del sistema, asegurando que todos los agentes (humanos y de IA) comprendan el propósito del producto.

---

## 1. Objetivo del Proyecto
El objetivo principal de **Tony Burgers** es desarrollar una plataforma web moderna, interactiva y de alto rendimiento para una cadena de hamburgueserías gourmet. La plataforma debe ofrecer una experiencia de usuario premium (WOW) que refleje la calidad de sus productos, facilitando la exploración del menú y la realización de pedidos y reservas.

## 2. Problema que Resuelve
Actualmente, los clientes de Tony Burgers experimentan fricciones al realizar pedidos por canales tradicionales (teléfono, redes sociales) y no cuentan con un canal centralizado y optimizado para móviles que les permita:
* Explorar de forma visual y detallada el menú gourmet.
* Personalizar sus hamburguesas (añadir/quitar ingredientes).
* Realizar pedidos para recoger (*takeaway*) o entrega a domicilio (*delivery*) de manera fluida.
* Reservar mesas en el local físico de forma instantánea.

## 3. Usuarios Objetivo
La plataforma está diseñada para dos perfiles de usuario principales:
1. **El Cliente Final (Comensal):** Amante de las hamburguesas gourmet que busca comodidad, rapidez, personalización en sus platos y un proceso de compra visualmente atractivo y sin fricción.
2. **El Administrador del Restaurante (Staff):** Personal encargado de gestionar los pedidos en cocina, actualizar la disponibilidad del menú y controlar el flujo de reservas de mesas.

---

## 4. Funcionalidades Principales (Scope Actual)

*   **Menú Gourmet Interactivo:**
    *   Visualización de platos con fotos de alta resolución, descripciones detalladas, alérgenos y precios.
    *   Filtros dinámicos por categorías (Hamburguesas, Acompañantes, Bebidas, Postres) y dietas (Vegano, Vegetariano, Sin Gluten).
    *   Personalizador de ingredientes (adicionales, exclusión de ingredientes comunes).
*   **Carrito de Compras y Checkout Seguro:**
    *   Gestión dinámica del carrito (agregar, editar cantidades, eliminar).
    *   Cálculo automático de subtotales, impuestos y costes de envío.
    *   Formulario de checkout interactivo (recogida en local o entrega a domicilio) con validaciones rigurosas.
*   **Sistema de Reserva de Mesas:**
    *   Calendario interactivo para selección de fecha, hora y número de personas.
    *   Confirmación visual instantánea de la disponibilidad de la mesa.
*   **Panel de Control del Restaurante (Backoffice Mocado):**
    *   Vista en tiempo real de los pedidos entrantes para su procesamiento (recibido, en preparación, listo, entregado).
    *   Gestión básica de inventario (marcar productos del menú como "Agotados").

---

## 5. Funcionalidades Futuras (Fuera de Scope Actual)

*   **Pasarela de Pago Real:** Integración con proveedores de pago como Stripe o PayPal (actualmente simulado en frontend).
*   **Sistema de Fidelización:** Programa de puntos acumulables por compras para canjear por productos o descuentos.
*   **Seguimiento de Pedidos en Tiempo Real:** Mapa interactivo con la ubicación del repartidor utilizando geolocalización.
*   **Autenticación de Usuarios:** Registro con redes sociales, historial de pedidos previos y direcciones guardadas.

---

## 6. Restricciones Técnicas y de Negocio

*   **Frontend-Only (Fase Inicial):** No se desarrollará backend real en esta etapa. Todos los flujos de datos deben estar simulados con mocks locales persistidos en `localStorage` o a través de un backend ficticio en memoria.
*   **Mobile-First:** El 80% del tráfico se estima desde dispositivos móviles. La interfaz debe ser impecablemente responsiva y fluida.
*   **Rendimiento Crítico:** Carga rápida del menú interactivo (imágenes optimizadas, lazy loading).
*   **Estética Visual Premium:** Colores armoniosos, animaciones fluidas al añadir productos y estética moderna (glassmorphism en detalles, tema oscuro/claro balanceado).

---

## 7. Gobernanza de Alcance (Leyes de Producto)

Para asegurar la coherencia de la visión del producto, se aplica estrictamente la siguiente ley de gobernanza global:

### LAW_003 - NO AUTONOMOUS FEATURES
Prohibido:
- Crear funcionalidades no solicitadas.
- Agregar mejoras no autorizadas.
- Inventar sistemas.
- Añadir secciones nuevas.
- Alterar experiencia de usuario sin aprobación.

Cualquier cambio propuesto debe responder exactamente a los requerimientos de la tarea aprobada sin añadir iniciativa autónoma.

---

---

## 8. Product Vision Alignment

This document describes the current website scope (Phase 1 of the product vision). For the long-term product evolution — including Conversion Optimization, Analytics, Insights, TonyBot, Knowledge Engine, Multi-Business, and SaaS — see:

➡️ **`../08-product/PRODUCT_VISION.md`**

**Key principle:** The product vision (PRODUCT_VISION.md) supersedes this document for all forward-looking decisions beyond the current website. Phase order is inviolable: data before automation, insights before AI, value before scale.

---

> [!NOTE]
> **[PLACEHOLDER] Información Pendiente:**
> *   *Integración con el sistema POS físico del local:* Pendiente de definir protocolos de comunicación en fases futuras.
> *   *Pasarela de pago final:* Definir si la región requiere proveedores específicos (ej. Redsys, MercadoPago, Stripe).
