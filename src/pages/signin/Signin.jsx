import './signin.css'
import { login } from '../../redux/userSlice';
import { useDispatch } from 'react-redux';

export default function SignIn(){
    const dispatch = useDispatch()

    function sign_in_google(){
        const openGoogleSignInPopup = () => {
            const clientId = '360201050801-r60i04v2j4f83ilmus698vtgcq16a5ng.apps.googleusercontent.com';
            const redirectUri = `http://api-admin.teemboom.com/user/google`;
            
            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
                `client_id=${encodeURIComponent(clientId)}&` +
                `redirect_uri=${encodeURIComponent(redirectUri)}&` +
                `response_type=code&` +
                `scope=${encodeURIComponent('openid email profile')}&`

            const popup = window.open(authUrl, 'google-signin', 'width=500,height=600');
            
            window.addEventListener('message', (event) => { 
                dispatch(login(event.data.payload))
            }, false);
        }
        openGoogleSignInPopup()
    }
    return (
        <div id="signin">
            <div id="signinWelcome">
                <header>Welcome To Teemboom Admin</header>
                <p>Enter and Manage Your Site</p>
            </div>
            <div id="signinOptions">
                <button onClick={sign_in_google}>Google</button>
            </div>
        </div>
    )
}