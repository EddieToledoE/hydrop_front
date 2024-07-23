export { default } from 'next-auth/middleware';

export const config = {
    matcher: [
        '/menu', 
        '/menu/:id*',  // Protege rutas como /menu/123, /menu/abc/xyz, etc.
        '/estacion', 
        '/estacion/:id*',  // Protege rutas como /estacion/123, /estacion/abc/xyz, etc.
        '/ajustes', 
        '/ajustes/:id*',  // Protege rutas como /ajustes/123, /ajustes/abc/xyz, etc.
        '/api/:path*',
        '/estadisticas',
    ]
};
