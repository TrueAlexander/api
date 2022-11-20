import mongoose from "mongoose"

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  textShort: {
    type: String,
    required: true,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  authorUsername: {
    type:String,
    required: true
  },
  imageUrl: {
    type: String,
  }
},
{
  timestamps: true
})

export default mongoose.model('Post', PostSchema)