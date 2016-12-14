const fetch = require('isomorphic-fetch')
const getSettings = require('../models/getSettings')

module.exports = (server) => {
  server.patch('/settings', (req, res) => {
    getSettings().update(req.body)
    .then(() => {
      res.status(204)
      res.end()
    })
    .catch((err) => {
      res.status(500)
      res.end(err.toString())
    })
  })
  server.get('/settings', (req, res) => {
    res.send(getSettings())
  })

  server.post('/settings/test', (req, res) => {
    try {
      let statusCode
      let statusText
      fetch(req.params.alertURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: req.params.recipients,
          name: '测试接口',
          errMessage: '这是一条测试错误信息',
          detail: '',
        }),
      })
      .then((_res) => {
        statusCode = _res.status
        statusText = _res.statusText
        return _res.text()
      })
      .then((body) => {
        res.send({
          status: 'OK',
          statusCode,
          statusText,
          body,
        })
      })
      .catch((err) => {
        res.send({
          status: 'Error',
          name: err.name,
          message: err.message,
        })
      })
    } catch (err) {
      res.status(500)
      res.send({
        status: 'Error',
        name: err.name,
        message: err.message,
      })
    }
  })
}