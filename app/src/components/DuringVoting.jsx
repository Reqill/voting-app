import { useState, useEffect } from "react";
import Countdown from "react-countdown";
import { baseApiLink } from "../commonData";


const VoteOption = ({ colors, idx, activeIdx, setActiveIdx, id, name, classLabel }) => {
    const [hover, setHover] = useState(false)
    const [color, setColor] = useState("rgba(0,0,0,.05)")

    useEffect(() => {
        if (activeIdx === idx) {
            setColor("rgba(230, 113, 11, .75)")
        } else {
            setColor("rgba(0,0,0,.05)")
        }
    }, [activeIdx])


    return (
        <div
            className="candidate-box"
            key={idx}
            // onMouseEnter={() => setHover(true)}
            // onMouseLeave={() => setHover(false)}
            onClick={() => { setActiveIdx(idx) }}
            style={{
                backgroundColor: color
            }}
        >
            <p className="candidate-name">{name}</p>
            <p className="candidate-class" style={{ color: colors.description }}>klasa: {classLabel}</p>
        </div>
    );
}


const DuringVoting = ({ colors, changeCard, endDate, token }) => {
    const [activeIdx, setActiveIdx] = useState(null)
    const [candidates, setCandidates] = useState([]);
    useEffect(() => {
        fetch(baseApiLink + "/candidates").then(response => response.json()).then(data => {
            setCandidates(data);
        })
    }, [])

    const _handleSubmit = (e) => {
        e.preventDefault()
        console.log(token);
    }

    const _renderOptions = () => {
        return candidates.map((candidate) => <VoteOption colors={colors} idx={candidate.id} activeIdx={activeIdx} setActiveIdx={setActiveIdx} name={candidate.fullName} classLabel={candidate.className} />)
    }

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


    return (
        <div className="center" style={{ width: "100%", maxWidth: "100%", marginBottom: "5px" }}>
            <form onSubmit={_handleSubmit} className="center" style={{ width: "100%" }}>
                <div className="options center">
                    {_renderOptions()}
                </div>
                <div className="onerow">
                    <select name="classLabel" id="classLabel" required>
                        <option value="1a">1a</option>
                        <option value="1b">1b</option>
                        <option value="1c">1c</option>
                        <option value="1d">1d</option>
                        <option value="1e">1e</option>
                        <option value="2a">2a</option>
                        <option value="2b">2b</option>
                        <option value="2c">2c</option>
                        <option value="2d">2d</option>
                        <option value="2e">2e</option>
                        <option value="3ap">3ap</option>
                        <option value="3bp">3bp</option>
                        <option value="3cp">3cp</option>
                        <option value="3dp">3dp</option>
                        <option value="3ep">3ep</option>
                        <option value="3ag">3ag</option>
                        <option value="3bg">3bg</option>
                        <option value="3cg">3cg</option>
                        <option value="3dg">3dg</option>
                        <option value="3eg">3eg</option>
                    </select>
                    <select name="sex" id="sex" required>
                        <option value="kobieta">kobieta</option>
                        <option value="mezczyzna">mężczyzna</option>
                        <option value="nie-podawac">nie chcę podawać</option>
                        <option value="inne">inne</option>
                    </select>
                </div>
                <button
                    className="vote-btn"
                    type="submit"
                    style={{ backgroundColor: activeIdx === null ? "rgba(0,0,0,.2)" : colors.primary, color: 'white' }}
                    disabled={activeIdx === null ? true : false}
                >
                    <p className="btn-label">Oddaj głos!</p>
                </button>
            </form>
            <p className="countdown-label" style={{ color: colors.header }}>Do zakończenia głosowania pozostało:</p>
            <Countdown
                date={endDate}
                renderer={renderer}
                onComplete={() => changeCard("after-time")}
            />
        </div>
    )
}

export default DuringVoting;
