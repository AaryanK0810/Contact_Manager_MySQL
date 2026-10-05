const getContactById = document.getElementById("getContactById");
const getContactForm = document.getElementById("getContactForm");
const submitContactId = document.getElementById("submitContactId");
const singleContactContainer = document.getElementById("singleContactContainer");

getContactById.addEventListener("click", () => {
    getContactForm.style.display = "block";
});

submitContactId.addEventListener("click", async () => {
    try {
        const token = localStorage.getItem("token");
        const contactId = document.getElementById("contactId").value;

        const response = await fetch(`/api/contacts/${contactId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            singleContactContainer.textContent = data.message;
            return;
        }

        singleContactContainer.textContent =
            `ID : ${data.id} | Name : ${data.name} | Email : ${data.email} | Phone : ${data.phone} | Type : ${data.type}`;

        getContactForm.style.display = "none";
    }
    catch (error) {
        console.log(error);
        singleContactContainer.textContent = "Something went wrong";
    }
});