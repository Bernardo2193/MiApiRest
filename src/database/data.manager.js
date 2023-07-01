const { error } = require("console");
const fs = require("fs");
const path = require("path");
const ruta = path.join(__dirname, "data.json");
const { isAsyncFunction } = require("util/types");


//Funcion de escritura
function escribir(contenido) {
    return new Promise((resolve, reject) =>{
        
        fs.writeFile(ruta, JSON.stringify(contenido, null, "\t"),  "utf8", (error) => {
            if (error) reject(new Error("Error.No se pudo escribir"));

            resolve(true);
        });
    
    });
}
//Funcion de Lectura
function leer() {
    return new Promise((resolve, reject) => {
        fs.readFile( ruta, "utf8", (error, result) => {
            if (error) reject(new Error("Error.No se pudo leer"));

            resolve(JSON.parse(result));
        });

    });
}

function generalId(items) {
    let mayorId = 0;

    items.forEach((item) => {
        if (item.id > mayorId) {
            mayorId = item.id;
        }  
    });

    return mayorId + 1;
}
//Me devuelve todo los items
async function findAll() {
    const items = await leer ();
    return items;
}

//Me devuelve un item especifico
async function findOneById(id) {
    if (!id) throw new Error("Error.Id undefined");
    const items = await leer();
    const item = items.find((elemento) => elemento.id === id);
    if (!item) throw new Error ("Error. El id no corresponde a un item del inventario");
    return item;
}
	
//Me crea un nuevo item
async function create(item) {

    if ( !item.categoria || !item.tipoDeItem || !item.precio || !item.disponible) throw new Error("Error. datos incompletos");
   
    const items = await leer();
    const itemConId = { id: generalId(items), ...item };
    items.push(itemConId);
    await escribir(items);

    return itemConId;


}

//Me  actualiza un item
async function update(item) {


    if (!item.categoria || !item.tipoDeItem || !item.precio || !item.disponible) throw new Error("Error. datos incompletos");

    const items = await leer();
    const indice = items.findIndex((elemento) => elemento.id === item.id); 


    if (indice === -1) throw new Error ("Error. El id no corresponde a algo dentro del inventario");

    items[indice] = item;
    await escribir (items);
    return item;

}

//Me  elimina un item
async function destroy(id) {
     
        if (!id) throw new Error("Error.Id undefined");

    const items = await leer();
    const item = items.find((elemento) => elemento.id === id);
    const indice = items.findIndex((elemento) => elemento.id === id);

    if (!item) throw new Error("Error. El id no corresponde a algo dentro del inventario");
    

   items.splice(indice,  1);
    await escribir(items); 

    return item;

}


module.exports = { findAll, findOneById, create, update, destroy};