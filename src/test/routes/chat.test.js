const request = require('supertest')

const buildAPP = require('../../app')
const userData = require('../../utils/userData')
const userController = require('../../controllers/userController')
const chatController = require('../../controllers/chatController')

const Context = require('../context')

let context
let token
beforeAll(async () => {
  context = await Context.build()
})

afterAll(() => {
  return context.close()
})

describe('Chat test handler', () => {
  it('User sign up user1', async () => {
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

  it('User sign up user2', async () => {
    await request(buildAPP())
      .post('/api/v1/users/signup/createUser')
      .send(userData.userData2)
      .expect(200)
  })

  it('Create chat', async () => {
    const startCount = await chatController.counter()
    await request(buildAPP())
      .post('/api/v1/chats')
      .send({ partnerId: 2 })
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    const endCount = await chatController.counter()
    expect(endCount - startCount).toEqual(1)
  })
})
