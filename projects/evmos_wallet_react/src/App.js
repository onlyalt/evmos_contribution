import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { Navbar, Nav, Container } from 'react-bootstrap';

import Transfer from "./components/portfolio.component";
import SignUp from "./components/signup.component";
import NFTPage from "./components/nft.component";
import MintPage from "./components/mint.component";
import FaucetPage from "./components/faucet.component";

function App() {
  return (<Router>
    <div className="App">
      <Navbar collapseOnSelect fixed='top' expand='sm' bg='dark' variant='dark'>
        <Container>
          <Navbar.Toggle aria-controls='responsive-navbar-nav' />
          <Navbar.Collapse id='responsive-navbar-nav'>
            <Nav>
              <Nav.Link href='/signup'>Sign Up </Nav.Link>
              <Nav.Link href='/wallet'>Portfolio</Nav.Link>
              <Nav.Link href='/nft'>NFTs</Nav.Link>
              <Nav.Link href='/mint'>Mint your NFT</Nav.Link>
              <Nav.Link href='/faucet'>OTT Faucet</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

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