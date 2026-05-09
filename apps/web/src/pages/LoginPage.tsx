import { useState } from 'react'
import { api } from '../services/api'
import { authStore } from '../store/auth.store'
import { useLocation } from 'wouter'

export default function LoginPage() {
    const [, navigate] = useLocation()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function handleLogin() {
        try {
            const res = await api.post('/auth/login', {
                email,
                password,
            })

            authStore.user = res.data.user
            navigate('/')
        } catch (err) {
            console.error(err)
            alert('Login failed')
        }
    }

    function steamLogin() {
        window.location.href =
            'http://localhost:3000/auth/steam'
    }

    return (
        <div>
            <h1>Login</h1>

            <input
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleLogin}>
                Login
            </button>

            <button onClick={steamLogin}>
                Login with Steam
            </button>
        </div>
    )
}