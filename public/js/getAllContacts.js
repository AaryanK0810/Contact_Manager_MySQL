const getAllContacts = document.getElementById("getAllContacts");
const contactContainer = document.getElementById("contactContainer");

getAllContacts.addEventListener("click", async () => {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch("/api/contacts", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        contactContainer.innerHTML = "";

        data.forEach(contact => {
            const contactElement = document.createElement("p");

            contactElement.textContent =
                `ID : ${contact.id} | Name : ${contact.name} | Email : ${contact.email} | Phone : ${contact.phone}`;

            contactContainer.appendChild(contactElement);
        });
    }
    catch (error) {
        console.log(error);
    }
});