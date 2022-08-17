import { Schema } from 'mongoose'

const ToDo = new Schema({
  title: String,
  description: String,
})

export default ToDo
