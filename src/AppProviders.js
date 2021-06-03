import Toaster from "./toast/Toaster"
import { BoardProvider } from "./util/boardContext"
import { ChainProvider } from "./util/chainContext"
import { GlobalProvider } from "./util/globalContext"

const AppProviders = ({ children }) => {
  return (
    <Toaster>
      <GlobalProvider>
        <ChainProvider>
          <BoardProvider>
            {children}
          </BoardProvider>
        </ChainProvider>
      </GlobalProvider>
    </Toaster>
  )
}

export default AppProviders;