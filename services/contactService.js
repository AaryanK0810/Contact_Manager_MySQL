const db = require('../db');

const getContacts = async (userId) => {
    const [contacts] = await db.query(
        'SELECT * FROM contacts WHERE user_id = ?',
        [userId]
    );
    return contacts;
}

const createContact = async (userId , name , email , phone , type) => {
    if (!name)
    {
        throw new Error('NAME_REQUIRED');
    }

    const [result] = await db.query(
        'INSERT INTO contacts (user_id , name , email , phone , type) VALUES (? , ? , ? , ? , ?)',
        [
            userId,
            name,
            email,
            phone,
            type || 'personal'
        ]
    );

return {
    message: "Contact created successfully",
    contactId: result.insertId
};
}

const getContactById = async(contactId , userId) => {
    const [contacts] = await db.query(
        'SELECT * FROM contacts WHERE id = ? AND user_id = ? ',
        [
            contactId,
            userId
        ]
    );

    if(contacts.length === 0)
    {
        throw new Error('CONTACT_NOT_FOUND');
    }

    return contacts[0];
}

const updateContact = async (contactId , userId , name , email , phone , type) => {

    if(!name)
    {
        throw new Error ('NAME_REQUIRED');
    }
    const [contacts] = await db.query(
        'UPDATE contacts SET name = ? , email = ? , phone = ? , type = ? WHERE id = ? AND user_id = ?',
        [
            name,
            email,
            phone,
            type,
            contactId,
            userId
        ]
    );

    if(contacts.affectedRows === 0)
    {
        throw new Error ('CONTACT_NOT_FOUND');
    }
    return {
        message : 'Contact updated successfully'
    }
};
module.exports = {getContacts , createContact , getContactById , updateContact};