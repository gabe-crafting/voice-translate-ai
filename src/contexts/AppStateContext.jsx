import React, {useState, createContext} from "react";

export const AppStateContext = createContext({
    currentStatus: "",
    changeCurrentStatus: () => {},
    statuses: [],
    clearStatuses: () => {}
});

export function AppStateContextProvider({children}) {
    const [currentStatus, setCurrentStatus] = useState("");
    const [statuses, setStatuses] = useState([])

    const changeCurrentStatus = (newStatus) => {
        // Changes the state and also adds it to the list of states
        setCurrentStatus(newStatus)
        setStatuses(prevStatuses => [...prevStatuses, newStatus]);
    }

    const clearStatuses = () => {
        setStatuses([])
    }

    const contextValue = {
        currentStatus,
        changeCurrentStatus,
        statuses,
        clearStatuses
    }

    return (
        <AppStateContext.Provider value={contextValue}>
            {children}
        </AppStateContext.Provider>
    )
}