import { getCurrentUser } from '@/lib/appwrite/api';
import { IContextType, IUser } from '@/types';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// How the empty user should looks like
export const INITIAL_USER = {
    id: '',
    name: '',
    username: '',
    email: '',
    imageUrl: '',
    about: ''
};


// To know whether we have loged in user all time
const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    setUser: () => {},
    setIsAuthenticated: () => {},
    checkAuthUser: async () => false as boolean,
}
// When we write children in the AuthProvider component, you're indicating that this 
// component is intended to wrap other components or elements, and those wrapped 
// elements will be rendered as children of AuthProvider.

const AuthContext = createContext<IContextType>(INITIAL_STATE);
const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<IUser>(INITIAL_USER);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    // This function will check whether user is authenticated or not
    const checkAuthUser = async () => {
        try{
            const currentAccount = await getCurrentUser();
            if(currentAccount){
                setUser({
                    id: currentAccount.$id,
                    name: currentAccount.name,
                    username: currentAccount.username,
                    email: currentAccount.email,
                    imageUrl: currentAccount.imageUrl,
                    about: currentAccount.about
                });
                setIsAuthenticated(true);
                return true;
            }
            return false;
        } catch(error){
            console.log(error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Since we want checkAuthUser to authenticate everytime when someone load the page so we will use useEffect()
    useEffect(() => {
        // || localStorage.getItem('cookieFallBack') === null
        if(localStorage.getItem('cookieFallBack') === '[]' || localStorage.getItem('cookieFallBack') === null){
            navigate('/sign-in');
        }
        checkAuthUser();

    }, [])

    const value = {
        user,
        setUser,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser
    };
    return (
        <AuthContext.Provider value={value} >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;
export const useUserContext = () => useContext(AuthContext);