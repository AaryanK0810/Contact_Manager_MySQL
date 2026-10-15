import { useEffect, useState } from "react";
import { useNavigate  } from "react-router-dom";
import { apiRequest } from "../services/api";

function Contacts() {
  const navigate = useNavigate();

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm , setSearchTerm] = useState("");

  useEffect(() => {
    async function loadContacts() {
      try {
        const data = await apiRequest("/api/contacts");
        setContacts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadContacts();
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  }

  const filteredContacts = contacts.filter((contact) =>
  contact.name.toLowerCase().includes(searchTerm.toLowerCase()))

  if (loading) {
    return <p>Loading contacts...</p>;
  }

  if (error) {
    return <p role="alert">Error: {error}</p>;
  }

  async function handleDelete(contactId)
  {
    const confirmed = window.confirm(
      "Are you sure you want to delete this contact?"
    );

    if(!confirmed)
    {
      return;
    }

    try
    {
      await apiRequest(`/api/contacts/${contactId}`, {
        method : "DELETE",
      });

      setContacts((currentContacts) => currentContacts.filter((contact) => contact.id !== contactId)
    );
    }
    catch(err)
    {
      setError(err.message);
    }
  }
  return (
    <main className="contacts-container">
      <button onClick={handleLogout}>Log Out</button>

      <h1>My Contacts</h1>
      <p>Manage your contacts in one place.</p>

      <div className = 'contact-search'>
        <input type = 'text' placeholder="Search contact by Name" value = {searchTerm} onChange = {(event) => setSearchTerm(event.target.value)}/>
      </div>

      {contacts.length === 0 ? (
  <p>No active contacts found.</p>
) : filteredContacts.length === 0 ? (
  <p>No contacts match "{searchTerm}".</p>
) : (
  <div className="contacts-list">
    {filteredContacts.map((contact) => (
      <article className="contact-card" key={contact.id}>
        <div>
          <h2>{contact.name}</h2>
          <p>{contact.email}</p>
          <p>{contact.phone}</p>
          <small>{contact.type}</small>
        </div>
        <div className="contact-actions">
          <button onClick={() => handleDelete(contact.id)}>
            Delete
          </button>
        </div>
      </article>
    ))}
  </div>
)}
    </main>
  );
}

export default Contacts;
