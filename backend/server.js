console.log("TESTING123 - DELETE ROUTE SHOULD EXIST");
console.log("=== NEW SERVER FILE RUNNING ===");
const dns = require("dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./model/user");
const Expense = require("./model/Expense");
const bcrypt = require("bcrypt");

const app = express();
const jwt = require("jsonwebtoken");
const Income = require("./model/Income");
const Employee = require("./model/Employee");
const auth = require("./middleware/auth");

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    if (req.url === "/api") {
        req.url = "/";
    } else if (req.url.startsWith("/api/")) {
        req.url = req.url.slice(4);
    }

    next();
});
console.log("Mongo URI:", process.env.MONGO_URI);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log(err);
});


// Signup API
app.post("/signup", async (req, res) => {

    console.log("Signup data:", req.body);

    try {

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if(existingUser){
            return res.status(400).json({
                message:"User already exists"
            });
        }


       const hashedPassword = await bcrypt.hash(password, 10);

const newUser = new User({
    name,
    email,
    password: hashedPassword
});


        await newUser.save();


        console.log("User saved");


        res.status(201).json({
            message:"Signup successful"
        });


    } catch(error){

        console.log(error);

        res.status(500).json({
            message:"Server error"
        });

    }

});
// Login API
app.post("/login", async (req, res) => {

    console.log("Login data:", req.body);

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

       const isMatch = await bcrypt.compare(password, user.password);

if (!isMatch) {
    return res.status(400).json({
        message: "Invalid password"
    });
}

       const token = jwt.sign(
    {
        userId: user._id,
        email: user.email
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1d"
    }
);
console.log("Generated Token:", token);

res.status(200).json({
    message: "Login successful",
    token
});

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});
console.log("Add Expense Route Loaded");
// Add Expense API
app.post("/add-expense",auth, async (req, res) => {

    console.log("Expense Data:", req.body);

    try {

        const { title, category, amount, payment, date } = req.body;

        const newExpense = new Expense({
           userId: req.user.userId,
            title,
            category,
            amount,
            payment,
            date
        });

        await newExpense.save();

        res.status(201).json({
            message: "Expense Added Successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

});
// Add Income Api
app.post("/add-income", auth, async (req, res) => {

    try {

        const { source, amount, date } = req.body;

        const newIncome = new Income({
            userId: req.user.userId,
            source,
            amount,
            date
        });

        await newIncome.save();

        res.status(201).json({
            message: "Income Added Successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

});
//get Income Api
app.get("/income", auth, async (req, res) => {

    try {

        const incomes = await Income.find({
            userId: req.user.userId
        }).sort({ date: -1 });

        res.status(200).json(incomes);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

});
// Get All Expenses (used by Dashboard/Analytics — returns plain array)
app.get("/expenses", auth, async (req, res) => {
    try {

        const expenses = await Expense.find({
            userId: req.user.userId
        });

        res.status(200).json(expenses);

    } catch(error) {

        console.log(error);

        res.status(500).json({
            message:"Server Error"
        });

    }
});
// Get All Users (Employees)
app.get("/users", auth, async (req, res) => {

    try {

        const users = await Employee.find().sort({ _id: -1 });

        res.status(200).json(users);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }
    

});
// Delete Expense
app.delete("/expense/:id", auth, async (req, res) => {

    try {

        const expense = await Expense.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.userId
        });

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.status(200).json({
            message: "Expense deleted successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

});
// Update Expense
app.put("/expense/:id", auth, async (req, res) => {

    try {

        const { title, category, amount, payment, date } = req.body;

        const expense = await Expense.findOneAndUpdate(

            {
                _id: req.params.id,
                userId: req.user.userId
            },

            {
                title,
                category,
                amount,
                payment,
                date
            },

            {
                new: true
            }

        );

        if (!expense) {

            return res.status(404).json({
                message: "Expense not found"
            });

        }

        res.status(200).json({
            message: "Expense updated successfully",
            expense
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

});
// Get Profile
app.get("/profile", auth, async (req, res) => {

    try {

        const user = await User.findById(req.user.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(user);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

});

// Update Profile (Name/Email)
app.put("/profile", auth, async (req, res) => {

    try {

        const { name, email } = req.body;

        const existingUser = await User.findOne({ email, _id: { $ne: req.user.userId } });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already in use"
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId,
            { name, email },
            { new: true }
        ).select("-password");

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

});

// Change Password
app.put("/change-password", auth, async (req, res) => {

    try {

        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Current password is incorrect"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            message: "Password changed successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

});
// Add User (Employee) API
app.post("/add-user", auth, async (req, res) => {

    try {

        const { firstName, lastName, email, dob, state, city, userType } = req.body;

        const existingEmployee = await Employee.findOne({ email });

        if (existingEmployee) {
            return res.status(400).json({
                message: "User with this email already exists"
            });
        }

        // Convert "Admin" -> 0, "User" -> 1
        const userTypeCode = userType === "Admin" ? 0 : 1;

        const newEmployee = new Employee({
            firstName,
            lastName,
            email,
            dob,
            state,
            city,
            userType: userTypeCode
        });

        await newEmployee.save();

        res.status(201).json({
            message: "User added successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

});
// Delete User (Employee)
app.delete("/user/:id", auth, async (req, res) => {

    try {

        const deletedUser = await Employee.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User deleted successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

});
// Update Employee
app.put("/user/:id", auth, async (req, res) => {

    try {

        const { firstName, lastName, email, dob, state, city, userType } = req.body;

        // "Admin"/"User" string ko 0/1 mein convert karo, add-user route jaisa
        const userTypeCode = userType === "Admin" ? 0 : 1;

        const updatedUser = await Employee.findByIdAndUpdate(
            req.params.id,
            {
                firstName,
                lastName,
                email,
                dob,
                state,
                city,
                userType: userTypeCode
            },
            {
                new: true
            }
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User updated successfully",
            user: updatedUser
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

});

// Test route
app.get("/", (req,res)=>{
    res.send("Backend is running");
});
app.get("/test", (req, res) => {
    res.send("Signup server is working");
});

// Server start
app.listen(5000,()=>{
    console.log("Server running on port 5000");
});