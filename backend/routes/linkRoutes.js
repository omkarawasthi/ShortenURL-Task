const express = require('express');
const router = express.Router();
const { 
  createLink, 
  getAllLinks, 
  getLinkStats, 
  deleteLink
} = require('../controllers/linkController');

// Create a new link
router.post('/links', createLink);

// Get all links
router.get('/links', getAllLinks);

// Get stats for a specific link
router.get('/links/:code', getLinkStats);

// Delete a link
router.delete('/links/:code', deleteLink);


module.exports = router;