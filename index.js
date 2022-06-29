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

/* Pregunta b) */
// Content-Type: application/json
// Response -> mascota creada

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
            console.log('Error en los datos de la mascota a registrar');
            throw err;
        } else {
            // Devuelve la mascota creada
            conn.query('select * from mascota where idmascota = ?',
                [result.insertId], (e, r) => {
                    if (e) {
                        console.log('No se pudo obtener la mascota creada');
                        throw e;
                    } else {
                        res.json(r);
                    }
                })
        }
    })
})




/* Pregunta d) */
// get--> obtener una cuenta expecifico
app.get('/cuenta/get/:id',function(req,res){
    let cuentaid=req.params.id;
    if(cuentaid=''){
        let sql = 'SELECT * FROM cuenta';
        conn.query(sql,params,function(err,results){
            if (err) {
                console.log('No se pudo obtener las cuentas');
                throw err;
            } else {
                res.json(results);
            }
        });
    }else{
        let sql1 = 'SELECT * FROM cuenta WHERE idcuenta=?';
        let params = [cuentaid];
        conn.query(sql1,params,function(err,results){
            if (err) {
                console.log('No se pudo obtener la cuenta');
                throw err;
            } else {
                res.json(results);
            }
        });
    }

});


/* Server */
app.listen(3000, () => {
    console.log("Servidor escuchando en puerto: 3000")
})