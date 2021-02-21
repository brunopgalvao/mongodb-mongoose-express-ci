const { Router } = require('express')
const controllers = require('../controllers')
const router = Router()

router.get('/', (req, res) => res.send('This is root!'))

router.post('/users', controllers.createUser)
router.get('/users', controllers.getAllUsers)
router.put('/users/:id', controllers.updateUser)
router.delete('/users/:id', controllers.deleteUser)

router.get('/users/:user_id/projects/:item_id', controllers.getProjectByUserId)
router.get('/users/:user_id/projects', controllers.getProjectsFromUser)
router.get('/users/:id/projects', controllers.getProjectsFromUser)
router.post('/users/:user_id/projects', controllers.createProject)
router.get('/projects/:id', controllers.getProject)
router.put('/projects/:id', controllers.updateProject)
router.delete('/projects/:id', controllers.deleteProject)

module.exports = router