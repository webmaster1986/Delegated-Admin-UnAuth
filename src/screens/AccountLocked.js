import React from "react"
import {Container} from "react-bootstrap";
import lock from '../components/images/lock.png';
class AccountLocked extends React.Component {

    render() {

        return (
            <Container className={"container-design"}>
                <img src={lock} alt=''/> &nbsp;
                                Your account is locked. You can unlock your account by going to <a href='/SelfService/unauth/password-reset'>Forgot Password</a>.            
            </Container>
        );
    }
}

export default AccountLocked;