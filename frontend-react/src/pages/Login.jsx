import {useState} from 'react';
import { apiRequest } from '../services/api';
import {useNavigate , Link} from 'react-router-dom';

function Login()
{
    const [email , setEmail] = useState('');
    const [password , setPassword] = useState('');

    const[error , setError] = useState();
    const[loading , setLoading] = useState();

    const navigate = useNavigate();

    //States for error and loading
    async function handleSubmit(event)
    {
        event.preventDefault();

        setError("");
        setLoading(true);

        try{
            const data = await apiRequest('/api/users/login' , {
                method : 'POST',
                body : JSON.stringify({email , password}),

            });

            if(data.token)
            {
                localStorage.setItem("token" , data.token);
                navigate("/contacts")
            }
            else
            {
                setError("Login succeeded, but no token was returned.")
            }
        }
        catch(error)
        {
            setError(error.message)
        }
        finally
        {
            setLoading(false);
        }
    }

    return(
        <main className = 'auth-container'>
            <form className = 'auth-form' onSubmit = {handleSubmit}>
                <h1>Welcome Back</h1>
                <p>Log in to manage your contacts.</p>
                {error && <p role='alert'>{error}</p>}
                <label htmlFor = 'email'>Email</label>
                <input id = 'email' type = 'email' value = {email} onChange = {(event) => setEmail(event.target.value)}
                placeholder='Enter your email' required></input>

                <label htmlFor = 'password'>Password</label>
                <input id = 'password' type = 'password' value={password} onChange={(event) => setPassword(event.target.value)}
                placeholder='Enter your password' required></input>'

                <p className = 'auth-switch'>Don't have an account? <Link to = '/register'>Register here</Link></p>
                
                <button type = 'submit' disabled = {loading}>{loading ? "Logging in..." : 'Log in'}</button>
            </form>
        </main>
    );
}

export default Login;