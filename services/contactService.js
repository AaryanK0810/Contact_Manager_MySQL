const db = require('../db');

const getContacts = async (userId) => {
    const [contacts] = await db.query(
        'SELECT * FROM contacts WHERE user_id = ?',
        [userId]
    );
    return contacts;
}

module.exports = {getContacts};