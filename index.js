const express = require("express");
const app = express(); //experrs ki metod app me aa jaygi
const mongoose = require("mongoose");
// const bycrypt = require("bycrypt")
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const cors = require("cors");
const port = 3000;
app.use(express.json());
app.use(cors());
mongoose //middelwer this work for send the deta in mongo db
  .connect(
    "mongodb+srv://patidarsunita19112:sunita1234@cluster0.djylgbe.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log("Error", err);
  });

const userSchema = new mongoose.Schema({
  //new keyword new object create karne ke liye karte he .jis form me data store karna he use scema  kahte he
  Fullname: String,
  email: String,
  password: String,
  mobile: Number,
});



const messageSchema = new mongoose.Schema({


  userId: {
    type: String,
    required: true,
  },
  userName:{
    type:String,
    required:true
  },

  userEmail: {
    type: String,
    required: true,
  },
  userMessage: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});
// const Message = mongoose.model("Message", messageSchema);
const Message = mongoose.model("Message", messageSchema);
const User = mongoose.model("User", userSchema);

const key = "12341234av";
const users = [];
// ... (your existing code)

// app.delete("/deleteUser/:id", async (req, res) => {
//   const userId = req.params.id;

//   try {
//     const removedUser = await User.findByIdAndRemove(userId);

//     if (removedUser) {
//       console.log(`User with ID ${userId} removed from the db`);
//       res.json({
//         msg: "User removed successfully",
//         status: "200",
//         data: removedUser,
//       });
//     } else {
//       res.json({
//         msg: "User not found",
//         status: "404",
//       });
//     }
//   } catch (err) {
//     console.log("Error", err);
//     res.json({
//       msg: "Internal server error",
//       status: "500",
//     });
//   }
// });
// app.put("/updateUser/:id", async (req, res) => {
//   const userId = req.params.id;
//   const { Fullname, email, password, mobile } = req.body;
//   try {
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { Fullname, email, password, mobile },
//       { new: true }
//     );
//     if (updatedUser) {
//       res.json({
//         msg: "user update successfull",
//         status: "200",
//         data: updatedUser,
//       });
//     } else {
//       res.json({
//         msg: "no such user exist",
//         status: "404",
//       });
//     }
//   } catch (err) {
//     console.log("Error", err);
//     res.json({
//       msg: "internal server error",
//       status: "500",
//     });
//   }
// });
// ... (rest of your code)

app.get("/getUser", async (req, res) => {
  try {
    const users = await User.find();
    res.json({
      msg: "successfuly",
      stauscode: 210,
      data: users,
    });
  } catch (err) {
    console.log("Error", err);
    res.json({
      msg: "enternal server Error",
      status: "500",
    });
  }
});
app.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let users = await User.find({ email });
  console.log("error");
  if (users.length != 0) {
    bcrypt.compare(password, users[0].password, function (err, result) {
      if (result) {
        let token = jwt.sign({ user: users[0] }, key);
        res.json({
          msg: "successful login",
          user: users[0],
          token: token,
          status: 200,
        });
      } else {
        res.json({
          msg: "Invalid Password",
          status: 401,
        });
      }
    });
  }
});

app.post("/createUser", async (req, res) => {
  const { Fullname, email, password, mobile } = req.body; //body pe dta show karne ke liye
  console.log(req.body);
  if (!Fullname && !email && !password && !mobile) {
    return res.json({
      status: "400",
      msg: "All Fields are required",
    });
  }

  bcrypt.hash(password, 10, async function (err, hash) {
    if (err) {
      console.log("Password is not encrypted", err);
    } else {
      const newUser = new User({ ...req.body, password: hash });
      try {
        //try method sirf code try karne ke liye hoti he
        const user = await newUser.save(); //
        console.log("User saved to the db", user);
        res.json({
          msg: "Successfully Created",
          status: "200",
          data: user,
        });
      } catch (err) {
        //catch method error cathch karne ke liye hoti he
        console.log("Error", err);
        res.json({
          msg: "user is not Created",
          status: "400",
          data: user,
        });
      }
    }
  });
  // const newUser = new User(req.body);
});
// app.post("/login",async(req,res)=>{
//   let {email,password}=req.body
//   let users =await User.find({email})
//   if(users.length !=0)
//   {
//     bycrypt.compare(password.users[0].password,function(err,result){
//       if(result)
//       {
//         let token = jwt.sing({user:users[0]},key)
//         res.json({
//           msg:"successful login",
//           user:users[0],
//           token:token,
//           status:200
//         })
//       }
//       else{
//         res,json({
//           msg:'Invalid Password',
//           status:401
//         })
//       }
//     })
// })

app.put("/updateUser/:id", async (req, res) => {
  const userId = req.params.id;
  const { Fullname, email, password, mobile } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { Fullname, email, password, mobile },
      { new: true }
    );
    if (updatedUser) {
      res.json({
        msg: "user update successfull",
        status: "200",
        data: updatedUser,
      });
    } else {
      res.json({
        msg: "no such user exist",
        status: "404",
      });
    }
  } catch (err) {
    console.log("Error", err);
    res.json({
      msg: "internal server error",
      status: "500",
    });
  }
});

app.delete("/deleteUser/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const removedUser = await User.findByIdAndRemove(userId);

    if (removedUser) {
      console.log(`User with ID ${userId} removed from the db`);
      res.json({
        msg: "User removed successfully",
        status: "200",
        data: removedUser,
      });
    } else {
      res.json({
        msg: "User not found",
        status: "404",
      });
    }
  } catch (err) {
    console.log("Error", err);
    res.json({
      msg: "Internal server error",
      status: "500",
    });
  }
});

app.get("/getUser", (req, res) => {
  const user = {
    name: "sunita",
    age: "34",
  };
  console.log(user);
  res.json(user);
});

app.post("/createUser", (req, res) => {
  console.log(req.body);
  res.json({
    status: 201,
    message: "User created",
    data: req.body,
  });
});
// Messages Api's
app.get("/getMessages", async (req, res) => {
  try {
     console.log(req.body)
    const message = await Message.find();
    console.log(message);
    res.json({
      msg: "Succecfully retrivated message",
      stauts: 200,
      data: message,
    });
  } catch (err) {
    console.log("error", err);
    res.json({
      msg: "internal server error",
      status: 500,
    });
    
  }
});
app.post("/postMessage", async (req, res) => {
  const { userId, userEmail, userMessage, userName } = req.body;
  if (!userId || !userEmail || !userMessage || !userName) {
    return res.json({
      stauts: 400,
      msg: "Text and sender are requred fields",
    });
  }
  try {
    const newMessage = new Message(req.body);
    const savedmessage = await newMessage.save();
    res.json({
      msg: "Succesfully posted message",
      status: 200,
      data: savedmessage,
    });
  } catch (err) {
    console.log("error", err);
    res.json({
      msg: "Message not posted",
      status: 500,
    });
  }
});
app.listen(port, (err) => {
  //server ko start karne ka function
  if (err) {
    return console.log("Something went wrogn");
  } else {
    console.log(`Server is running on port ${port}`);
  }
});
