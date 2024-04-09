const request = require('supertest')
const buildAPP = require('../../app')
const Context = require('../context')

const recationController = require('../../controllers/reactionController')
const postController = require('../../controllers/postController')
const userController = require('../../controllers/userController')

let context
let token

const userData = {
  first_name: 'salim',
  last_name: 'hassan',
  email: 'a@gmail.com',
  password: 'z'
}

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
    await request(buildAPP())
      .post('/api/v1/posts')
      .send({ userId: 1, message: 'Hello world' })
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    const endCount = await postController.counter()
    expect(endCount - starCount).toEqual(1)
  })

  it('React to a post test handler', async () => {
    const starCount = await reactionController.counter()

    await request(buildAPP())
      .post('/api/v1/reaction')
      .send()
      .set()
      .expect(200)
      .then(response => {
        console.log('====================================');
        console.log(response);
        console.log('====================================');
      })
    const endCount = await reactionController.counter()

    expect(endCount - starCount).toEqual(1)
  })
})