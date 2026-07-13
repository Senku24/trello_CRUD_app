const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.MONGO_URI);

//schemas and models
const userSchema = new mongoose.Schema({
    username: String,
    password: String
})
const organizationSchema = new mongoose.Schema({
    title: String,
    description: String,
    admin: mongoose.Types.ObjectId,
    members: [mongoose.Types.ObjectId]

})

const organizationModel = mongoose.model("organization", organizationSchema);
const userModel = mongoose.model("user", userSchema);

module.exports = {userModel, organizationModel};