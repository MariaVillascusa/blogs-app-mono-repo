const blogs = require('../utils/list_helper').blogs
const favoriteBlog = require('../utils/list_helper').favoriteBlog

describe('favourite blog ', () => {
    test('of blog list', () => {
        const result = favoriteBlog(blogs)
        expect(result).toEqual(blogs[2])
    })
})
