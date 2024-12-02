import './WriteDiary.css'
import { db, auth } from '../../FirebaseAuth/Firebase'
import { useState } from 'react'
import { collection, addDoc, getDocsFromCache, where, query, onSnapshot } from "firebase/firestore";

function WriteDiary(){
    const [ data, setData] = useState({
        videogame:'',
        story:''})

    const add = async (pub) =>{
        if ("Notification" in window && Notification.permission === 'granted') {
            new Notification("Response to upload request",{
                leng:'en',
                body:'Uploading...'
            })
        }
        const q = query(collection(db,"stories"), where("story", "==", data.story), where("videogame", "==", data.videogame), where("user", "==", auth.currentUser.displayName || auth.currentUser.email.split('@')[0]))
        getDocsFromCache(q)
        .then((value)=> {
            if (!value.empty) {
                if ("Notification" in window && Notification.permission === 'granted') {
                    new Notification("Response to upload request",{
                        leng:'en',
                        body:'Request to upload done with Failed, the story already exists'
                    })
                }
                return
            }
            addDoc(collection(db,"stories"),{...data, user:auth.currentUser.displayName || auth.currentUser.email.split('@')[0],public:pub})
            .catch(()=>{
                if ("Notification" in window && Notification.permission === 'granted') {
                    new Notification("Response to upload request",{
                        leng:'en',
                        body:'Request to upload done with Failed, we are sorry, try again.'
                    })
                }
            })
        })
        .catch((e)=>{window.alert('There is an error in cache check: ', e)})
        setData({videogame:'',story:''})
        onSnapshot(collection(db,'stories'), () => 
            {
                window.location.reload()
            });
    }

    return(
        <>
        <div className="FormStory card">
            <div className='Videogame'>
                <input type='text' placeholder='Videogame' value={data.videogame} onChange={(e)=>setData({...data,videogame:e.target.value})}></input>
            </div>
            <div className='Story'>
                <textarea type='textbox' placeholder='Write your story' value={data.story} onChange={(e)=>setData({...data, story:e.target.value})}></textarea>
            </div>
            <div className='Public-Save'>
                <button className='btn' onClick={()=>add(true)}>Public</button>
                <button className='btn' onClick={()=>add(false)}>Save for later</button>
            </div>
        </div>
        </>
    )
}

export default WriteDiary