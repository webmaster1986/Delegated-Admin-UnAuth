import React from "react";
import {Col, Container, Row, Form, FormGroup  } from "react-bootstrap";
import {Steps, Divider, Tooltip, Icon} from "antd";
import DatePicker from "react-datepicker";
import moment from "moment"
import PasswordPolicy from "../components/PasswordPolicy";
import "react-datepicker/dist/react-datepicker.css";
import {ApiService} from "../services/ApiService";
import check from "../components/images/check.jpg";

const { Step } = Steps

class ActivateAccount extends React.Component {
  _apiService = new ApiService();

  constructor(props) {
    super(props);
    this.state = {
      userLogin: '',
      userLoginError: false,
      firstName: '',
      firstNameError: false,
      lastName: '',
      lastNameError: false,
      dob: '',
      dobError: false,
      last4ofSSN: '',
      last4ofSSNError: false,
      password: '',
      confirmPassword: '',
      challenges: [
        {
          challenge: '',
          response: '',
          responseError: false
        },
        {
          challenge: '',
          response: '',
          responseError: false
        },
        {
          challenge: '',
          response: '',
          responseError: false
        }
      ],
      allChallengeQuestions: [],
      error: {},
      isLoaderShow: false,
      errorMessage: '',
      apiMessage: '',
      afterSubmit: false,
      isCheckShow: false,
      currentStep: 0
    };
    this.baseState = this.state;
    this.style = { listitem: { paddingBottom: '0', paddingTop: '0' } }
  }

  async componentDidMount() {
    document.title = "Activate Account";
    this.setState({
      isLoaderShow: true
    })

    const data = await this._apiService.getChallengeQuestions();
    if (!data || data.error) {
      window.scrollTo(0, 0);
      this.setState({
        apiMessage: 'An error has occurred',
        errorMessage: 'apiError',
        isLoaderShow: false
      })
    }else {
      this.setState({
        allChallengeQuestions: data.challengeQuestions,
        challenges: [
          {
            challenge: data.challengeQuestions[0],
            response: '',
            responseError: false
          },
          {
            challenge: data.challengeQuestions[1],
            response: '',
            responseError: false
          },
          {
            challenge: data.challengeQuestions[2],
            response: '',
            responseError: false
          }
        ],
        isLoaderShow: false
      })
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name] : e.target.value
    })
  }

  handleSSNInputChange = (e) => {
    if (e.target.value.length === 0) {
      this.setState({
        [e.target.name]: ''
      })
    } else if (e.target.value.match(/^\d+$/) !== null) {
      this.setState({
        [e.target.name]: e.target.value.match(/^\d+$/).toString().substring(0, 4)
      })
    }
  }

  handleSSNBlur = (e) => {
    const { error } = this.state
    const { value, name } = e.target
    if (value === undefined || value.toString().length < 4) {
      error[name] = 'Enter the last 4 digits of SSN'
    } else {
      delete error[name]
    }
    this.setState({error})
  }

  handleDateChange = (date) => {
    this.setState({
      dob: date
    });
  }

  handleBlur = (e) => {
    let {error, userLogin} = this.state
    const {name, value} = e.target

    let errorName = ''
    if(name === "userLogin"){
      errorName = 'Enter the FISA reference number'
    } else if(name === "firstName"){
      errorName = 'Enter the first name'
    } else if(name === "lastName"){
      errorName = 'Enter the last name'
    } else if(name === "dob"){
      errorName = 'Enter the date of birth'
    }
    error[name] = !value ? errorName : ""
    if (name === "userLogin") {
      // if (/^[0-9]/.test(userLogin)) {
      if (userLogin && userLogin.length < 7) {
        this.setState({
          userLogin: '0'.repeat(7 - value.length) + value,
        })
      } /*else if (value.length < 7) {
        error[name] = `Please enter a valid ${name}`
      }*/
    }
    this.setState({ error })
  }

  checkErr = () => {
    const {errorMessage, apiMessage} = this.state
    let message = null;
    switch (errorMessage) {
      case 'noRequiredFields':
        message = <Row className='error-banner' style={{ paddingLeft: '20px' }}><p style={{ paddingTop: '10px' }}>Please enter all the required fields.</p></Row>;
        break;
      case 'duplicateAnswers':
        message = <Row className='error-banner' style={{ paddingLeft: '20px' }}><p style={{ paddingTop: '10px' }}>The answers to Security Questions have to be unique. Please correct the duplicate answers.</p></Row>;
        break;
      case 'sameQuestion':
        message = <Row className='error-banner' style={{ paddingLeft: '20px' }}><p style={{ paddingTop: '10px' }}>Security Questions should be unique.</p></Row>;
        break;
      case 'apiError':
        message = <Row className='error-banner' style={{ paddingLeft: '20px' }}><p style={{ paddingTop: '10px' }}>{apiMessage}</p></Row>;
        break;
      case 'pass':
        message = <Row className='pass-banner' style={{ paddingLeft: '20px' }}><p style={{ paddingTop: '10px' }}>Your account has been successfully Activated.<br/><a href='http://www.fdny.org/'>Click here </a>to go to the home page.</p></Row>;
        break;
      case 'isResponseError':
        message = <Row className='pass-banner' style={{ paddingLeft: '20px' }}><p style={{ paddingTop: '10px' }}>{this.state.responseErrMsg}</p></Row>;
        break;
      default:
        message = null;
    }
    return message
  }

  handleSelectChange(e, index) {
    let question = { ...this.state.challenges };
    question[index].challenge = e.target.value;
    this.setState({ [`question${index}`]: question })
  }

  handleAnswerInputChange(e, index) {
    let answer = { ...this.state.challenges }
    answer[index].response = e.target.value;
    this.setState({ [`answer${index}`]: answer })
  }

  handleAnswerBlur(e, index) {
    let error = { ...this.state.challenges }
    if (e.target.value === undefined || e.target.value.length === 0) {
      error[index].responseError = true;
      this.setState({ [`error${index}`]: error })
    } else {
      error[index].responseError = false;
      this.setState({ [`error${index}`]: error })
    }
  }

  handleSubmitBtnClick = async () => {
    const {userLogin, firstName, lastName, last4ofSSN, dob, password, confirmPassword, challenges} = this.state;
    this.setState({
      afterSubmit: true
    })

    let isRequiredEmpty = (userLogin === undefined || userLogin.length < 7) ||
      (firstName === undefined || firstName.length === 0) ||
      (lastName === undefined || lastName.length === 0) ||
      (dob === undefined || dob.length === 0) ||
      (last4ofSSN === undefined || last4ofSSN.toString().length < 4) ||
      (password || confirmPassword) && ((password === undefined || password.length === 0) ||
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$#@$!%*?&])[A-Za-z\d$@#$!%*?&]{8,}/.test(password) ||
      password.includes(firstName) ||
      password.includes(lastName) ||
      password.includes(userLogin) ||
      !/[A-Za-z]/.test(password.substring(0, 1)) ||
      (confirmPassword === undefined || confirmPassword.length === 0 || confirmPassword !== password)) ||
      (challenges[0].response === undefined || challenges[0].response.length === 0) ||
      (challenges[1].response === undefined || challenges[1].response.length === 0) ||
      (challenges[2].response === undefined || challenges[2].response.length === 0);

    let isQuestionSame = challenges[0].challenge === challenges[1].challenge ||
      challenges[0].challenge === challenges[2].challenge ||
      challenges[1].challenge === challenges[2].challenge;

    let isAnswerSame = challenges[0].response === challenges[1].response ||
      challenges[0].response === challenges[2].response ||
      challenges[1].response === challenges[2].response;

    if (isRequiredEmpty) {
      window.scrollTo(0, 0);
      this.setState({
        errorMessage: 'noRequiredFields',
        afterSubmit: false
      })
    } else if (isQuestionSame) {
      window.scrollTo(0, 0);
      this.setState({
        errorMessage: 'sameQuestion',
        afterSubmit: false
      })
    }
    else if (isAnswerSame) {
      window.scrollTo(0, 0);
      this.setState({
        errorMessage: 'duplicateAnswers',
        afterSubmit: false
      })
    } else {
      this.setState({
        errorMessage: '',
      })

      let birthday = dob;
      const  user = {
        userLogin: (userLogin || '').trim(), firstName: (firstName || '').trim(), lastName: (lastName || '').trim(),
        dob: `${birthday.getFullYear()}-${birthday.getMonth() <= 8 ? `0${birthday.getMonth() + 1}` : `${birthday.getMonth() + 1}`}-${birthday.getDate() < 10 ? `0${birthday.getDate()}` : `${birthday.getDate()}`}`,
        last4ofSSN, password, confirmPassword,
        challengeQuestions: [
          {
            name: challenges[0].challenge,
            value: (challenges[0] && challenges[0].response || '').trim()
          },
          {
            name: challenges[1].challenge,
            value: (challenges[1] && challenges[1].response || '').trim()
          },
          {
            name: challenges[2].challenge,
            value: (challenges[2] && challenges[2].response || '').trim()
          }
        ]
      };
      const response = await this._apiService.updateClaim(user);
      if (!response || response.error) {
        window.scrollTo(0, 0);
        this.setState({
          apiMessage: response.error || 'An error has occurred',
          errorMessage: 'apiError',
          afterSubmit: false
        })
      }else {
        // window.scrollTo(0, 0);
        // this.setState (this.baseState);
        // this.setState({
        //   errorMessage: 'pass',
        //   afterSubmit: false
        // })
        // this.props.history.push('/SelfService/unauth/success')
        this.props.history.push({
          pathname: '/SelfService/unauth/success',
          state: { data: response, location: 'activateAccount' }
        })
      }
    }
  }

  onValidationCheck = async () => {
    const {userLogin, firstName, lastName, last4ofSSN, dob, password, confirmPassword, challenges, currentStep} = this.state;
    this.setState({
      afterSubmit: true
    })

    let isRequiredEmpty = false

    if(currentStep === 0) {
      isRequiredEmpty = (userLogin === undefined || userLogin.length < 7) ||
          (firstName === undefined || firstName.length === 0) ||
          (lastName === undefined || lastName.length === 0) ||
          (dob === undefined || dob.length === 0) ||
          (last4ofSSN === undefined || last4ofSSN.toString().length < 4)
    } else if(currentStep === 1) {
      isRequiredEmpty = (challenges[0].response === undefined || challenges[0].response.length === 0) ||
          (challenges[1].response === undefined || challenges[1].response.length === 0) ||
          (challenges[2].response === undefined || challenges[2].response.length === 0);
    } else if(currentStep === 2) {
      isRequiredEmpty = (password || confirmPassword) && ((password.length === 0) ||
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$#@$!%*?&])[A-Za-z\d$@#$!%*?&]{8,}/.test(password) || password.includes(firstName) ||
          password.includes(lastName) || password.includes(userLogin) || !/[A-Za-z]/.test(password.substring(0, 1)) || (confirmPassword.length === 0 || confirmPassword !== password))
    }

    let isQuestionSame = challenges[0].challenge === challenges[1].challenge ||
        challenges[0].challenge === challenges[2].challenge ||
        challenges[1].challenge === challenges[2].challenge;

    let isAnswerSame = challenges[0].response === challenges[1].response ||
        challenges[0].response === challenges[2].response ||
        challenges[1].response === challenges[2].response;

    if (isRequiredEmpty) {
      window.scrollTo(0, 0);
      this.setState({
        errorMessage: 'noRequiredFields',
        afterSubmit: false
      })
    } else if (isQuestionSame && currentStep === 1) {
      window.scrollTo(0, 0);
      this.setState({
        errorMessage: 'sameQuestion',
        afterSubmit: false
      })
    } else if (isAnswerSame && currentStep === 1) {
      window.scrollTo(0, 0);
      this.setState({
        errorMessage: 'duplicateAnswers',
        afterSubmit: false
      })
    } else {
      let errorMessage = ""
      let responseErrMsg = ""
      const object = {}
      if(currentStep === 0) {
        const payload = {
          userLogin: (userLogin || '').trim(),
          firstName: (firstName || '').trim(),
          lastName: (lastName || '').trim(),
          dob,
          last4ofSSN
        }
        const response = await this._apiService.getBasicInfo(payload);
        if (!response || response.error) {
          if (response && response.errorData && response.errorData.response && response.errorData.response.data && response.errorData.response.data.message) {
            errorMessage = 'isResponseError'
            responseErrMsg = response.errorData.response.data.message
          }
        } else {
          object.currentStep = currentStep + 1
        }
      } else {
        object.currentStep = currentStep + 1
      }
      this.setState({
        errorMessage,
        responseErrMsg,
        afterSubmit: false,
        ...object
      })
    }
  }

  onStepChange = (step) => {
    let obj = {}
    if(step === 2) {
      obj = {
        confirmPassword: '',
        password: ''
      }
    }
    this.setState({
      currentStep: step,
      ...obj
    })
  }

  render() {
    const {errorMessage, firstName, lastName, userLogin, dob, last4ofSSN,
      password, confirmPassword, challenges, allChallengeQuestions, afterSubmit, currentStep, error, isCheckShow} = this.state;

    const isPwdPassValidate = !password || password.includes(firstName) ||  password.includes(lastName) || !/(.*[a-zA-Z]){2,}/.test(password) || password.length < 8 || !/(.*[a-z]){1,}/.test(password) || !/(.*[0-9]){1,}/.test(password) ||
        !/(.*[$#@^$!%*?&]){1,}/.test(password) || !/(.*[A-Z]){1,}/.test(password) || !/^[a-zA-Z]/.test(password) || password.includes(userLogin)

    let message = null;
    if (errorMessage && Object.keys(errorMessage).length) {
      message = this.checkErr();
    }

    const isViewMode = currentStep === 3

    return (
      <Container className='container-design'>
        <h4>Activate Account</h4>
        <hr/>
        {message}
        <Row>
          <Col md={12} sm={12}>
            <Steps current={currentStep}>
              <Step title="Basic Information" onClick={currentStep >= 0 ? () => this.setState({currentStep: 0, confirmPassword: '', password: ''}) : () => {}}/>
              <Step title="Setup Security Questions" onClick={currentStep >= 1 ? () => this.setState({currentStep: 1, confirmPassword: '', password: ''}) : () => {}}/>
              <Step title="Set Password" onClick={currentStep >= 2 ? () => this.setState({currentStep: 2, confirmPassword: '', password: ''}) : () => {}}/>
              <Step title="Review" onClick={currentStep >= 3 ? () => this.setState({currentStep: 3, confirmPassword: '', password: ''}) : () => {}}/>
            </Steps>
          </Col>

          <Divider/>

          { (currentStep === 0 || currentStep === 3) ?
            <>
              <Col md={6} sm={12}>
                <div >
                  <h5>Basic Information</h5>
                  <div className="p-2">

                    <Form as={Row} className={isViewMode ? "" : "pb-10"} >
                      <Form.Label column md='5' lg='4' xl='4'>
                        {isViewMode ? null : <span className='star-color'>*</span>}FISA Ref Number
                        {isViewMode ? null :
                          <div className="text-danger font-italic cursor-pointer fs-10">
                            <span onClick={() => this.setState({isCheckShow: !isCheckShow})}>
                              (Need help to find your ID Number?)
                            </span>
                          </div>
                        }
                      </Form.Label>
                      <Col className="hide-img">
                        <div className={isCheckShow ? "p-2" : ""}>
                          {isCheckShow && <img src={check} alt='Here is a check'/>}
                        </div>
                      </Col>
                      <Col md='7' lg='6' xl='5'>
                        <Form.Control
                            value={userLogin}
                            name="userLogin"
                            onChange={this.handleChange}
                            onBlur={this.handleBlur}
                            size="sm"
                            readOnly={isViewMode}
                            plaintext={isViewMode}
                        />
                        { error && error.userLogin ? <span className="error-text">{error.userLogin}</span> : null }
                      </Col>
                    </Form>

                    <Form as={Row} className={isViewMode ? "" : "pb-10"}>
                      <Form.Label column md='5' lg='4' xl='4'>
                        {isViewMode ? null : <span className='star-color'>*</span>}First Name
                      </Form.Label>
                      <Col md='7' lg='6' xl='5'>
                        <Form.Control
                            value={firstName}
                            name="firstName"
                            onChange={this.handleChange}
                            onBlur={this.handleBlur}
                            size="sm"
                            readOnly={isViewMode}
                            plaintext={isViewMode}
                        />
                        { error && error.firstName ? <span className="error-text">{error.firstName}</span> : null }
                      </Col>
                    </Form>

                    <Form as={Row} className={isViewMode ? "" : "pb-10"}>
                      <Form.Label column md='5' lg='4' xl='4'>
                        {isViewMode ? null : <span className='star-color'>*</span>}Last Name
                      </Form.Label>
                      <Col md='7' lg='6' xl='5'>
                        <Form.Control
                            value={lastName}
                            name="lastName"
                            onChange={this.handleChange}
                            onBlur={this.handleBlur}
                            size="sm"
                            readOnly={isViewMode}
                            plaintext={isViewMode}
                        />
                        { error && error.lastName ? <span className="error-text">{error.lastName}</span> : null }
                      </Col>
                    </Form>

                    <Form as={Row} style={{alignItems: 'center'}} className={isViewMode ? "" : "pb-10"}>
                      <Form.Label column md='5' lg='4' xl='4'>
                        {isViewMode ? null : <span className='star-color'>*</span>}Date of Birth
                      </Form.Label>
                      <Col md='7' lg='6' xl='5'>
                        {
                          !isViewMode ?
                            <DatePicker
                              placeholderText="MM/DD/YYYY"
                              selected={dob}
                              onChange={this.handleDateChange}
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              name="dob"
                              onBlur={this.handleBlur}
                              maxDate={new Date()}
                              className='form-control form-control-sm'
                              size="sm"
                            /> :
                            <span style={{color: '#212529'}}>{dob && moment(dob).format("MM/DD/YYYY")}</span>
                        }
                        { error && error.dob ? <span className="error-text">{error.dob}</span> : null }
                      </Col>
                    </Form>

                    <Form as={Row} className={isViewMode ? "" : "pb-10"}>
                      <Form.Label column md='5' lg='4' xl='4'>
                        {isViewMode ? null : <span className='star-color'>*</span>}SSN
                      </Form.Label>
                      <Col md='7' lg='6' xl='5'>
                        <Form.Control
                            value={last4ofSSN}
                            name="last4ofSSN"
                            onChange={this.handleSSNInputChange}
                            onBlur={this.handleSSNBlur}
                            size="sm"
                            readOnly={isViewMode}
                            plaintext={isViewMode}
                        />
                        { !isViewMode ? <p style={{fontStyle: 'italic', fontSize: '12px'}}>(last 4 digits)</p> : null }
                        { error && error.last4ofSSN ? <span className="error-text">{error.last4ofSSN}</span> : null }
                      </Col>
                    </Form>

                  </div>
                </div>
              </Col>
              <Col className="d-none d-md-block">
                <h5>&nbsp;</h5>
                <div className="p-2">
                  {isCheckShow && <img src={check} alt='Here is a check'/>}
                </div>
              </Col>
            </> : null
          }

          { currentStep === 2 ?
            <Col md='12'>
              <div >
                <Row>
                  <Col md={6} sm={12}>
                    <h5>Create Your Password</h5>
                    <div className="p-2">

                      <Form>
                        <FormGroup controlId="formControlsSelect">
                          <label>
                            <span className='star-color'>*</span>
                            Password
                          </label>
                          <Col lg='8' xl='8' className='pl-0'>
                            <Form.Control
                              type="password"
                              placeholder=""
                              value={password}
                              name="password"
                              onChange={this.handleChange}
                              size="sm"
                            />
                          </Col>
                          <span className='error-text'>{password && isPwdPassValidate && 'Please follow the password policy.'}</span>
                        </FormGroup>
                      </Form>

                      <Form>
                        <FormGroup controlId="formControlsSelect">
                          <label>
                            <span className='star-color'>*</span>
                            Confirm Password
                          </label>
                          <Col lg='8' xl='8' className='pl-0'>
                            <Form.Control
                              type="password"
                              placeholder=""
                              value={confirmPassword}
                              name="confirmPassword"
                              onChange={this.handleChange}
                              size="sm"
                            />
                          </Col>
                          <span className='error-text'>{confirmPassword && confirmPassword !== password && "Passwords do not match."}</span>
                        </FormGroup>
                      </Form>

                    </div>
                  </Col>
                  <Col md={1}/>
                  <Col md={5} sm={12}>
                    <PasswordPolicy
                        password={password}
                        firstName={(firstName || "").toUpperCase()}
                        lastName={(lastName || "").toUpperCase()}
                        userName={(userLogin || "").toUpperCase()}
                        style={this.style.listitem}
                    />
                  </Col>
                </Row>
              </div>
            </Col> : null
          }

        </Row>

        { currentStep === 1 || currentStep === 3 ?
          <div >
            { !isViewMode ?  <h5>Security Questions</h5> : null }
            <div className={!isViewMode ? "p-2" : ""} >

              {
                isViewMode ?
                  <Row>
                    <Col md={6} sm={12}>
                      <div >
                        <h5>Set up Security Questions</h5>
                        <div className="p-2">
                          {
                            challenges && challenges.map((item, i) => {
                              const data = challenges[i]
                              return (
                                <span key={i.toString()}>
                                  <Form as={Row}>
                                    <Form.Label column md="4">
                                      {`Question ${i + 1}`}
                                    </Form.Label>
                                    <Col md="8" className="pt-2">
                                      <span className="security-question">
                                        {data && data.challenge}
                                      </span>
                                      <Tooltip title="Answer is hidden for security reasons">
                                        <Icon type="info-circle" className="info-icon"/>
                                      </Tooltip>
                                    </Col>
                                  </Form>
                                </span>
                              )
                            })
                          }
                        </div>
                      </div>
                    </Col>
                  </Row>
                   : null
              }

              {
                !isViewMode && challenges && challenges.map((item, i) => {
                  const data = challenges[i]
                  return (
                    <span key={i.toString() + i}>
                      <Row>
                        <Col xs='12' md='8' lg='6' xl='4'>
                          <FormGroup controlId="formControlsSelect">
                            <label>
                              {`Question ${i + 1}`}
                            </label>
                            <Form.Control
                                as="select"
                                onChange={(e) => this.handleSelectChange(e, i)}
                                value={data && data.challenge}
                                size="sm"
                            >
                              {allChallengeQuestions.filter(item => item !== challenges[i === 0 ? 1 : i === 1 ? 0 : 0].challenge && item !== challenges[i === 0 ? 2 : i === 1 ? 2 : 1].challenge)
                                  .map(item => <option key={item}>{item}</option>)}
                            </Form.Control>
                          </FormGroup>
                        </Col>
                      </Row>
                      {
                        isViewMode ? null :
                          <Row className='pb-20'>
                            <Col xs='12' md='8' lg='6' xl='4'>
                              <FormGroup controlId="formControlsSelect">
                                <label>
                                  <span className='star-color'>*</span>
                                  {`Answer ${i + 1}`}
                                </label>
                                <Form.Control
                                  value={data && data.response}
                                  onChange={(e) => this.handleAnswerInputChange(e, i)}
                                  onBlur={(e) => this.handleAnswerBlur(e, i)}
                                  size="sm"
                                />
                                <span
                                    className='error-text'>{data && data.responseError && 'Answer is required.'}</span>
                              </FormGroup>
                            </Col>
                          </Row>
                      }
                    </span>
                  )
                })
              }

            </div>
          </div> : null
        }

        {
          currentStep === 3 ?
            <div>
              <h5>Set Password</h5>
              <div className="p-2">
                <p>
                  <Icon type="info-circle" className="info-icon"/>
                  <span className="ml-2 font-italic">Password is hidden for security reasons</span>
                </p>
              </div>
            </div> : null
        }

        <br/>

        <div className="justify-content-between d-flex">
          { currentStep === 0 ? <div/> :
              <button type="button" className="btn btn-info btn-md" disabled={currentStep === 0}
                      onClick={() => this.onStepChange(currentStep - 1)}>
                Back
              </button>
          }
          <div>
            {/*{ currentStep === 2 ?
              <Tooltip title='You can choose to skip this step if you logged in to windows and reset your temporary password.'>
                <button
                  type="button"
                  className="btn btn-warning btn-md mr-5"
                  onClick={() =>
                    this.setState({
                      currentStep: currentStep + 1,
                      confirmPassword: '',
                      password: ''
                    })
                  }
                >
                  Skip this step
                </button>
              </Tooltip> : null
            }*/}
            { currentStep === 3 ?
              <button type="button" className="btn btn-success btn-md" onClick={this.handleSubmitBtnClick} disabled={afterSubmit}>
                { afterSubmit ? <div className="spinner-border spinner-border-sm text-dark"/> : null }
                {' '} Submit
              </button> :
              <button type="button" className="btn btn-primary btn-md" onClick={() => this.onValidationCheck(currentStep + 1)} disabled={currentStep === 2 ? (isPwdPassValidate || !confirmPassword || confirmPassword !== password) : false}>
                Next
              </button>
            }
          </div>
        </div>
      </Container>
    );
  }
}

export default ActivateAccount;