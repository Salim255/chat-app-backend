const request = require('supertest')

const buildAPP = require('../../app')

const userController = require('../../controllers/userController')

const Context = require('..//context')

let context

beforeAll(async () => {
  context = await Context.build()
  console.log(context, 'Hello');
})

afterAll(() => {
  return context.close()
})

describe('User test handler', () => {
  it('User sign up', async () => {
    const userData = {
      first_name: 'salim',
      last_name: 'hassan',
      email: 'a@gmail.com',
      password: '3333'
    }

    const startCount = await userController.counter()

    await request(buildAPP())
      .post('/app/v1/users/signup')
      .send(userData)
      .expect(200)
      .then(response => {
        createdUserId = response.body.data.id
        token = response.body.data.token
      })

    const finishCount = await userController.count()

    expect(finishCount - startCount).toEqual(1)
  })
})
