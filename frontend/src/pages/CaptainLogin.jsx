import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CaptainContext } from '../context/CaptainContext'; // Corrected import

const CaptainLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Added isLoading state here

    // Use the correct context name and its values
    const { loginCaptain } = useContext(CaptainContext);
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoginError(null);
        setIsLoading(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, { email, password });
            if (response.status === 200) {
                const { captain, token } = response.data;
                // No need to set token in localStorage here, context will handle it
                loginCaptain(captain, token);
                navigate('/captain-home');
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
                <img className='w-20 mb-3' src="https://www.svgrepo.com/show/505031/uber-driver.svg" alt="Captain Icon" />
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
                <p className='text-center'>Join a fleet? <Link to='/captain-signup' className='text-blue-600'>Register as a Captain</Link></p>
            </div>
            <div>
                <Link
                    to='/login'
                    className='bg-[#d5622d] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg'
                >
                    Sign in as User
                </Link>
            </div>
        </div>
    );
};

export default CaptainLogin;