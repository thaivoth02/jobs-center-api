module.exports.queue = {
  email: {
    helper: {
      description: 'Helper to send email',
      directories: ['email'],
      file: 'send',
      data: {},
    }
  },
  notification: {
    helper: {
      description: 'Helper to push notification',
      directories: ['notification'],
      file: 'push',
      data: {},
    }
  }
};
