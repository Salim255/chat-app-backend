const request = require('supertest')
const buildAPP = require('../../app')
const Context = require('../context')
const userData = require('../../utils/userData')
const userController = require('../../controllers/userController')
const postController = require('../../controllers/postController')
const commentController = require('../../controllers/commentController')

let context
beforeAll(async () => {
  context = await Context.build()
})

afterAll(async () => {
  return await context.close()
})

let token

describe('Comment test handler', () => {
  it('User sign up', async () => {
    const startCount = await userController.counter()
    await request(buildAPP())
      .post('/api/v1/users/signup/createUser')
      .send(userData.userData1)
      .expect(200)
      .then(response => {
        token = response.body.data.token
      })
    const finishCount = await userController.counter()
    expect(finishCount - startCount).toEqual(1)
  })

  it('Create a post ', async () => {
    const starCount = await postController.counter()
    await request(buildAPP())
      .post('/api/v1/posts')
      .send({ userId: 1, message: 'Hello world' })
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    const endCount = await postController.counter()
    expect(endCount - starCount).toEqual(1)
  })

  it('Leave a comment on a post ', async () => {
    const starCount = await commentController.counter()
    await request(buildAPP())
      .post('/api/v1/comments')
      .send({ userId: 1, content: 'All is good to go!', postId: 1 })
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    const endCount = await commentController.counter()
    expect(endCount - starCount).toEqual(1)
  })

  it('Update comment', async () => {
    let comment = 'All is good to go!'
    await request(buildAPP())
      .put('/api/v1/comments/1')
      .send({ content: 'What do you think!' })
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(res => {
        comment = res.body.data.content
      })
    expect(comment === 'What do you think!')
  })

  it('Delete comment', async () => {
    const starCount = await commentController.counter()

    await request(buildAPP())
      .delete('/api/v1/comments/1')
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const endCount = await commentController.counter()

    expect(endCount - starCount).toEqual(-1)
  })
})
