import { useState } from 'react';
import './RoundButton.css';

const RoundButton = (props) => {
    const [animatePress, setAnimatePress] = useState(false);

    return (
        <div 
            className={"RoundButton" + (animatePress ? " press" : "") + (props.secondaryClass ? " " + props.secondaryClass : "") + (props.active ? " active" : "")} 
            onClick={() => {
                if (props.animatePress) setAnimatePress(true);
                props.buttonClick()
            }}
            onAnimationEnd={() => setAnimatePress(false)}
        >
            {props.content}
        </div>
    );
}

export default RoundButton;