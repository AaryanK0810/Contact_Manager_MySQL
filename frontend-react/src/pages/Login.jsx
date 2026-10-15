import {useState} from 'react';

function Login()
{
    const [email , setEmail] = useState('');
    const [password , setPassword] = useState('');

    function handleSubmit(event)
    {
        event.preventDefault();

        console.log({
            email,
            password
        });
    }

    return(
        <main className = 'auth-container'>
            <form className = 'auth-form' onSubmit = {handleSubmit}>
                <h1>Welcome Back</h1>
                <p>Log in to manage your contacts.</p>

                <label htmlFor = 'email'>Email</label>
                <input id = 'email' type = 'email' value = {email} onChange = {(event) => setEmail(event.target.value)}
                placeholder='Enter your email' required></input>

                <label htmlFot = 'password'>Password</label>
                <input id = 'password' type = 'password' value={password} onChange={(event) => setPassword(event.target.value)}
                placeholder='Enter your password' required></input>'

                <button type = 'submit'>Log In</button>
            </form>
        </main>
    );
}

export default Login;