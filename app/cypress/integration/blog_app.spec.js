describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'user',
      username: 'user',
      password: 'password'
    }

    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('Blogs')
    cy.contains('Log in to application')
    cy.contains('Login')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('input[name="Username"]').type('user')
      cy.get('input[name="Password"]').type('password')
      cy.get('.login-btn').click()
      cy.contains('Log out')
      cy.contains('New blog')
    })
    it('fails with wrong credentials', function () {
      cy.get('input[name="Username"]').type('user')
      cy.get('input[name="Password"]').type('wrongpassword')
      cy.get('.login-btn').click()
      cy.get('.error')
        .should('contain', 'Wrong username o password')
        .and('have.css', 'background-color', 'rgb(221, 80, 68)')
    })
  })
  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'user', password: 'password' })
    })

    it('A blog can be created', function () {
      cy.contains('New blog').click()
      cy.get('input[name="title"]').type('New blog from Cypress')
      cy.get('input[name="author"]').type('myauthor')
      cy.get('input[name="url"]').type('myurl')
      cy.get('.create-btn').click()
      cy.contains('New blog from Cypress')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'Second blog from Cypress',
          author: 'my user',
          url: 'http://www.newbcypress.com'
        })
      })
      it('it can be liked by a user', function () {
        cy.get('.viewButton').click()
        cy.contains('Likes: 0')
        cy.get('.likeButton').click()
        cy.contains('Likes: 1')
      })
      it('it can be deleted by the user who create it', function () {
        cy.get('.viewButton').click()
        cy.get('.removeButton').click()
        cy.get('.removeNotification').should('contain', 'removed')
        cy.get('.bloglist').should('not.contain', 'Second blog from Cypress')
      })
      it('it can´t be deleted by other users', function () {
        cy.get('.logout-btn').click()
        cy.request('POST', 'http://localhost:3003/api/users/', {
          name: 'other',
          username: 'otheruser',
          password: 'otherpassword'
        })
        cy.login({ username: 'otheruser', password: 'otherpassword' })
        cy.get('.viewButton').click()
        cy.get('.removeButton').should('not.exist')
      })
      it('blogs ar in order depending on the likes', function () {
        cy.createBlog({
          title: 'Third blog from Cypress',
          author: 'my user',
          url: 'http://www.newbcypress.com'
        })
        cy.createBlog({
          title: 'Fourth blog from Cypress',
          author: 'my user',
          url: 'http://www.newbcypress.com'
        })
        cy.get('.viewButton:first').click()
        cy.get('.likeButton').click()
        cy.get('.hideButton').click()
        cy.get('.viewButton:last').click()
        cy.get('.likeButton').click()
        cy.get('.likeButton').click()
        cy.visit('http://localhost:3000')
        cy.get('.viewButton:first').click()
        cy.contains('Likes: 2')
        cy.get('.hideButton').click()
        cy.get('.viewButton:last').click()
        cy.contains('Likes: 0')
      })
    })
  })
})
