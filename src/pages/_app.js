import "./../styles/globals.css";
import "./../styles/lazy.css"
import {AppStateContextProvider} from "../contexts/AppStateContext";


export default function App({ Component, pageProps }) {
  return (
      <AppStateContextProvider>
        <Component {...pageProps} />;
      </AppStateContextProvider>
  )
}
