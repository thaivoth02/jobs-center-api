/**
 * Custom configuration
 * (sails.config.custom)
 *
 * One-off settings specific to your application.
 *
 * For more information on custom configuration, visit:
 * https://sailsjs.com/config/custom
 */

module.exports.custom = {

  /***************************************************************************
  *                                                                          *
  * Any other custom config this Sails app should use during development.    *
  *                                                                          *
  ***************************************************************************/
  // sendgridSecret: 'SG.fake.3e0Bn0qSQVnwb1E4qNPz9JZP5vLZYqjh7sn8S93oSHU',
  // stripeSecret: 'sk_test_Zzd814nldl91104qor5911gjald',
  // …
  baseUrl: 'http://localhost:1342',
  constants: {
    queue: {
      status: {
        ACTIVE: 0,
        INACTIVE: 1
      },
      mode: {
        MANUAL: 0,
        AUTO: 1,
        BOTH: 2
      },
    },
    job: {
      // deletionTime: 60000,
      deletionTime: 6 * 60 * 60 * 1000,
      options: {
        attempts: 3,
        removeOnComplete: {
          age: 60 * 60
        },
        removeOnFail: {
          age: 60 * 60 * 24
        }
      },
      status: {
        active: 0,
        completed: 1,
        failed: 2
      },
      code: {
        COMPLETED: 0,
      }
    }
  },
  cache:{
    methods: [],
    prefix: `jobsCenterCached`
  },
  file: {
    path: 'assets/',
    excel: 'documents/excel/',
    text: 'documents/text/'
  },
  email: {
    defaultEmail: 'onboarding@resend.dev'
  },
  notification: {
    telegram: {
      baseUrl: 'https://api.telegram.org/bot',
    }
  }

};
