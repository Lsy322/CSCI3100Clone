// package
const jwt = require("jsonwebtoken");

// const
// const EXPIRE = 60 * 30; // 30 min
const EXPIRE = 60 * 60 * 24 * 30; // 1 month

const authAdmin = async (username, password) => {
  // TODO: authenticate admin by username, password and return the admin doc if matched
  console.log(username, password);
  let isAdmin =
    username == process.env.ADMIN_USER && password == process.env.ADMIN_PW;
  if (!isAdmin) {
    throw { name: "UserNotFound", message: "admin credential not matched" };
  } else return isAdmin;
};

const genAuthToken = async () => {
  // TODO: generate jwt token
  console.log("> generating auth token");
  let token = jwt.sign({ _id: 3100, usertype: "admin" }, process.env.SECRET, {
    expiresIn: EXPIRE,
  });
  console.log("> generated token");
  return token;
};

module.exports = {
  login: async (req, res) => {
    // TODO: login user by username, password
    console.log("> login to server");
    console.log("req.body:", req.body); // username, pw
    try {
      console.log("now authenticate admin");

      // authenticate admin
      await authAdmin(req.body.username, req.body.password);

      // generate token for enter home page
      let token = await genAuthToken();

      console.log("you get token:", token);

      res.status(200).send({ token }); // 200: OK
    } catch (err) {
      res.status(401).send(err); // 401: Unauthorized
    }
  },
};
