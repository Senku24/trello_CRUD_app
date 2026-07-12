const mongoose = require("mongoose");
mongoose.connect("");

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