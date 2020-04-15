import React from 'react';
import './App.css';
import Loader from './components/loader';
import useElementHeight from './hooks/useElementHeight';
import Collections from './components/collections';
import communication from './communication/communication';
import CollectionNotFound from './components/notFound';



function App() {
  const documentHeight = useElementHeight(document.documentElement);
  const [collectionsState, setCollectionsState] = React.useState(null);
  const [isCommunicationInitialized, setIsCommunicationInitialized] = React.useState(false);
  const [isAuth, setIsAuth] = React.useState(false);

  React.useEffect(() => {
    communication.init().then((isAuth) => {
      setIsAuth(isAuth);
      console.log('Initialized communication! isAuth:', isAuth);

      if (isAuth) {
        communication.requestCollectionsData().then((collections) => {
          console.log('Received collections', collections);
          setCollectionsState(collections);
          setIsCommunicationInitialized(true);
        });
      } else { 
        setIsCommunicationInitialized(true);
      }
    });
  }, []);

  React.useEffect(() => {
    if (isCommunicationInitialized) {
      communication.updateIFrameHeight(documentHeight);
    }
  }, [documentHeight, isCommunicationInitialized]);

  if (!isCommunicationInitialized) {
    return <Loader />;
  }

  return (
    <div className="App">
      { isAuth ? <Collections collections={collectionsState.data} /> : <CollectionNotFound />}
    </div>
  );
}

export default App;
