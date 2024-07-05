import dotenv from 'dotenv';
import { createConnection } from 'mysql2';
import MySQLStore from 'express-mysql-session';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
};

const connection = createConnection(dbConfig);

const sessionStore = new MySQLStore(
  {
    expiration: 86400000, // Tiempo de expiración de la sesión (en milisegundos)
    createDatabaseTable: true, // Crea automáticamente la tabla de sesiones si no existe
    schema: {
      tableName: 'sessions',
      columnNames: {
        session_id: 'session_id',
        expires: 'expires',
        data: 'data',
      },
    },
  },
  connection
); // Pasa la conexión de MySQL

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err.stack);
    return;
  }
  console.log('Connected to database as id', connection.threadId);
});

export default connection;

// connection.connect((err) => {
//   if (err) {
//     console.error('Error connecting to database:', err.stack);
//     return;
//   }
//   console.log('Connected to database as id', connection.threadId);
// });

// export default connection;
