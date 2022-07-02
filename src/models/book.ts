import { model, Schema } from 'mongoose';

const BookeSchema = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'Author', required: true },
  summary: { type: String, required: true },
  isbn: { type: String, required: true },
  genre: [{ type: Schema.Types.ObjectId, ref: 'Genre' }]
})


BookeSchema.virtual('url').get(function () {
  return `/catalog/book/${this._id}`
})

export default model('Book', BookeSchema)