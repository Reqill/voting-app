import { useState, useEffect } from "react";
import Countdown from "react-countdown";



const BeforeTime = ({ colors }) => {
    const endDate = 1633298400000;

    const renderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            return <span>complete!</span>;
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
        <div className="center" style={{ width: "100%", marginBottom: "10px" }}>
            <div className="dummy center">
                <p>
                    tutaj będzie można oddać głos po rozpoczęciu głosowania
                </p>
            </div>
            <p className="countdown-label">Do głosowania pozostało:</p>
            <Countdown
                date={endDate}
                renderer={renderer}
            />
        </div>
    )
}

export default BeforeTime;
