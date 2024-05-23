import { DataType, DataTypes } from 'sequelize';
import sequelize from '../db/conexion';

export const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type : DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'usuario', // Nombre de la tabla existente en la base de datos
    timestamps: false // Indica que no hay columnas 'createdAt' y 'updatedAt' en la tabla
});


// Llamar al procedimiento almacenado
export async function callCrearUsuarioProcedure(nombreAdministrador: string, telefono: string, correoElectronico: string, username: string, password: string, tipoPermiso: string) {
    try {
      const [results, metadata] = await sequelize.query(
        `CALL crear_usuario('${nombreAdministrador}', '${telefono}', '${correoElectronico}', '${username}', '${password}', '${tipoPermiso}')`
      );
      //console.log(results);
    } catch (error) {
      console.error('Error al llamar al procedimiento almacenado:', error);
    }
}
  
export async function callActualizarPassword(username: string, password: string){
  try {
    const [results, metadata] = await sequelize.query(
      `CALL actualizar_contrasena('${username}', '${password}')`
    );
  } catch (error) {
    console.error('Error al llamar al procedimiento almacenado:', error);
  }
}

export async function obtener_categoria_permiso(username:string) {
  try {
      const [results, metadata] = await sequelize.query(
          `SELECT obtener_categoria_permiso('${username}') AS categoria`
      );
      return results;
  } catch (error) {
      console.error('Error al llamar al procedimiento almacenado:', error);
      throw error; // Propaga el error para manejarlo en otro lugar si es necesario
  }
}