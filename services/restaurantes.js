const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1) {
    try {
        const offset = helper.getOffset(page, config.listPerPage);
        const rows = await db.query(
            `SELECT * FROM Restaurantes LIMIT ${offset},${config.listPerPage}`
        );

        // Verificar si se recuperaron filas de la base de datos
        if (rows && rows.length > 0) {
            // Mapear las filas de la base de datos a un arreglo de objetos de restaurantes
            const data = rows.map(row => ({
                ID: row.ID,
                Nombre: row.Nombre,
                Tipo: row.Tipo,
                Direccion: row.Direccion,
                Telefono: row.Telefono,
                Imágen: row.Imagen
                // Asegúrate de incluir cualquier otra propiedad que tengas en tu tabla de restaurantes
            }));

            // Crear un objeto de metadatos para incluir la información de la página
            const meta = { page };

            // Devolver un objeto que contiene los datos de los restaurantes y los metadatos
            return {
                data,
                meta
            };
        } else {
            // Si no se encontraron filas, devolver un objeto vacío
            return {
                data: [],
                meta: { page }
            };
        }
    } catch (error) {
        // Capturar cualquier error y lanzarlo
        throw error;
    }
}

//------------------------------------------------------------------------------------CREAR NUEVOS RESTAURANTES-------------------------------------------------------------------------------------

async function create(Restaurante, ruta) {
    try {
        const resultRestaurante = await db.query(
            `INSERT INTO Restaurantes 
             (Nombre, Tipo, Direccion, Telefono, Imagen, Img) 
             VALUES 
             (?, ?, ?, ?, ?, ?)`,
            [Restaurante.Nombre, Restaurante.Tipo, Restaurante.Direccion, Restaurante.Telefono, Restaurante.Imagen, ruta]
        );
        // console.log(ruta)

        if (!resultRestaurante.affectedRows) {
            return { message: 'Error al ingresar el restaurante' };
        }

        const restauranteId = resultRestaurante.insertId;

        const resultEmpleados = await db.query(
            `INSERT INTO Empleados 
             (id_restaurante, numero_empleados) 
             VALUES 
             (?, ?)`,
            [restauranteId, Restaurante.numero_empleados]
        );

        if (!resultEmpleados.affectedRows) {
            return { message: 'Error al ingresar el número de empleados' };
        }

        return { message: 'Restaurante creado con éxito' };
    } catch (error) {
        return { message: 'Error al crear el restaurante: ' + error.message };
    }
}

//------------------------------------------------------------------------------------ACTUALIZAR UN RESTAURANTE POR ID-------------------------------------------------------------------------------------


async function update(id, Restaurante, ruta) {
    try {
        let queryParams = []; // Almacenará los valores de los parámetros en la consulta SQL
        let updateFields = []; // Almacenará los campos que se van a actualizar en la consulta SQL

        // Construye la consulta SQL y los parámetros asociados dinámicamente
        if (Restaurante.Nombre !== undefined) {
            updateFields.push("Nombre=?");
            queryParams.push(Restaurante.Nombre);
        }
        if (Restaurante.Tipo !== undefined) {
            updateFields.push("Tipo=?");
            queryParams.push(Restaurante.Tipo);
        }
        if (Restaurante.Direccion !== undefined) {
            updateFields.push("Direccion=?");
            queryParams.push(Restaurante.Direccion);
        }
        if (Restaurante.Telefono !== undefined) {
            updateFields.push("Telefono=?");
            queryParams.push(Restaurante.Telefono);
        }
        if (Restaurante.Imagen !== undefined) {
            updateFields.push("Imagen=?");
            queryParams.push(Restaurante.Imagen);
        }
        if (ruta !== undefined) {
            updateFields.push("Img=?");
            queryParams.push(ruta);
        }

        // Verifica si hay campos para actualizar
        if (updateFields.length === 0) {
            return { message: 'No se proporcionaron campos para actualizar el restaurante' };
        }

        // Agrega el ID al final del array de parámetros
        queryParams.push(id);

        // Construye la consulta SQL final
        const updateQuery = `UPDATE Restaurantes SET ${updateFields.join(", ")} WHERE id=?`;

        // Ejecuta la consulta SQL
        const resultRestaurante = await db.query(updateQuery, queryParams);

        // Verifica si se actualizó algún restaurante
        if (!resultRestaurante.affectedRows) {
            return { message: 'No se encontró ningún restaurante para actualizar' };
        }

        // Actualiza el número de empleados (si se proporciona)
        if (Restaurante.numero_empleados !== undefined) {
            const resultEmpleados = await db.query(
                `UPDATE Empleados 
                SET numero_empleados=? 
                WHERE id_restaurante=?`,
                [Restaurante.numero_empleados, id]
            );

            if (!resultEmpleados.affectedRows) {
                return { message: 'Error al actualizar el número de empleados para este restaurante' };
            }
        }

        return { message: 'Restaurante actualizado con éxito' };
    } catch (error) {
        return { message: 'Error al actualizar el restaurante: ' + error.message };
    }
}


//------------------------------------------------------------------------------------ELIMINAR UN RESTAURANTE CONOCIENDO SU ID-------------------------------------------------------------------------------------


async function remove(id) {

    const result2 = await db.query(
        `DELETE FROM Empleados WHERE id_restaurante=${id}`
    );
    const result = await db.query(
        `DELETE FROM Restaurantes WHERE id=${id}`
    );

    let message = 'Error al intentar elimnar el Restaurante';

    if (result.affectedRows) {
        message = 'Restaurante eliminado Correctamente';
    }

    return { message };
}

async function search(id) {
    const rows = await db.callSpSearch(id);
    const data = helper.emptyOrRows(rows);
    return {
        data
    }
}



module.exports = {
    getMultiple,
    create,
    update,
    remove,
    search
};




