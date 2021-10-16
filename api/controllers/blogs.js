const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const tokenExtractor = require('../utils/middleware').tokenExtractor

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', tokenExtractor, async (request, response, next) => {
    try {
        const { user: userId } = request
        const user = await User.findById(userId)

        const blog = new Blog({
            title: request.body.title,
            author: request.body.author,
            url: request.body.url,
            likes: request.body.likes || 0,
            user: user._id
        })

        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.json(savedBlog)
    } catch (error) {
        next(error)
    }
})

blogsRouter.delete('/:id', tokenExtractor, async (request, response, next) => {
    try {
        const { user: userId } = request
        const user = await User.findById(userId)
        const blog = await Blog.findById(request.params.id)

        if (user._id.toString() !== blog.user.toString()) {
            return response.status(401).json({ error: 'you can´t modify this blog' })
        }

        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } catch (error) {
        next(error)
    }
})

blogsRouter.put('/:id', tokenExtractor, async (request, response, next) => {
    try {
        const blog = {
            title: request.body.title,
            author: request.body.author,
            url: request.body.url,
            likes: request.body.likes || 0
        }

        await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
        response.json(blog)
    } catch (error) {
        next(error)
    }
})

module.exports = blogsRouter
