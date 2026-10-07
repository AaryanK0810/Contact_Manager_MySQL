const express = require("express");
const db = require("../db");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

const contactController = require('../controllers/contactController');

router.get("/" , protect , contactController.getContacts);


router.post('/' , protect , contactController.createContact);

router.get("/search" , protect , contactController.searchContacts);

router.get("/:id" , protect , contactController.getContactById);

router.put('/:id' , protect , contactController.updateContacts);

router.delete('/:id' , protect , contactController.deleteContact);
module.exports = router;