const db = require('../db')
const User = require('../models/user')
const Project = require('../models/project')

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

const createUser = async (req, res) => {
    try {
        const user = await new User(req.body)
        await user.save()
        return res.status(201).json(user)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).send(error.message)
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndUpdate(id, req.body, { new: true }, (err, user) => {
            if (err) {
                res.status(500).send(err);
            }
            if (!user) {
                res.status(500).send('User not found!');
            }
            return res.status(200).json(user);
        })
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await User.findByIdAndDelete(id)
        if (deleted) {
            return res.status(200).send("User deleted");
        }
        throw new Error("User not found");
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

const getProjectsFromUser = async (req, res) => {
    try {
        const { user_id } = req.params
        const projects = await Project.find({ user_id: user_id })
        if (projects) {
            return res.status(200).json(projects)
        }
        return res.status(404).send('User with the specified ID does not exist')
    } catch (error) {
        return res.status(500).send(error.message)
    }
}

const getProjectByUserId = async (req, res) => {
    try {
        const { user_id, project_id } = req.params
        const project = await Project.findOne({ user_id: user_id, _id: project_id })
        if (project) {
            return res.status(200).json(project)
        }
        return res.status(404).send('Project with the specified ID does not exist')
    } catch (error) {
        return res.status(500).send(error.message)
    }
}

const createProject = async (req, res) => {
    try {
        const user = await User.findById(req.params.user_id)
        const project = await new Project(req.body)
        project.user_id = user._id
        await project.save()
        return res.status(201).json(project)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}
const getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
        res.send(project)
    } catch (error) {
        return res.status(500).send(error.message)
    }
}

const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        await Project.findByIdAndUpdate(id, req.body, { new: true }, (err, project) => {
            if (err) {
                res.status(500).send(err);
            }
            if (!project) {
                res.status(500).send('Project not found!');
            }
            return res.status(200).json(project)
        })
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Project.findByIdAndDelete(id)
        if (deleted) {
            return res.status(200).send("Project deleted");
        }
        throw new Error("Project not found");
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

module.exports = {
    createUser,
    getAllUsers,
    getProject,
    updateUser,
    deleteUser,
    getProjectsFromUser,
    getProjectByUserId,
    createProject,
    updateProject,
    deleteProject
}