import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import './index.css' 

//--Components--
import ContainerTitleUsername from './components/TItle-Username/Container';
import Diary from './components/Diary-FormLogin/Diary';
import MyStory from './components/ViewMyStory/MyStory';
import ViewStories from './components/ViewStories/ViewSrories';
//--------------
const root = ReactDOM.createRoot(document.getElementById('root'));

if ("Notification" in window && (Notification.permission === 'denied' || Notification.permission === 'default')) {
  Notification.requestPermission()
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register('./SW.js')
  .then(()=>console.log("Service worker is registered"))
  .catch((err) => console.log("Service worker ins't registered: " , err))
}

navigator.serviceWorker.addEventListener('message',(evt)=> {
  if ("Notification" in window && Notification.permission === 'granted') {
    new Notification("Response to upload request",{
        leng:'en',
        body:evt.data
    })
}
})

root.render(
  <React.StrictMode>
    <div className='all' id='all'>
      <ContainerTitleUsername />
      <Diary/>
    </div>
      <MyStory/>
    <ViewStories/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
