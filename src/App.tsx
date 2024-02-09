import { Routes, Route } from 'react-router-dom';
import SigninForm from './_auth/forms/SigninForm';
import SignupForm from './_auth/forms/SignupForm';
import AuthLayout from './_auth/AuthLayout';
import RootLayout from './_root/RootLayout';
import { Home, Explore } from './_root/pages';
import './globals.css';
import Saved from './_root/pages/Saved';
import AllUsers from './_root/pages/AllUsers';
import CreateProject from './_root/pages/CreateProject';
import { Toaster } from './components/ui/toaster';

const App = () => {
  return (
    <main className='flex h-screen'>
        <Routes>
            {/*public route*/}
            <Route element={<AuthLayout/>}>
                <Route path='/sign-in' element={<SigninForm/>}/>
                <Route path='/sign-up' element={<SignupForm/>}/>
            </Route>
            {/*private route*/}
            <Route element={<RootLayout/>}>
                <Route index element={<Home/>}/>
                <Route path="/explore" element={<Explore />} />
                <Route path="/saved" element={<Saved />} />
                <Route path="/all-users" element={<AllUsers />} />
                <Route path="/create-project" element={<CreateProject />} />
            </Route>            
        </Routes>
        <Toaster/>
    </main>
  )
}

export default App