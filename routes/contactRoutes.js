const express = require("express");
const db = require("../db");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/" , protect , async (req,res) =>{
    try{
        const [contacts] = await db.query(
            "SELECT * FROM contacts where user_id = ?",
            [req.user.id]
        );

        res.json(contacts);
    }
    catch(error)
    {
        console.error(error);

        res.status(500).json({
            message : "Server error"
        });
        
    }
});


router.post('/' , protect ,async(req,res) =>
{
    try{
        const {name , email , phone , type} = req.body;

        if(!name)
        {
            return res.status(400).json({
                message : 'Name is required'
            });
        }

        const [result] = await db.query (
            'INSERT INTO contacts (user_id , name , email , phone , type) VALUES (? , ? , ? , ? , ?)',
            [
                req.user.id,
                name,
                email,
                phone,
                type || 'personal'
            ]
        );

        res.status(201).json({
            message : 'Contact created successfully',
            contactId : result.insertId
        });
    }

    catch (error)
    {
        console.error(error);

        res.status(500).json({
            message : 'Server Error'
        });
        
    }
});

router.get("/:id" , protect , async (req ,res) =>{
    try{
        const[contacts] = await db.query(
            "SELECT * FROM contacts where id = ? AND user_id = ?",
            [req.params.id , req.user.id]
        );

        if(contacts.length === 0)
        {
            return res.json({
                message : 'Contact not found'
            });
        }

        res.json(contacts[0]);
    }

    catch(error)
    {
        console.error(error);
        
        res.status(500).json({
            message : 'Server error'
        });
    }

    
})

router.put('/:id' , protect , async(req , res) =>{
    try{
        const {name , email , phone , type} = req.body;

        const [result] = await db.query(
            `UPDATE contacts
             SET name = ?, email = ?, phone = ?, type = ?
             WHERE id = ? AND user_id = ?`,
            [
                name,
                email,
                phone,
                type,
                req.params.id,
                req.user.id
            ]
        );

        if(result.affectedRows === 0)
        {
            return res.status(404).json({
                message : 'Contact Not Found'
            });
        }
        res.json({
            message : 'Contact updated successfully'
        });
    }

    catch(error)
    {
        console.error(error);
        
        res.json({
            message : 'Server Error'
        });
    }
});

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