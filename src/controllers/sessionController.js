const sessionModal = require('../models/sessionKeysModel');

exports.getSessionByUser = async ({ chatId }) => {
  try {
    const sessionKey = await sessionModal.getSessionByUser({ chatId });
    return sessionKey
  } catch (error) {
    // Deal with error
    console.log(error, 'Hello error')
  }
}
