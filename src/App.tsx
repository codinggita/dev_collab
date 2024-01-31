import { Routes, Route } from 'react-router-dom';
import SigninForm from './_auth/forms/SigninForm';
import SignupForm from './_auth/forms/SignupForm';
import AuthLayout from './_auth/AuthLayout';
import RootLayout from './_root/RootLayout';
import { Home, Explore } from './_root/pages';
import './globals.css';

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
            </Route>            
        </Routes>
    </main>
  )
}

export default App