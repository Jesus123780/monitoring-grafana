import { Model, DataTypes, STRING, UUIDV4 } from 'sequelize';
import sequelizeConnection from '../db';

export interface ErrorAttributes {
  id?: number;
  type: string;
  date: string;
  reported: boolean;
}

class ErrorModel extends Model<ErrorAttributes> implements ErrorAttributes {
  public id!: number;
  public type!: string;
  public date!: string;
  public reported!: boolean;

  // Necesario para TypeScript para prevenir errores de tipado durante la creación
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ErrorModel.init(
  {
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: STRING(36),
      defaultValue: UUIDV4(),
    },
    type: {
      type: DataTypes.STRING,
    },
    date: {
      type: DataTypes.STRING,
      unique: false,
    },
    reported: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: 'errors'
  }
);

export default ErrorModel;
