import { useState, useEffect } from 'react';
import './styles/App.css';
import BeforeTime from './components/BeforeTime'
import BeforeVoting from './components/BeforeVoting'
import DuringVoting from './components/DuringVoting'
import AfterVoting from './components/AfterVoting'
import AfterTime from './components/AfterTime'


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

  return (
    <div style={{ backgroundColor: colors.bgPage }} className="background">
      <main style={{ backgroundColor: colors.bgCard }}>
        <div className="upper-row" style={{ backgroundColor: colors.bgPage }} />
        <div className="center" style={{ padding: "20px 20px 15px 20px" }}>
          <h1 style={{ color: colors.header }}>
            Głosowanie na Marszałka
          </h1>
          <h2 style={{ color: colors.description }}>
            I Liceum Ogółnokształcące w Gliwicach
          </h2>
          {currentCard === "before-time" ?
            <BeforeTime colors={colors} changeCard={setCurrentCard} /> :
            currentCard === "before-voting" ?
              <BeforeVoting colors={colors} changeCard={setCurrentCard} /> :
              currentCard === "during-voting" ?
                <DuringVoting colors={colors} changeCard={setCurrentCard} /> :
                currentCard === "after-voting" ?
                  <AfterVoting colors={colors} changeCard={setCurrentCard} /> :
                  currentCard === "after-time" ?
                    <AfterTime colors={colors} /> :
                    <p>WTF</p>
          }
        </div>


      </main>
    </div>
  );
}

export default App;
