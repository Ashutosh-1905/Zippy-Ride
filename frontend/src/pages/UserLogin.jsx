import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext"; // Corrected import
import axios from 'axios';

const UserLogin = () => {
    // Corrected context usage
    const { user, setUser, setToken } = useContext(UserContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoginError(null);
        setIsLoading(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, { email, password });
            if (response.status === 200) {
                const { user, token } = response.data;
                setUser(user);
                setToken(token);
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                navigate('/home');
            }
        } catch (error) {
            setLoginError(error.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='p-7 h-screen flex flex-col justify-between'>
            <div>
                <img className='w-16 mb-10' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s" alt="Logo" />
                <form onSubmit={submitHandler}>
                    <h3 className='text-lg font-medium mb-2'>What's your email</h3>
                    <input
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg'
                        type="email"
                        placeholder='email@example.com'
                    />
                    <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
                    <input
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg'
                        type="password"
                        placeholder='password'
                    />
                    <button
                        disabled={isLoading}
                        className={`bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg ${isLoading ? 'opacity-50' : ''}`}
                    >
                        {isLoading ? 'Processing...' : 'Login'}
                    </button>
                    {loginError && <p className="text-red-500 text-center">{loginError}</p>}
                </form>
                <p className='text-center'>New here? <Link to='/signup' className='text-blue-600'>Create an account</Link></p>
            </div>
            <div>
                <Link
                    to='/captain-login'
                    className='bg-[#d5622d] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg'
                >
                    Sign in as Captain
                </Link>
            </div>
        </div>
    );
};

export default UserLogin;