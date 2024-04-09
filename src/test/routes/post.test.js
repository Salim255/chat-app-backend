const request = require('supertest')
const buildApp = require('../../config/app')
const Context = require('../context')

let context
let token
beforeAll(async () => {
  context = await Context.build()
})

afterAll(async () => {
  return context.close()
})

describe('Post test handler', () => {
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
    await request(buildApp())
      .post('/api/v1/posts')
      .send({ userId: 1, message: 'Hello world' })
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(response => {
        console.log(response);
      })
    const endCount = await postController.counter()
    expect(endCount - starCount).toEqual(1)
  })
})
