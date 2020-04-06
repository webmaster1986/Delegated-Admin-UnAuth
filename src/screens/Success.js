import React from "react"
import {Container} from "react-bootstrap";
class Success extends React.Component {

    render() {
        const { state } = this.props.location
        return (
            <Container className={"container-design"}>
                {
                    state.location === 'claimAccount' ?
                        <>
                            <h5 className="text-left">Your data saved successfully.</h5>
                            { (state.data && state.data.passwordError) ? <div style={{padding: '0 10px'}}>{state.data.passwordError}</div> : null }
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