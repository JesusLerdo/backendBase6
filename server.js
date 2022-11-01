const express = require('express')
const messagesRouter = require('./routes/messages')
const usuariosRouter = require('./routes/usuarios')
const cors = require('cors')

class Server {
   constructor() {
    this.app = express()
    this.port = process.env.PORT
    this.paths = {
        messages:"/api/v1/messages",
        usuarios: "/api/v1/usuarios"

    }

    this.routes()
    this.middlewares()
   }

   routes(){ 
    //this.app.get('/', (req, res)=> {
        //res.send('Mensaje recibido')
     //})  //End Point 
     this.app.use(this.paths.messages, messagesRouter)
     this.app.use(this.paths.usuarios, usuariosRouter)
   }

   middlewares(){
    this.app.use(cors()) //habilita origen cruzaado
    this.app.use(express.json())
   }

   listen(){
    this.app.listen(this.port, () => {
        console.log('servidor corriendo en el puerto', process.env.PORT)
    })
   }
}
module.exports=Server