import './User.css'
import { auth } from '../../FirebaseAuth/Firebase'
import {onAuthStateChanged, signOut} from "firebase/auth";
import { useState, useEffect } from 'react';



const  Login = () => {
    const [ { user, userName}, setUser ] = useState({user:null, userName:''}) 
    const [ connection, setConnection] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser != null) {
                setUser({
                    user:currentUser,
                    userName: currentUser.displayName || currentUser.email.split('@')[0]
                });
            } else {
                setUser({user:null, userName:''}); 
            }
        });
        return () => unsubscribe();
    }, [user]);


    const delAcc = () =>{
        if (window.confirm("Are you sure? your account it's gonna be deleted but not your stories.")) {
            if ("Notification" in window && Notification.permission === 'granted') {
                new Notification("Response to delet account request",{
                    leng:'en',
                    body:'Request to delete account in execution...'
                })
            }
            user.delete().then(()=> {
                if ("Notification" in window && Notification.permission === 'granted') {
                    new Notification("Response to delet account request",{
                        leng:'en',
                        body:"Request to delete account it's finished with success"
                    })
                }
                else window.alert("Your account it's deleted")
            }).catch((err)=>{
                switch (err.code) {
                    case 'auth/network-request-failed':
                        window.alert("Delete account failed because the connection in unstable")
                        setConnection(false)
                        break;
                    case 'auth/requires-recent-login':
                        window.alert("Account deletion failed because you have been logged in for too long time, ri-autenticati per completare l'operazione!")
                        break;

                    default:
                        window.alert("Delete account failed, try again")
                        break;
                }
            })
        }
    }

    function Log(){
        return (
            <>
                <div className='login'>
                    <div className='box'>
                        <img src={user.photoURL == null ? '' : user.photoURL}
                        alt="" ></img>
                    </div>
                    
                    <div className='username'>
                        <h2>{userName}</h2>
                    </div>

                    <div className='signOut'>
                        <button className='btnUser' onClick={()=> signOut(auth)}>SignOut</button>
                        {connection?<button className='btnUser' onClick={delAcc}>Delete Account</button>:<></>}
                    </div>
                </div>
            </>
        )
    }

    return(
        <>
            {user != null ? <Log></Log> : <></>}
        </>
    )
}

export default Login 


