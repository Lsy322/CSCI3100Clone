// model
const Restaurants = require("../models/restaurant.js");
const foodItem = require("../models/food_item.js");

// package
const bcrypt = require("bcryptjs");
const multer = require("multer");
const sharp = require("sharp");

// const
const MAX_RESIZE_PX = 2000; // 2000 pixel
const MAX_FILESIZE = 5 * 1024 * 1024; // 5MB

// handle for image upload
const upload = multer({
  limits: { fileSize: MAX_FILESIZE }, // 5MB
  fileFilter(req, file, cb) {
    console.log("file info:", file);
    if (file.mimetype == "image/png" || file.mimetype == "image/jpeg") {
      // jpg, jpeg, jfif are udner image/jpeg
      cb(null, true);
    } else {
      console.log("cant upload!");
      cb(null, false);
    }
  },
});

const authRestaurant = async (username, password) => {
  // TODO: authenticate restaurant by username, password and return the restaurant doc if matched

  // fetch restaurant by username
  let restaurant = await Restaurants.findOne({ username });
  if (restaurant == null) {
    throw { name: "UserNotFound", message: "User does not exist" };
  }
  // console.log('restaurant doc:', restaurant.username);

  // check if password matched
  let matched = await bcrypt.compare(password, restaurant.password);
  console.log("compare result:", matched);
  if (!matched) {
    throw { name: "InvalidPassword", message: "Invalid password" };
  }

  return restaurant;
};

const getRestaurantByUsername = async (username) => {
  // TODO: get restaurant by username
  console.log("searching restaurant with username:", username);
  let restaurant = await Restaurants.findOne({ username });
  if (restaurant == null) {
    throw { name: "UserNotExist", message: "User does not exist" };
  }
  // console.log('restaurant doc:', restaurant.username);

  return restaurant;
};

const getRestaurantById = async (id) => {
  // TODO: get restaurant by id
  console.log("searching restaurant with id:", id);
  let restaurant = await Restaurants.findOne({ _id: id });
  if (restaurant == null) {
    throw { name: "UserNotExist", message: "User does not exist" };
  }
  // console.log('restaurant doc:', restaurant.username);

  return restaurant;
};

module.exports = {
  getRestaurantById: getRestaurantById,

  getRestaurantByUsername: getRestaurantByUsername,

  getRestaurantData: async (req, res) => {
    try {
      // fetch restaurant by username
      const data = await Restaurants.findOne({
        _id: req.restaurant._id,
      }).populate("menu");
      res.status(200).send(data);
    } catch (err) {
      console.log(err);
      res.status(404).send(err);
    }
  },

  getNotApprovedRestaurant: async (req, res) => {
    try {
      let list = await Restaurants.find({ approved: false }).populate("menu");

      res.status(200).send(list);
    } catch (err) {
      console.log(err);
      res.status(404).send(err);
    }
  },

  getApprovedRestaurant: async (req, res) => {
    try {
      let list = await Restaurants.find({ approved: true }).populate("menu");
      res.status(200).send(list);
    } catch (err) {
      console.log(err);
      res.status(404).send(err);
    }
  },

  getAllRestaurantData: async (req, res) => {
    try {
      let data = await Restaurants.find().populate("menu");
      res.status(200).send(data);
    } catch (err) {
      console.log(err);
      res.status(404).send(err);
    }
  },

  // middleware for new user login
  addRestaurant: async (req, res, next) => {
    try {
      let restaurant = await Restaurants.findOne({
        username: req.body.username,
      });

      if (restaurant) {
        // already exists
        throw {
          name: "UserAlreadyExisted",
          message: "User with same username already registed",
        };
      }

      // create restaurant account
      restaurant = await Restaurants.create(req.body);

      req.restaurant = restaurant;

      console.log(`New Restaurant Register with username ${req.body.username}`);

      // continue to set profile pic
      next();
    } catch (err) {
      res.status(400).send(err); // 400: Bad request // code 11000 would be sent if username duplicated
    }
  },

  changePw: async (req, res) => {
    // TODO: change pw given old and new password pair (request by user)
    console.log("> change pw");
    try {
      let passwordOld = req.body.passwordOld;
      let passwordNew = req.body.passwordNew;
      let restaurant = req.restaurant;

      // check if old pw matched
      let matched = await bcrypt.compare(passwordOld, restaurant.password);
      console.log("compare result:", matched);
      if (!matched) {
        throw { name: "InvalidPassword", message: "Invalid password" };
      }

      // check if new pw same as old pw
      if (passwordOld === passwordNew) {
        throw {
          name: "DuplicatedNewPassword",
          message: "New password is same as the old password",
        };
      }

      console.log("password len:", passwordNew.length);
      // check if new pw is longer than 8 characters
      if (passwordNew.length < 8) {
        throw {
          name: "LengthTooShort",
          message: "Password length should be greater than 8",
        };
      }

      restaurant.password = passwordNew;
      await restaurant.save();

      console.log("> pw changed");

      // continue to set profile pic
      res
        .status(200)
        .send({
          name: "SuccessfullyChangedPassword",
          message: "Successfully changed password",
        });
    } catch (err) {
      res.send(err);
    }
  },

  resetPw: async (req, res) => {
    // TODO: change pw given username (request by admin)
    console.log("> reset pw");
    try {
      let passwordNew = req.body.passwordNew;

      let restaurant = await getRestaurantByUsername(req.body.username);

      console.log("password len:", passwordNew.length);
      // check if new pw is longer than 8 characters
      if (passwordNew.length < 8) {
        throw {
          name: "LengthTooShort",
          message: "Password length should be greater than 8",
        };
      }

      restaurant.password = passwordNew;
      await restaurant.save();

      // continue to set profile pic
      res
        .status(200)
        .send({
          name: "SuccessfullyResetPassword",
          message: "Successfully reset password",
        });
    } catch (err) {
      res.send(err);
    }
  },

  // middleware
  uploadProfilePic: async (req, res, next) => {
    // TODO: upload profile image with key = 'profile' to server
    console.log("> upload profile");
    try {
      return upload.single("profile")(req, res, () => {
        if (!req.file) {
          console.log("> upload failed");
          return res
            .status(400)
            .send({
              name: "FileExtensionError",
              message: "image should be jpg or png",
            });
        } else {
          console.log("filesize:", req.file.size);
          console.log("> Upload Success");
        }

        // continue to set store profile pic
        next();
      });
    } catch (err) {
      res.send(err);
    }
  },

  // middleware
  setProfilePic: async (req, res, next) => {
    // TODO: add profile pic to db
    console.log("> add profile");
    try {
      // resize profile pic to 100x100px before storing to db
      let resizedBuf = await sharp(req.file.buffer)
        .resize({
          width: 500,
          height: 500,
        })
        .toBuffer();
      req.restaurant.profilePic = resizedBuf;
      await req.restaurant.save();

      next();
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  },

  getProfilePic: async (req, res) => {
    // TODO: view profile image
    try {
      // res.set('Content-Type', 'image/png');  // disable for testing in postman
      // res.set('Content-Type', 'image/jpeg');  // disable for testing in postman
      console.log("> sent profile");
      res.send(req.restaurant.profilePic);
    } catch (err) {
      res.send(err);
    }
  },

  login: async (req, res) => {
    // TODO: login user by username, password
    console.log("> login to server");
    console.log("req.body:", req.body); // username, pw
    try {
      console.log("now authenticate restaurant");

      // authenticate restaurant
      let restaurant = await authRestaurant(
        req.body.username,
        req.body.password
      );
      // console.log('authenticate successful, with user=', restaurant);

      // check account if approved
      if (restaurant.approved == false) {
        // user created account but not approved
        console.log("restaurant not approved");
        throw { name: "AccountNotApproved", message: "account not approved" };
      }

      // generate token for enter home page
      let token = await restaurant.genAuthToken();

      restaurant.online = true;
      await restaurant.save();

      console.log("you get token:", token);

      res.status(200).send({ token }); // 200: OK
    } catch (err) {
      console.log(err);
      res.status(401).send(err); // 401: Unauthorized
    }
  },

  logout: async (req, res) => {
    // TODO: logout restaurant after token verification
    console.log("> logout");
    try {
      req.restaurant.online = false;
      await req.restaurant.save();
      res
        .status(200)
        .send({ name: "SuccessfullyLogout", message: "Successfully logout" });
    } catch (err) {
      res.send(err);
    }
  },

  approveAccount: async (req, res, next) => {
    // TODO: approve account by admin
    console.log(`> Admin approved restaurant ${req.body.username}`);

    try {
      let restaurant = await getRestaurantByUsername(req.body.username);
      // console.log('restaurant doc:', restaurant);

      // check if already approved
      if (restaurant.approved) {
        throw { name: "AlreadyApproved", message: "Account already activated" };
      }

      // approve account
      restaurant.approved = true;
      console.log(`${restaurant.restaurantName} approved by admin`);
      await restaurant.save();

      req.accStatus = "AccountApproved";
      req.restaurant = restaurant;

      // res.status(200).send({msg:"Account approved"}); // 200: OK
      // continue to send email notify restaurant
      next();
    } catch (err) {
      console.log(err);
      res.status(403).send(err);
    }
  },

  rejectAccount: async (req, res, next) => {
    // TODO: reject account by admin
    console.log(`> Admin rejected restaurant ${req.body.username}`);

    try {
      let restaurant = await getRestaurantByUsername(req.body.username);
      // console.log('restaurant doc:', restaurant);

      // reject account
      console.log(`${restaurant.restaurantName} rejected by admin`);

      req.accStatus = "AccountRejected";
      req.restaurant = restaurant;
      await Restaurants.deleteOne({ username: req.body.username });

      // continue to send email notify restaurant
      next();
    } catch (err) {
      console.log(err);
      res.status(403).send(err);
    }
  },

  // Food Related Function
  uploadFoodItemPic: async (req, res, next) => {
    // TODO: upload profile image with key = 'foodPic' to server
    console.log("> upload Food Item Pic");
    try {
      return upload.single("foodPic")(req, res, () => {
        if (!req.file) {
          console.log("> upload failed");
          return res
            .status(400)
            .send({
              name: "FileExtensionError",
              message: "image should be jpg or png",
            });
        } else {
          console.log("filesize:", req.file.size);
          console.log("> Upload Success");
        }

        // continue to set store Food Item pic
        next();
      });
    } catch (err) {
      res.send(err);
    }
  },

  addFoodItem: async (req, res) => {
    console.log("> add Food Item");
    try {
      // resize Food Item pic to MAX_RESIZE_PX before storing to db
      let resizedBuf = await sharp(req.file.buffer)
        .resize({
          width: MAX_RESIZE_PX,
          height: MAX_RESIZE_PX
        })
        .toBuffer();
      let doc = new foodItem();
      doc.picture = resizedBuf;
      doc.name = req.body.name;
      doc.price = req.body.price;
      doc.style = req.body.style;

      doc = await foodItem.create(doc);

      req.restaurant.menu.push(doc._id);
      await req.restaurant.save();
      console.log("Added Food item to db with _id", doc._id);
      res.send({
        name: "AddedFoodItemSuccessfully",
        message: "Added food item successfully",
      });
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  },

  removeFoodItem: async (req, res) => {
    console.log("Remove Food Item with ID", req.body.foodId);
    try {
      let idx = req.restaurant.menu.indexOf(req.body.foodId);
      if (idx == -1) {
        throw { name: "FoodNotFound", message: "food is not exist in menu" };
      }
      req.restaurant.menu.splice(idx, 1);
      console.log(req.restaurant.menu);
      await req.restaurant.save();

      console.log(req.restaurant.menu);
      await foodItem.deleteOne({ _id: req.body.foodId });
      console.log("Removed Food Item Successfully");
      res.send({
        name: "RemovedFoodItemSuccessfully",
        message: "Removed food item successfully",
      });
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  },
};
