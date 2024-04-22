const request = require('supertest')

const buildAPP = require('../../app')

const userController = require('../../controllers/userController')
const friendController = require('../../controllers/friendController')

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

describe('Friends test handler', () => {
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
      .post('/api/v1/users/signup/createUser')
      .send(userData.userData2)
      .expect(200)
      .then(response => {
        token = response.body.data.token
      })

    const finishCount = await userController.counter()

    expect(finishCount - startCount).toEqual(1)
  })

  it('Add user1 to user2 friends list', async () => {
    await request(buildAPP())
      .post('/api/v1/friends')
      .send({ friend_id: 1 })
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })

  it('Get all friends by user', async () => {
    await request(buildAPP())
      .get('/api/v1/friends/get-friends')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })
})
