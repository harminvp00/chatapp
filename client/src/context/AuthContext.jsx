
import { createContext, useContext, useState } from "react";
import { contextNotExist } from "../Errors/context.error.js"
import axios from 'axios';

// create a context
const AuthContext = createContext(null);

// create a provider 
export default function AuthProvider({children}) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const api = axios.create({
        baseURL: import.meta.VITE_SERVER_URI,
        withCredentials: true
    })

    async function getUser(){
        const response = await axios.get('user/:me', {
            Credential: true
        })
    }

    // making call on /user/:me 
    const login = async (credential) =>{
        const user = await api.post('/user/:me', credential);
        setUser(user.data);
    }

    const logout = async () => {
        await api.get('/user/logout');
        setUser(null);
    }


    return (
        <AuthContext.Provider value={{user, login, logout, loading}} >
            {!loading && children}
        </AuthContext.Provider>
    )
}


export function useAuth() {

    const context = useContext(AuthContext);
    if(!context) throw new contextNotExist();
    return context;
}