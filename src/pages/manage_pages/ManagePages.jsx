import './managepages.css'
import { navigateTo } from "../../services/navigation"
import apiClient from "../../services/apiClient"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import Comment from './comment/Comment'


export default function ManagePage() {
    const currentSite = useSelector((state) => state.site.site)
    const [pages, setPages] = useState([])
    const [comments, setComments] = useState([])
    const [currentPage, setCurrentPage] = useState('')

    async function getPages() {
        const data = await apiClient.post('/site/get_all_pages', { domain: currentSite._id })
        setPages(data.data.data)
        if (data.data.data.length > 0) loadPage(data.data.data[0])
    }
    async function loadPage(page) {
        setCurrentPage(page)
        const data = await apiClient.post('comment/get_comments', { page_id: page })
        setComments(data.data.data)
    }

    const removeComment = (id) => {
        setComments((prevComments) => prevComments.filter(comment => comment._id !== id));
      };

    useEffect(() => {
        getPages()
        return () => { };
    }, []);
    return (
        <>
            <div id="mpTopBar">
                <button onClick={() => { navigateTo("/") }} className="action_button">Dashboard</button>
                <p>{currentSite._id}</p>
            </div>
            <section id="mpMain">
                <div id="mpSide">
                    <div id="mpSideSearch">
                        <input type="text" name="" id="" placeholder="Search For Page" />
                    </div>
                    <div id="mpSidePages">
                        {pages.map(page => {
                            return <p onClick={() => { loadPage(page) }} key={page}>{page}</p>
                        })}
                    </div>
                </div>
                <div id="mpPage">
                    <header id="mpCurrentPage">{currentPage}</header>
                    <div id="mpFilterBar">
                        <input type="text" name="" id="mpFilterSearch" placeholder="Search comments, usernames..." />
                        <button>Sort By</button>
                    </div>
                    <div id="mpComments">
                        {comments.map(comment => {
                            return <Comment key={comment._id} data={comment} onRemove={removeComment} />
                        })}
                    </div>
                </div>
            </section>
        </>
    )
}