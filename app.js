require("dotenv").config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require("mongoose");
// const md5 = require("md5");
const bcrypt = require('bcrypt');
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

mongoose.set('strictQuery', false);
main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/userDB', { useNewUrlParser: true, useUnifiedTopology: true });
}

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", (req, res) => {
    const userName = req.body.username;
    const password = req.body.password;

    User.findOne({ email: userName }, (err, foundUser) => {
        if (err) console.log(err);
        else {
            if (foundUser) {
                bcrypt.compare(password, foundUser.password, (err, result) => {
                    if (result) res.render("secrets");
                    else res.send("Password is incorrect");
                });
            }
            else res.send("User not registered");
        }
    })
})

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {

    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) console.log(err);
        else {
            const newUser = new User({
                email: req.body.username,
                password: hash
            })

            newUser.save((err) => {
                if (err) console.log(err);
                else res.render("secrets");
            })
        }
    });
})

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
