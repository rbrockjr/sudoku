import CellModeMenu from "./CellModeMenu";
import ColorChainMenu from "./ColorChainMenu";
import "./Menu.css";
import SettingsMenu from "./SettingsMenu";

function Menu(props) {
    return (
        <div className="Menu" >
            <CellModeMenu />
            <ColorChainMenu />
            <SettingsMenu openSettings={props.openSettings} />
        </div>
    )
}

export default Menu;