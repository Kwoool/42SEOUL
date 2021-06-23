const express = require('express');
const router = express.Router();

const notiRouter = require('./board/notice');
const currRouter = require('./board/curriculum');
const joinRouter = require('./users/users');
const applyRouter = require('./board/apply');
const revRouter = require('./board/review');
const intRouter = require('./board/interview');
const faqRouter = require('./board/faq');
const applyAdminRouter = require('./admin/admin_apply');
const currAdminRouter = require('./admin/admin_curriculum');
const faqAdminRouter = require('./admin/admin_faq');
const categoryAdminRouter = require('./admin/admin_category');
const intAdminRouter = require('./admin/admin_interview');
const notiAdminRouter = require('./admin/admin_notice');
const revAdminRouter = require('./admin/admin_review');
const mainRouter = require('./main/main');

router.use('/notice', notiRouter)
router.use('/curr',currRouter);
router.use('/user',joinRouter);
router.use('/apply',applyRouter);
router.use('/review',revRouter);
router.use('/interview',intRouter);
router.use('/faq',faqRouter);
router.use('/admin',applyAdminRouter);
router.use('/admin',currAdminRouter);
router.use('/admin',faqAdminRouter);
router.use('/admin',categoryAdminRouter);
router.use('/admin',intAdminRouter);
router.use('/admin',notiAdminRouter);
router.use('/admin',revAdminRouter);
router.use('/',mainRouter);

module.exports = router;

