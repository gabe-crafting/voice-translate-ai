import "./../styles/globals.css";
import "./../styles/lazy.css"
import {AppStateContextProvider} from "../contexts/AppStateContext";
import Header from "./../components/Header";


export default function App({ Component, pageProps }) {
  return (
      <AppStateContextProvider>
          <Header/>
          <Component {...pageProps} />;
      </AppStateContextProvider>
  )
}
