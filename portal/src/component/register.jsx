import axios from 'axios'
import { useState } from 'react';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';


function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // make register call
    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        const res = await axios.post('https://super-winner-9w5vpqvgrj6cxj65-5000.app.github.dev/api/v1/auth/register', {
            username,
            password
        });
        console.log(res.data);
        if (res.data.success) {
            setSuccess(res.data.message);
            setUsername('');
            setPassword('');
            setLoading(false);
            localStorage.setItem('userData', JSON.stringify(res.data.data.createdUser));
        } else {
            setError(res.data.message);
            setUsername('');
            setPassword('');
            setLoading(false);
        }

        // redirect to login page
    }

    // Register PassKey
    const registerPassKey = async (e) => {
        setLoading(true);
        e.preventDefault();
        setError('');
        setSuccess('');

        const userData = JSON.parse(localStorage.getItem('userData'));

        const registeredPassKey = await axios.post('https://super-winner-9w5vpqvgrj6cxj65-5000.app.github.dev/api/v1/auth/register-passkey', { _id: userData._id, username: userData.username, password: userData.password });
        console.log(registeredPassKey.data.data.passKeyPayload, 'registeredPassKey');
        if (!registeredPassKey.data.success) {
            setError(registeredPassKey.data.message);
            setUsername('');
            setPassword('');
            return;
        }

        setSuccess(registeredPassKey.data.message);
        setUsername('');
        setPassword('');
        const registeredPassKeyPayload = await startRegistration(registeredPassKey.data.data.passKeyPayload);
        console.log(registeredPassKeyPayload, 'registeredPassKeyPayload');
        if (!registeredPassKeyPayload) {
            setError('Registration failed');
            setUsername('');
            setPassword('');
            return;
        }

        const authentication = await axios.post("https://super-winner-9w5vpqvgrj6cxj65-5000.app.github.dev/api/v1/auth/verify-register-passkey", {
            passkey: registeredPassKeyPayload,
            user: userData
        });

        if (!authentication.data.success) {
            setError(authentication.data.message);
            setUsername('');
            setPassword('');
            return;
        }

        console.log(authentication.data.data, 'authentication');
        console.log('Authentication successful')
        setLoading(false);
    }



    return (
        <>
            {/* Register Form */}
            <div className="container d-flex justify-content-center align-items-center vh-100">
                <div className="card">
                    <div className="card-header">
                        Register
                    </div>
                    <div className="card-body">
                        {error && <div className="alert alert-danger">{error}</div>}
                        {success && <div className="alert alert-success">{success}</div>}
                        <form onSubmit={onSubmit}>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input type="text" className="form-control" onChange={e => setUsername(e.target.value)} id="username" aria-describedby="username" placeholder="Enter username" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleInputPassword1">Password</label>
                                <input type="password" className="form-control" onChange={e => setPassword(e.target.value)} id="exampleInputPassword1" placeholder="Password" />
                            </div>
                            <button type="submit" disabled={loading} className="btn btn-primary">Submit</button>
                        </form>
                    </div>
                </div>


                {/* Register PassKey */}
                <div className="row gap-3">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">
                                Register PassKey
                            </div>
                            <div className="card-body">
                                <button onClick={registerPassKey} className="btn btn-primary">Register PassKey</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register
