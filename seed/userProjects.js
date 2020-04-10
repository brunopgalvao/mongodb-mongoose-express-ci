const db = require('../db')
const Project = require('../models/project')
const User = require('../models/user')
const faker = require('faker')

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

const main = async () => {
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
}



const run = async () => {
    await main()
    db.close()
}

run()