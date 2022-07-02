import { Document, model, Schema } from 'mongoose';


const GenreSchema = new Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 100 },
})

GenreSchema.virtual('url').get(function () {
  return `/catalog/genre/${this._id}`
})

const Genre = model('Genre', GenreSchema)

export default Genre