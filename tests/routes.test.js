const request = require('supertest')
const app = require('../app.js')
const mongoose = require('mongoose')
const databaseName = 'projectsTestDatabase'
const Project = require('../models/project')
const User = require('../models/user')
const faker = require('faker')

beforeAll(async () => {
    const MONGODB_URI = `mongodb://127.0.0.1/${databaseName}`
    await mongoose.connect(MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })

    const users = [...Array(25)].map(user => (
        {
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName(),
            email: faker.internet.email()
        }
    ))
    const createdUsers = await User.insertMany(users)
    console.log('Created users!')
    
    const projects = [...Array(100)].map(item => {
        const user = createdUsers[Math.floor(Math.random() * 25)]
        return {
            title: faker.lorem.sentence(),
            image_url: faker.internet.url(),
            description: faker.lorem.paragraph(),
            github_url: faker.internet.url(),
            deployed_url: faker.internet.url(),
            user_id: user._id
        }
    })
    await Project.insertMany(projects)
    console.log('Created projects!')
})

let project, user

describe('Projects API', () => {
    it('should show all users', async done => {
        const res = await request(app).get('/api/users')
        expect(res.statusCode).toEqual(200)
        user = res.body[0]
        expect(res.body[0]).toHaveProperty('_id')
        done()
    }),
    it('should show all projects', async done => {
        const res = await request(app).get(`/api/users/${user._id}/projects`)
        expect(res.statusCode).toEqual(200)
        expect(res.body[0]).toHaveProperty('_id')
        done()
    }),
    it('should create a new project', async done => {
        const res = await request(app)
            .post(`/api/users/${user._id}/projects`)
            .send({
                title: 'Test Project',
                image_url: 'http://www.testing.com',
                description: 'http://www.testing.com',
                github_url: 'http://www.testing.com',
                deployed_url: 'http://www.testing.com',
                user_id: user._id
            })
        expect(res.statusCode).toEqual(201)
        expect(res.body).toHaveProperty('_id')
        project = res.body._id
        done()
    }),
    it('should show a project', async done => {
        const res = await request(app).get(`/api/projects/${project}`)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('_id')
        done()
    }),
    it('should update a project', async done => {
        const res = await request(app)
            .put(`/api/projects/${project}`)
            .send({
                title: 'Update Test Project',
                image_url: 'http://www.testing.com',
                description: 'http://www.testing.com',
                github_url: 'http://www.testing.com',
                deployed_url: 'http://www.testing.com',
                user_id: user._id
            })
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('_id')
        done()
    }),
    it('should delete a project', async done => {
        const res = await request(app).del(`/api/projects/${project}`)
        expect(res.statusCode).toEqual(200)
        expect(res.text).toEqual("Project deleted")
        done()
    })
})

afterAll(async () => {
    await mongoose.connection.db.dropDatabase()
    await mongoose.connection.close()
})