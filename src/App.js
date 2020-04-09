import React, { Component } from 'react';
import {Route, Switch} from 'react-router-dom'
import {Container} from 'react-bootstrap';
import {Spin} from 'antd';

import ActivateAccount from "./screens/ActivateAccount";
import ForgetPassword from "./screens/ForgetPassword";
import Success from "./screens/Success";
import AccountLocked from "./screens/AccountLocked";
import { ApiService } from "./services/ApiService"
// import Registration from "./screens/Registration";

import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';
import 'antd/dist/antd.css';


class App extends Component {
    _apiService = new ApiService();

    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            environment: "prd"
        }
    }

    async componentDidMount() {
        const envData = await this._apiService.getEnvironment()
        this.setState({
            isLoading: false,
            environment: envData && envData.environment
        })
    }

    render() {
        const {isLoading, environment} = this.state
        return (
            <div>
                {isLoading ? <div className="text-center mt-5-p"><Spin className='mt-50 custom-loading'/></div> :
                    <div>
                        <Header environment={environment}/>
                        <Container>
                            <Switch>
                                <React.Fragment>
                                    <Route path='/SelfService/unauth/activate-account' component={ActivateAccount}/>
                                    <Route path='/SelfService/unauth/password-reset' component={ForgetPassword} />
                                    <Route path='/SelfService/unauth/success' component={Success}/>
                                    <Route path='/SelfService/unauth/accountlocked' component={AccountLocked} />
                                    <Route path='/SelfService/unauth/accountlocked.html' component={AccountLocked} />
                                </React.Fragment>
                            </Switch>
                            <Footer/>
                        </Container>
                    </div>
                }
            </div>
        );
    }
}

export default App;