import { FC, FormEvent } from 'react'
import { Link } from 'react-router-dom';
import { useTypeDispatch, useTypeSelector } from '../hooks/reduxHooks';
import { authMutationAction } from '../store/actionCreators/authActionCreators';
import { userSlice } from '../store/reducers/userSlice';
import { AuthMutationType, AuthOperations } from '../types/auth-types';

interface CredentialsPageProps {
    type: AuthMutationType;
}

const CredentialsPage:FC<CredentialsPageProps> = ({type}) => {
    const {username,password} = useTypeSelector(state=>state.users);
    const {isLoading} = useTypeSelector(state=>state.authentication);
    const {isLoading: isChatLoading} = useTypeSelector(state=>state.chat)
    const {setPassword,setUsername} = userSlice.actions;
    const dispatch = useTypeDispatch();
    const sendCredentials = (e: FormEvent) => {
        e.preventDefault();
        dispatch(authMutationAction({username,password,operation: type}));
        dispatch(setPassword(""));
        dispatch(setUsername(""));
    }

  return (isLoading||isChatLoading) ? <></> : (
    <div className='app-wrapper'>
        <h1>BLVCKROOM – {type.toUpperCase()}</h1>
        <form className='auth-form' onSubmit={sendCredentials}>
            <label className="input-label">
                Login
                <input 
                    className="input auth-input"
                    value={username} 
                    onChange={e=>dispatch(setUsername(e.target.value))} 
                    required
                />
            </label>
            <label className="input-label">
                Password
                <input 
                    className="input auth-input"
                    value={password} 
                    onChange={e=>dispatch(setPassword(e.target.value))} 
                    type="password" 
                    required
                />
            </label>
            <button className="input auth-btn">{type.toUpperCase()}</button>
        </form>
        {type===AuthOperations.login && 
            <h3>Don't have an account? <Link className='link' to="/signup">Sign Up!</Link></h3>
        }
    </div>
  )
}

export default CredentialsPage