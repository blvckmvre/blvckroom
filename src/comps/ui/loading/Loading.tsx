import {FC} from 'react'
import cs from './Loading.module.css'

const Loading:FC = () => {
  return (
    <svg className={cs.LoadScreen}>
        <circle cx={"50vw"} cy={"50vh"} r={100} className={cs.LoadCircle} />
    </svg>
  )
}

export default Loading