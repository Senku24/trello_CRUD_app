const express = require("express");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("./middleware");

const app = express();
const port= 3001;
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
app.post('/Organization', authMiddleware, (req, res) => {
    const userID =req.userID;
    ORGANIZATIONS.push({ id: ORGANIZATIONS_ID++,
        title: req.body.title,
        description: req.body.description,
        admin: userID,
        members: [] });
    res.status(201).json({ message: 'Organization created successfully' , id: ORGANIZATIONS_ID - 1 });



})
app.post('/add-member-to-organization', authMiddleware, (req, res) => {
    const userID = req.userID;
    const organizationID = parseInt(req.body.organizationID);
    const memberUsername = req.body.memberUsername;

    const organization = ORGANIZATIONS.find(org => org.id === organizationID);
    if (!organization || organization.admin !== userID) {
        return res.status(404).json({ message: 'Organization not found or not an admin' });
    }
    const memberUser = USERS.find(user => user.username === memberUsername);
    if (!memberUser) {
        return res.status(404).json({ message: 'Member user not found' });
    }
    organization.members.push(memberUser.id);
    res.json({message: 'Member added to organization successfully' });
})
app.post('/Board', authMiddleware, (req, res) => {

})
app.post('/issue', authMiddleware, (req, res) => {
})

//read endpoints
app.get('/boards', authMiddleware, (req, res) => {
})
app.get('/organizations', authMiddleware, (req, res) => {
    const userID = req.userID;
    const organizationID = req.query.organizationID;

    const organization = ORGANIZATIONS.find(org => org.id === organizationID);
    if (!organization || organization.admin !== userID) {
        return res.status(404).json({ message: 'Organization not found or not an admin' });
    }
    res.json({ organization: {
        ...organization,
        members: organization.members.map(memberId => {
            const user = USERS.find(user => user.id === memberId);
            return {
                id: user.id,
                username: user.username
            }
        })
    }
    })
})
app.get('/issues', authMiddleware, (req, res) => {
})
app.get('/members', authMiddleware, (req, res) => {
})

//update endpoints
app.put('/issues', authMiddleware, (req, res) => {
})

//delete endpoints
app.delete('/members', authMiddleware, (req, res) => {
     const userID = req.userID;
    const organizationID = req.body.organizationID;
    const memberUsername = req.body.memberUsername;

    const organization = ORGANIZATIONS.find(org => org.id === organizationID);
    if (!organization || organization.admin !== userID) {
        return res.status(404).json({ message: 'Organization not found' });
    }
    const memberUser = USERS.find(user => user.username === memberUsername);
    if (!memberUser) {
        return res.status(404).json({ message: 'Member user not found' });
    }
    organization.members = organization.members.filter(id => id !== memberUser.id);
    res.json({message: 'Member removed from organization successfully' });
})


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});