/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': { view: 'pages/homepage' },


  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/

  /* File */
  'GET /api/v1/file': { action: 'file/download-file' },
  /* Queue */
  'GET /api/v1/queue/list': { action: 'queue/browse' },
  'POST /api/v1/queue/create': { action: 'queue/add' },
  'PUT /api/v1/queue/update': { action: 'queue/modify' },
  'GET /api/v1/queue/list-configuration': { action: 'queue/get-configuration'},
  /* Job */
  'GET /api/v1/job/list': { action: 'job/browse' },
  'POST /api/v1/job/create': { action: 'job/add' },
  'PUT /api/v1/job/update': { action: 'job/modify' },
  /* Log */
  'POST /api/v1/log/create-log': { action: 'log/create-log' },


};
