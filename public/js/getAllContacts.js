const getAllContacts = document.getElementById("getAllContacts");
const contactContainer = document.getElementById("contactContainer");

contactContainer.style.display = 'none';

// getAllContacts.addEventListener('click' , () => {
//     if(contactContainer.style.display === 'none')
//     {
//         contactContainer.style.display = 'block';
//     }
//     else
//     {
//         contactContainer.style.display = 'none';
//     }
// })
getAllContacts.addEventListener("click", async () => {

         if (contactContainer.style.display === "block") {
        contactContainer.style.display = "none";
        return;
    }

    contactContainer.style.display = "block";
    try {
        const token = localStorage.getItem("token");

        const response = await authenticatedFetch("/api/contacts", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        contactContainer.innerHTML = "";

        if (!response.ok) {
            contactContainer.textContent = data.message;
            return;
        }

        if (data.length === 0) {
            contactContainer.textContent = "No contacts exist";
            return;
        }

        data.forEach(contact => {
            const contactElement = document.createElement("p");

            contactElement.textContent =
                `ID : ${contact.id} | Name : ${contact.name} | Email : ${contact.email} | Phone : ${contact.phone} | Type : ${contact.type}`;

            contactContainer.appendChild(contactElement);
        });
    }
    catch (error) {
        console.log(error);
        contactContainer.textContent = "Something went wrong";
    }
});