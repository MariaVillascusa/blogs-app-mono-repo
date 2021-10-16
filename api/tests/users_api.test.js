const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')
const usersInDB = require('./testsAPI_helper').usersInDB

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('secret', 10)
        const user = new User({ username: 'root', passwordHash })
        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await usersInDB()

        const newUser = {
            username: 'dev0',
            name: 'Charlie Alcant',
            password: 'pass1234'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await usersInDB()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })
    test('creation fails with status code 400 if there is not username', async () => {
        const usersAtStart = await usersInDB()

        const newUser = {
            name: 'Aaron Peeps',
            password: 'password'
        }
        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(409)
        expect(result.body.error).toContain('`username` is required')
        const usersAtEnd = await usersInDB()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
    test('creation fails with status code 400 if there is not password', async () => {
        const usersAtStart = await usersInDB()

        const newUser = {
            username: 'jkeen',
            name: 'John Keen'
        }
        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(409)
        expect(result.body.error).toContain('password is required')
        const usersAtEnd = await usersInDB()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).not.toContain(newUser.username)
    })
    test('creation fails with status code 400 if there is a duplicated username', async () => {
        const usersAtStart = await usersInDB()

        const newUser = {
            username: 'root',
            name: 'Matt Murdock',
            password: 'password'
        }
        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(409)
        expect(result.body.error).toContain('`username` to be unique')
        const usersAtEnd = await usersInDB()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })
    test('creation fails with status code 400 if username is shorter than the minimum allowed length (3)', async () => {
        const usersAtStart = await usersInDB()

        const newUser = {
            username: 'ba',
            name: 'barbara thompson',
            password: 'pass123456'
        }
        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(409)
        expect(result.body.error).toContain('is shorter than the minimum allowed length (3)')
        const usersAtEnd = await usersInDB()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).not.toContain(newUser.username)
    })
    test('creation fails with status code 400 if password is shorter than the minimum allowed length (3)', async () => {
        const usersAtStart = await usersInDB()

        const newUser = {
            username: 'clarance',
            name: 'claire sandford',
            password: 'pa'
        }
        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(409)
        expect(result.body.error).toContain('password must be at least 3 characters')
        const usersAtEnd = await usersInDB()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).not.toContain(newUser.username)
    })
})

afterAll(() => {
    mongoose.connection.close()
})
