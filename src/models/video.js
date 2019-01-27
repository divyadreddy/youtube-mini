const mongoose = require('mongoose');

const videoSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  title: { type: String, required: true},
  description: { type: String, required: true},
  clicks: { type: Number, default: 1},
  videoFile: { type: String},//, required: true},
  link: { type: String, required: true}
});

module.exports = mongoose.model('Video', videoSchema);
