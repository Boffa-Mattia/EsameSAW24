import './ViewStories.css'
import { db } from '../../FirebaseAuth/Firebase'
import { useState, useEffect } from 'react'
import { collection, where, query, getDocs, getDocsFromCache} from "firebase/firestore";

function SingleStory( { entry } ){
    const story = entry.data()
    const [ data ] = useState({videogame:story.videogame, story:story.story, user:story.user})

    return(
        <div className='singleStoryOther'>
            <div className='author'><p>Author: {data.user}</p></div>
            <div className='videogameOther'>
                <p>{data.videogame}</p>
            </div>
            <div className='storyOther'>
                <p>{data.story}</p>
            </div>
        </div>
    )
}

function NoStory(){
    return(
        <>
        <div className='messageNothing'>
            <h1>
                Here there is nothing for us!
            </h1>
            <h2>
                maybe you can be "The First"
            </h2>
            <img src='./img/astronaut.jpg' alt=''></img>
        </div>
        </>
    )
}

function ViewStories(){
    const [stories, setStories] = useState([]);
    const [ loading, setLoading] = useState(true)

    useEffect(() => {
        spownStory();
    }, []);
 
    function spownStory(){

        let que = query(collection(db,"stories"),where("public", "==", true))
        
        Promise.any([ //Ignora i fallimenti
            getDocs(que), getDocsFromCache(que)])
          .then((docs) => {
            if (docs) {
              const values = docs.docs;
              setStories(values);
            } else {
              setStories([]);  
            }
            setLoading(false)
          })
          .catch(() =>setStories([])); 
        }

    return(
        <>
        <div className='bladDivisor'></div>
        <div className='containerStories'>
            <div className='title titleStorys'>
                <span>C</span>
                <span>o</span>
                <span>m</span>
                <span>m</span>
                <span>e</span>
                <span>u</span>
                <span>n</span>
                <span>i</span>
                <span>t</span>
                <span>y</span>
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
            {loading?
            <div className='load'>
                <h1>Loading</h1>
            </div>
            :stories.length>0?stories.map((story, index) => (
                        <SingleStory 
                        entry={story}
                        key={index}
                        />
                    )):<NoStory/>
                    }
            </div>
            {stories.length>3?<div className='readMore'><img src='./img/arrowR.gif' alt=''></img> SCROLL TO READ MORE <img src='./img/arrowR.gif' alt=''></img></div>:<></>}
        </div>
        </>
    )
}

export default ViewStories