'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    title: String,
    description: String,
    estimatedTime: String,
    materialsNeeded: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
     }
});

const Course = mongoose.model("Course",CourseSchema);

module.exports.Course = Course;