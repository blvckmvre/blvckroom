import {FC, FormEvent, useEffect, useRef, useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { $req } from '../axios/config';
import ChatWindow from '../comps/ChatWindow'
import { useTypeDispatch, useTypeSelector } from '../hooks/reduxHooks'
import { msgSlice } from '../store/reducers/msgSlice';
import { IMessage } from '../types/message-types';
import { IRoom } from '../types/room-types';
import url from '../url';

const ChatPage:FC = () => {
  const dispatch = useTypeDispatch();
  const {username} = useTypeSelector(state=>state.authentication.responseData!.user!);
  const {messages,chatMessage,usersTyping} = useTypeSelector(state=>state.messages);

  const {setChatMessage,setMessages,setUsersTyping,clearMessages} = msgSlice.actions;

  const[room, setRoom] = useState<IRoom | null>(null);

  const socket = useRef<ReturnType<typeof io> | null>(null);
  const chatWindow = useRef<HTMLDivElement | null>(null);
  const isTyping = useRef<boolean>(false);

  const {id} = useParams();

  const router = useNavigate();

  
  const send = (e: FormEvent) => {
    e.preventDefault();
    if(chatMessage.trim())
      socket.current?.emit("chat-message", {message:{
        username,
        message: chatMessage
      }, id});
    dispatch(setChatMessage(""));
  }

  const leave = () => {
    if(isTyping.current)
      socket.current?.emit("typing-end", username, id);
    router("/");
  }

  const getRoom = async() => {
    const res = await $req.get("/room", {params: {id}});
    setRoom(res.data);
  }

  const socketClient = async() => {
    await getRoom();

    socket.current = io(url, {auth: {token: localStorage.getItem("accessToken")}});
    socket.current.on("connect", ()=>{
      socket.current?.emit("join-room", id);
    });

    socket.current.on("online-count", (updatedRoom: IRoom)=>{
      setRoom(updatedRoom);
    });

    socket.current.on("chat-message", (data: IMessage)=>{
      dispatch(setMessages(data));
    });

    socket.current.on("typing-start", (users: string[])=>{
      dispatch(setUsersTyping(users.filter(user=>user!==username)));
    })

    socket.current.on("typing-end", (users: string[])=>{
      dispatch(setUsersTyping(users.filter(user=>user!==username)));
    })
  }

  useEffect(()=>{
    socketClient();
    return () => {
      dispatch(clearMessages());
      dispatch(setChatMessage(""));
      socket.current?.removeAllListeners();
      socket.current?.disconnect();
    }
  },[]);

  useEffect(()=>{
    if(chatMessage && !isTyping.current){
      socket.current?.emit("typing-start", username, id);
      isTyping.current = true;
    }
    if(!chatMessage && isTyping.current) {
      socket.current?.emit("typing-end", username, id);
      isTyping.current = false;
    }
  },[chatMessage])

  useEffect(()=>{
    if(chatWindow.current)
      chatWindow.current.scrollTop = chatWindow.current.scrollHeight;
  },[messages, usersTyping])

  return (
    <div className='app-wrapper'>
        {room && <h3>/{room.name}/. Current online: {room.users}</h3>}
        {room 
        ?
        <div className='chat-wrapper'>
          <form onSubmit={send} className="input-wrapper">
            <input 
              className='input msg-input' 
              value={chatMessage} 
              onChange={e=>dispatch(setChatMessage(e.target.value))} 
            />
            <button className='input sm'>Send</button>
          </form>
          <ChatWindow chatWindow={chatWindow} />
        </div> 
        : 
        <h3>Room not found</h3>}
        <button className='input sm' onClick={leave}>LEAVE</button>
    </div>
  )
}

export default ChatPage