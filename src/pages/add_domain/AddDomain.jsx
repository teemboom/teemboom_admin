import { useSelector } from 'react-redux'
import './adddomain.css'
import { useState } from 'react'
import apiClient from '../../services/apiClient'
import { navigateTo } from '../../services/navigation'

export default function AddDomain() {
    const user = useSelector((state) => state.user.user)
    const [domainName, setDomainName] = useState("")
    const [verificationType, setVerificationType] = useState(0)

    async function verify_domain_dns_txt(){
        if (!domainName || domainName.indexOf('/') > -1 || domainName.indexOf('.') < 0){
            console.log('bad domain name')
            return
        }
        const response = await apiClient.post('/site/verify_domain_dns_txt', {'domain': domainName})
        console.log(response.data)
        if (response.data.status) navigateTo('/')
    }
    async function verify_domain_url_route(){
        if (!domainName || domainName.indexOf('/') > -1 || domainName.indexOf('.') < 0){
            console.log('bad domain name')
            return
        }
        const response = await apiClient.post('/site/verify_domain_url_route', {'domain': domainName})
        console.log(response.data)
        if (response.data.status) navigateTo('/')
    }
    function verify_domain(){
        if (verificationType == 0) verify_domain_dns_txt()
        else verify_domain_url_route()
    }
    return (
        <div id="addDomain">
            <h1>Add Domain</h1>
            <div className="gItem">
                <p>Enter Domain Name</p>
                <input type="text" name="" id="" placeholder='example.com' value={domainName} onChange={(e)=>{setDomainName(e.target.value)}} />
                <p id="error" style={{color: 'red'}}></p>
            </div>
            <h2>Choose Verification Method</h2>
            <div className="vItem">
                <header>DNS TXT RECORD</header>
                <p>
                    Go to your domain provider and create this DNS TXT record
                    <br /><strong>Key=</strong><i>teemboom.auth</i>
                    <br /><strong>Value=</strong><i>{user._id}</i>
                </p>
                <div onClick={()=>{document.getElementById('txtS').click()}} className="huy">
                    <input type="radio" name="vtype" id="txtS" value="txt" onFocus={()=>setVerificationType(0)} defaultChecked />
                    <p>Select This Option</p>
                </div>
            </div>

            <div className="vItem">
                <header>URL ROUTE INSPECTION</header>
                <p>
                    To verify your site, you'll have to make the the
                    below url accessable. This url should return a 200 status.
                    You can place a HTML file here or return any response from
                    this route. Just make sure it is working and responsive.
                    <br />Example: yoursite.com/<strong>{user._id}</strong>, yourwebsitename.org/<strong>{user._id}</strong>
                </p>
                <div onClick={()=>{document.getElementById('urlS').click()}} className="huy">
                    <input type="radio" name="vtype" id="urlS" value="txt" onFocus={()=>setVerificationType(1)} />
                    <p>Select This Option</p>
                </div>
               </div>

            <div id="verifyButton" className='action_button' onClick={verify_domain}>Verify</div>
        </div>
    )
}