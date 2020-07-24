import React from "react"
import {Container} from "react-bootstrap";
class Success extends React.Component {

    render() {
        const { state } = this.props.location
        return (
            <Container className={"container-design"}>
                {
                    state.location === 'activateAccount' ?
                        <>
                            <h5 className="text-left">Your account has been successfully activated.</h5>
                            { (state.data && state.data.passwordError) ? <div style={{padding: '0 10px'}}>The password could not be updated because of an error. Please use the <a href='/SelfService/unauth/password-reset'>Reset Password </a> page to reset your password.</div> : null }
                        </> :
                        <>
                            { (state.data && state.data.location === 'forgetPassword') ? <h6>Your password has been reset successfully. <a href='http://www.fdny.org/'>Click here </a>to go to home page.</h6> : null }
                        </>

                }
            </Container>
        );
    }
}

export default Success;