# Catálogo Isa

Proyecto de e-commerce cosmético construido con Nuxt 3, Vue 3 Composition API y Supabase.

## Scripts

- `npm install`
- `npm run dev`
- `npm run build`

## Requisitos

- Supabase con la tabla `productos` creada según el SQL indicado.
- Variables de entorno configuradas en `.env`:

```bash
NUXT_PUBLIC_SUPABASE_URL=tu_url
NUXT_PUBLIC_SUPABASE_KEY=tu_anon_key
```

## Estructura principal

- `pages/index.vue`: catálogo principal.
- `components/TarjetaProducto.vue`: tarjeta reutilizable del producto.
- `pages/productos/[id].vue`: detalle del producto.
- `nuxt.config.ts`: configuración de Supabase y Tailwind.
