import { type Dialect, Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const dbName = process.env.NAME_DB ?? ''
const dbUser = process.env.USER_DB ?? ''
const dbHost = process.env.HOST_DB ?? ''
const dbPort = process.env.PORT_DB !== undefined ? parseInt(process.env.PORT_DB) : undefined
const dbDriver = process.env.DIALECT_DB as Dialect
const dbPassword = process.env.PASS_DB

const dialectOptions: Record<Dialect, any> = {
  postgres: {

  },
  mysql: undefined,
  sqlite: undefined,
  mariadb: undefined,
  mssql: undefined,
  db2: undefined,
  snowflake: undefined,
  oracle: undefined
}
const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  logging: true,
  dialect: dbDriver,
  dialectOptions: (dbDriver !== null) && (Boolean(dialectOptions[dbDriver])) ? dialectOptions[dbDriver] : {},
  ssl: false
})
sequelizeConnection.sync()

export default sequelizeConnection
