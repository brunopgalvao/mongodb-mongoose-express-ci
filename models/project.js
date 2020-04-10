const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Project = new Schema(
    {
        title: { type: String, required: true },
        image_url: { type: String, required: true },
        description: { type: String, required: true },
        github_url: { type: String, required: true },
        deployed_url: { type: String, required: true },
        user_id: { type: Schema.Types.ObjectId, ref: 'user_id' }
    },
    { timestamps: true },
)

module.exports = mongoose.model('projects', Project)