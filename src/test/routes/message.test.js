const request = require('supertest')
const buildAPP = require('../../app')

const userController = require('../../controllers/userController')
const chatController = require('../../controllers/chatController')
const chatUserController = require('../../controllers/chatUserController')
const Context = require('../context')

let context

let token
beforeAll(async () => {
  context = await Context.build()
})

afterAll(() => {
  return context.close()
})

const userData = {
  first_name: 'salim',
  last_name: 'hassan',
  email: 'a@gmail.com',
  password: 'z'
}

describe('Message test handler', () => {
  it('User sign up user1', async () => {
    const startCount = await userController.counter()

    await request(buildAPP())
      .post('/api/v1/users/signup')
      .send(userData)
      .expect(200)
      .then(response => {
        userId = response.body.data.id
        token = response.body.data.token
      })
    const finishCount = await userController.counter()
    expect(finishCount - startCount).toEqual(1)
  })

  it('User sign up user2', async () => {
    await request(buildAPP())
      .post('/api/v1/users/signup')
      .send({
        first_name: 'salim',
        last_name: 'hassan',
        email: 'b@gmail.com',
        password: 'z'
      })
      .expect(200)
  })

  it('Create chat', async () => {
    const startCount = await chatController.counter()
    await request(buildAPP())
      .post('/api/v1/chats')
      .send()
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    const endCount = await chatController.counter()
    expect(endCount - startCount).toEqual(1)
  })

  it('Create chat-user', async () => {
    const startCount = await chatUserController.counter()
    await request(buildAPP())
      .post('/api/v1/chat-users')
      .send({ usersIdsList: [1, 2], chatId: 1 })
      .set('Authorization', `Bearer ${token}`)

    const endCount = await chatUserController.counter()
    expect(endCount - startCount).toEqual(2)
  })

  it('Create message test', async () => {
    const startCount = await messageController.counter()
    await request(buildAPP())
      .post('/api/v1/messages')
      .send()
      .set('Authorization', `Bearer ${token}`)

    const endCount = await messageController.counter()

    expect(endCount - startCount).toEqual(1)
  })
})
