const Blog = require('../models/blog')
const User = require('../models/user')

const blogsInDB = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog)
}

const usersInDB = async () => {
    const users = await User.find({})
    return users.map(user => user)
}
const initialBlogs = async () => {
    const users = await usersInDB()
    const blogs = [
        {
            title: 'First blog',
            author: 'Britney',
            url: 'sdfmdlskfsdlf',
            likes: 100,
            user: users[0]._id
        },
        {
            title: 'Second blog',
            author: 'Brad',
            url: 'ldjgreu',
            likes: 100,
            user: users[0]._id
        }
    ]
    return blogs
}

module.exports = { initialBlogs, blogsInDB, usersInDB }
