import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../../FirebaseAuth/Firebase'
import { useState } from 'react';
import './Form.css'



function FormLogin( { setConnection }){
    const [ email, setEmail] = useState("")
    const [ password, setPassword] = useState("")
    const [ logging, setLogging] = useState(false)

    const LogInGoogle = () =>{
        setLogging(true)
        const provider = new GoogleAuthProvider()
        signInWithPopup(auth, provider)
        .then(()=>setLogging(false))
        .catch((e)=> {
            if (e.code === 'auth/internal-error') {
                window.alert("there is an error, it's possible caused by connection")
                setConnection({active:false})
            }
            setLogging(false)
        })
    }

    const LogInWithCredentials = (e) => {
        setLogging(true)
        signInWithEmailAndPassword(auth, email, password)
        .then(()=>setLogging(false))
        .catch((e)=>{
            switch (e.code) {
                case 'auth/invalid-credential':
                    window.alert("Invalid credentials")
                    setLogging(false)
                    break;
                case "auth/network-request-failed":
                    window.alert("there is an error, it's possible caused by connection")
                    setConnection({active:false})
                    setLogging(false)
                    break;
                default:
                    setLogging(false)
                    break;
                    }
                })
            }

    const SignInWithCredentials = () => {
        setLogging(true)
        createUserWithEmailAndPassword(auth, email, password)
        .then(()=>setLogging(false))
        .catch((e) =>{
            switch (e.code) {
                case "auth/email-already-in-use":
                    window.alert("User already exist")
                    setLogging(false)
                    break;
                case "auth/weak-password":
                    window.alert("Password should be at least 6 characters")
                    setLogging(false)
                    break;
                case "auth/missing-password":
                    window.alert("password isn't optional")
                    setLogging(false)
                    break;
                case "auth/network-request-failed":
                    window.alert("there is an error, it's possible caused by connection")
                    setConnection({active:false})
                    setLogging(false)
                    break;
                default:
                    setLogging(false)
                    break;
            }
        })
    }

    const Reset = () => {
        setLogging(true)
        sendPasswordResetEmail(auth, email)
        .then(()=>{
            if ("Notification" in window && Notification.permission === 'granted') {
                new Notification("Response to reset password request",{
                    leng:'en',
                    body:'Your reset mail is sended.'
                })
            }
            else window.alert("Your reset mail is sended.")
            setLogging(false)
        })
        .catch((err)=>{
            if (err.code === 'auth/network-request-failed') {
                window.alert("there is an error, it's possible caused by connection")
                setConnection({active:false})
            }
            else
            window.alert("Send reset mail failed, check the email box and try again.")
            setLogging(false)
        })
        setEmail('')
    }

    return(
        <>
            <div className='Form card'>
                <form className='inputText'>
                    <p>..Fill out the form and choose what you do..</p>
                    <input value={email} type='email' placeholder='Email' onChange={(e)=> setEmail(e.target.value)}></input>
                    <input value={password} type='password' placeholder='Password' onChange={(e)=> setPassword(e.target.value)}></input>
                </form>
                <div>
                    <div className='buttonWithOutGoogle'>
                        <button className='btn' onClick={()=>{
                            SignInWithCredentials()
                            setEmail('')
                            setPassword('')
                        }}>{logging?
                            <><img src="./img/loading.gif" alt="" className="logImg"/>Please wait</>:
                            <>SingUp</>}</button>
                            <button className='btn' onClick={()=>{
                            LogInWithCredentials()
                            setEmail('')
                            setPassword('')
                        }}>{logging?
                                <><img src="./img/loading.gif" alt="" className="logImg"/>Please wait</>:
                                <>SingIn</>}</button>
                    </div>
                    <div className='buttonWithGoogle'>
                        <button className='btn' onClick={LogInGoogle}>
                            {logging ? 
                            <><img src="./img/loading.gif" alt=""/>Please wait</>:
                            <><img src="./img/GoogleLogoPng.png" alt=""/>Continue with Google</>
                            }
                            </button>
                    </div>
                    <div className="resetPassword">
                        <button className="btn" onClick={Reset}>
                        {logging?
                        <div className="ForgetP"><img src="./img/loading.gif" alt="" className="logImg"/>Please wait</div>:
                        <>Lost Password</>}
                        </button>
                        <p>!! If you have lost your password simply fill in the mail box !!</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FormLogin