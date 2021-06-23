const express = require('express');
const router = express.Router();
const {sequelize, Application, Curriculum, Faq, Hashtag, Review, Notice, User} = require('../../models/index')
const getCookie = require('../../middleware/getcookie');
const authAdmin = require('../../middleware/authadmin');
const { Op } = require("sequelize");



module.exports = router;
