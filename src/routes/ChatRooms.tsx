import { FC, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useTypeDispatch, useTypeSelector } from '../hooks/reduxHooks';
import { authLogoutAction } from '../store/actionCreators/authActionCreators';
import { createRoom, deleteRoom, getRooms } from '../store/actionCreators/chatActionCreators';
import { chatSlice } from '../store/reducers/chatSlice';

const ChatRooms:FC = () => {

    const router = useNavigate();

    const dispatch = useTypeDispatch();

    const {username} = useTypeSelector(state=>state.authentication.responseData!.user!);
    const {rooms,roomTitle} = useTypeSelector(state=>state.chat);

    const {setRoomTitle} = chatSlice.actions;

    const createChatRoom = async() => {
        if(roomTitle.trim()){
            dispatch(createRoom({creator: username, name: roomTitle}));
        }
        else alert("Enter valid room name");
        dispatch(setRoomTitle(""));
    }

    const deleteChatRoom = async(id: number) => {
        dispatch(deleteRoom({id,creator: username}));
    }

    const logout = () => {
        dispatch(authLogoutAction());
    }

    useEffect(()=>{
        dispatch(getRooms());
    },[]);
  return (
    <div className='app-wrapper'>
        <div className='input-wrapper col'>
            <input 
                className='input' 
                maxLength={24} 
                value={roomTitle} 
                onChange={e=>dispatch(setRoomTitle(e.target.value))} 
            />
            <button className='input' onClick={createChatRoom}>Create Room</button>
        </div>
        <div className='chat-rooms-wrapper'>
            {rooms && rooms.map(room=>
                <div 
                    className={room.creator===username ? "chat-room my-room" : "chat-room"} 
                    key={room.roomid}
                >
                    <p className='chat-room-name' onClick={()=>router("/"+room.roomid)}>
                        ID{room.roomid}. {room.name} – {room.users} users (created by {room.creator})
                    </p>
                    <button className='input blocky' onClick={()=>deleteChatRoom(room.roomid)}>
                        X
                    </button>
                </div>    
            )}
        </div>
        <button className='input sm' onClick={logout}>OUT</button>
    </div>
  )
}

export default ChatRooms