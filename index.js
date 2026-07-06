const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
const port= 3000;
app.use(express.json());
// username, pass, org, boards, issues
let USERS_ID = 1;
let ORGANIZATIONS_ID = 1;
let BOARDS_ID = 1;
let ISSUES_ID = 1;
const USERS = [];
const ORGANIZATIONS = [];
const BOARDS = [];
const ISSUES = [];

//create endpoints
app.post('/signup', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = USERS.find(user => user.username === username);
    if (userExists) {
        return res.status(411).json({ message: 'Username already exists' });
    }
    USERS.push({ id: USERS_ID++, username, password });
    res.status(201).json({ message: 'User created successfully' });
})

app.post('/signin', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = USERS.find(user => user.username === username && user.password === password);
    if (!userExists) {
        return res.status(403).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userID: userExists.id }, 'nix123')
    res.status(200).json({ message: 'Signin successful', token });
})
app.post('/Organization', (req, res) => {
})
app.post('/add-member-to-organization', (req, res) => {
})
app.post('/Board', (req, res) => {
})
app.post('/issue', (req, res) => {
})

//read endpoints
app.get('/boards', (req, res) => {
})
app.get('/issues', (req, res) => {
})
app.get('/members', (req, res) => {
})

//update endpoints
app.put('/issues', (req, res) => {
})

//delete endpoints
app.delete('/members', (req, res) => {
})


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});