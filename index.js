require('dotenv').config()

const appConfig = require('./src/config/app')
const app = require('./src/app')
const pool = require('./src/config/pool')
// const connectionOptions = require('./src/config/connection')
const socketServer = require('./src/sockets/socketServer')

// migrate-up && NODE_ENV=production
console.log(`Database port: ${process.env.DB_PORT}`);
console.log(`Database host: ${process.env.DB_HOST}`);
console.log(`Database user: ${process.env.DB_USER}`);
console.log(`Database url: ${process.env.DATABASE_URL}`);

process.on('uncaughtException', (err) => {
  console.log('UNHANDLED EXCEPTION! 💥 Shutting down...')
  console.log('ERROR NAME:=>', err.name, ' ERROR MESSAGE:=>', err.message)
  process.exit(1)
})

const PORT = appConfig.app_port || 4003

/* pool.connect(connectionOptions).then(() => {
  console.log('DB connection successful!')
}).then(() => {
  console.log('DB connection successful!')
}) */

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

pool.connect(
  {
    connectionString: process.env.DATABASE_URL
  }
)
  .then(() => {
    console.log('DB connection successful!')
  })
  .catch(err => {
    console.error('DB connection failed:', err);
  });

const server = app().listen(PORT, () => {
  console.log('App running on port', PORT)
})

// Socket section
const options = {
/*  origin: 'http://localhost:8100', */
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true
};

socketServer(server, options)

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...')
  console.log('ERROR NAME:=>', err.name, ' ERROR MESSAGE:=>', err.message)
  server.close(() => {
    process.exit(1)
  })
})
