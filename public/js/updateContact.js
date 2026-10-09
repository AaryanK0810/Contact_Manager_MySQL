const updateMessage = document.getElementById("updateMessage");

const contactContainerForUpdate = document.getElementById("contactContainer");

if (contactContainerForUpdate) {
    contactContainerForUpdate.addEventListener("click", (event) => {
        const button = event.target.closest(".update-contact-btn");
        if (!button) return;

        const row = button.closest(".contact-row");
        if (!row) return;

        const existingForm = row.querySelector(".inline-update-form");
        if (existingForm) {
            existingForm.remove();
            return;
        }

        const form = document.createElement("form");
        form.className = "inline-update-form";
        form.innerHTML = `
            <label>Name<input name="name" type="text" required></label>
            <label>Email<input name="email" type="email"></label>
            <label>Phone<input name="phone" type="text"></label>
            <label>Type<input name="type" type="text"></label>
            <div class="inline-form-actions">
                <button type="submit" class="button button-primary">Save changes</button>
                <button type="button" class="button button-secondary cancel-update-btn">Cancel</button>
            </div>
        `;

        form.elements.name.value = button.dataset.name;
        form.elements.email.value = button.dataset.email;
        form.elements.phone.value = button.dataset.phone;
        form.elements.type.value = button.dataset.type;
        row.appendChild(form);
    });

    contactContainerForUpdate.addEventListener("click", (event) => {
        if (event.target.closest(".cancel-update-btn")) {
            event.target.closest(".inline-update-form")?.remove();
        }
    });

    contactContainerForUpdate.addEventListener("submit", async (event) => {
        const form = event.target.closest(".inline-update-form");
        if (!form) return;

        event.preventDefault();

        const row = form.closest(".contact-row");
        const contactId = row?.dataset.contactId;
        if (!contactId) return;

        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = "Saving...";

        const formData = new FormData(form);
        const body = {
            name: formData.get("name").trim(),
            email: formData.get("email").trim(),
            phone: formData.get("phone").trim(),
            type: formData.get("type").trim()
        };

        try {
            const response = await authenticatedFetch(`/api/contacts/${contactId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                let error = form.querySelector(".form-error");
                if (!error) {
                    error = document.createElement("p");
                    error.className = "form-error contact-notice";
                    form.appendChild(error);
                }
                error.textContent = data.message || "Could not update this contact.";
                submitButton.disabled = false;
                submitButton.textContent = "Save changes";
                return;
            }

            if (typeof window.loadContacts === "function") {
                await window.loadContacts();
            }
        } catch (error) {
            console.error(error);
            let errorNotice = form.querySelector(".form-error");
            if (!errorNotice) {
                errorNotice = document.createElement("p");
                errorNotice.className = "form-error contact-notice";
                form.appendChild(errorNotice);
            }
            errorNotice.textContent = "Something went wrong while updating this contact.";
            submitButton.disabled = false;
            submitButton.textContent = "Save changes";
        }
    });
}
