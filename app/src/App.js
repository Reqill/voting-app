import { useState, useEffect } from 'react';
import './styles/App.css';
import BeforeTime from './components/BeforeTime'
import BeforeVoting from './components/BeforeVoting'
import DuringVoting from './components/DuringVoting'
import AfterVoting from './components/AfterVoting'
import AfterTime from './components/AfterTime'
import { baseApiLink } from './commonData';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { getResults } from './firebase';


const colorScheme = {
  primary: "#e6710b",
  secondary: "",
  bgPage: "#f5a21c",
  bgCard: "#FAFAFA",
  header: "#111111",
  description: "#666666"
}

const App = () => {
  const [colors, setColors] = useState(colorScheme)
  const [currentCard, setCurrentCard] = useState("before-time")
  const [token, setToken] = useState();
  const [settings, setSettings] = useState({ startTime: { _seconds: 16325877560 }, endTime: { _seconds: 163258775600 } });
  const [loaded, setLoaded] = useState(false)
  const [message, setMessage] = useState("");
  const [waitingForServer, setWaitingForServer] = useState(false);
  useEffect(() => {

    console.log("DOWNLOADING");
    fetch(baseApiLink + "/settings").then(response => response.json()).then(data => {
      if (data.startTime !== undefined && data.endTime !== undefined) {
        setSettings(data);
        setLoaded(true);
      }

    })
    
    setWaitingForServer(true);
    getResults(callback);
  }, [])
  const callback = (credentials, user) => {
    if(credentials !==undefined && user !== undefined){
      if (user.email.endsWith("@lo1.gliwice.pl")) {
        
        fetch(baseApiLink + "/ableToVote",{
            method: "get",
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.idToken
            })}).then(response =>{
            if(response.status === 200){
                setCurrentCard("during-voting");
                setWaitingForServer(false);
                setToken(credentials.idToken);
                
            }else{
                setCurrentCard("after-voting");
                setWaitingForServer(false);
                setMessage("Możesz oddać tylko jeden głos!");
                
            }
           
        })
        
     }
      else {
          setWaitingForServer(false);
          // console.log("to nie email szkolny");
          alert("Musisz zalogować się z maila szkolnego! Domena: *@lo1.gliwice.pl")
      }
    }
    setWaitingForServer(false);
    

}
  return (
    <div style={{ backgroundColor: colors.bgPage }} className="background">
      <main style={{ backgroundColor: colors.bgCard }}>
        <div className="upper-row" style={{ backgroundColor: colors.bgPage }} />
        <div className="center" style={{ padding: "20px 20px 15px 20px", position: "relative" }}>
          <h1 style={{ color: colors.header }}>
            Głosowanie na Marszałka
          </h1>
          <h2 style={{ color: colors.description }}>
            I Liceum Ogółnokształcące w Gliwicach
          </h2>
          {
            !loaded || waitingForServer? <div style={{ margin: "40px" }}><Loader type="Bars" color={colors.primary} height={40} width={40} /></div> :
              currentCard === "before-time" ?
                <BeforeTime colors={colors} changeCard={setCurrentCard} endDate={settings.startTime._seconds * 1000} /> :
                currentCard === "before-voting" ?
                  <BeforeVoting colors={colors} changeCard={setCurrentCard}endDate={settings.endTime._seconds * 1000} /> :
                  currentCard === "during-voting" ?
                    <DuringVoting colors={colors} changeCard={setCurrentCard} endDate={settings.endTime._seconds * 1000} token={token} setMessage={setMessage} /> :
                    currentCard === "after-voting" ?
                      <AfterVoting colors={colors} changeCard={setCurrentCard} endDate={settings.endTime._seconds * 1000} message={message}/> :
                      currentCard === "after-time" ?
                        <AfterTime colors={colors} /> :
                        <p>WTF</p>
          }
          <p className="signed" style={{ color: colors.description }}>{'By: Maciuga Adam & Mrózek Mikołaj'}</p>
        </div>


      </main>
    </div>
  );
}

export default App;
