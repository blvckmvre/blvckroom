import {FC, RefObject} from 'react'
import { useTypeSelector } from '../hooks/reduxHooks';
import { IMessage } from '../types/message-types'

interface ChatWindowProps {
  chatWindow: RefObject<HTMLDivElement>;
}

const ChatWindow:FC<ChatWindowProps> = ({chatWindow}) => {
  const {username} = useTypeSelector(state=>state.authentication.responseData!.user!);
  const {messages,usersTyping: typing} = useTypeSelector(state=>state.messages)
  return (
    <div ref={chatWindow} className="chat-window">
      {messages.map(message=>
        <div 
          key={message.timestamp} 
          className={message.username===username ? 'msg my-msg' : "msg"}
        >
          <p className='msg-user'>{
            message.username===username 
            ? 
            message.username+" (You)"
            :
            message.username
          }</p> 
          <p className='msg-text'>{message.message}</p> 
          <p className='msg-timestamp'>({message.timestamp})</p>
        </div> 
      )}
      {!!typing.length && <p className="typing-info">
        {typing.length===1 ? `${typing[0]} is typing...` : `${typing.length} users are typing...`}
      </p>}
    </div>
  )
}

export default ChatWindow