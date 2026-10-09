const contactContainerForDelete = document.getElementById("contactContainer");

if (contactContainerForDelete) {
    contactContainerForDelete.addEventListener("click", async (event) => {
        const button = event.target.closest(".delete-contact-btn");
        if (!button) return;

        const contactId = button.dataset.contactId;
        if (!contactId) return;

        const row = button.closest(".contact-row");
        const contactName = row?.querySelector(".contact-name")?.textContent || "this contact";

        if (!window.confirm(`Delete the contact ${contactName}?`)) {
            return;
        }

        button.disabled = true;
        button.textContent = "Deleting..."; 

        try {
            const response = await authenticatedFetch(`/api/contacts/${contactId}`, {
                method: "DELETE"
            });

            const data = await response.json();

            if (!response.ok) {
                window.alert(data.message || "Could not delete this contact.");
                button.disabled = false;
                button.textContent = "Delete";
                return;
            }

            if (typeof window.loadContacts === "function") {
                await window.loadContacts();
            }
        } catch (error) {
            console.error(error);
            window.alert("Something went wrong while deleting this contact.");
            button.disabled = false;
            button.textContent = "Delete";
        }
    });
}
