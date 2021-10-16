const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const initialBlogs = require('./testsAPI_helper').initialBlogs
const blogsInDB = require('./testsAPI_helper').blogsInDB

beforeEach(async () => {
    const initBlogs = await initialBlogs()
    await Blog.deleteMany({})
    let BlogObj = new Blog(initBlogs[0])
    await BlogObj.save()
    BlogObj = new Blog(initBlogs[1])
    await BlogObj.save()
})

test('blogs are returned as json', async () => {
    const initBlogs = await initialBlogs()
    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(initBlogs.length)
})

test('blogs have id property', async () => {
    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    expect(response.body[0].id).toBeDefined()
})

describe('addition of a new blog', () => {
    test('create it with valid data', async () => {
        const initBlogs = await initialBlogs()
        let loginToken = ''
        const response = await api
            .post('/api/login/')
            .send({
                username: 'root',
                password: 'secret'
            })
        loginToken = response.body.token
        const newBlog = {
            title: 'Post blog',
            author: 'Maxi',
            url: 'doifsdf',
            likes: 370
        }
        await api
            .post('/api/blogs')
            .set({ Authorization: 'Bearer ' + loginToken })
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await blogsInDB()
        expect(blogsAtEnd).toHaveLength(initBlogs.length + 1)
        const contents = blogsAtEnd.map(b => b.title)
        expect(contents).toContain('Post blog')
    })
    test('fails with status code 401 if there is not a token', async () => {
        const newBlog = {
            title: 'Post blog',
            author: 'Maxi',
            url: 'doifsdf',
            likes: 370
        }
        await api
            .post('/api/blogs')
            .set({ Authorization: null })
            .send(newBlog)
            .expect(401)
    })

    test('blog without likes it means it have 0 likes', async () => {
        const initBlogs = await initialBlogs()
        let loginToken = ''
        const response = await api
            .post('/api/login/')
            .send({
                username: 'root',
                password: 'secret'
            })
        loginToken = response.body.token
        const newBlog = {
            title: 'No likes blog',
            author: 'Toni',
            url: 'protiren'
        }
        await api
            .post('/api/blogs')
            .set({ Authorization: 'Bearer ' + loginToken })
            .send(newBlog)
            .expect(200)
        const blogsAtEnd = await blogsInDB()
        expect(blogsAtEnd).toHaveLength(initBlogs.length + 1)
    })
    test('fails with status code 400 if data invaild', async () => {
        const initBlogs = await initialBlogs()

        let loginToken = ''
        const response = await api
            .post('/api/login/')
            .send({
                username: 'root',
                password: 'secret'
            })
        loginToken = response.body.token
        const newBlog = {
            author: 'Peter'
        }
        await api
            .post('/api/blogs')
            .set({ Authorization: 'Bearer ' + loginToken })
            .send(newBlog)
            .expect(409)
        const blogsAtEnd = await blogsInDB()
        expect(blogsAtEnd).toHaveLength(initBlogs.length)
    })
})
describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const initBlogs = await initialBlogs()

        let loginToken = ''
        const response = await api
            .post('/api/login/')
            .send({
                username: 'root',
                password: 'secret'
            })
        loginToken = response.body.token
        const blogsAtStart = await blogsInDB()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set({ Authorization: 'Bearer ' + loginToken })
            .expect(204)

        const blogsAtEnd = await blogsInDB()
        expect(blogsAtEnd).toHaveLength(initBlogs.length - 1)

        const contents = blogsAtEnd.map(b => b.title)
        expect(contents).not.toContain(blogToDelete.title)
    })
})

describe('updating a blog', () => {
    test('succeeds with status code 200 if id is valid', async () => {
        const initBlogs = await initialBlogs()

        let loginToken = ''
        const response = await api
            .post('/api/login/')
            .send({
                username: 'root',
                password: 'secret'
            })
        loginToken = response.body.token
        const blogsAtStart = await blogsInDB()
        const blogToUpdate = blogsAtStart[0]
        const updatedBlog = {
            title: blogToUpdate.title,
            url: blogToUpdate.url,
            likes: blogToUpdate.likes + 1
        }

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .set({ Authorization: 'Bearer ' + loginToken })
            .send(updatedBlog)
            .expect(200)

        const blogsAtEnd = await blogsInDB()
        expect(blogsAtEnd).toHaveLength(initBlogs.length)

        const likes = blogsAtEnd.map(b => b.likes)
        expect(likes[0]).toBe(updatedBlog.likes)
    })
})

afterAll(() => {
    mongoose.connection.close()
})
