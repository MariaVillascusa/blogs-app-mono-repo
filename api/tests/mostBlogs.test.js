const blogs = require('../utils/list_helper').blogs
const mostBlogs = require('../utils/list_helper').mostBlogs

describe('author with most blogs', () => {
    test('of blogs list', () => {
        const result = mostBlogs(blogs)
        expect(result).toEqual({
            author: 'Robert C. Martin',
            blogs: 3
        })
    })
})
