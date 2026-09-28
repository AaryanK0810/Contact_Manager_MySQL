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
module.exports = {getContacts , createContact};