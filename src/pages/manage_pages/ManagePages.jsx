import { useParams } from "react-router-dom"
import './managepages.css'
import { navigateTo } from "../../services/navigation"
export default function ManagePage(){
    const { id } = useParams()
    return (
        <>
            <div id="mpTopBar">
                <button onClick={()=>{navigateTo("/")}} className="action_button">Dashboard</button>
                <p>teemboom.com</p>
            </div>
            <section id="mpMain">
                <div id="mpSide">
                    <div id="mpSideSearch">
                        <input type="text" name="" id="" placeholder="Search For Page" />
                    </div>
                    <div id="mpSidePages">
                        <p>teemboom.com/blog/this_is_a_prime_example_of_a_very_great_application</p>
                        <p>teemboom.com/blog/this_is_a_prime_example_of_a_very_great_application</p>
                        <p>teemboom.com/blog/this_is_a_prime_example_of_a_very_great_application</p>
                        <p>teemboom.com/blog/this_is_a_prime_example_of_a_very_great_application</p>
                        <p>teemboom.com/blog/this_is_a_prime_example_of_a_very_great_application</p>
                        <p>teemboom.com/blog/this_is_a_prime_example_of_a_very_great_application</p>
                        <p>teemboom.com/blog/this_is_a_prime_example_of_a_very_great_application</p>
                        <p>teemboom.com/blog/this_is_a_prime_example_of_a_very_great_application</p>
                        <p>teemboom.com/blog/this_is_a_prime_example_of_a_very_great_application</p>
                        <p>teemboom.com/blog/this_is_a_prime_example_of_a_very_great_application</p>
                    </div>
                </div>
                <div id="mpPage">
                    <header id="mpCurrentPage">teemboom.com/blog/this_is_a_prime_example_of_a_very_great_application</header>
                    <div id="mpFilterBar">
                        <input type="text" name="" id="mpFilterSearch" placeholder="Search comments, usernames..." />
                        <button>Sort By</button>
                    </div>
                    <div id="mpComments">

                    </div>
                </div>
            </section>
        </>
    )
}