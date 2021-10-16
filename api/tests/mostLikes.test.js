const blogs = require('../utils/list_helper').blogs
const mostLikes = require('../utils/list_helper').mostLikes

describe('author with most likes', () => {
    test('of blogs list', () => {
        const result = mostLikes(blogs)
        expect(result).toEqual({
            author: 'Edsger W. Dijkstra',
            likes: 17
        })
    })
})
