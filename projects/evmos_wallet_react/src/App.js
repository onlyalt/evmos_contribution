import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

import Transfer from "./components/portfolio.component";
import SignUp from "./components/signup.component";
import NFTPage from "./components/nft.component";
import MintPage from "./components/mint.component";
import FaucetPage from "./components/faucet.component";

function App() {
  return (<Router>
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <Link className="navbar-brand" to={"/wallet"}>Alt Wallet</Link>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to={"/signup"}>Sign up</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/wallet"}>Portfolio</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/nft"}>NFTs</Link>
              </li> 
              <li className="nav-item">
                <Link className="nav-link" to={"/mint"}>Mint your NFT</Link>
              </li> 
              <li className="nav-item">
                <Link className="nav-link" to={"/faucet"}>OTT Faucet</Link>
              </li> 
            </ul>
          </div>
        </div>
      </nav>

      <div className="auth-wrapper">
        <div className="auth-inner" style={{ width: "700px"}}>
          <Switch>
            <Route exact path="/">
              <Redirect to="/signup" />
            </Route>
            <Route exact path="/sign-up">
              <Redirect to="/signup" />
            </Route>
            <Route path="/signup" component={SignUp} />
            <Route exact path='/wallet' component={Transfer} />
            <Route path="/nft" component={NFTPage} />
            <Route path="/mint" component={MintPage} />
            <Route path="/faucet" component={FaucetPage} />
          </Switch>
        </div>
      </div>
    </div></Router>
  );
}

export default App;