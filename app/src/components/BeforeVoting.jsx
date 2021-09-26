import { useState, useEffect } from "react";
import Countdown from "react-countdown";
import "../styles/App.css"
import signInWithGoogle from "../firebase";
import { baseApiLink } from "../commonData";
const BeforeVoting = ({ colors, changeCard, setToken, endDate }) => {
    const [voteCount, setVoteCount] = useState(0);
    const [mostVotesClass, setMostVotesClass] = useState("");
    useEffect(() => {
        fetch(baseApiLink + "/votes/count").then(response => response.json()).then(data => {
            setVoteCount(data.total);
            setMostVotesClass(data.classes.sort((a, b) => b.numberOfVotes - a.numberOfVotes)[0]?.class)
        })
    }, [])
    const renderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            changeCard("after-voting");
            return <span>Zakończono głosowanie!</span>;
        } else {
            return (
                <p>
                    <span className="time-number" style={{ color: colors.primary }}>{days}</span>
                    <span className="time-label" style={{ color: colors.description }}>dni</span>&nbsp;&nbsp;
                    <span className="time-number" style={{ color: colors.primary }}>{hours}</span>
                    <span className="time-label" style={{ color: colors.description }}>godzin</span>&nbsp;&nbsp;
                    <span className="time-number" style={{ color: colors.primary }}>{minutes}</span>
                    <span className="time-label" style={{ color: colors.description }}>minut</span>&nbsp;&nbsp;
                    <span className="time-number" style={{ color: colors.primary }}>{seconds}</span>
                    <span className="time-label" style={{ color: colors.description }}>sekund</span>
                </p>
            );
        }
    };
    const callback = (credentials, user) => {
        if (user.email.endsWith("@lo1.gliwice.pl")) {
            setToken(credentials.idToken);
            changeCard("during-voting");
        }
        else {
            // console.log("to nie email szkolny");
            alert("Musisz zalogować się z maila szkolnego! Domena: *@lo1.gliwice.pl")
        }

    }
    const _handleLogIn = () => {
        signInWithGoogle(callback);
    }

    return (
        <div className="center" style={{ width: "100%", maxWidth: "100%", marginBottom: "5px" }}>
            <div className="voting-info center">
                <div className="voting-spec-info center">
                    {/* <h3 style={{ color: colors.header }} style={{ margin: 0, padding: 0 }}>
                        Głosowanie otwarte!
                    </h3> */}
                    <h4 style={{ color: colors.primary }}>
                        <span style={{ color: colors.description }}>oddano </span>{voteCount}&nbsp;<span style={{ color: colors.description }}>głosów łącznie,</span>
                    </h4>
                    <h4 style={{ color: colors.primary }}>
                        <span style={{ color: colors.description }}>a </span>{mostVotesClass || "X"}&nbsp;<span style={{ color: colors.description }}>to klasa z najwyższą frekwencją</span>
                    </h4>
                </div>
                <button
                    className="vote-btn"
                    onClick={() => _handleLogIn()}
                    style={{ backgroundColor: colors.primary, color: 'white' }}
                >
                    <p className="btn-label">Zagłosuj!</p>
                </button>
                <p className="warning" style={{ color: "tomato" }}>Aby wziąć udział w głosowaniu <b>musisz</b> zalogować się poprzez <b>maila szkolnego</b></p>
            </div>
            <p className="countdown-label" style={{ color: colors.header }}>Do zakończenia głosowania pozostało:</p>
            <Countdown
                date={endDate}
                renderer={renderer}
                onComplete={() => changeCard("after-time")}
            />
        </div>
    )
}

export default BeforeVoting;
