const app = require('./app');

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║   🚀 UTM Generator API Server        ║
║                                       ║
║   Environment: ${process.env.NODE_ENV?.padEnd(24)}║
║   Port: ${PORT.toString().padEnd(30)}║
║   URL: http://localhost:${PORT.toString().padEnd(16)}║
║                                       ║
║   Status: ✅ Running                  ║
╚═══════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});