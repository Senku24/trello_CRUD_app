const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { authMiddleware } = require("./middleware");

const { userModel, organizationModel } = require("./models");

const app = express();
const port= 3001;
app.use(express.json());



// username, pass, org, boards, issues
// let USERS_ID = 1;
// let ORGANIZATIONS_ID = 1;
let BOARDS_ID = 1;
let ISSUES_ID = 1;
// const USERS = [];
// const ORGANIZATIONS = [];
const BOARDS = [];
const ISSUES = [];

//create endpoints
app.post('/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExists =await userModel.findOne({username: username});
    if (userExists) {
        return res.status(411).json({ message: 'Username already exists'});
    }
    // USERS.push({ id: USERS_ID++, username, password });
    const newUser = await userModel.create({
        username,
        password
    })
    res.status(201).json({ message: 'User created successfully' , id: newUser._id });
})

app.post('/signin', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = await userModel.findOne({ username, password });
    if (!userExists) {
        return res.status(403).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userID: userExists.id }, 'nix123')
    res.status(200).json({ message: 'Signin successful', token });
})
app.post('/Organization', authMiddleware, async (req, res) => {
    const userID =req.userID;
    // ORGANIZATIONS.push({ id: ORGANIZATIONS_ID++,
    //     title: req.body.title,
    //     description: req.body.description,
    //     admin: userID,
    //     members: [] });
    const newOrg= await organizationModel.create({
        title: req.body.title,
        description: req.body.description,
        admin: userID,
        members: []
    });
    res.status(201).json({ message: 'Organization created successfully' , id: newOrg._id });



})
app.post('/add-member-to-organization', authMiddleware, async (req, res) => {
    const userID = req.userID;
    const organizationID = req.body.organizationID;
    const memberUsername = req.body.memberUsername;

    const organization = await organizationModel.findOne({ _id: organizationID });
    if (!organization || organization.admin.toString() !== userID) {
        return res.status(404).json({ message: 'Organization not found or not an admin' });
    }
    const memberUser = await userModel.findOne({ username: memberUsername }  );
    if (!memberUser) {
        return res.status(404).json({ message: 'Member user not found' });
    }
    // organization.members.push(memberUser.id);
    const addMember = await organizationModel.updateOne({ _id: organizationID}, {
        $push:{
            members: memberUser._id
        }
    })
    res.json({message: 'Member added to organization successfully' , memberId: memberUser._id});
})
app.post('/Board', authMiddleware, async (req, res) => {
    const userID = req.userID;

})
app.post('/issue', authMiddleware, (req, res) => {
    const userID = req.userID;
})

//read endpoints
app.get('/boards', authMiddleware, (req, res) => {
})
app.get('/organizations', authMiddleware, async (req, res) => {
    const userID = req.userID;
    const organizationID = req.query.organizationID;

    const organization = await organizationModel.findOne({ _id: organizationID });
    if (!organization || organization.admin.toString() !== userID) {
        return res.status(404).json({ message: 'Organization not found or not an admin' });
    }
    res.json({ organization: organization});
    
})
app.get('/issues', authMiddleware, (req, res) => {
})
app.get('/members', authMiddleware, (req, res) => {
})

//update endpoints
app.put('/issues', authMiddleware, (req, res) => {
})

//delete endpoints
app.delete('/members', authMiddleware, async (req, res) => {
     const userID = req.userID;
    const organizationID = req.body.organizationID;
    const memberUsername = req.body.memberUsername;

    const organization = await organizationModel.findOne({ _id: organizationID });
    if (!organization || organization.admin.toString() !== userID) {
        return res.status(404).json({ message: 'Organization not found' });
    }
    const memberUser = await userModel.findOne({ username: memberUsername });
    if (!memberUser) {
        return res.status(404).json({ message: 'Member user not found' });
    }
    // organization.members = organization.members.filter(id => id !== memberUser._id);
    const removeMember= await organizationModel.updateOne({ _id: organizationID }, {
        $pullAll: {
            members: [memberUser._id]
        }
})
    res.json({message: 'Member removed from organization successfully' });
})


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});