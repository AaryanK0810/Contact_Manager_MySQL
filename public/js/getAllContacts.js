const getAllContactsButton = document.getElementById("getAllContacts");
const contactContainer = document.getElementById("contactContainer");

if (contactContainer) {
    contactContainer.style.display = "none";
}

async function loadContacts() {
    if (!contactContainer) return;

    contactContainer.style.display = "block";
    contactContainer.innerHTML = '<p class="contact-notice">Loading contacts...</p>';

    try {
        const response = await authenticatedFetch("/api/contacts", {
            method: "GET"
        });

        const data = await response.json();

        contactContainer.innerHTML = "";

        if (!response.ok) {
            contactContainer.innerHTML = "";
            const notice = document.createElement("p");
            notice.className = "contact-notice";
            notice.textContent = data.message || "Unable to load contacts.";
            contactContainer.appendChild(notice);
            return;
        }

        if (!Array.isArray(data) || data.length === 0) {
            const notice = document.createElement("p");
            notice.className = "contact-notice";
            notice.textContent = "No active contacts yet. Add a contact to get started.";
            contactContainer.appendChild(notice);
            return;
        }

        data.forEach((contact) => {
            const row = document.createElement("article");
            row.className = "contact-row";
            row.dataset.contactId = contact.id;

            const details = document.createElement("div");
            details.className = "contact-details";

            const name = document.createElement("h3");
            name.className = "contact-name";
            name.textContent = contact.name || "Unnamed contact";

            const email = document.createElement("p");
            email.className = "contact-meta";
            email.textContent = contact.email || "No email provided";

            const phone = document.createElement("p");
            phone.className = "contact-meta";
            phone.textContent = contact.phone || "No phone provided";

            const type = document.createElement("span");
            type.className = "contact-type";
            type.textContent = contact.type || "General";

            details.append(name, email, phone, type);

            const actions = document.createElement("div");
            actions.className = "contact-actions";

            const updateButton = document.createElement("button");
            updateButton.type = "button";
            updateButton.className = "button button-update update-contact-btn";
            updateButton.textContent = "Update";
            updateButton.dataset.contactId = contact.id;
            updateButton.dataset.name = contact.name || "";
            updateButton.dataset.email = contact.email || "";
            updateButton.dataset.phone = contact.phone || "";
            updateButton.dataset.type = contact.type || "";

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "button button-delete delete-contact-btn";
            deleteButton.textContent = "Delete";
            deleteButton.dataset.contactId = contact.id;

            actions.append(updateButton, deleteButton);
            row.append(details, actions);
            contactContainer.appendChild(row);
        });
    } catch (error) {
        console.error(error);
        contactContainer.innerHTML = "";
        const notice = document.createElement("p");
        notice.className = "contact-notice";
        notice.textContent = "Something went wrong while loading contacts.";
        contactContainer.appendChild(notice);
    }
}

window.loadContacts = loadContacts;

if (getAllContactsButton) {
    getAllContactsButton.addEventListener("click", async () => {
        if (contactContainer.style.display === "block") {
            contactContainer.style.display = "none";
            return;
        }
        await loadContacts();
    });
}
