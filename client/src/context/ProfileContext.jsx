

import { createContext, useContext, useState } from 'react';

const ProfileContext = createContext();
export default function ProfileProvider({ children }) {

    // states 
    const [profileEditMode, setProfileEditMode] = useState(false);

    // provide context to all children 
    return (
        <ProfileContext.Provider value={{ profileEditMode, setProfileEditMode }}>
            {children}
        </ProfileContext.Provider>
    )
}

export const useProfile = () => {
    const profile_context = useContext(ProfileContext);
    if (!profile_context) {
        throw new Error("useProfile should be used inside the ProfileProvider.");
    }
    return profile_context;
}