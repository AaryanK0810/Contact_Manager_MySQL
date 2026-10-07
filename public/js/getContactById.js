const getContactById = document.getElementById("getContactById");
const getContactForm = document.getElementById("getContactForm");
const submitContactId = document.getElementById("submitContactId");
const singleContactContainer = document.getElementById("singleContactContainer");

getContactById.addEventListener("click", () => {
    if(getContactForm.style.display === 'none')
    {
        getContactForm.style.display = "block";
    }
    else{
        getContactForm.style.display = 'none';
    }
});

submitContactId.addEventListener("click", async () => {
    try {
        const token = localStorage.getItem("token");
        const contactQuery = document.getElementById("contactQuery").value;

        const response = await fetch(
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
            const contactElement = document.createElement("p");

            contactElement.textContent =
                `ID : ${contact.id} | Name : ${contact.name} | Email : ${contact.email} | Phone : ${contact.phone} | Type : ${contact.type}`;

            singleContactContainer.appendChild(contactElement);
        });

        getContactForm.style.display = "none";
    }
    catch (error) {
        console.log(error);
        singleContactContainer.textContent = "Something went wrong";
    }
});