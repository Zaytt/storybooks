const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const StorySchema = new Schema({
  user:         { type: Schema.Types.ObjectId, ref: 'users'},
  title:        { type: String, required: true },
  body:         { type: String, required: true},
  status:       { type: String, default: 'public' },
  allowComments:{ type: Boolean, default: true },
  publishDate:  { type: Date },
  comments:     [{
    commentBody: { type: String, required: true },
    commentDate: { type: Date, default: Date.now},
    commentUser: { type: Schema.Types.ObjectId, ref: 'users'}
  }]
});

// Create collection & Schema
mongoose.model('stories', StorySchema, 'stories');