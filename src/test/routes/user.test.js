const request = require('supertest')

const buildAPP = require('../../app')

const userController = require('../../controllers/userController')

const userData = require('../../utils/userData')

const Context = require('../context')

let context
let token
beforeAll(async () => {
  context = await Context.build()
})

afterAll(() => {
  return context.close()
})

describe('User authentication & authorization test handler', () => {
  it('User sign up', async () => {
    const startCount = await userController.counter()
    const data = { ...userData.userData1, is_staff: true }
    await request(buildAPP())
      .post('/api/v1/users/signup/createUser')
      .send(data)
      .expect(200)

    const finishCount = await userController.counter()

    expect(finishCount - startCount).toEqual(1)
  })

  it('Sign up user2', async () => {
    const startCount = await userController.counter()

    await request(buildAPP())
      .post('/api/v1/users/signup/createAdmin')
      .send(userData.userData2)
      .expect(200)

    const finishCount = await userController.counter()

    expect(finishCount - startCount).toEqual(1)
  })

  it('User login', async () => {
    let userId

    await request(buildAPP())
      .post('/api/v1/users/login')
      .send(userData.userData2)
      .expect(200)
      .then(response => {
        userId = response.body.data.id
        token = response.body.data.token
      })

    expect(userId).toEqual(2)
  })

  it('Fetch user info with token', async () => {
    let userId

    await request(buildAPP())
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(response => {
        userId = response.body.data.id
      })

    expect(userId).toEqual(2)
  })

  it('Disable user by admin', async () => {
    let isActive = true
    await request(buildAPP())
      .put('/api/v1/users/1/disable')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(res => {
        isActive = res.body.data.is_active
      })
    expect(isActive).toEqual(false)
  })
})
