const request = require('supertest')
const buildAPP = require('../../app')
const userController = require('../../controllers/userController')
const postController = require('../../controllers/postController')
const userData = require('../../utils/userData')

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

  it('Update post', async () => {
    let message = 'Hello world'
    await request(buildAPP())
      .put('/api/v1/posts/1')
      .send({ message: 'Hello Salim' })
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(res => {
        message = res.body.data.message
      })
    expect(message === 'Hello Salim').toEqual(true)
  })
})
