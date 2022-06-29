'use strict'

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql2')
const params = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'sandylance'
}
let conn = mysql.createConnection(params);

/* Pregunta a) */
// get--> obtención de todas las mascotas existentes o de uno específico usando el id
app.get("/mascota/get/:id?", (req, res) => {
    let id = req.params.id;
    let sql_a = "SELECT * FROM sandylance.mascota where idmascota = ?";

    if (id === undefined) {
        let sql = 'SELECT * FROM sandylance.mascota';
        conn.query(sql, function (err, result) {
            if (err) {
                res.json({msg: "ocurrió un error al obtener información lista de mascotas"});
                console.error(err);
            } else {
                res.json(result);
            }
        });
    } else {
        let parametros = [id];
        conn.query(sql_a, parametros, function (err, result) {
            if (err) {
                res.json({msg: "ocurrió un error al obtener información sobre la mascota con id=" + id});
                console.error(err);
            } else {
                if (result.length !== 0) res.json(result);
                else res.json({msg: 'No se encontraron resultados'})
            }
        });
    }
});

/* Pregunta b) */
/**
 * Content-Type: application/json
 * Ejemplo de Request:
 {
         "nombre": "Crash",
         "anho": "8",
         "historia": "obesidad",
         "observaciones": "ninguna",
         "sexo": "masculino",
         "raza_especie_idraza": 3,
         "raza_otros": "ninguno",
         "cuenta_idcuenta": 3
    }
 * Response -> mascota creada
 */
app.post('/mascota/create', bodyParser.json(), (req, res) => {
    let sql = 'insert into mascota set ?';
    let params = {
        nombre: req.body.nombre,
        anho: req.body.anho,
        historia: req.body.historia,
        observaciones: req.body.observaciones,
        sexo: req.body.sexo,
        raza_especie_idraza: req.body.raza_especie_idraza,
        raza_otros: req.body.raza_otros,
        cuenta_idcuenta: req.body.cuenta_idcuenta
    }

    conn.query(sql, params, (err, result) => {
        if (err) {
            res.json({msg: 'Error en los datos de la mascota a registrar'});
            console.error(err);
        } else {
            // Devuelve la mascota creada
            conn.query('select * from mascota where idmascota = ?',
                [result.insertId], (e, r) => {
                    if (e) {
                        res.json({msg: 'No se pudo obtener la mascota creada'});
                        console.error(err);
                    } else {
                        res.json(r);
                    }
                })
        }
    })
})


/* Pregunta c) */
/**
 * Content-Type: application/json
 * Ejemplo de Request: (idmascota por variable de ruta)
 {
        "cuenta_idcuenta": 3,
        "duracion": 30,
        "entrega": "Domicilio",
        "responsable_idresponsable": 2
    }
 * Response -> mascota creada
 */

app.post("/servicio/create/:id", bodyParser.json(), (req, res) => {
    // variables
    let mascota_idmascota = req.params.id;
    let cuenta_idcuenta = req.body.cuenta_idcuenta;
    let duracion = req.body.duracion;
    let entrega = req.body.entrega;
    let responsable_idresponsable = req.body.responsable_idresponsable;

    let sql = "insert into servicio (mascota_idmascota, cuenta_idcuenta, duracion, entrega, responsable_idresponsable) values (?,?,?,?,?)";
    let params = [mascota_idmascota, cuenta_idcuenta, duracion, entrega, responsable_idresponsable];

    conn.query(sql, params, (err, result) => {
        if (err) {
            res.json({msg: 'Error en los datos del servicio a registrar'});
            console.error(err);
        } else {
            conn.query("select * from servicio where idservicio = ?", [result.insertId], (e, r) => {
                if (e) {
                    res.json({msg: 'No se pudo obtener el servicio creada'});
                    console.error(err);
                } else {
                    res.json(r)
                }
            })
        }
    })
})


/* Pregunta d) */
// get--> obtener todas las cuentas o una en específico
app.get('/cuenta/get/:id?', function (req, res) {
    let cuentaid = req.params.id;
    if (cuentaid === undefined) {
        let sql = 'SELECT * FROM cuenta';
        conn.query(sql, params, function (err, results) {
            if (err) {
                res.json({msg: 'No se pudo obtener las cuentas'});
                console.error(err);
            } else {
                if (results.length !== 0) res.json(results);
                else res.json({msg: 'No se encontraron resultados'})
            }
        });
    } else {
        let sql1 = 'SELECT * FROM cuenta WHERE idcuenta = ?';
        let params = [cuentaid];
        conn.query(sql1, params, function (err, results) {
            if (err) {
                res.json({msg: 'No se pudo obtener la cuenta'});
                console.error(err);
            } else {
                if (results.length !== 0) res.json(results);
                else res.json({msg: 'No se encontraron resultados'})
            }
        });
    }
});

/* Server */
app.listen(3000, () => {
    console.log("Servidor escuchando en puerto: 3000")
})












