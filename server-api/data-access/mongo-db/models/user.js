import { Schema } from 'mongoose'

const User = new Schema({
  username: String,
  displayName: String,
  email: String,
  hash: String,
  salt: String,
  tokens: [String],
})

export default User
