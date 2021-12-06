import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from 'components/App/App';
import { BrowserRouter as Router } from 'react-router-dom';

import configureStore from 'store';
import { PersistGate } from 'redux-persist/integration/react';
import Loading from './standalone/Loading';
import * as serviceWorker from './serviceWorker';

import 'styles/media-queries.scss';
import 'styles/index.scss';

// We listen to the resize event
window.addEventListener('resize', () => {
  // We execute the same script as before
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});

const { store, persistor } = configureStore();

ReactDOM.render(
  // <React.StrictMode>
  <Provider store={store}>
    <PersistGate loading={<Loading pageMode />} persistor={persistor}>
      <Suspense fallback={<Loading pageMode />}>
        <Router>
          <App />
        </Router>
      </Suspense>
    </PersistGate>
  </Provider>,
  // </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
