# 📅 Timely - Sistema de Gestión de Reservas y Negocios

<div align="center">

![Timely Logo](https://img.shields.io/badge/Timely-Sistema%20de%20Reservas-blue?style=for-the-badge)

**Plataforma completa para la gestión eficiente de negocios y reservas**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?style=flat-square&logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)

[Demo en Vivo](https://timely-omega-eight.vercel.app) 

</div>

---



## 🎯 Sobre el Proyecto

**Timely** es una plataforma web moderna diseñada para revolucionar la forma en que los negocios gestionan sus reservas y citas. Combina una interfaz intuitiva con un backend robusto para ofrecer una solución completa de gestión empresarial.

### ¿Por qué Timely?

En un mundo donde el tiempo es oro, Timely elimina la fricción entre negocios y clientes, permitiendo una gestión eficiente de horarios, citas y disponibilidad en tiempo real.

---

## 🔍 Problemática

### Desafíos que Resuelve Timely

#### 1. **Gestión Manual Ineficiente**
- ❌ Registro de citas en cuadernos o hojas de cálculo
- ❌ Pérdida de información por falta de respaldo
- ❌ Dificultad para coordinar múltiples agendas
- ❌ Errores humanos en la programación de horarios

#### 2. **Falta de Visibilidad en Tiempo Real**
- ❌ Clientes no pueden ver horarios disponibles sin llamar
- ❌ Doble reserva del mismo horario
- ❌ Falta de recordatorios automáticos
- ❌ Imposibilidad de gestionar múltiples ubicaciones

#### 3. **Experiencia del Cliente Limitada**
- ❌ Procesos de reserva tediosos y lentos
- ❌ Falta de confirmaciones automáticas
- ❌ Dificultad para reprogramar citas
- ❌ Comunicación ineficiente entre negocio y cliente

#### 4. **Escalabilidad del Negocio**
- ❌ Imposible gestionar múltiples negocios desde un solo lugar
- ❌ Falta de métricas y análisis de ocupación
- ❌ Dificultad para expandir operaciones
- ❌ Procesos manuales que no escalan

---

## ✨ Características Principales

### Para Administradores de Negocios

#### 🏢 Gestión Multi-Negocio
- Crear y administrar múltiples negocios desde una única cuenta
- Configuración personalizada por negocio (nombre, dirección, teléfono, información)
- Dashboard centralizado con vista de todos tus negocios

#### 📅 Sistema de Horarios Flexible
- Crear horarios disponibles por fecha y rango de horas
- Marcar horarios como disponibles o bloqueados
- Edición y eliminación de horarios en tiempo real
- Visualización por calendario para mejor organización

#### 👥 Gestión de Citas
- Ver todas las reservas por negocio
- Confirmar o cancelar citas
- Historial completo de reservas
- Notificaciones de nuevas reservas

#### 🔐 Control de Acceso
- Sistema de roles (Admin/Cliente)
- Guards de seguridad a nivel de negocio
- Validación de propiedad antes de modificaciones
- Autenticación mediante JWT de Supabase

### Para Clientes

#### 🔍 Exploración de Negocios
- Catálogo completo de negocios disponibles
- Información detallada de cada establecimiento
- Búsqueda y filtrado (próximamente)

#### 🎟️ Reservas Simplificadas
- Ver horarios disponibles en tiempo real
- Reservar citas con un solo clic
- Modificar o cancelar reservas fácilmente
- Historial personal de citas

#### 📱 Perfil Personal
- Gestionar información de contacto
- Actualizar preferencias
- Cambio de rol Admin/Cliente

---

## 🎁 Beneficios

### Para Negocios

| Beneficio | Impacto |
|-----------|---------|
| **Ahorro de Tiempo** | Reduce hasta un 70% el tiempo dedicado a gestión de citas |
| **Reducción de Errores** | Elimina dobles reservas y conflictos de horarios |
| **Accesibilidad 24/7** | Los clientes pueden reservar en cualquier momento |
| **Escalabilidad** | Gestiona 1 o 100 negocios con la misma facilidad |
| **Profesionalización** | Imagen moderna y tecnológica del negocio |
| **Análisis de Datos** | Métricas claras de ocupación y demanda |

### Para Clientes

| Beneficio | Impacto |
|-----------|---------|
| **Comodidad** | Reserva desde cualquier dispositivo en segundos |
| **Transparencia** | Ve disponibilidad real sin llamadas |
| **Flexibilidad** | Reprograma citas fácilmente |
| **Recordatorios** | Nunca olvides una cita (próximamente) |
| **Historial** | Acceso a todas tus reservas pasadas y futuras |

---

## 🛠️ Tecnologías

### Frontend

```
Next.js 14          - Framework React con App Router
TypeScript          - Tipado estático para mayor seguridad
Tailwind CSS        - Estilos utility-first
Shadcn/ui           - Componentes UI accesibles
Lucide Icons        - Iconografía moderna
```

### Backend

```
NestJS              - Framework Node.js escalable
TypeScript          - Desarrollo type-safe
Supabase Auth       - Autenticación y autorización
Supabase Database   - PostgreSQL como base de datos
JWT                 - Tokens de autenticación seguros
```

### Infraestructura

```
Vercel              - Hosting del frontend
Render              - Hosting del backend
Supabase Cloud      - Base de datos y autenticación
GitHub              - Control de versiones
```

### Herramientas de Desarrollo

```
ESLint              - Linting de código
Prettier            - Formateo de código
pnpm                - Gestión de paquetes
Git                 - Control de versiones
```

---

## 🏗️ Arquitectura del Sistema

### Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│                      (Next.js + Vercel)                     │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Pages      │  │  Components  │  │   Services   │       │
│  │              │  │              │  │              │       │
│  │ - Dashboard  │  │ - Navbar     │  │ - API calls  │       │
│  │ - Businesses │  │ - Cards      │  │ - Auth       │       │
│  │ - Schedules  │  │ - Forms      │  │ - Helpers    │       │
│  │ - Profile    │  │ - Modals     │  │              │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS/REST API
                            │ Authorization: Bearer <JWT>
┌───────────────────────────▼─────────────────────────────────┐
│                         BACKEND                             │
│                      (NestJS + Render)                      │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Controllers  │  │   Services   │  │    Guards    │       │
│  │              │  │              │  │              │       │
│  │ - Auth       │  │ - Business   │  │ - JWT Verify │       │
│  │ - Businesses │  │ - Schedules  │  │ - Owner      │       │
│  │ - Schedules  │  │ - Users      │  │ - Admin      │       │
│  │ - Users      │  │              │  │              │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└───────────────────────────┬─────────────────────────────────┘
                            │ SQL Queries
                            │ JWT Validation
┌───────────────────────────▼─────────────────────────────────┐
│                     SUPABASE                                │
│                  (PostgreSQL + Auth)                        │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Database   │  │     Auth     │  │   Storage    │       │
│  │              │  │              │  │              │       │
│  │ - users      │  │ - JWT Secret │  │ - Files      │       │
│  │ - businesses │  │ - Sessions   │  │ - Images     │       │
│  │ - schedules  │  │ - Providers  │  │              │       │
│  │ - bookings   │  │              │  │              │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Autenticación

```
┌──────────┐         ┌──────────┐         ┌──────────┐
│  Client  │         │ Backend  │         │ Supabase │
└────┬─────┘         └────┬─────┘         └─────┬────┘
     │                    │                     │
     │  Login Request     │                     │
     ├───────────────────>│                     │
     │                    │  Validate Credentials
     │                    ├────────────────────>│
     │                    │                     │
     │                    │    JWT Token        │
     │                    │<────────────────────┤
     │   JWT Token        │                     │
     │<───────────────────┤                     │
     │                    │                     │
     │  API Request       │                     │
     │  + Bearer Token    │                     │
     ├───────────────────>│                     │
     │                    │  Verify JWT         │
     │                    ├────────────────────>│
     │                    │                     │
     │                    │    Valid ✓          │
     │                    │<────────────────────┤
     │   Response         │                     │
     │<───────────────────┤                     │
     │                    │                     │
```

### Flujo de Creación de Horario

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Admin   │    │ Frontend │    │ Backend  │    │ Database │
└────┬─────┘    └────┬─────┘    └────┬─────┘    └─────┬────┘
     │               │               │                │ 
     │ Click "Nuevo  │               │                │
     │ Horario"      │               │                │
     ├──────────────>│               │                │
     │               │               │                │
     │ Fill Form     │               │                │
     │ (date, time)  │               │                │
     ├──────────────>│               │                │
     │               │               │                │
     │ Submit        │ POST /schedules                │
     ├──────────────>├──────────────>│                │
     │               │   + JWT Token  │               │
     │               │                │               │
     │               │                │ Verify JWT    │
     │               │                │ Check Owner   │
     │               │                │───────┐       │
     │               │                │       │       │
     │               │                │<──────┘       │
     │               │                │               │
     │               │                │ INSERT INTO   │
     │               │                │  schedules    │
     │               │                ├──────────────>│
     │               │                │               │
     │               │                │    Success    │
     │               │                │<──────────────┤
     │               │   Schedule     │               │
     │               │    Created     │               │
     │               │<───────────────┤               │
     │  Redirect to  │                                │
     │  Schedules    │                                │
     │<──────────────┤                                │ 
                                                      │
```

---

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+ instalado
- pnpm (recomendado) o npm
- Cuenta en Supabase
- Git

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/timely.git
cd timely
```

### 2. Configurar el Backend

```bash
cd timely-backend
npm install

# Crear archivo .env
cp .env.example .env
```

Configurar variables de entorno en `timely-backend/.env`:

```env
# Supabase
Supabase_Url=tu_url_de_supabase
Supabase_Key=tu_service_role_key
SUPABASE_JWT_SECRET=tu_jwt_secret

# Servidor
PORT=3000
NODE_ENV=development
```

Iniciar el backend:

```bash
npm run start:dev
```

### 3. Configurar el Frontend

```bash
cd timely-frontend
pnpm install

# Crear archivo .env.local
cp .env.example .env.local
```

Configurar variables de entorno en `timely-frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

Iniciar el frontend:

```bash
pnpm dev
```

### 4. Configurar Base de Datos

Ejecutar las migraciones SQL en Supabase SQL Editor:

```sql
-- Crear tabla de negocios
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(50),
  info TEXT,
  admin_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de horarios
CREATE TABLE schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de estado de usuario
CREATE TABLE user_status (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  user_name VARCHAR(255),
  phone VARCHAR(50),
  role VARCHAR(50) DEFAULT 'cliente',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 5. Acceder a la Aplicación

- Frontend: http://localhost:3001
- Backend: http://localhost:3000
- Supabase Dashboard: https://app.supabase.com

---

## 📖 Uso del Sistema

### Para Administradores

#### 1. Registro y Login

```
1. Ir a /register
2. Llenar formulario con:
   - Nombre
   - Email
   - Contraseña
   - Teléfono (opcional)
   - Seleccionar rol: "Administrador"
3. Verificar email (si está habilitado en Supabase)
4. Iniciar sesión en /login
```

#### 2. Crear un Negocio

```
1. Dashboard → "Crear Negocio"
2. Llenar información:
   - Nombre del negocio
   - Dirección
   - Teléfono
   - Información adicional
3. Guardar
4. El negocio aparecerá en "Mis Negocios"
```

#### 3. Gestionar Horarios

```
1. Mis Negocios → Seleccionar negocio → "Horarios"
2. Seleccionar fecha en el calendario
3. Click en "Nuevo Horario"
4. Configurar:
   - Fecha
   - Hora inicio (formato 24h: 09:00)
   - Hora fin (formato 24h: 17:00)
   - Marcar si está disponible
5. Guardar
```

#### 4. Editar/Eliminar Horarios

```
- Editar: Click en botón de edición → Modificar → Guardar
- Eliminar: Click en botón de eliminar → Confirmar
```

### Para Clientes

#### 1. Explorar Negocios

```
1. Login como cliente
2. Ir a "Todos los Negocios"
3. Ver información de cada negocio
```

#### 2. Hacer una Reserva

```
1. Seleccionar negocio
2. Ver horarios disponibles
3. Elegir fecha y hora
4. Confirmar reserva
5. Ver confirmación en "Mis Reservas"
```

---

## 📁 Estructura del Proyecto

### Frontend (timely-frontend/)

```
timely-frontend/
├── app/
│   ├── appointments/          # Gestión de citas
│   │   ├── page.tsx          # Lista de citas
│   │   └── new/              # Nueva cita
│   ├── businesses/           # Catálogo de negocios
│   │   ├── page.tsx
│   │   ├── [id]/             # Detalle de negocio
│   │   └── new/              # Crear negocio
│   ├── my-businesses/        # Negocios del admin
│   │   ├── page.tsx
│   │   └── [businessId]/
│   │       └── schedules/    # Gestión de horarios
│   ├── dashboard/            # Dashboard principal
│   ├── login/                # Inicio de sesión
│   ├── register/             # Registro
│   └── profile/              # Perfil de usuario
├── components/
│   ├── ui/                   # Componentes Shadcn
│   ├── navbar.tsx            # Barra de navegación
│   └── protected-route.tsx   # HOC de protección
├── services/
│   └── api.ts                # Llamadas al backend
├── lib/
│   ├── auth.ts               # Lógica de autenticación
│   └── auth-utils.ts         # Utilidades de auth
└── types/                    # Definiciones TypeScript
```

### Backend (timely-backend/)

```
timely-backend/
├── src/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── dto/
│   │       └── auth.dto.ts
│   ├── businesses/
│   │   ├── businesses.controller.ts
│   │   ├── businesses.service.ts
│   │   ├── businesses.guard.ts    # JWT verification
│   │   ├── adminAccess.guard.ts   # Admin check
│   │   └── checkOwner.guard.ts    # Ownership check
│   ├── schedules/
│   │   ├── schedules.controller.ts
│   │   ├── schedules.service.ts
│   │   ├── schedules.guard.ts     # Owner verification
│   │   └── dto/
│   │       └── schedules.dto.ts
│   ├── users/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── user.guard.ts          # User auth guard
│   │   └── dto/
│   ├── config/
│   │   └── supabase.cliente.ts    # Supabase config
│   ├── app.module.ts              # Módulo principal
│   └── main.ts                    # Entry point
└── test/                          # Tests E2E
```

---

## 🔌 API Endpoints

### Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Registrar nuevo usuario | No |
| POST | `/auth/login` | Iniciar sesión | No |

**Ejemplo Request (Register):**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "phone": "+56912345678",
  "role": "admin"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "juan@example.com",
    "user_metadata": {
      "name": "Juan Pérez",
      "role": "admin"
    }
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token"
  }
}
```

### Negocios

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/businesses` | Listar todos los negocios | Sí |
| GET | `/businesses/:id` | Obtener negocio específico | Sí |
| GET | `/businesses/admin/:userId` | Negocios del admin | Sí |
| POST | `/businesses` | Crear negocio | Sí (Admin) |
| PATCH | `/businesses/:id` | Actualizar negocio | Sí (Owner) |
| DELETE | `/businesses/:id` | Eliminar negocio | Sí (Owner) |

**Ejemplo Request (Create Business):**
```json
{
  "name": "Peluquería María",
  "address": "Av. Principal 123",
  "phone": "+56912345678",
  "info": "Cortes y peinados profesionales"
}
```

### Horarios

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/schedules/business/:businessId` | Horarios de un negocio | No |
| GET | `/schedules/business/:businessId?date=2024-01-15` | Horarios por fecha | No |
| POST | `/schedules/business/:businessId` | Crear horario | Sí (Owner) |
| PATCH | `/schedules/:scheduleId` | Actualizar horario | Sí (Owner) |
| DELETE | `/schedules/:scheduleId` | Eliminar horario | Sí (Owner) |

**Ejemplo Request (Create Schedule):**
```json
{
  "date": "2024-01-15",
  "start_time": "09:00",
  "end_time": "17:00",
  "available": true
}
```

### Usuarios

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/users/me` | Perfil del usuario actual | Sí |
| PATCH | `/users/me` | Actualizar perfil | Sí |
| GET | `/users/:id` | Obtener usuario por ID | Sí (Admin) |

---

## 🔐 Seguridad

### Sistema de Guards

#### 1. **BusinessesGuard** (JWT Verification)
```typescript
// Verifica que el token JWT sea válido
// Decodifica el payload y asigna user al request
// Usado en todos los endpoints protegidos
```

#### 2. **AdminBusinessGuard** (Role Check)
```typescript
// Verifica que el usuario tenga rol 'admin'
// Necesario para crear negocios
```

#### 3. **CheckOwnerGuard** (Ownership Verification)
```typescript
// Verifica que el usuario sea propietario del negocio
// Previene modificaciones no autorizadas
```

#### 4. **SchedulesOwnerGuard** (Schedule Ownership)
```typescript
// Verifica que el usuario sea dueño del negocio
// Antes de crear/editar/eliminar horarios
```

### Flujo de Seguridad

```
Request → JWT Guard → Role Guard → Owner Guard → Controller → Service → DB
         ↓           ↓             ↓
      Verify JWT   Check Role   Verify Owner
```

### Variables de Entorno Sensibles

**Backend:**
```env
SUPABASE_JWT_SECRET=*****     # ⚠️ CRÍTICO: Nunca exponer
Supabase_Key=*****            # ⚠️ Service Role Key
```

**Frontend:**
```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=*****  # ✅ Pública, pero limitada
```

---

## 🗺️ Roadmap

### Fase 1: MVP ✅ (Completado)
- [x] Sistema de autenticación
- [x] CRUD de negocios
- [x] CRUD de horarios
- [x] Roles de usuario (Admin/Cliente)
- [x] Guards de seguridad
- [x] Interfaz responsiva

### Fase 2: Mejoras de UX (En Progreso)
- [ ] Búsqueda y filtrado de negocios
- [ ] Notificaciones en tiempo real
- [ ] Sistema de confirmación de citas
- [ ] Calendario interactivo mejorado
- [ ] Modo oscuro

### Fase 3: Features Avanzados
- [ ] Sistema de notificaciones por email
- [ ] Recordatorios automáticos de citas
- [ ] Integración con Google Calendar
- [ ] Sistema de reseñas y calificaciones
- [ ] Chat en vivo entre cliente y negocio
- [ ] Pagos integrados

### Fase 4: Analytics y Reportes
- [ ] Dashboard de métricas para admins
- [ ] Reportes de ocupación
- [ ] Estadísticas de reservas
- [ ] Análisis de tendencias
- [ ] Exportación de datos

### Fase 5: Escalabilidad
- [ ] App móvil (React Native)
- [ ] API pública para integraciones
- [ ] Sistema de plugins
- [ ] Multi-idioma
- [ ] Multi-tenant architecture

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si deseas colaborar:

### 1. Fork el Proyecto

```bash
git clone https://github.com/tu-usuario/timely.git
cd timely
```

### 2. Crear una Rama

```bash
git checkout -b feature/nueva-funcionalidad
```

### 3. Realizar Cambios

```bash
# Hacer tus cambios
git add .
git commit -m "Add: nueva funcionalidad increíble"
```

### 4. Push y Pull Request

```bash
git push origin feature/nueva-funcionalidad
```

Luego crea un Pull Request en GitHub.

### Guía de Estilo

- Usar TypeScript para type safety
- Seguir convenciones de ESLint y Prettier
- Escribir código autodocumentado
- Agregar comentarios para lógica compleja
- Seguir el patrón de arquitectura existente

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**.

```
MIT License

Copyright (c) 2024 Timely

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---


<div align="center">

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!

[⬆ Volver arriba](#-timely---sistema-de-gestión-de-reservas-y-negocios)

</div>
