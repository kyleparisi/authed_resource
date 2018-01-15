const debug = require("debug")(process.env.DEBUG_NAMESPACE);
global.debug = debug;
const express = require("express");
const app = express();
const jwt = require("express-jwt");
const jwks = require("jwks-rsa");

const jwksUri = process.env.JWKSURI;
debug("jwksUri: " + jwksUri);
const audience = process.env.AUDIENCE;
debug("audience: " + audience);
const issuer = process.env.ISSUER;
debug("issuer: " + issuer);
const algorithms = process.env.ALGORITHMS.split(/[ ,]+/).filter(Boolean);
debug("algorithms: " + algorithms);
const port = process.env.PORT;
debug("port: " + port);

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: jwksUri
  }),
  audience: audience,
  issuer: issuer,
  algorithms: algorithms
});

app.use(jwtCheck);

app.get("/authorized", function(req, res) {
  console.log(req.user);
  res.send("Secured Resource");
});

app.listen(port);
