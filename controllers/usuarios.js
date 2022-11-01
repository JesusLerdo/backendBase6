const{reques, response, request} = require("express")
const bcryptjs = require("bcryptjs")
const pool = require("../db/connection")

const getUsers = async (req = reques, res = response) => {
    let conn
    try{
        conn = await pool.getConnection() //realizamos la conexion
        
        //generamos la consulta
        const users = await conn.query("SELECT * FROM Usuarios", (error) => {if (error) throw error})

        if(!users){ // En caso de no haber registros lo informamos
            res.status(404).json({msg: "NO existen usuarios registrados"})
            return
        }
        res.json({users})
    }catch (error){

        console.log(error)
        res.status(500).json({msg: error}) //informamos del error
    } finally{
        if (conn) conn.end() //termina la conexion

    }
}


const getUserByID = async (req = request, res = response) =>{
    const {id} = req.params
    let conn
    try{
        conn = await pool.getConnection() //realizamos la conexion
        
        //generamos la consulta
        const [user] = await conn.query(`SELECT * FROM Usuarios WHERE ID = ${id}`, (error) => {if (error) throw error})
        console.log(user)

        if(!user){ // En caso de no haber registros lo informamos
            res.status(404).json({msg: `NO existen usuarios registrados con el ID ${id}`})
            return
        }
        res.json({user})
    }catch (error){

        console.log(error)
        res.status(500).json({msg: error}) //informamos del error
    } finally{
        if (conn) conn.end() //termina la conexion

    }
}


const deleteUserByID = async (req = request, res = response) =>{
        const {id} = req.params
        let conn
        try{
            conn = await pool.getConnection() //realizamos la conexion
            
            //generamos la consulta
            const result = await conn.query(`UPDATE Usuarios SET Activo = 'N' WHERE ID = ${id}`, (error) => {if (error) throw error})
            console.log(result.affectedRows)

            if(result.affectedRows === 0){ // En caso de no haber registros lo informamos
                res.status(404).json({msg: `NO existen usuario registrados con el ID ${id}`})
                return
            }

            res.json({msg:`Se elemino el usuario con el ID ${id}`})
        }catch (error){
    
            console.log(error)
            res.status(500).json({msg: error}) //informamos del error
        } finally{
            if (conn) conn.end() //termina la conexion
    
        }
}


const addUser = async (req = request, res = response) => {
    const { Nombre,
        Apellidos, 
        Edad, 
        Genero = '', 
        Usuario, 
        Contrasena, 
        Fecha_Nacimiento = '1990-01-01', 
        Activo
    } = req.body//URI params

    if(
        !Nombre || 
        !Apellidos || 
        !Edad ||
        !Usuario || 
        !Contrasena || 
        !Activo)
        
        {
        res.status(400).json({msg: "Faltan Datos"})
        return
    }
    const salt = bcryptjs.genSaltSync()
    const ContraseñaCifrada =  bcryptjs.hashSync(Contrasena, salt)

    let conn;

    try {
        
        conn = await pool.getConnection()//Realizamos la conexión
        
         //generamos la consulta
        const [userExist] = await conn.query(`SELECT Usuario FROM Usuarios WHERE Usuario = '${Usuario}'`)
        
        if(userExist){
            res.status(400).json({msg: `El usuario '${Usuario}' ya se encuentra registrado`})
            return
        }

                    //generamos la consulta
                    const result = await conn.query(`INSERT INTO Usuarios(
                        Nombre, 
                        Apellidos, 
                        Edad, 
                        Genero, 
                        Usuario, 
                        Contraseña, 
                        Fecha_Nacimiento, Active) VALUES (
                        '${Nombre}', 
                        '${Apellidos}', 
                         ${Edad}, 
                        '${Genero}', 
                        '${Usuario}', 
                        '${ContraseñaCifrada}', 
                        '${Fecha_Nacimiento}', 
                        '${Activo}'
                        )`, (error) => {if(error) throw error})

        if (result.affectedRows === 0) {   //En caso de no haber resgistros lo informamos
            res.status(404).json({msg: `No se pudo agregar el usuarios con el Nombre ${Nombre}`})
            return
        }
                    
            res.json({msg:`Se agregó satisfactoriamente el usuario con Nombre ${Nombre}`}) //Se manda la lista de usuarios
        }
   
        catch (error) {
        console.log(error)
        res.status(500).json({msg: error})//informamos el error
    }
    finally{
        if (conn) conn.end()//Termina la conexión
    }

}

const updateUserByUsuario = async (req = request, res = response) => {
    const {Nombre, 
           Apellidos, 
           Edad, 
           Genero, 
           Usuario, 
           Fecha_Nacimiento = '1900-01-01'
        } = req.body//URI params

    if(
       !Nombre || 
       !Apellidos || 
       !Edad || 
       !Usuario
      
       ) {
        res.status(400).json({msg: "Faltan Datos"})
        return
    }
    

    let conn;

    try {

        conn = await pool.getConnection()//Realizamos la conexión
        const [userExit]=await conn.query(`SELECT Usuario FROM Usuarios WHERE Usuario = '${Usuario}'`)
        
        if (!userExit) {
            res.status(400).json({msg: `El Usuario '${Usuario} no se encuentra registrado`})
            return
        }

                    //generamos la consulta
                    const result = await conn.query(`UPDATE Usuarios SET
                         Nombre='${Nombre}',
                         Apellidos='${Apellidos}', 
                         Edad=${Edad}, 
                         ${Genero? `Genero='${Genero}',`:''} 
                         Fecha_Nacimiento= '${Fecha_Nacimiento}'
                        WHERE Usuario='${Usuario}'
                         `, (error) => {if(error) throw error})

                    if (result.affectedRows === 0) {//En caso de no haber registrado la informacion
                    res.status(404).json({msg: `No se pudo actualisar el usuario`})
                    return
                    }
                    
                    res.json({msg:`Se agregó satisfactoriamente el usuarios`})
                    //Se manda la lista de usuarios
                }

    catch (error){
        console.log(error)
        res.status(500).json({msg: error})//informamos el error
    }
    finally{
        if (conn) conn.end()//Termina la conexión
    }}


    const signIn = async (req = request, res = response) =>{
        const {Usuario, Contraseña} = req.body //UEI Params

        if(!Usuario || !Contraseña){
            res.status(400).json({msg: "Faltan Datos."})
            return
        }
        let conn
        try{
            conn = await pool.getConnection() //realizamos la conexion
            
            //generamos la consulta
            const [user] = await conn.query(`Select Contraseña, Activo From Usuarios Where Usuario = '${Usuario}'`, (error) => {if (error) throw error})

            if(!user || user.Activo == 'N'){ // En caso de no haber registros lo informamos
                res.status(403).json({msg: `El usuario o contraseña que ingreso no son validos`})
                return
            }

            const contraseñaValida = bcryptjs.compareSync(user.Contraseña, user.Contraseña)

            if(!contraseñaValida){
                res.status(403).json({msg: `El usuario o contraseña que ingreso no son validos`})
                return
            }

            res.json({msg:`El usuario se ha identificado correctamente`})
        }catch (error){
    
            console.log(error)
            res.status(500).json({msg: error}) //informamos del error
        } finally{
            if (conn) conn.end() //termina la conexion
    
        }
}



module.exports = {getUsers, getUserByID, deleteUserByID, addUser, updateUserByUsuario, signIn }