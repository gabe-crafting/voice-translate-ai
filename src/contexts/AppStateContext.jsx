import React, {useState, createContext} from "react";

export const AppStateContext = createContext({
    currentState: "",
    changeCurrentState: () => {},
    states: [],
    clearStates: () => {}
});

export function AppStateContextProvider({children}) {
    const [currentState, setCurrentState] = useState("");
    const [states, setStates] = useState([])

    const changeCurrentState = (newState) => {
        // Changes the state and also adds it to the list of states
        setCurrentState(newState)
        setStates(prevStates => [...prevStates, newState]);
    }

    const clearStates = () => {
        setStates([])
    }

    const contextValue = {
        currentState,
        changeCurrentState,
        states,
        clearStates
    }

    return (
        <AppStateContext.Provider value={contextValue}>
            {children}
        </AppStateContext.Provider>
    )
}