# 03 - ESTÁNDARES DE CÓDIGO Y BUENAS PRÁCTICAS

Este documento detalla las reglas de codificación, tipado, estilos y estructura que deben seguirse obligatoriamente al escribir código para el proyecto **Tony Burgers**. El objetivo es mantener el código consistente, seguro, autoexplicativo y fácil de auditar.

---

## 1. Convenciones de TypeScript

*   **Tipado Estricto:** La configuración `strict: true` en `tsconfig.json` es innegociable. No se permite eludir validaciones del compilador.
*   **Prohibido el uso de `any`:** Queda estrictamente prohibido usar el tipo `any`. Si un tipo no es determinable de inmediato, se debe utilizar `unknown` y realizar un estrechamiento de tipo (*type narrowing*) adecuado.
*   **Interfaces vs. Types:**
    *   Utilizar `interface` para definir la estructura de objetos, componentes y contratos de datos que puedan ser extendidos o implementados.
    *   Utilizar `type` para alias de tipos primarios, uniones, tuplas o intersecciones complejas.
*   **Tipado de Funciones:** Todas las funciones expuestas en utilidades o servicios deben tener un tipado explícito tanto para sus parámetros como para su valor de retorno.

```typescript
// ✅ CORRECTO
export interface Burger {
  id: string;
  name: string;
  price: number;
  ingredients: string[];
}

export function calculateTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

// ❌ INCORRECTO
export type Burger = { id: any; name: string };

const calculateTotal = (items: any) => {
  return items.reduce((total: any, item: any) => total + item.price, 0);
};
```

---

## 2. Convenciones de React

*   **Componentes Funcionales:** Escribir siempre componentes basados en funciones utilizando la sintaxis estándar de funciones flecha o funciones declarativas.
*   **Declaración de Componentes:** Definir el tipo del componente utilizando tipado explícito para las Props. No usar `React.FC` a menos que sea estrictamente necesario (ej. para componentes genéricos complejos).
*   **Desestructuración de Props:** Desestructurar las propiedades directamente en la firma del componente, asignando valores por defecto siempre que sea posible.
*   **Uso Eficiente de Hooks:**
    *   No abusar de `useMemo` o `useCallback` en cálculos triviales o funciones sencillas. Utilizarlos únicamente cuando el costo computacional sea alto o cuando la referencia del objeto/función se use como dependencia de otros hooks.

```tsx
// ✅ CORRECTO
interface MenuItemProps {
  id: string;
  name: string;
  price: number;
  onAddToCart: (id: string) => void;
}

export const MenuItem = ({ id, name, price, onAddToCart }: MenuItemProps) => {
  return (
    <div className="menu-item">
      <h3>{name}</h3>
      <p>{price} €</p>
      <button onClick={() => onAddToCart(id)}>Agregar</button>
    </div>
  );
};
```

---

## 3. Convenciones de Estilos (Tailwind & CSS)

*   **Orden de Clases Tailwind:** Las clases en la propiedad `className` deben seguir un orden visual lógico:
    1.  *Layout / Display* (`flex`, `grid`, `block`, `absolute`, `z-index`)
    2.  *Box Model / Dimensiones* (`w-`, `h-`, `p-`, `m-`, `gap-`)
    3.  *Tipografía* (`text-`, `font-`, `leading-`)
    4.  *Apariencia Visual* (`bg-`, `border-`, `rounded-`, `shadow-`)
    5.  *Interactividad / Hover / Focus* (`hover:`, `focus:`, `transition-`)
    6.  *Responsividad* (`sm:`, `md:`, `lg:`)
*   **Combinación Dinámica de Clases:** Usar siempre la utilidad `cn` (que combina `clsx` y `tailwind-merge`) para la concatenación condicional de clases de Tailwind, evitando colisiones de estilos.
*   **Variables CSS:** Los colores de marca, bordes y espaciados deben hacer referencia al archivo de configuración de Tailwind o variables CSS definidas en `index.css` para soportar de manera nativa temas oscuro y claro.

```tsx
// ✅ CORRECTO
import { cn } from "@/utils/cn";

export const Button = ({ isActive, className }: { isActive: boolean; className?: string }) => {
  return (
    <button
      className={cn(
        "flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200",
        isActive ? "bg-amber-600 text-white hover:bg-amber-700" : "bg-zinc-100 text-zinc-800 hover:bg-zinc-200",
        className
      )}
    >
      Ordenar
    </button>
  );
};
```

---

## 4. Convenciones de Imports y Exports

*   **Imports Absolutos:** Configurar y utilizar siempre el alias `@/` para referenciar la raíz de `src`. Quedan prohibidos los imports relativos anidados de tipo `../../../../`.
*   **Orden de Imports:**
    1.  Librerías externas (ej. `react`, `lucide-react`).
    2.  Componentes de UI y de features globales (ej. `@/components/ui/Button`).
    3.  Hooks, Servicios y Contextos (ej. `@/hooks/useCart`).
    4.  Utilidades, constantes y tipos (ej. `@/utils/formatCurrency`).
    5.  Estilos CSS (ej. `@/index.css`).
*   **Named Exports:** Se prefieren los Named Exports (`export const Feature = ...`) por encima de Default Exports. Esto facilita el autocompletado en el IDE y evita renombrados inconsistentes.

```typescript
// ✅ CORRECTO
import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/utils/formatCurrency";
import type { CartItem } from "@/types";
```

---

## 5. Reglas de Comentarios y JSDoc

*   **Autoexplicativo:** El código limpio debe explicarse por sí mismo. Evitar comentarios obvios como `// Incrementar contador`.
*   **JSDoc para Funciones Complejas:** Documentar funciones de utilidad, servicios o hooks complejos utilizando bloques JSDoc.
*   **Comentarios Técnicos / Racionales:** Usar comentarios para explicar el *por qué* se tomó una decisión poco común, no el *cómo* funciona el código a nivel básico.

```typescript
/**
 * Calcula el impuesto aplicado al subtotal del pedido según la región.
 * 
 * @param subtotal - El coste neto de los artículos.
 * @param location - Ubicación física o si es para recoger.
 * @returns El importe total correspondiente a impuestos.
 */
export const calculateTax = (subtotal: number, location: "pickup" | "delivery"): number => {
  const taxRate = location === "delivery" ? 0.10 : 0.08; // 10% delivery, 8% takeaway
  return subtotal * taxRate;
};
```

---

## 6. Leyes de Gobernanza del Código (Obligatorio)

### LAW_005 - MINIMAL CHANGE PRINCIPLE
Todo cambio debe ser:
- Pequeño.
- Localizado.
- Justificable.
- Reversible.
