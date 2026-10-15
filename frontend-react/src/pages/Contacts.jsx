
import { useEffect, useState } from "react";
import { useNavigate  } from "react-router-dom";
import { apiRequest } from "../services/api";



function Contacts() {
  const navigate = useNavigate();

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) {
    return <p>Loading contacts...</p>;
  }

  if (error) {
    return <p role="alert">Error: {error}</p>;
  }

  return (
    <main className="contacts-container">
      <button onClick={handleLogout}>Log Out</button>

      <h1>My Contacts</h1>
      <p>Manage your contacts in one place.</p>

      {contacts.length === 0 ? (
        <p>No active contacts found.</p>
      ) : (
        <div className="contacts-list">
          {contacts.map((contact) => (
            <article className="contact-card" key={contact.id}>
              <div>
                <h2>{contact.name}</h2>
                <p>{contact.email}</p>
                <p>{contact.phone}</p>
                <small>{contact.type}</small>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default Contacts;
