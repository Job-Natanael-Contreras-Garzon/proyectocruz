import { DataType, DataTypes, DecimalDataType, INTEGER, IntegerDataType } from 'sequelize';
import sequelize from "../db/conexion";

export const Factura = sequelize.define('Factura', {
    codigo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
}, {
    tableName: 'factura', // Nombre de la tabla existente en la base de datos
    timestamps: false // Indica que no hay columnas 'createdAt' y 'updatedAt' en la tabla
});
//Llamada de los procedimientos almacenador
export async function insertar_factura(nombre_cliente: string, correo_cliente: string,ci_cliente: number, telefono_cliente: string,
                                       nombre_admin: string, metodo_pago: string, nombre_categoria_producto: string, cantidad: number) {
    try {
      const [results, metadata] = await sequelize.query(
        `CALL insertar_factura('${nombre_cliente}', '${correo_cliente}', '${ci_cliente}','${telefono_cliente}','${nombre_admin}', 
                               '${metodo_pago}', '${nombre_categoria_producto}', '${cantidad}')`
      );
      //console.log(results);
    } catch (error) {
      console.error('Error al llamar al procedimiento almacenado:', error);
    }
}