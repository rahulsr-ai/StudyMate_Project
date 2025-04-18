import React, { useEffect, useState } from 'react'
import supabase from '../utils/Supabase'
import { useNavigate } from 'react-router-dom'

const UpdatePassword = () => {
    const [tokenValid, setTokenValid] = useState(false);
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        alert(email)
        await supabase.auth.updateUser({ password: password })
    }

    useEffect(() => {

        // ✅ Check if Localstorage has access_token
        const accessToken = localStorage.getItem("sb-jtxvaqctajkhgkjekams-auth-token");

        alert(accessToken?.access_token);

        console.log('token is ', accessToken)

        // if (!accessToken?.access_token) {
        //     console.log("❌ Invalid reset attempt, redirecting...");
        //     navigate("/login"); // ❌ Agar token nahi mila to login page pe bhejo
        // } else {
        //     console.log("✅ Token found, user can reset password.");
        //     setTokenValid(true);
        // }
    }, []);



    return (
        <div className='min-h-screen flex justify-center bg-blue-200'>
            <form onSubmit={handleSubmit} >
                <input type="text" placeholder='enter your email '
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input type="text" placeholder='enter your password'
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type='submit'> submit </button>
            </form>
        </div>
    )
}

export default UpdatePassword