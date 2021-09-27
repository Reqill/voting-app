import { useState, useEffect } from "react";
import Countdown from "react-countdown";

const AfterVoting = ({ colors, changeCard, endDate, message }) => {

    const renderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            changeCard("after-time");
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

            <div className="dummy center" style={{ height: "120px" }}>
                <p>
                    {message}
                </p>
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

export default AfterVoting;
