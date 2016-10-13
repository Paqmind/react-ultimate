//it('should authenticate a user', function (done) {
//  var qstring = JSON.stringify({
//    userid: testuserParams.login,
//    password: testuserParams.password
//  })
//  var options = defaultPostOptions('/login', qstring)
//  var req = http.request(options, function (res) {
//    sessionCookie = res.headers['set-coookie'][0]
//    res.on('data', function (d) {
//      var body = JSON.parse(d.toString('utf8'))
//      body.should.have.property('message').and.match(/logged in/)
//      accountId = body.account.id
//      done()
//    })
//  })
//  req.write(qstring)
//  req.end()
//})
