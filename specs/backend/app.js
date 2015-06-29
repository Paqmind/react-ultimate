import {expect} from "chai";
import Axios from "axios";
import app from "backend/app";
import "backend/server";

// SPECS ===========================================================================================
describe("app", function () {
  it("should exist", function () {
    expect(app).to.be.an("Function");
    expect(app).to.have.property("request");
    expect(app).to.have.property("response");
  });

  it("should listen localhost:" + process.env.HTTP_PORT, function (cb) {
    Axios.get("http://localhost:" + process.env.HTTP_PORT + "/api/somewhere-in-the-galaxy")
      .then(response => response.status)
      .catch(response => response.status)
      .then(status => {
        expect(status).eql(404);
      })
      .then(cb).catch(cb);
  });
});

//it('should authenticate a user', function (done) {
//  var qstring = JSON.stringify({
//    userid: testuserParams.login,
//    password: testuserParams.password
//  });
//  var options = defaultPostOptions('/login', qstring);
//  var req = http.request(options, function (res) {
//    sessionCookie = res.headers['set-coookie'][0];
//    res.on('data', function (d) {
//      var body = JSON.parse(d.toString('utf8'));
//      body.should.have.property('message').and.match(/logged in/);
//      accountId = body.account.id;
//      done();
//    });
//  });
//  req.write(qstring);
//  req.end();
//});
