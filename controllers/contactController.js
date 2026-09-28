const contactService = require('../services/contactService');


const getContacts = async (req , res) => {
        try{
            const contacts = await contactService.getContacts(req.user.id);

            res.status(200).json(contacts);
        }
        catch(error)
        {
            console.error(error);
            
            res.status(500).json({
                message : 'Server error'
            });
        }
};

module.exports = {getContacts}