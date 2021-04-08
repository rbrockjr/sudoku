import './RoundButton.css';

const RoundButton = (props) => {
    return (
        <div className={"RoundButton" + (props.secondaryClass ? " " + props.secondaryClass : "") + (props.active ? " active" : "")} onClick={props.buttonClick}>{props.buttonText}</div>
    );
}

export default RoundButton;