const _ = require('lodash')

const blogs = [
    {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    },
    {
        _id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
        __v: 0
    },
    {
        _id: '5a422b891b54a676234d17fa',
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
        __v: 0
    },
    {
        _id: '5a422ba71b54a676234d17fb',
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
        __v: 0
    },
    {
        _id: '5a422bc61b54a676234d17fc',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 3,
        __v: 0
    }
]

const dummy = (blogs) => 1

const totalLikes = blogs => {
    const total = (sum, blog) => sum + blog.likes
    return blogs.reduce(total, 0)
}

const favoriteBlog = blogs => {
    const favorite = blogs.reduce(function (prev, current) {
        return (prev.likes > current.likes) ? prev : current
    })
    return favorite
}

const mostBlogs = blogs => {
    const result = []
    const authors = _.groupBy(blogs, 'author')
    const articles = Array.from(Object.keys(authors))
    articles.map(name => {
        const authorObj = {}
        let quantity = 0
        const number = blogs.map((b) => {
            if (b.author === name) { quantity += 1 }
            return quantity
        })
        authorObj.author = name
        authorObj.blogs = number[number.length - 1]
        result.push(authorObj)
        return result
    })
    let maxAuthor = {}
    const blogsArray = result.map(author => author.blogs)
    const maxBlogs = Math.max(...blogsArray)
    maxAuthor = result.filter(author => author.blogs === maxBlogs)[0]
    return maxAuthor
}

const mostLikes = blogs => {
    const result = []
    const authors = _.groupBy(blogs, 'author')
    const articles = Array.from(Object.keys(authors))
    articles.map(name => {
        const authorObj = {}
        let quantity = 0
        const number = blogs.map((b) => {
            if (b.author === name) { quantity += Number(b.likes) }
            return quantity
        })
        authorObj.author = name
        authorObj.likes = number[number.length - 1]
        result.push(authorObj)
        return result
    })
    let maxLikesWithAutor = {}
    const likes = result.map(author => (author.likes))
    const maxLikes = (Math.max(...likes))
    maxLikesWithAutor = result.filter(author => author.likes === maxLikes)[0]
    return maxLikesWithAutor
}

module.exports = { blogs, dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
