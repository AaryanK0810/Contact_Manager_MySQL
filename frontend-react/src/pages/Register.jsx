import { useState } from "react";

import {Link} from "react-router-dom";

function Register()
{
    const [username , setUsername] = useState("");
    const [email , setEmail] = useState("");
    const [password , setPassword] = useState('');

    function handleSubmit(event)
    {
        event.preventDefault();

        console.log({
            username , 
            email ,
            password
        });
    }

    return (
        <main className="auth-container">
            <form className = 'auth-form' onSubmit={handleSubmit}>
                <h1>Create an account</h1>
                <p>Register to start managing your contacts.</p>

                <label htmlFor="username">Username</label>
                <input id = 'username' type="text" value={username} onChange={(event) => setUsername(event.target.value)} 
                    placeholder = 'Enter your username' required></input>
                
                <label htmlFor="email">Email</label>
                <input id = 'email' type ='email' value={email} onChange = {(event) => setEmail(event.target.value)}
                    placeholder = 'example@example.com' required></input>
                
                <label htmlFor = 'password'>Password</label>
                <input id = 'password' type = 'password' value={password} onChane = {(event) => setPassword(event.target.value)}
                placeholder="Enter your password" required></input>

                <button type="submit">Register</button>

                <p className="auth-footer">
                    Already have an account? <Link to = '/login'>Log in</Link>
                </p>
            </form>
        </main>
    )
}

export default Register;