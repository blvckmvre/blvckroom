import {FC, useEffect} from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import ChatRooms from './routes/ChatRooms'
import Loading from './comps/ui/loading/Loading'
import { useTypeDispatch, useTypeSelector } from './hooks/reduxHooks'
import ChatPage from './routes/ChatPage'
import CredentialsPage from './routes/CredentialsPage'
import { AuthOperations } from './types/auth-types'
import { isAuthorized } from './store/actionCreators/authActionCreators'



const App:FC = () => {
  const {isLoggedIn, error, isLoading,responseData} = useTypeSelector(state=>state.authentication);
  const {isLoading: isChatLoading, error: chatError} = useTypeSelector(state=>state.chat);

  const dispatch = useTypeDispatch();


  useEffect(()=>{
    if(localStorage.getItem("accessToken"))
        dispatch(isAuthorized());
},[])
  return (
    <BrowserRouter>
      {(isLoading||isChatLoading) && <Loading />}
      {!isLoggedIn && 
      <div id="navbar">
        <Link className="navlink" to="/login">Login</Link>
        <Link className="navlink" to="/signup">Sign Up</Link>
      </div>}
      {(error||chatError) && <p className='error-info'>{error||chatError}</p>}
      {isLoggedIn && responseData?.user?.username
      ?
      <p className='auth-info'>
        Logged in as {responseData.user.username}
      </p> 
      :
      <p className='auth-info noauth'>
        You are not logged in!
      </p>}
      <Routes>
        <Route path='/' element={isLoggedIn ? <ChatRooms /> : <Navigate to="/login" />} />
        <Route path='/:id' element={isLoggedIn ? <ChatPage /> : <Navigate to="/login" />} />
        <Route path='/login' element={!isLoggedIn ? <CredentialsPage type={AuthOperations.login} /> : <Navigate to="/" />} />
        <Route path='/signup' element={!isLoggedIn ? <CredentialsPage type={AuthOperations.signup} /> : <Navigate to="/" />} />
        <Route path='*' element={<Navigate to={isLoggedIn ? "/" : "/login" }/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App