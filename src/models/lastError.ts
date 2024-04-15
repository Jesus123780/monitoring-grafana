import { Model, DataTypes, STRING, UUIDV4 } from 'sequelize'
import sequelizeConnection from '../db'

export interface LastErrorAttributes {
  id?: number
  type: string
  date: string
  reported: boolean
}

class LastErrorModel extends Model<LastErrorAttributes> implements LastErrorAttributes {
  public id!: number
  public type!: string
  public date!: string
  public reported!: boolean

  // Necesario para TypeScript para prevenir errores de tipado durante la creación
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

LastErrorModel.init(
  {
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: STRING(36),
      defaultValue: UUIDV4()
    },
    type: {
      type: DataTypes.STRING
    },
    date: {
      type: DataTypes.STRING,
      unique: false
    },
    reported: {
      type: DataTypes.BOOLEAN
    }
  },
  {
    sequelize: sequelizeConnection,
    modelName: 'lasterror'
  }
)

export default LastErrorModel
