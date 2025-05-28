const router = require('express').Router();
const User = require('../models/usersModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddlewares')

// Register new user
router.post('/register', async (req, res) => {
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.send({
                message: 'User already exists',
                success: false,
                data: null,
            });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;

        // Create and save the new user
        const newUser = new User(req.body);
        await newUser.save();

        res.send({
            message: 'User created successfully',
            success: true,
            data: null,
        });
    } catch (error) {
        res.send({
            message: error.message,
            success: false,
            data: null,
        });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
         // Check if the user exists
        const userExists = await User.findOne({ email: req.body.email });
        if (!userExists) {
            return res.send({
                message: "User does not exist",
                success: false,
                data: null,
            });
        }
     if(userExists.isBlocked)
     {
        return res.send({
            message: "Your account is blocked, please contact with admin",
            success: false,
            data: null,
        });
     }
        // Compare the hashed password
        const passwordMatch = await bcrypt.compare(req.body.password, userExists.password);
        if (!passwordMatch) {
            return res.send({
                message: "Incorrect password",
                success: false,
                data: null,
            });
        }
        // Generate a JWT token
        const token = jwt.sign(
            { userId: userExists._id },
            process.env.jwt_secret, // Use `JWT_SECRET` from your environment variables
            { expiresIn: "1d" }
        );

        res.send({
            message: "User logged in successfully",
            success: true,
            data: token,
        });
    } catch (error) {
        res.send({
            message: error.message,
            success: false,
            data: null,
        });
    }
});

//get user by id
router.post("/get-user-by-id",authMiddleware,async (req,res) => {
try{
const user = await User.findById(req.body.userId);
res.send({
    message: "User fetched sucessfully",
    success: true,
    data: user,
    });
   }
catch(error){
    res.send({
        message:error.message,
        success: false,
        data: null,
    });
  }
});

//get all users
router.post("/get-all-users", authMiddleware, async (req, res) => {
    try {
      const users = await User.find({});
      return res.status(200).send({
        message: "Users fetched successfully",
        success: true,
        data: users,
      });
    } catch (error) {
      return res.status(500).send({
        message: error.message,
        success: false,
        data: null,
      });
    }
  });
  

// update the users
router.post("/update-user-permissions", authMiddleware, async (req, res) => {
    try {
      const { _id, ...updateData } = req.body; // Extract `_id` and update fields
      await User.findByIdAndUpdate(_id, updateData, { new: true });
      res.send({
        message: "User permissions updated successfully",
        success: true,
        data: null,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        success: false,
        data: null,
      });
    }
  });  
module.exports = router;
