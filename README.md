# ⚡ PokéCapture ⚡

¡Bienvenido a **PokéCapture**! Una aplicación interactiva construida con **React** y **Vite** que simula una experiencia completa estilo Pokédex/Pokémon GO en la web. Explora, busca y captura Pokémon para armar tu propia colección.

![PokéCapture Banner](https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png)

## ✨ Características Principales

*   🌍 **Exploración de Pokémon:** Visualiza una lista completa de Pokémon interactivos.
*   🔍 **Buscador y Filtros en Tiempo Real:** Encuentra a tu Pokémon favorito al instante por nombre o tipo.
*   🎯 **Sistema de Captura (RNG):** Al intentar capturar un Pokémon, las probabilidades de éxito dependerán de su nivel y rareza.
*   🎒 **Mochila (Inventario):** Revisa los Pokémon que has capturado, libéralos si lo deseas o consulta sus estadísticas detalladas.
*   🗺️ **Radar Integrado (Mapa):** Usa la vista de mapa interactiva (con Leaflet) para simular ubicaciones de Pokémon cercanos a ti.
*   💎 **Jerarquía Visual de Rarezas:** Cada Pokémon tiene asignada una rareza (Common, Rare, Epic, Legendary) que define sus estilos, brillos (*glow*) y animaciones doradas especiales para los legendarios.
*   🌓 **Modo Oscuro / Claro:** Alterna entre temas visuales que se adaptan a tu preferencia y se guardan automáticamente.
*   📱 **Diseño 100% Responsivo:** La aplicación está diseñada bajo el modelo *mobile-first*, incluyendo una barra de navegación inferior adaptada para usarse con una sola mano en smartphones.
*   💫 **Micro-Animaciones Avanzadas:** 
    *   Lanzamiento de Pokéballs animadas con CSS.
    *   Transiciones y *Skeleton Loaders* (*shimmer effect*) mientras los datos cargan.
    *   Animaciones de captura con confeti y efectos de sonido (*beep*).

## 🛠️ Tecnologías Utilizadas

*   **Frontend Framework:** React 18
*   **Build Tool:** Vite
*   **Routing:** React Router DOM v6
*   **Mapas:** React Leaflet (`react-leaflet` y `leaflet`)
*   **Estilos:** CSS Modules y variables CSS Globales para el Theming.
*   **Animaciones:** CSS Keyframes puros y la librería de micro interacciones `canvas-confetti`.

## 🚀 Instalación y Ejecución Local

Si deseas probar la aplicación de manera local en tu entorno de desarrollo, sigue estos pasos:

1.  **Clona el repositorio** o asegúrate de estar en la carpeta raíz del proyecto (`frontend`):
    ```bash
    cd frontend
    ```

2.  **Instala las dependencias** requeridas (asegúrate de tener Node.js instalado):
    ```bash
    npm install
    ```

3.  **Inicia el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

4.  Abre tu navegador y entra a: `http://localhost:5173`

## 📁 Estructura del Proyecto

*   `/src/components`: Componentes reutilizables como `CreatureCard.tsx`.
*   `/src/pages`: Las vistas principales (`Home.tsx`, `Map.tsx`, `Inventory.tsx`, `Detail.tsx`, `Login.tsx`).
*   `/src/data`: Datos persistentes o mockups como el JSON local `creatures.json`.
*   `/src/styles`: Estilos globales y reseteos `global.css`.

## 🎮 ¿Cómo Jugar?

1.  Abre la aplicación.
2.  Busca un Pokémon en la vista "Explorar".
3.  Presiona el botón **Capturar** y espera a que termine la animación de la Pokéball.
4.  Si logras capturarlo, ¡felicidades! El Pokémon se guardará en tu colección y lo verás en la pestaña **Mochila**.
5.  Puedes ir al **Mapa** para usar el modo de radar.

---
*Desarrollado con pasión utilizando el stack de React, Vite y la imaginación del mundo Pokémon.*
