const {
  User,
  validateUser,
  validateUpdate,
  validateChangePassword,
  validateForgotPassword,
  verifyToken,
  validateRegister
} = require("../../models/user");
const bcrypt = require("bcrypt");
const express = require("express");
const _ = require("lodash");
const router = express.Router();
const handle = require("../../middleware/handle");
const { transporter } = require("../../services/mail");
const verify = require("../../middleware/confirmEmail");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const config = require("config");
const upload = require("../../services/uploading")();
const {
  uploadImage,
  deleteImage,
  deletePublic
} = require("../../services/cloudinary");
const Random = require("../../services/random");
router.post(
  "/",
  handle(async (req, res) => {
    const { error } = validateRegister(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res.status(400).send("this email already registered before.");
    const salt = await bcrypt.genSalt(10);
    let name = req.body.name;
    name = name.toString().toLowerCase();
    user = {
      name: name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, salt),
      confirmed: false,
      isAdmin: false,
      gender: req.body.gender ? req.body.gender : null,
      profile_photo: null,
      short_desc: req.body.short_desc ? req.body.short_desc : null,
      long_desc: req.body.long_desc ? req.body.long_desc : null,
      linknedIn: req.body.linknedIn ? req.body.linknedIn : null,
      twitter: req.body.twitter ? req.body.twitter : null,
      job: req.body.job ? req.body.job : null
    };
    user = new User(user);
    const token = user.generateAuthToken();
    var fullUrl =
      req.protocol +
      "://" +
      req.get("host") +
      "/api/users/passwordAttack/" +
      token;
    await transporter.sendMail({
      from: config.get("Mail_UserName"),
      to: user.email,
      subject: "Confirm Email",
      html: `<h4>Dear User</h4><p>It's Ezat Elzalouy, Core member at devmix and hope you fine. this email has registered to our site and hope to confirm it by clicking on that link</p>
       <a href="${fullUrl}">Confirm Your Email</a>`
    });
    user = await user.save();
    res.status(200).send(_.pick(user, ["_id", "name", "email", "gender"]));
  })
);
router.put(
  "/update",
  [auth],
  handle(async (req, res) => {
    const { error } = validateUpdate(req.body);
    if (error) await res.status(400).send(error.details[0].message);
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true
    });
    if (!user)
      return res
        .status(400)
        .send("the user with the given id was not existed.");
    res.send(user);
  })
);
router.post(
  "/upload",
  auth,
  upload.single("profile_photo"),
  handle(async (req, res) => {
    const user_id = req.user._id;
    const user = await User.findById(user_id);
    if (user && user.profile_photo) deleteImage(user.profile_photo.public_id);
    if (!user)
      return res.status(400).send("Error occureed while saving the photo.");
    const path = "./" + req.file.path;
    const result = await uploadImage(path);
    if (result) {
      user.profile_photo = result;
      await user.save();
    }
    deletePublic();
    res.send("done");
  })
);

router.get(
  "/confirming/:token",
  [verify],
  handle(async (req, res, next) => {
    res.redirect(
      config.get("FrontEndUrl") + "/emailConfirm/" + req.params.token
    );
  })
);

router.post(
  "/search",
  handle(async (req, res) => {
    let users = await User.find({
      name: { $regex: req.body.name.toLowerCase() }
    }).select("name  profile_photo");
    if (!users) res.status(400).send("there are no users with this  name");
    res.status(200).send(users);
  })
);

router.get(
  "/byid/:id",
  handle(async (req, res) => {
    let user = await User.findById(req.params.id);
    if (!user) res.status(400).send("user with the given id was not found");
    user = _.omit(user, ["password", "confirmed", "isAdmin"]);
    res.status(200).send(user);
  })
);

router.get(
  "/admins",
  [auth, admin],
  handle(async (req, res) => {
    let admins = await User.find({
      isAdmin: true,
      _id: { $ne: req.user._id }
    }).select("name email profile_photo");
    if (!admins || admins.length === 0)
      return res
        .status(400)
        .send("there are no admins, only you are the admin.");
    res.status(200).send(admins);
  })
);

router.get(
  "/makeAdmin/:id",
  [auth, admin],
  handle(async (req, res) => {
    let admin = await User.findById(req.user._id);
    if (!admin) return res.status(401).send("Unauthorized Request");
    let user = await User.findById(req.params.id);
    if (!user)
      return res.status(400).send("the user with the given id was not found");
    if (user.isAdmin) return res.status(400).send("the user is already admin");
    user = await User.findByIdAndUpdate(
      { _id: req.params.id },
      { isAdmin: true, adminAt: Date.now() },
      { new: true }
    ).select("name profile_photo email isAdmin");
    res.status(200).send(user);
  })
);

router.get(
  "/removeAdmin/:id",
  [auth, admin],
  handle(async (req, res) => {
    let admin = await User.findById(req.user._id);
    if (!admin) return res.status(401).send("Unauthorized Request");
    let user = await User.findById(req.params.id);
    if (!user)
      return res.status(400).send("the user with the given id was not found");
    if (user.adminAt && admin.adminAt > user.adminAt)
      return res
        .status(400)
        .send("You can't remove this admin, cause he is older than you.");
    user = await User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        isAdmin: false,
        adminAt: null
      },
      { new: true }
    );
    res.send(user);
  })
);

router.put(
  "/changePssword",
  auth,
  handle(async (req, res) => {
    let id = req.user._id;
    let user = await User.findById(id);
    let { error } = validateChangePassword(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const validPassword = await bcrypt.compare(
      req.body.oldPassword,
      user.password
    );
    if (validPassword === false)
      return res.status(400).send("You entered wrong password");
    //use redis to add a token to the blacklist here.
    const salt = await bcrypt.genSalt(10);
    let oldPassword = user.password;
    let newEncPassword = await bcrypt.hash(req.body.newPassword, salt);
    user = await User.findByIdAndUpdate(
      user._id,
      {
        oldPassword: oldPassword,
        password: newEncPassword
      },
      { new: true }
    );
    let confirmChangingPasswordToken = user.generateAuthToken();
    var fullUrl =
      req.protocol +
      "://" +
      req.get("host") +
      "/api/users/passwordAttack/" +
      confirmChangingPasswordToken;
    await transporter.sendMail({
      from: config.get("Mail_UserName"),
      to: user.email,
      subject: "Devmix Support, Password Changed",
      html: `<h4>Dear ${user.name}</h4><p>We have noticed that you have changed your password if you didn't change it and didn't permit that Changement, Click this link to reset your password.</p>
      <a href="${fullUrl}">Confirm Your Email</a>`
    });
    res.send({ token: confirmChangingPasswordToken });
  })
);

router.get(
  "/passwordAttack/:token",
  verify,
  handle(async (req, res) => {
    let id = req.user._id;
    const salt = await bcrypt.genSalt(10);
    let randomVal = Random(10);
    let EncryptedRandomVal = await bcrypt.hash(randomVal, salt);
    let password = EncryptedRandomVal;
    let user = await User.findByIdAndUpdate(
      id,
      {
        password: password
      },
      { new: true }
    );
    await transporter.sendMail({
      from: config.get("Mail_UserName"),
      to: user.email,
      subject: "Devmix Support : Reset Password",
      html: `<h3>Dear ${user.name}</h3> <p>We generated a random password for you, but you must reset your password with a strong one. Here is your new password <mark>${randomVal}</mark> </p>`
    });
    res.redirect("https://www.google.com/");
  })
);
router.get(
  "/resetPassword/:email",
  handle(async (req, res) => {
    let email = req.params.email;
    let user = await User.findOne({ email: email });
    if (!user) return res.status(400).send("email not existed");
    let token = user.ResetPasswordToken();
    var fullUrl = config.get("FrontEndUrl") + "/ResetPasword/" + token;
    await transporter.sendMail({
      from: config.get("Mail_UserName"),
      to: user.email,
      subject: "Devmix Support : Forget Password",
      html: `
    <h2>Dear ${user.name}</h2>
    <p>We accepted a request form that email to reset his password, click </p> <a href=${fullUrl}>Reset Password</a> to insure your request.  
    `
    });
    res.send("We send an email, Check your inbox, please.");
  })
);
router.post(
  "/ResetPassword",
  handle(async (req, res) => {
    const { error } = validateForgotPassword(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let decodedData = verifyToken(req.body.token);
    if (decodedData.action !== "reset")
      return res.status(403).send("Access Denied");
    let user = await User.findById(decodedData._id);
    if (!user) return res.status(403).send("Access Denied");
    const salt = await bcrypt.genSalt(10);
    let update = await User.findOneAndUpdate(
      { _id: decodedData._id },
      {
        password: await bcrypt.hash(req.body.newPassword, salt)
      },
      { new: true }
    );
    if (!update) return res.status(400).send("Error");
    res.status(200).send("Password changed");
  })
);
module.exports = router;
