# 🚀 Marketplace de Emprendimientos - Fullstack

Una plataforma robusta diseñada para que emprendedores puedan gestionar sus catálogos de productos y los clientes puedan descubrir ofertas locales. El sistema incluye gestión de inventario, autenticación por roles y almacenamiento de imágenes en la nube.

---

## 🛠️ Tecnologías Principales

**Frontend:**
*   **React + TypeScript**: Interfaz de usuario reactiva y tipado fuerte.
*   **Ant Design**: Componentes de UI profesionales y sistema de formularios.
*   **Lucide React**: Biblioteca de iconos moderna.
*   **Tailwind CSS**: Estilizado moderno, responsivo y basado en utilidades.

**Backend:**
*   **Node.js + Express**: Servidor de API REST eficiente.
*   **Supabase (PostgreSQL + Auth + Storage)**: Base de datos relacional, manejo de sesiones de usuario y almacenamiento de archivos binarios.
*   **Multer**: Middleware para el procesamiento de datos `multipart/form-data` y carga de archivos.

---

## ✨ Funcionalidades Implementadas

### 📦 Gestión de Productos
- **CRUD Completo**: Creación, lectura, actualización y eliminación de productos.
- **Manejo de Imágenes**: Subida de archivos físicos desde el cliente hacia **Supabase Storage** mediante un service especializado, con generación de URLs públicas automáticas.
- **Control de Inventario**: Gestión de stock y validación de tipos de datos en tiempo real.
- **Estados Dinámicos**: Control de visibilidad de productos (Activo/Inactivo) para el catálogo público.

### 🔐 Seguridad y Acceso
- **Autenticación JWT**: Integración con Supabase Auth para la protección de rutas.
- **Control por Roles (RBAC)**: Diferenciación de permisos entre Administradores y Proveedores.
- **Validación de Propiedad**: Los proveedores solo tienen permisos de escritura sobre productos vinculados a su propio `entrepreneurship_id`.

---

## 📂 Estructura del Proyecto

```text
├── backend/
│   ├── controllers/    # Lógica de controladores (Products, Auth, etc.)
│   ├── middlewares/    # Multer (upload), validación de JWT, roles
│   ├── services/       # Comunicación con Supabase Admin y Storage
│   └── routes/         # Definición de endpoints de la API
├── frontend/
│   ├── src/
│   │   ├── components/ # Componentes compartidos (Modales, ImageUpload)
│   │   ├── services/   # Cliente API (Axios configurado con FormData)
│   │   ├── hooks/      # Lógica de estado y llamadas a la API
│   │   └── pages/      # Vistas principales del dashboard y catálogo
