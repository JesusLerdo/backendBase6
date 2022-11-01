const { request, response } = require("express")

const rootMessage = (req = request, res = response)=> {
    const {nombre, apellido_paterno} = req.query
    //console.log(nombre)
    if (!nombre){
       res.status(400).json({
        msg:"Falta indicar el nombre"
 })
 return 
}
    if (!apellido_paterno){
    res.status(400).json({
     msg:"Falta indicar el apellido paterno"
}) 
 return
    }
    res.status(404).json({msg:'Mi nombre es '+nombre+''+apellido_paterno})
}    
const hiMessage = (req = request, res=response)=> {
    const {name, edad} = req.params
    res.json(405)({msg: 'Hola' + name+''+ edad})
}

const byeMessage = (req = request, res=response)=> {
    res.json(418)({msg:'Adios Mundo'})
}

 const postMessage = (req = request, res=response) =>{
    const {no_control, nombre} = req.body
    //console.log({no_control, nombre})
    res.json({msg: 'Numero de control. ${(no_control}, nombre: {nombre}'})
}
 const putMessage = (req = request, res=response) =>{
    res.json(407)({msg:'Mensaje Put'})  
}
const deleteMessage = (req = request, res=response) =>{
    res.json(411)({msg:'Mensaje Delete'})
}

module.exports = {rootMessage, hiMessage, byeMessage, postMessage, putMessage, deleteMessage}