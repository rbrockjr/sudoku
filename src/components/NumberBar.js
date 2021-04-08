import './NumberBar.css';
import { useContext } from 'react';
import RoundButton from './RoundButton';
import { GlobalContext } from '../util/globalContext';

const NumberBar = () => {
    const { state, setActiveNumber } =  useContext(GlobalContext);

    const buttonClick = (number) => {
      setActiveNumber(number);
    }

    const buttons= [];
    for (let i = 0; i < 9; i++) {
        buttons.push(
            <RoundButton buttonText={i+1} active={state.activeNumber === (i+1)} secondaryClass={state.solvedNumbers[i] ? 'greyed' : ''} buttonClick={() => buttonClick(i+1)} key={i+1} />
        );
    }

    return(
        <div className="NumberBar">
            {buttons}
        </div>
    )
}

export default NumberBar;