const request = require('supertest')
const buildAPP = require('../../app')
const Context = require('../context')

const userController = require('../../controllers/userController')
const postController = require('../../controllers/postController')

let context
beforeAll(async () => {
  context = await Context.build()
})

afterAll(async () => {
  return await context.close()
})

const userData = {
  first_name: 'salim',
  last_name: 'hassan',
  email: 'a@gmail.com',
  password: 'z'
}

let token

describe('Comment test handler', () => {
  it('User sign up', async () => {
    const startCount = await userController.counter()
    await request(buildAPP())
      .post('/api/v1/users/signup')
      .send(userData)
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
    const starCount = await postController.counter()
    await request(buildAPP())
      .post('/api/v1/comments')
      .send({ userId: 1, content: 'All is good to go!', postId: 1 })
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    const endCount = await postController.counter()
    expect(endCount - starCount).toEqual(1)
  })
})