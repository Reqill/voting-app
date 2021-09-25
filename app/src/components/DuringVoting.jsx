import { useState, useEffect } from "react";
import Countdown from "react-countdown";

const DuringVoting = ({ colors, changeCard }) => {
    const endDate = 1633384799000;

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
