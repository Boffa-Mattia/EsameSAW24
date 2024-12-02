import './MyStory.css'
import { auth, db } from '../../FirebaseAuth/Firebase'
import { useState, useEffect } from 'react'
import { onAuthStateChanged } from "firebase/auth";
import { collection, where, query, getDocs, updateDoc, doc, deleteDoc, onSnapshot, getDocsFromCache } from "firebase/firestore";

function SingleStory( { entry } ){
    const story = entry.data()
    const [ data ] = useState({videogame:story.videogame, story:story.story, public:story.public})
    const [ newData,  setNewData] = useState({videogame:story.videogame, story:story.story, public:story.public, user:story.user})
    const [ updating, setUpdating ] = useState(false)

    useEffect(()=>{
        if (newData.story !== data.story || newData.videogame !== data.videogame || data.public !== newData.public) {
            setUpdating(true)
        }
        else setUpdating(false)
    },[newData])

    const update = (e) =>{
        const docRef = doc(db, 'stories', entry.id)
        if (window.confirm("Are you shure? the story it's gonna ba updated").valueOf()){
            e.target.style.backgroundColor = 'rgb(2 99 14)'
            e.target.innerText = 'Updating...'

            
            updateDoc(docRef, newData)
            .catch(()=>{
                window.alert("There is an error with update the story!")
            })

            onSnapshot(docRef, (doc) => {window.location.reload()});

        }
    }

    const del = (e) => {
        const docRef = doc(db, 'stories', entry.id)
        if (window.confirm("Are you shure? the story it's gonna ba deleted").valueOf()){
            e.target.style.backgroundColor = '#960d0d'
            e.target.innerText = 'Deleting...'
            deleteDoc(docRef)
            .catch(()=>{
                window.alert("There is an error with delete the story!")
            })
            onSnapshot(docRef, (doc) => {window.location.reload()});
        }
    }

    const cancel = () => {
        setNewData(data)
    }

    return(
        <div className='singleStory'>
            <div className='public'><p>{newData.public?'Public':'Private'}</p></div>
            <div className='videogame'>
                <input placeholder='Videogame' type='text' value={newData.videogame} onChange={(e)=>setNewData({...newData, videogame:e.target.value})}/>
            </div>
            <div className='story'>
                <textarea type='text' placeholder='Story' value={newData.story} onChange={(e)=> setNewData({...newData, story:e.target.value})}/>
            </div>
            <div className='buttonDeleteModify'>
                <button className='gntMy' onClick={del}>Delete</button>
                {updating?
                <>
                <button className='gntMy' onClick={update}>Update</button>
                <button className='gntMy' onClick={cancel}>Cancel</button>
                </>
                :<></>}
                {!updating?
                newData.public?<button className='gntMy' onClick={()=> setNewData({...newData, public:false})}>Private</button>:<button className='gntMy' onClick={()=> setNewData({...newData, public:true})}>Public</button>
                    :<></>}
            </div>
        </div>
    )
}

function NoStory(){
    return(
        <>
        <div className='message'>
            <h1>
                You didn't write any story
            </h1>
            <h2>
                scroll down to read other Stories
            </h2>
            <img src='./img/arrow2.gif' alt=''></img>
        </div>
        </>
    )
}

function MyStory(){
    const [ user, setUser ] = useState(auth.currentUser)
    const [stories, setStories] = useState([]);
    
    onAuthStateChanged(auth, (currentUser) => {
        if (currentUser){ 
            setUser(currentUser)
        }
        else setUser(null)
    })

    useEffect(() => {
        if (user) {
            spownStory();
        }
    }, [user]);
 
    function spownStory(){

        let que = query(collection(db,"stories"),where("user", "==", user.displayName!=null?user.displayName:user.email.split('@')[0]))
        

        Promise.any([ //Ignora i fallimenti
            getDocs(que),getDocsFromCache(que)])
          .then((docs) => {
            if (docs) {
              const values = docs.docs;
              setStories(values);
            } else {
              setStories([]);  
            }
          })
          .catch(() => setStories([]));  

    }

    return(
        user != null ?
        <>
        <div className='bladDivisor'></div>
        <div className='container'>
            <div className='title titleStorys'>
                <span>Y</span>
                <span>o</span>
                <span>u</span>
                <span>r</span>
                <span>_</span>
                <span>S</span>
                <span>t</span>
                <span>o</span>
                <span>r</span>
                <span>i</span>
                <span>e</span>
                <span>s</span>
            </div>
            <div className='stories'>
            {stories.length>0?stories.map((story, index) => (
                        <SingleStory 
                        entry={story}
                        key={index}
                        />
                    )):<NoStory/>
                    }
            </div>
            <div className='scollDown'>
                        <img src='./img/arrowDir.gif' alt=''></img>
                        <h2>Scroll down</h2>
                        <img src='./img/arrowDir.gif' alt=''></img>
                    </div>
        </div>
        </>: <></>
    )
}

export default MyStory