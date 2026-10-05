const addContact = document.getElementById("addAContact");
const addContactForm = document.getElementById("addContactForm");
const submitContact = document.getElementById("submitContact");

addContactForm.style.display = "none";

addContact.addEventListener("click", () => {
    if (addContactForm.style.display === "none") {
        addContactForm.style.display = "block";
    } else {
        addContactForm.style.display = "none";
    }
});

submitContact.addEventListener("click", async () => {
    try {
        const token = localStorage.getItem("token");

        const name = document.getElementById("contactName").value;
        const email = document.getElementById("contactEmail").value;
        const phone = document.getElementById("contactPhone").value;
        const type = document.getElementById("contactType").value;

        const response = await fetch("/api/contacts", {
            method: "POST",
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

        if(response.ok)
        {
            addContactForm.style.display = "none"
        }

        console.log(data);
    }
    catch (error) {
        console.log(error);
    }
});