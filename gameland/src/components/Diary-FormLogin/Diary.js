import './Diary.css'
import { useState } from 'react';
import { auth } from '../../FirebaseAuth/Firebase'
import { onAuthStateChanged } from "firebase/auth";

import FormLogin from './Form';
import WriteDiary from './WriteDiary';


function Diary(){
    const [ user, setUser] = useState(auth.currentUser)
    const [ connection, setConnection] = useState({active:true})
    const [ loading, setLoading] = useState(true)

    onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) setUser(currentUser)
        else setUser(null)
        setLoading(false)
    })

    return(
        <>
            <div className="containerDiarys">
                <div className='box-welcome'> 
                    <h1>Before the "Lore" there was DARK!</h1>
                    <h2>Free space for your thoughts</h2>
                    <p>tell us your adventures, thoughts and hopes. Read other people's stories without being judged or judging, broaden your horizons, another point of view creates a new game with new emotions.</p>
                    <h2>scroll down for YOUR stories and more</h2>
                    <img src='./img/arrow.gif' alt=''></img>
                </div>
                <div className='diaryRight'>
                {loading ? 
                <>
                <div className='loading'>
                    <div className='loadImg'>
                    <img src='./img/loading.gif' alt=''></img><h1>Loading</h1><img src='./img/loading.gif' alt=''></img>
                    </div>
                    <h2>we are working for you</h2>
                </div>
                </>
                :user == null ? 
                connection.active ?
                    <FormLogin  setConnection = {setConnection}/>:
                    <>
                    <div className='connection'> 
                        <h1>Connection unstable</h1>
                        <div className='disC'>
                            <h2>WE CAN TRY TO SATISFY YOU WITH CACHE RESOURCES</h2>
                        </div>
                        <img src='./img/panic.png' alt=''/>
                    </div>
                    </>
                    :<WriteDiary/>}    
                </div>
            </div>
        </>
    )
}

export default Diary