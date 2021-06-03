import styled from "styled-components";
import RoundButton from "./RoundButton";
import useModal from "../modal/UseModal";
import Settings from "./Settings";
import Tools from "./Tools";
import toolsImg from '../images/tools.png';
import gearImg from '../images/gear.png';

const SettingsMenu = () => {
  const [ ToolsModal, openTools, closeTools ] = useModal();
  const [ SettingsModal, openSettings, closeSettings ] = useModal();

  return (
    <Menu>
      <RoundButton
        content={<ToolsButton>&nbsp;</ToolsButton>}
        buttonClick={() => openTools()}
        animatePress={true}
      />
      <RoundButton
        content={<SettingsButton>&nbsp;</SettingsButton>}
        buttonClick={() => openSettings()}
        animatePress={true}
      />
      <ToolsModal>
        <Tools onClose={() => closeTools()} />
      </ToolsModal>
      <SettingsModal>
        <Settings onClose={() => closeSettings()} />
      </SettingsModal>
    </Menu>
  );
};

const Menu = styled.div`
  display: flex;
  width: 180px;
  height: 80px;
  flex-direction: row;
  flex-wrap: wrap;
  @media all and (max-width: 800px), all and (max-height: 767px) {
    height: 140px;
    width: 80px;
  }
`;

const ToolsButton = styled.div`
  background-image: url(${toolsImg});
  background-repeat: no-repeat;
  background-position: 6px 6px;
  background-size: 75%
`;

const SettingsButton = styled.div`
  background-image: url(${gearImg});
  background-repeat: no-repeat;
  background-position: 5px 5px;
  background-size: 82%
`;

export default SettingsMenu;
