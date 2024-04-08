const request = require('supertest')

const buildAPP = require('../../app')

const userController = require('../../controllers/userController')

const Context = require('..//context')

let context

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

describe('User test handler', () => {
  it('User sign up', async () => {
    const startCount = await userController.counter()

    await request(buildAPP())
      .post('/api/v1/users/signup')
      .send(userData)
      .expect(200)

    const finishCount = await userController.counter()

    expect(finishCount - startCount).toEqual(1)
  })

  it('User login', async () => {
    let userId

    await request(buildAPP())
      .post('/api/v1/users/login')
      .send(userData)
      .expect(200)
      .then(response => {
        userId = response.body.data.id
      })

    expect(userId).toEqual(1)
  })
})
