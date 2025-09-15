# 🛍️ Marketplace Frontend

Aplicación frontend desarrollada con **React + Vite** para un marketplace que incluye productos, carrito de compras, favoritos, checkout y perfil de usuario.

**Autor:** Yoselin González

---

## 📌 Características principales

- **Exploración de productos**
  - Listado con paginación y búsqueda.
  - Productos destacados en la página principal.
- **Detalle de producto**
  - Vista detallada con descripción, precio e imagen.
  - Botón para agregar al carrito.
  - Sistema de favoritos persistente por usuario.
- **Carrito de compras**
  - Modificación de cantidades.
  - Eliminación de productos.
  - Cálculo automático de IVA y total.
- **Checkout**
  - Resumen de pedido y creación de orden.
  - Redirección a página de éxito.
- **Perfil de usuario**
  - Edición de datos personales e imagen.
  - Gestión de productos publicados.
  - Visualización de favoritos.
  - Historial de compras.
- **Autenticación**
  - Registro con imagen de perfil.
  - Inicio de sesión con JWT.
  - Sesión persistente con `localStorage`.

---

## 🛠️ Tecnologías utilizadas

- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- Fetch API (cliente `api`)
- TailwindCSS (clases utilitarias en JSX)

---

## 📂 Estructura del proyecto

```
src/
 ├─ api/              # Cliente API
 ├─ components/       # Componentes reutilizables (ProductCard, etc.)
 ├─ pages/            # Páginas principales (Home, Products, Profile, etc.)
 ├─ App.jsx           # Rutas principales
 └─ main.jsx          # Entrada principal
```

---

## ⚙️ Instalación y uso

### 1. Clonar el repositorio

```bash
git clone https://github.com/tuusuario/marketplace-frontend.git
cd marketplace-frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Variables de entorno

Crea un archivo `.env` en la raíz con la URL de tu backend:

```env
VITE_API_URL=http://localhost:3000
```

### 4. Ejecutar en modo desarrollo

```bash
npm run dev
```

Aplicación disponible en `http://localhost:5173`

### 5. Build para producción

```bash
npm run build
npm run preview
```

---

## 👩‍💻 Autor

Creado con ❤️ por **Yoselin González**

---

# Marketplace API – Yoselin Gonzales (Por desarrollar pero ya se implemento el uso de estos futuros endpoints en el proyecto)

API REST para un marketplace minimalista construido con **Node.js (Express)** y **PostgreSQL**.  
Incluye autenticación con **JWT**, gestión de **usuarios**, **productos**, **carrito**, **favoritos**, **ventas** y **newsletter**.

> Autor del proyecto: **Yoselin Gonzales**

---

Servidor por defecto: `http://localhost:3000` a crear hito 3

---

## Autenticación

- **Login** devuelve un JWT.
- Usar en headers:
  ```http
  Authorization: Bearer <token>
  ```

---

## Endpoints principales

### Auth & Users

| Método | Ruta         | Descripción            |
| ------ | ------------ | ---------------------- |
| POST   | `/users`     | Crear usuario          |
| POST   | `/login`     | Login, retorna token   |
| GET    | `/users/:id` | Obtener usuario por ID |
| PUT    | `/users/:id` | Actualizar usuario     |

### Newsletter

| Método | Ruta                       | Descripción           |
| ------ | -------------------------- | --------------------- |
| POST   | `/newsletter/subscribe`    | Suscribir correo      |
| POST   | `/newsletter/unsubscribe`  | Desuscribir correo    |
| GET    | `/newsletter/status?email` | Estado de suscripción |

### Products

| Método | Ruta                      | Descripción                    |
| ------ | ------------------------- | ------------------------------ |
| POST   | `/products`               | Crear producto (auth)          |
| PUT    | `/products/:id`           | Actualizar producto (auth)     |
| DELETE | `/products/:id`           | Eliminar producto (auth)       |
| GET    | `/users/:userId/products` | Listar productos de un usuario |
| GET    | `/products/search`        | Buscar productos               |
| GET    | `/products/:id`           | Obtener producto por ID        |

### Cart

| Método | Ruta                  | Descripción                      |
| ------ | --------------------- | -------------------------------- |
| POST   | `/cart`               | Agregar/actualizar item (auth)   |
| GET    | `/users/:userId/cart` | Listar carrito de usuario (auth) |
| PUT    | `/cart/:id`           | Actualizar cantidad (auth)       |
| DELETE | `/cart/:id`           | Eliminar item del carrito (auth) |

### Favorites

| Método | Ruta                       | Descripción                          |
| ------ | -------------------------- | ------------------------------------ |
| POST   | `/favorites`               | Agregar favorito (auth)              |
| GET    | `/users/:userId/favorites` | Listar favoritos de usuario (auth)   |
| DELETE | `/favorites/:favoriteId`   | Eliminar por ID favorito (auth)      |
| DELETE | `/favorites`               | Eliminar por (userId, postId) (auth) |

### Sales

| Método | Ruta                   | Descripción                      |
| ------ | ---------------------- | -------------------------------- |
| POST   | `/sales`               | Crear venta desde carrito (auth) |
| GET    | `/users/:userId/sales` | Listar ventas de usuario (auth)  |
| GET    | `/sales/:id`           | Obtener detalle de venta (auth)  |

---

## Paginación

Todas las rutas de listado aceptan:

- `page` (default 1)
- `pageSize` (default 10)

Respuestas incluyen `{ items, page, pageSize, total }`.
