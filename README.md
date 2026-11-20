# PatyLu Makeup — base de migración

Proyecto base React + Vite para el repositorio `allanvaltierra77-svg/PatyLuMakeUP.Gto`.

## Importante
Este paquete **no es todavía la migración completa del sitio**. Incluye el esqueleto Vite y tres archivos fuente recibidos: `Booking.jsx`, `OAuthConsent.jsx` y `sidebar.jsx`. La pantalla inicial es deliberadamente un aviso de integración pendiente; no reemplaza el sitio original.

Faltan integrar las demás páginas, componentes, hojas de estilo, dependencias UI restantes y la sustitución completa de Base44 por Supabase.

## Ejecutar
Requiere Node.js 20 o superior.

```bash
npm install
npm run dev
```

## Compilar
```bash
npm run build
```

## Cloudflare Pages
- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Root directory: `/`

Configura `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en las variables de entorno de Cloudflare cuando se integre Supabase. Nunca publiques `service_role`.
