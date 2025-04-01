# DenunciApp - Backend

Backend de la aplicación **DenunciApp**, una plataforma de reporte ciudadano que permite a los usuarios informar sobre incidencias en su comunidad mediante una app móvil. Este backend está construido con **Node.js** y **Express**, e incluye funcionalidades de autenticación, manejo de reportes, envío de notificaciones, y almacenamiento en la nube.

---

## 🛠️ Tecnologías Utilizadas

- **Node.js** + **Express** – API REST
- **MySQL** – Base de datos relacional
- **JWT** – Autenticación basada en tokens
- **Amazon S3** – Almacenamiento de imágenes
- **PostGIS** – Manejo geoespacial (junto con Postgres si se utiliza en conjunto)
- **Google Maps API** – Geolocalización y visualización
- **Bcrypt** – Encriptación de contraseñas
- **Expo Notifications** – Notificaciones push móviles

---

## 📦 Instalación

1. Clona este repositorio:

   ```bash
   git clone https://github.com/tuusuario/denunciapp-backend.git
   cd denunciapp-backend
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Crea un archivo `.env` basado en el ejemplo:

   ```bash
   cp .env.example .env
   ```

   Llena las variables necesarias como:

   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=tu_clave
   DB_NAME=denunciapp
   JWT_SECRET=tu_secreto
   AWS_ACCESS_KEY=clave
   AWS_SECRET_KEY=secreto
   S3_BUCKET=nombre_del_bucket
   ```

4. Ejecuta el servidor:

   ```bash
   docker compose up -d
   npm run dev
   ```

---

## 📚 Estructura del Proyecto

```
.
├── controllers/       # Lógica de negocio
├── models/            # Definiciones de la base de datos
├── routes/            # Endpoints API
├── middleware/        # Autenticación y validaciones
├── config/            # Configuración general
├── utils/             # Funciones auxiliares
├── uploads/           # Imágenes temporales (si aplica)
└── app.js             # Configuración principal de Express
```

---

## 🔐 Funcionalidades Principales

### 1. Autenticación
- Registro de usuario por correo y contraseña
- Inicio de sesión con JWT
- Modo invitado (limitado)

### 2. Reportes de Incidencias
- Envío de reportes con imagen y ubicación
- Descripción breve asistida por IA (integración opcional)
- Visualización en mapa

### 3. Gestión de Reportes
- Seguimiento del estado del reporte
- Estados: Pendiente, En proceso, Resuelto
- Administración de reportes por panel de administrador

### 4. Notificaciones
- Notificaciones push y por correo al cambiar el estado de los reportes

---

## ⚙️ Endpoints API (Resumen)

| Método | Endpoint              | Descripción                          |
|--------|-----------------------|--------------------------------------|
| POST   | /auth/register        | Registro de usuario                  |
| POST   | /auth/login           | Inicio de sesión                     |
| POST   | /reports              | Crear nuevo reporte                  |
| GET    | /reports              | Obtener todos los reportes           |
| GET    | /reports/:id          | Ver detalle de un reporte            |
| PUT    | /reports/:id/status   | Cambiar estado (solo admin)          |
| GET    | /users/me/reports     | Obtener reportes del usuario actual  |

---

## 🔒 Seguridad

- JWT para control de acceso
- Bcrypt para encriptación de contraseñas
- HTTPS recomendado en producción
- S3 para almacenamiento seguro de imágenes

---

## 📈 Escalabilidad y Rendimiento

- Arquitectura modular por capas
- Optimizado para alta concurrencia
- Soporte para crecimiento en usuarios y reportes

---

## 📄 Licencia

Este proyecto es de uso académico para la materia de **Construcción de Software** en el **Instituto Tecnológico de Santo Domingo (INTEC)**.

---

## ✒️ Autores

- Alexander Gil
- Erick Saviñón Fernández
- Manuel Guzmán Fortuna
- Leonardo Perozo
- Samuel Polanco

Supervisado por: **Okelarys Sánchez**
