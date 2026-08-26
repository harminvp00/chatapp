
import { createContext, useContext, useState } from "react";
import { contextNotExist } from "../Errors/context.error.js"

// create a context
const AuthContext = createContext(null);

// create a provider 
export default function AuthProvider({children}) {

    const [user, setUser] = useState(null);
    return (
        <AuthContext.Provider user={user} setUser={setUser} >
            {children}
        </AuthContext.Provider>
    )
}


export function useAuth() {

    const context = useContext(AuthContext);
    if(!context) throw new contextNotExist();
    return context;
}