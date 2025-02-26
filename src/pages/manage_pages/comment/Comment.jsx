import './comment.css'
import apiClient from '../../../services/apiClient'
import { useEffect, useState } from 'react'

export default function Comment({ data, onRemove, top=false }) {
    const [approved, setApproved] = useState(data.approved)
    const [pinned, setPinned] = useState(data.pinned)
    const [replies, setReplies] = useState([])

    useEffect(() => {
        setReplies(data.replies || []);
    }, [data.replies]);

    async function deleteComment() {
        const response = await apiClient.post('/comment/delete_comment', { comment_id: data._id })
        if (!response.data.status) return
        onRemove(data._id)
    }
    async function approveComment() {
        const response = await apiClient.post('/comment/approve_comment', { comment_id: data._id })
        if (!response.data.status) return
        setApproved(true)
    }
    async function disapproveComment() {
        const response = await apiClient.post('/comment/disapprove_comment', { comment_id: data._id })
        if (!response.data.status) return
        setApproved(false)
    }
    const removeComment = (id) => {
        setReplies((prevReplies) => prevReplies.filter(reply => reply._id !== id));
    };
    async function pin(){
        const response = await apiClient.post('/comment/pin_comment', { comment_id: data._id })
        if (!response.data.status) return
        setPinned(true)
    }
    async function upPin(){
        const response = await apiClient.post('/comment/unpin_comment', { comment_id: data._id })
        if (!response.data.status) return
        setPinned(false)
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
                {(() => {
                    if (approved) {
                        return <button onClick={disapproveComment} className='ERROR'>Disapprove</button>
                    } else return <button onClick={approveComment} className='SUCCESS'>Approve</button>
                })()}
                {(() => {
                    if (top) {
                        if (pinned) return <button onClick={upPin} className='ERROR'>Unpin</button>
                        else return <button onClick={pin} className='SUCCESS'>Pin</button>
                    }
                })()}
            </div>
            <div id="nestedComments">
                {replies.map(comment => {
                    return <Comment key={comment._id} data={comment} onRemove={removeComment} />
                })}
            </div>
        </div>
    )
}