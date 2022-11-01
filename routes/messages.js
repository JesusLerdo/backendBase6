//http://localhost:4000//api/v1/messages/
//http://localhost:4000/api/v1/messages/hi
//http://localhost:4000/api/v1/messages/bye
const {Router} = require('express')
const router = Router()
const { rootMessage, hiMessage, byeMessage,
postMessage, putMessage, deleteMessage } = require('../controllers/messages')

router.get('/', rootMessage) //End point

router.get('/hi/:name/:edad', hiMessage) //End point

router.get('/bye', byeMessage) //End point

router.post('/', postMessage) // Crear o Añadir
router.put('/', putMessage) // Actualizar registro
router.delete('/', deleteMessage) // Eliminar registro

module.exports = router