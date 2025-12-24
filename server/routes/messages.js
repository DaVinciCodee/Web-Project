const express = require('express');
const router = express.Router();
const Message = require('../models/Message'); 

const { addMessage, getMessages, getUrlMetadata } = require("../controllers/messageController");

router.post("/addmsg/", addMessage); 
router.post("/getmsg/", getMessages); 
router.post("/get-url-metadata/", getUrlMetadata);

module.exports = router;