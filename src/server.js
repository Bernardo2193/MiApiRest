const express = require("express");
const dotenv = require ("dotenv")

const {findAll, findOneById, create, update, destroy} = require("./database/data.manager.js");

dotenv.config();

const server = express();

   server.use(express.json());
   server.use(express.urlencoded({ extended: true } ) );


//Obtener todos los items

server.get('/inventario', (req, res) => {
    findAll()
    .then((items) =>res.status(200) .send(items)) 
        .catch((error) => res.status(400).send(error.message)) ;
    

} );

//Obtener informacion de un item especifico

server.get('/inventario/:id', (req,res) => {

    const { id } = req.params;

    findOneById(Number(id))
        .then((item) => res.status(200).send(item))
        .catch((error) => res.status(400).send(error.message));
  
});


//Crear un nuevo item
server.post('/inventario', (req, res) => {

    const { categoria, tipoDeItem , precio , disponible } = req.body;
    create({ categoria, tipoDeItem, precio, disponible })

        .then((item) => res.status(201).send(item))
        .catch((error) => res.status(400).send(error.message));

});

//Actualizar un item en especifico
server.put('/inventario/:id', (req, res) => {
    const { id } = req.params;
    const { categoria, tipoDeItem, precio, disponible } = req.body;

    update({ id: Number(id), categoria, tipoDeItem, precio, disponible })
        .then((item) => res.status(200).send(item))
        .catch((error) => res.status(400).send(error.message));
});

//Elimina un item en especifico

server.delete('/inventario/:id', (req, res) => {
    const { id } = req.params;

    destroy(Number(id))
        .then((item) => res.status(200).send(item))
        .catch((error) => res.status(400).send(error.message));

});

server.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
    console.log(`Ejecutandose en http://${process.env.SERVER_HOST}:${ process.env.SERVER_PORT }/inventario`);
});