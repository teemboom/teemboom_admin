import './comment.css'
import apiClient from '../../../services/apiClient'
import { useState } from 'react'

export default function Comment({data, onRemove}){
    const [approved, setApproved] = useState(data.approved)

    async function deleteComment(){
        const response = await apiClient.post('/comment/delete_comment', {comment_id: data._id})
        if (!response.data.status) return
        onRemove(data._id)
    }
    async function approveComment(){
        const response = await apiClient.post('/comment/approve_comment', {comment_id: data._id})
        if (!response.data.status) return
        setApproved(true)
    }
    async function disapproveComment(){
        const response = await apiClient.post('/comment/disapprove_comment', {comment_id: data._id})
        if (!response.data.status) return
        setApproved(false)
    }

    return (
        <div className={`mcomment ${approved ? "" : "mcommentdisapproved"}`}>
            <div className="mcommentProfile">
                <img src={data.user.profile_pic} alt="" />
            </div>
            <div className="mcommentContent">
                <p className="mcommenttime">{data.elasped_time}</p>
                <p className='mcommentname'>{data.user.username}</p>
                <p className="mcommenttext">{data.content}</p>
            </div>
            <div className="mcommentActions">
            <button onClick={deleteComment} className='ERROR'>Delete</button>
            {(()=>{
                if (approved){
                    return <button onClick={disapproveComment} className='ERROR'>Disapprove</button>
                }else return <button onClick={approveComment} className='SUCCESS'>Approve</button>
            })()}
            
            </div>
        </div>
    )
}