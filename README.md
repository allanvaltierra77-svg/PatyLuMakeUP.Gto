# PatyLu Makeup

Sitio web de **PatyLu Makeup**, construido con React y Vite. El proyecto está preparado para publicarse en GitHub y desplegarse en Cloudflare Pages. La integración de autenticación y datos se realizará con Supabase.

## Requisitos

- Node.js 20 o superior (recomendado).
- npm.
- Una cuenta de GitHub, Cloudflare y Supabase.

## Instalación local

Clona el repositorio:

```bash
git clone https://github.com/USUARIO/REPOSITORIO.git
cd REPOSITORIO
```

Instala las dependencias:

```bash
npm install
```

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=TU_CLAVE_PUBLICA
```

Usa únicamente la clave pública/anon de Supabase en el frontend. **Nunca** incluyas la clave `service_role` ni otros secretos en variables `VITE_`, en GitHub o en el navegador.

Inicia el servidor:

```bash
npm run dev
```

Vite mostrará la dirección local en la terminal, normalmente `http://localhost:5173`.

## Compilación

```bash
npm run build
```

La versión de producción se genera en `dist/`. Para probarla localmente:

```bash
npm run preview
```

## Despliegue en Cloudflare Pages

1. Sube el proyecto a un repositorio de GitHub.
2. En Cloudflare, entra a **Workers & Pages** y crea una aplicación de Pages conectada a Git.
3. Selecciona el repositorio y configura:

| Configuración | Valor |
|---|---|
| Framework preset | Vite |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` |

4. En **Settings → Environment variables**, agrega estas variables para Production (y Preview si corresponde):

| Variable | Valor |
|---|---|
| `VITE_SUPABASE_URL` | URL del proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Clave pública/anon de Supabase |

5. Guarda y ejecuta el despliegue.

Cada actualización que subas a la rama conectada puede iniciar un nuevo despliegue automáticamente.

## Supabase

Supabase será el backend para:

- Autenticación de usuarios.
- Perfiles y roles (`admin` y `user`).
- Catálogo de servicios.
- Reservaciones y su seguimiento.

Antes de usar el sitio en producción, configura las tablas, políticas de seguridad (RLS), permisos y usuarios administradores. Los permisos deben validarse también en la base de datos; ocultar opciones en la interfaz no es suficiente.

## Estructura general

La estructura final puede variar conforme se integre el código:

```text
.
├── public/                 # Imágenes y recursos públicos
├── src/
│   ├── api/                # Clientes y acceso a servicios externos
│   ├── components/         # Componentes reutilizables y UI
│   ├── hooks/              # Hooks de React
│   ├── lib/                # Utilidades y configuración
│   ├── pages/              # Vistas de la aplicación
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env                    # Variables locales (no subir a Git)
├── .gitignore
├── index.html
├── package.json
└── README.md
```

## Seguridad

- No subas `.env` a GitHub.
- No publiques contraseñas, tokens privados ni claves `service_role`.
- Configura las variables de entorno directamente en Cloudflare Pages.
- Activa y revisa RLS en todas las tablas con información de usuarios o reservaciones.
- Protege las operaciones administrativas tanto en la aplicación como en Supabase.

## Estado de la migración

Este repositorio corresponde a la migración de Base44 hacia React + Vite + Supabase. Antes de considerar el sitio listo para producción, verifica:

- Que no queden dependencias ni llamadas al SDK de Base44.
- Que el cliente de Supabase use correctamente las variables de entorno.
- Que el inicio de sesión, registro y recuperación de contraseña funcionen.
- Que las reservaciones se guarden y consulten con los permisos correctos.
- Que el acceso administrativo esté protegido por rol y políticas RLS.
- Que las imágenes y recursos no dependan de enlaces temporales de Base44.
- Que el flujo completo se pruebe en el dominio publicado.

---

**PatyLu Makeup** — *Elegancia en cada detalle.*
