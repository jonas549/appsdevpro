// Next.js 15 no incluye declaraciones para los imports de hojas de estilo, y
// TypeScript 6 exige una declaración explícita en los imports con efectos
// secundarios (TS2882). Sin esto, `import './globals.css'` rompe el build.
declare module '*.css'
declare module '*.scss'
