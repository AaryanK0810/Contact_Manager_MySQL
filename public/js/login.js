const loginForm = document.getElementById('loginForm');
const message = document.getElementById('message');

loginForm.addEventListener('submit' , async(event) =>{
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try{
        const response = await fetch('/api/users/login' , {
            method : "POST",
            headers :{

             "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                email,
                password
            })
        });
        
        const data = await response.json();

        
        // console.log(token);
        
        if(response.ok)
        {
            const token =data.token;
            
            localStorage.setItem("token" , token);

            message.textContent = data.message;

            setTimeout(() => {
                window.location.href = "/operations.html"
            } , 1000);
        }
        else{
        message.textContent = data.message;
        }
    }

    catch(error)
    {
        console.error(error);

        message.textContent = 'Something went wrong';
        
    }
});
