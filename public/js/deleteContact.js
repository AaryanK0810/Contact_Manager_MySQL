const deleteButton = document.getElementById('deleteButton');
const deleteContactForm = document.getElementById('deleteContactForm');
const submitDeleteContact = document.getElementById('submitDeleteContact');
const deleteMessage = document.getElementById('deleteMessage');

deleteButton.addEventListener('click' , () =>{
    if(deleteContactForm.style.display === 'none')
    {
        deleteContactForm.style.display = 'block';
    }
    else
    {
        deleteContactForm.style.display = 'none';
    }
})

submitDeleteContact.addEventListener('click' , async () => 
{
    try{
        const token = localStorage.getItem('token');

        const contactId = document.getElementById('deleteContactId').value;

        const response = await authenticatedFetch(`api/contacts/${contactId}` , {
            method : "DELETE",
            headers : {
                Authorization : `Bearer ${token}`
            }
        });

        const data = await response.json();

        if(!response.ok)
        {
            deleteMessage.textContent = data.message;
            return;
        }

        deleteMessage.textContent = data.message;

        deleteContactForm.style.display = 'none';
    }

    catch(error)
    {
        console.log(error);
        deleteMessage.textContent = 'Something went wrong';
        
    }
});