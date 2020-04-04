import React from 'react';
import {Route, Switch} from 'react-router-dom'
import {Container} from 'react-bootstrap';

import ClaimAccount from "./screens/ClaimAccount";
import ForgetPassword from "./screens/ForgetPassword";
import Success from "./screens/Success";
// import Registration from "./screens/Registration";

import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';
import 'antd/dist/antd.css';

const App  = () => (
 <div>
   <Header/>
   <Container>
     <Switch>
       <React.Fragment>
         <Route path='/SelfService/unauth/claim-account' component={ClaimAccount}/>
         <Route path='/SelfService/unauth/password-reset' component={ForgetPassword} />
         <Route path='/SelfService/unauth/success' component={Success}/>
       </React.Fragment>
     </Switch>
     <Footer/>
   </Container>
 </div>
);

export default App;
