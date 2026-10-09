const getContactById = document.getElementById("getContactById");
const getContactForm = document.getElementById("getContactForm");
const submitContactId = document.getElementById("submitContactId");
const singleContactContainer = document.getElementById("singleContactContainer");

getContactById.addEventListener("click", () => {
    if (getContactForm.style.display === "none") {
        getContactForm.style.display = "block";
    }
    else {
        getContactForm.style.display = "none";
    }
});

// Builds the name / email / phone / type block for a contact
function renderContactDetails(details, contact) {
    details.innerHTML = "";

    const name = document.createElement("h3");
    name.className = "contact-name";
    name.textContent = contact.name || "Unnamed contact";

    const id = document.createElement("p");
    id.className = "contact-meta";
    id.textContent = `ID ${contact.id}`;

    const email = document.createElement("p");
    email.className = "contact-meta";
    email.textContent = contact.email || "No email provided";

    const phone = document.createElement("p");
    phone.className = "contact-meta";
    phone.textContent = contact.phone || "No phone provided";

    const type = document.createElement("span");
    type.className = "contact-type";
    type.textContent = contact.type || "General";

    details.append(name, id, email, phone, type);
}

submitContactId.addEventListener("click", async () => {
    try {
        const token = localStorage.getItem("token");
        const contactQuery = document.getElementById("contactQuery").value;

        const response = await authenticatedFetch(
            `/api/contacts/search?query=${encodeURIComponent(contactQuery)}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            singleContactContainer.textContent = data.message;
            return;
        }

        singleContactContainer.innerHTML = "";

        if (data.length === 0) {
            singleContactContainer.textContent = "No contacts found";
            return;
        }

        data.forEach(contact => {
            const contactElement = document.createElement("article");
            contactElement.className = "contact-row";

            const contactInfo = document.createElement("div");
            contactInfo.className = "contact-details";
            renderContactDetails(contactInfo, contact);

            const actions = document.createElement("div");
            actions.className = "contact-actions";

            const updateButton = document.createElement("button");
            updateButton.type = "button";
            updateButton.className = "button button-update";
            updateButton.textContent = "Update";

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "button button-delete";
            deleteButton.textContent = "Delete";

            actions.append(updateButton, deleteButton);

            const updateForm = document.createElement("div");
            updateForm.className = "inline-update-form";
            updateForm.hidden = true;

            updateForm.innerHTML = `
                <label>Name<input type="text" class="search-update-name"></label>
                <label>Email<input type="email" class="search-update-email"></label>
                <label>Phone<input type="text" class="search-update-phone"></label>
                <label>Type<input type="text" class="search-update-type"></label>
                <div class="inline-form-actions">
                    <button type="button" class="button button-primary save-search-update">Save changes</button>
                </div>
            `;

            updateForm.querySelector(".search-update-name").value = contact.name || "";
            updateForm.querySelector(".search-update-email").value = contact.email || "";
            updateForm.querySelector(".search-update-phone").value = contact.phone || "";
            updateForm.querySelector(".search-update-type").value = contact.type || "";

            contactElement.append(contactInfo, actions, updateForm);

            updateButton.addEventListener("click", () => {
                updateForm.hidden = !updateForm.hidden;
            });

            updateForm
                .querySelector(".save-search-update")
                .addEventListener("click", async () => {

                    try {
                        const name =
                            updateForm.querySelector(".search-update-name").value;

                        const email =
                            updateForm.querySelector(".search-update-email").value;

                        const phone =
                            updateForm.querySelector(".search-update-phone").value;

                        const type =
                            updateForm.querySelector(".search-update-type").value;

                        const response = await authenticatedFetch(
                            `/api/contacts/${contact.id}`,
                            {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${token}`
                                },
                                body: JSON.stringify({
                                    name,
                                    email,
                                    phone,
                                    type
                                })
                            }
                        );

                        const result = await response.json();

                        if (!response.ok) {
                            alert(result.message);
                            return;
                        }

                        renderContactDetails(contactInfo, {
                            id: contact.id,
                            name,
                            email,
                            phone,
                            type
                        });

                        updateForm.hidden = true;
                    }
                    catch (error) {
                        console.log(error);
                        alert("Something went wrong");
                    }
                });

            deleteButton.addEventListener("click", async () => {

                try {
                    const token = localStorage.getItem("token");

                    const response = await authenticatedFetch(
                        `/api/contacts/${contact.id}`,
                        {
                            method: "DELETE",
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );

                    const result = await response.json();

                    if (!response.ok) {
                        alert(result.message);
                        return;
                    }

                    contactElement.remove();
                }
                catch (error) {
                    console.log(error);
                    alert("Something went wrong");
                }
            });

            singleContactContainer.appendChild(contactElement);
        });

        getContactForm.style.display = "none";
    }
    catch (error) {
        console.log(error);
        singleContactContainer.textContent = "Something went wrong";
    }
});