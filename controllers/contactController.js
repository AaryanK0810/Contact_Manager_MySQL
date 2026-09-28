const { errorMonitor } = require('supertest/lib/test');
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

const createContact = async (req , res) => {
    try{
        const {name , email , phone , type} = req.body;

        const result = await contactService.createContact(
            req.user.id,
            name, 
            email ,
            phone,
            type
        );

        res.status(201).json(result);
    }

    catch(error)
    {
        console.error(error);

        if(error.message === 'NAME_REQUIRED')
        {
            return res.status(400).json({
                message : 'Name is required'
            });
      }

      return res.status(500).json({
        message : 'Server error'
      });
        
    }
};

const getContactById = async (req , res) => {
        try{
            const contact = await contactService.getContactById(
                req.params.id,
                req.user.id
            );

            res.status(200).json(contact);
        }

        catch(error)
        {
            console.error(error);
         
            if(error.message === 'CONTACT_NOT_FOUND')
            {
                return res.status(404).json({
                    message : 'Contact not found'
                });
            }
            
            return res.status(500).json({
                message : 'Server error'
            });
        }
};

module.exports = {getContacts , createContact , getContactById}