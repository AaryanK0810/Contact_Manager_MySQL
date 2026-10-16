import { useEffect, useState } from "react";
import { useNavigate  } from "react-router-dom";
import { apiRequest } from "../services/api";

function Contacts() {
  const navigate = useNavigate();

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm , setSearchTerm] = useState("");
  const [editingContactId , setEditingContactId] = useState(null);
  const [editForm , setEditForm] = useState({
    name : "" , 
    email : "" , 
    phone : "" ,
    type : "personal",
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
    type: "personal",
});
  
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
  (contact.name ?? "")
    .toLowerCase()
    .includes(searchTerm.toLowerCase())
);

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

  function handleEditClick(contact)
  {
    setEditingContactId(contact.id);

    setEditForm({
      name : contact.name || "" ,
      email : contact.email || "",
      phone : contact.phone || "",
      type : contact.type || "personal"
    });
  }
  async function handleUpdate(event, contactId) {
  event.preventDefault();
  setError("");

  try {
    const updatedContact = await apiRequest(
      `/api/contacts/${contactId}`,
      {
        method: "PUT",
        body: JSON.stringify(editForm),
      }
    );

    setContacts((currentContacts) =>
      currentContacts.map((contact) =>
        contact.id === contactId
          ? { ...contact, ...updatedContact }
          : contact
      )
    );

    setEditingContactId(null);
  } catch (err) {
    setError(err.message);
  }
}


async function handleCreateContact(event) {
  event.preventDefault();
  setError("");

  try {
    const response = await apiRequest("/api/contacts", {
      method: "POST",
      body: JSON.stringify(newContact),
    });

    console.log("Create contact response:", response);

    // Temporarily reload contacts from the backend.
    // This avoids assuming the POST response shape.
    const refreshedContacts = await apiRequest("/api/contacts");

    setContacts(refreshedContacts);

    setNewContact({
      name: "",
      email: "",
      phone: "",
      type: "personal",
    });

    setShowCreateForm(false);
  } catch (err) {
    setError(err.message);
  }
}

    return (
    <main className="contacts-container">
      <button onClick={handleLogout}>Log Out</button>

      <h1>My Contacts</h1>
      <p>Manage your contacts in one place.</p>

      <button
  onClick={() => setShowCreateForm((current) => !current)}
>
  {showCreateForm ? "Cancel" : "Add Contact"}
</button>

{showCreateForm && (
  <form
  className="edit-contact-form"
  onSubmit={handleCreateContact}
>
    <input
      type="text"
      placeholder="Name"
      value={newContact.name}
      onChange={(event) =>
        setNewContact({ ...newContact, name: event.target.value })
      }
      required
    />

    <input
      type="email"
      placeholder="Email"
      value={newContact.email}
      onChange={(event) =>
        setNewContact({ ...newContact, email: event.target.value })
      }
    />

    <input
      type="tel"
      placeholder="Phone"
      value={newContact.phone}
      onChange={(event) =>
        setNewContact({ ...newContact, phone: event.target.value })
      }
    />

    <select
      value={newContact.type}
      onChange={(event) =>
        setNewContact({ ...newContact, type: event.target.value })
      }
    >
      <option value="personal">Personal</option>
      <option value="work">Work</option>
    </select>

    <button type="submit">Create Contact</button>
  </form>
)}

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
          <button onClick = {() => handleEditClick(contact)}>
            Update
          </button>
          <button onClick={() => handleDelete(contact.id)}>
            Delete
          </button>
        </div>
        {editingContactId === contact.id && (
  <form
  className="edit-contact-form"
  onSubmit={(event) => handleUpdate(event, contact.id)}
>
    <input
      type="text"
      placeholder="Name"
      value={editForm.name}
      onChange={(event) =>
        setEditForm({ ...editForm, name: event.target.value })
      }
      required
    />

    <input
      type="email"
      placeholder="Email"
      value={editForm.email}
      onChange={(event) =>
        setEditForm({ ...editForm, email: event.target.value })
      }
    />

    <input
      type="tel"
      placeholder="Phone"
      value={editForm.phone}
      onChange={(event) =>
        setEditForm({ ...editForm, phone: event.target.value })
      }
    />

    <input
      type="text"
      placeholder="Contact type"
      value={editForm.type}
      onChange={(event) =>
        setEditForm({ ...editForm, type: event.target.value })
      }
    />

    <button type="submit">Save Changes</button>

    <button
      type="button"
      onClick={() => setEditingContactId(null)}
    >
      Cancel
    </button>
  </form>
)}
      </article>
    ))}
  </div>
)}
    </main>
  );
}

export default Contacts;
