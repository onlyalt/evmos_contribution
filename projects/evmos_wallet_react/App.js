import React, { useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Moralis from 'moralis';
import { constants } from 'helpers';

import {
  AuditorsPage,
  AuditorPage,
  CreateAuditorPage,
  RequestPage,
  CreateRequestPage,
  DeliverAuditPage,
  DashboardPage,
  SearchPage,
  AuthCallbackPage,
} from 'pages';
import { Header } from 'components/User';
import { Footer } from 'components/_Global';

import useGetUser from 'hooks/user/useGetUser';
import env from '.env';
import useApp from './useApp';

Moralis.start({
  serverUrl: env[process.env.REACT_APP_ENVIRONMENT].moralisServerUrl,
  appId: env[process.env.REACT_APP_ENVIRONMENT].moralisAppId,
});

function App() {
  const { getContracts } = useApp();
  const { checkCurrentChainId } = useGetUser();

  useEffect(() => {
    getContracts();
    checkCurrentChainId();
  }, []);

  return (
    <>
      <Header />
      <Switch>
        <Route path="/github">
          <AuthCallbackPage
            service={constants.REVIEW_LINKING_SERVICES.GITHUB}
          />
        </Route>
        <Route path="/auditors">
          <AuditorsPage />
        </Route>
        <Route exact path="/create-auditor">
          <CreateAuditorPage />
        </Route>
        <Route exact path="/auditor/:chainId/:address">
          <AuditorPage />
        </Route>
        <Route exact path="/create-request/:chainId/:auditorAddress">
          <CreateRequestPage />
        </Route>
        <Route exact path="/audit/:chainId/:address">
          <RequestPage />
        </Route>
        <Route exact path="/deliver-audit/:chainId/:requestAddress">
          <DeliverAuditPage />
        </Route>
        <Route exact path="/dashboard">
          <DashboardPage />
        </Route>
        <Route exact path="/search">
          <SearchPage />
        </Route>
        <Route exact path="/">
          <Redirect to="/auditors" />
        </Route>
        <Route path="/">
          <Redirect to="/auditors" />
        </Route>
      </Switch>
      <Footer />
    </>
  );
}

export default App;
