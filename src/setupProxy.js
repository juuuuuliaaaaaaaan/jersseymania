// Windows (cmd):
// 1) Encontrar PID del proceso que usa el puerto 3000:
//    netstat -ano | findstr :3000
// 2) Matar el proceso (reemplaza <PID> por el número obtenido):
//    taskkill /PID <PID> /F
// Alternativa (requiere npx): mata el puerto directamente:
//    npx kill-port 3000
// Luego reinicia tu dev server: npm start

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
	// No proxy a las rutas estáticas: esto evita que create-react-app redirija /images/* a localhost:4000
	// Si en el futuro necesitas proxear solo la API, descomenta y ajusta la siguiente línea:
	// app.use('/api', createProxyMiddleware({ target: 'http://localhost:4000', changeOrigin: true }));

	// Ejemplo: si quieres proxear websockets u otras rutas, añade aquí más middlewares.
};
