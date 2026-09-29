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

        const token =data.token;
        
        // console.log(token);
        
        localStorage.setItem("token" , token);

        message.textContent = data.message;
    }

    catch(error)
    {
        console.error(error);

        message.textContent = 'Something went wrong';
        
    }
});
