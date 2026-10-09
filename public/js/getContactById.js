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
            const contactElement = document.createElement("div");

            const contactInfo = document.createElement("span");

            contactInfo.textContent =
                `ID : ${contact.id} | Name : ${contact.name} | Email : ${contact.email} | Phone : ${contact.phone} | Type : ${contact.type}`;

            const updateButton = document.createElement("button");
            updateButton.textContent = "Update";

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";

            contactElement.appendChild(contactInfo);
            contactElement.appendChild(updateButton);
            contactElement.appendChild(deleteButton);

            const updateForm = document.createElement("div");

            updateForm.style.display = "none";

            updateForm.innerHTML = `
                <input type="text" class="search-update-name" placeholder = 'name'>
                <input type="email" placeholder = 'email' class="search-update-email">
                <input type="text" placeholder = 'phone' class="search-update-phone">
                <input type="text" placeholder = 'type' class="search-update-type">
                <button class="save-search-update">Save Update</button>
            `;

            contactElement.appendChild(updateForm);

            updateButton.addEventListener("click", () => {
                if (updateForm.style.display === "none") {
                    updateForm.style.display = "block";
                }
                else {
                    updateForm.style.display = "none";
                }
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

                        contactInfo.textContent =
                            `ID : ${contact.id} | Name : ${name} | Email : ${email} | Phone : ${phone} | Type : ${type}`;

                        updateForm.style.display = "none";
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