const mongoose = require('mongoose')

const { Schema, model } = mongoose

const userSchema = new Schema({
  __v: { type: Number, select: false },
  name: { type: String, required: true },
  password: { type: String, required: true, select: false },
  avatar_url: { type: String },
  gender: { type: String, enum: ['male', 'female'], default: 'male' },
  // 简介
  headline: { type: String },
  // 居住地
  locations: { type: [{ type: String }], select: false },
  // 所在行业
  business: { type: String, select: false },
  // 职业经历
  employments: {
    type: [
      {
        company: { type: String },
        job: { type: String }
      }
    ],
    select: false
  },
  // 教育经历
  educations: {
    type: [
      {
        school: { type: String },
        major: { type: String },
        diploma: { type: Number, enum: [1, 2, 3, 4, 5] },
        entrance_year: { type: Number },
        graduate_year: { type: Number }
      }
    ],
    select: false
  }
})

module.exports = model('User', userSchema)
