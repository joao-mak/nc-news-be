const express = require('express')
const commentsRouter = express.Router()

const { patchComment, deleteCommentById } = require('../controllers/comments.controller.js')
const { send405 } = require('../controllers/errors.controller.js');


commentsRouter.route('/:comment_id').patch(patchComment).delete(deleteCommentById).all(send405)

module.exports = commentsRouter;