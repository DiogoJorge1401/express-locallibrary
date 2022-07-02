import { Schema, model } from 'mongoose';
import { DateTime } from 'luxon'

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date }
})

AuthorSchema.virtual('name').get(function () {
  const fullname = `${this.family_name}, ${this.first_name}`
  return fullname
})

AuthorSchema.virtual('lifespan').get(function () {
  let lifetime_string = ''

  if (this.date_of_birth)
    lifetime_string += DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)

  lifetime_string += ' - '
  if (this.date_of_death)
    lifetime_string += DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)

  return lifetime_string
})

AuthorSchema.virtual('date_of_birth_formatted').get(function () {
  return DateTime.fromJSDate(this.date_of_birth as Date).toFormat('yyyy-LL-dd')
})

AuthorSchema.virtual('date_of_death_formatted').get(function () {
  return DateTime.fromJSDate(this.date_of_death as Date).toFormat('yyyy-LL-dd')
})

AuthorSchema.virtual('url').get(function () {
  return `/catalog/author/${this._id}`
})

export default model('Author', AuthorSchema)