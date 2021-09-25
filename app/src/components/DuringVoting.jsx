import { useState, useEffect } from "react";
import Countdown from "react-countdown";


const VoteOption = ({ colors, idx, activeIdx, setActiveIdx, id, name, classLabel }) => {
    const [hover, setHover] = useState(false)

    return (
        <div
            className="candidate-box"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={() => { setActiveIdx(idx) }}
            style={{

            }}
        >
            <p className="canditate-name">{name}</p>
            <p className="candidate-class">{classLabel}</p>
        </div>
    );
}


const DuringVoting = ({ colors, changeCard }) => {
    const [activeIdx, setActiveIdx] = useState(null)
    const endDate = 1633384799000;

    const _handleSubmit = (e) => {
        e.preventDefault()
    }

    const _renderOptions = (x) => {
        return x.map((el, idx) => <VoteOption colors={colors} idx={idx} activeIdx={activeIdx} setActiveIdx={setActiveIdx} />)
    }

    const renderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
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
                    {_renderOptions(["Adam","1"])}
                </div>
                <button
                    className="vote-btn"
                    type="submit"
                    style={{ backgroundColor: colors.primary, color: 'white' }}
                >
                    <p className="btn-label">Zagłosuj!</p>
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
