const updateAContact = document.getElementById("updateAContact");
const updateContactForm = document.getElementById("updateContactForm");
const submitUpdateContact = document.getElementById("submitUpdateContact");
const updateMessage = document.getElementById("updateMessage");

updateAContact.addEventListener("click", () => {
    if(updateContactForm.style.display === 'none')
    {
        updateContactForm.style.display = "block";
    }
    
    else
    {
        updateContactForm.style.display = 'none';
    }
});

submitUpdateContact.addEventListener("click", async () => {
    try {
        const token = localStorage.getItem("token");

        const contactId = document.getElementById("updateContactId").value;
        const name = document.getElementById("updateContactName").value;
        const email = document.getElementById("updateContactEmail").value;
        const phone = document.getElementById("updateContactPhone").value;
        const type = document.getElementById("updateContactType").value;

        const response = await authenticatedFetch(`/api/contacts/${contactId}`, {
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
        });

        const data = await response.json();

        if (!response.ok) {
            updateMessage.textContent = data.message;
            return;
        }

        updateMessage.textContent = data.message;

        updateContactForm.style.display = "none";
    }
    catch (error) {
        console.log(error);
        updateMessage.textContent = "Something went wrong";
    }
});