const express = require("express");
const db = require("../db");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

const contactController = require('../controllers/contactController');

router.get("/" , protect , contactController.getContacts);


router.post('/' , protect , contactController.createContact);

router.get("/:id" , protect , contactController.getContactById);

router.put('/:id' , protect , contactController.updateContacts);

router.delete('/:id' , protect , async(req , res)=>{
    try{
        const [result] = await db.query(
            "DELETE FROM contacts where id = ? AND user_id = ?",
            [req.params.id , req.user.id]
        );

        if(result.affectedRows === 0)
        {
            return res.status(404).json({
                message : 'Contact not found'
            });
        }

        res.json({
            message : 'Contact deleted successfully'
        });
    }

    catch(error)
    {
        console.error(error);

        res.status(500).json({
            message : "Server error"
        });
        
    }
})
module.exports = router;