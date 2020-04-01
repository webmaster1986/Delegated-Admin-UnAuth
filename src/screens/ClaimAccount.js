import React from "react";
import {Col, Container, Row, Form} from "react-bootstrap";
import DatePicker from "react-datepicker";
import PasswordPolicy from "../components/PasswordPolicy";

import "react-datepicker/dist/react-datepicker.css";
import {ApiService} from "../services/ApiService";

class ClaimAccount extends React.Component {
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
      afterSubmit: false
    };
    this.baseState = this.state;
    this.style = { listitem: { paddingBottom: '0', paddingTop: '0' } }
  }

  async componentDidMount() {
    document.title = "Claim Account";
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
    if (e.target.value === undefined || e.target.value.toString().length < 4) {
      this.setState({
        last4ofSSNError: true
      })
    } else {
      this.setState({
        last4ofSSNError: false
      })
    }
  }

  handleDateChange = (date) => {
    this.setState({
      dob: date
    });
  }

  handleBlur = (e) => {
    let {error, userLogin} = this.state
    const {name, value} = e.target
    error[name] = !value ? `Please provide ${name}` : ""
    if (name === "userLogin") {
      // if (/^[0-9]/.test(userLogin)) {
      if (userLogin && userLogin.length < 7) {
        this.setState({
          userLogin: '0'.repeat(7 - value.length) + value,
        })
      } else if (value.length < 7) {
        error[name] = `Please provide valid ${name}`
      }
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
        message = <Row className='error-banner' style={{ paddingLeft: '20px' }}><p style={{ paddingTop: '10px' }}>The Security Questions and Answers could not be set because there were duplicate answers.</p></Row>;
        break;
      case 'sameQuestion':
        message = <Row className='error-banner' style={{ paddingLeft: '20px' }}><p style={{ paddingTop: '10px' }}>Security Questions should not be same.</p></Row>;
        break;
      case 'apiError':
        message = <Row className='error-banner' style={{ paddingLeft: '20px' }}><p style={{ paddingTop: '10px' }}>{apiMessage}</p></Row>;
        break;
      case 'pass':
        message = <Row className='pass-banner' style={{ paddingLeft: '20px' }}><p style={{ paddingTop: '10px' }}>User account has been successfully registered.<br/>Please wait at least 5 mins before attempting to login.<br/><a href='http://www.fdny.org/'>Click here </a>to go to the home page.</p></Row>;
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
      (password === undefined || password.length === 0) ||
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$#@$!%*?&])[A-Za-z\d$@#$!%*?&]{8,}/.test(password) ||
      password.includes(firstName) ||
      password.includes(lastName) ||
      password.includes(userLogin) ||
      !/[A-Za-z]/.test(password.substring(0, 1)) ||
      (confirmPassword === undefined || confirmPassword.length === 0 || confirmPassword !== password) ||
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
        userLogin, firstName, lastName,
        dob: `${birthday.getFullYear()}-${birthday.getMonth() <= 8 ? `0${birthday.getMonth() + 1}` : `${birthday.getMonth() + 1}`}-${birthday.getDate() < 10 ? `0${birthday.getDate()}` : `${birthday.getDate()}`}`,
        last4ofSSN, password, confirmPassword,
        challengeQuestions: [
          {
            name: challenges[0].challenge,
            value: challenges[0].response
          },
          {
            name: challenges[1].challenge,
            value: challenges[1].response
          },
          {
            name: challenges[2].challenge,
            value: challenges[2].response
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
        window.scrollTo(0, 0);
        this.setState (this.baseState);
        this.setState({
          errorMessage: 'pass',
          afterSubmit: false
        })
      }
    }
  }

  render() {
    const {errorMessage, firstName, firstNameError, lastName, lastNameError, userLogin, userLoginError, dob, dobError, last4ofSSN,
      last4ofSSNError, password, confirmPassword, challenges, allChallengeQuestions, afterSubmit} = this.state;
    let isNameInput = !firstName || !lastName || !userLogin;

    let isPwdPass = !password &&
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$#@$!%*?&])[A-Za-z\d$@#$!%*?&]{8,}/.test(userLogin) &&
      !password.includes(firstName) && !password.includes(lastName) && !password.includes(userLogin) &&
      /[A-Za-z]/.test(password.substring(0, 1));

    let message = null;
    if (errorMessage && Object.keys(errorMessage).length) {
      message = this.checkErr();
    }

    return (
      <Container className='container-design'>
        <h4>Claim Account</h4>
        <hr/>
        {message}
        <Row>
          <Col md={6} sm={12}>
            <div className='border-box margin-top'>
              <h5>Basic Information</h5>
              <div className="p-2">
                <Row>
                  <Col md={4}>
                    <Form.Label>
                      <span className='star-color'>*</span>User Login</Form.Label>
                  </Col>
                  <Col md={8}>
                    <Form.Control value={userLogin} name="userLogin"
                                  onChange={this.handleChange}
                                  onBlur={this.handleBlur}
                    />
                  </Col>
                  <Col md='4' />
                  {
                    userLoginError ?
                      <Col md={8} className='error-text padding-bottom'>User Login is required.</Col>
                      :
                      <Col md={8} className='padding-bottom' style={{ visibility: 'hidden', fontSize: '12px' }}>123</Col>
                  }
                </Row>
                <Row>
                  <Col md={4}>
                    <Form.Label>
                      <span className='star-color'>*</span>First Name</Form.Label>
                  </Col>
                  <Col md={8}>
                    <Form.Control value={firstName} name="firstName"
                                  onChange={this.handleChange}
                                  onBlur={this.handleBlur}
                    />
                  </Col>
                  <Col md={4} />
                  <Col md={8} className='error-text padding-bottom'>{firstNameError && 'First name is required.'}</Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <Form.Label>
                      <span className='star-color'>*</span>
                      Last Name
                    </Form.Label>
                  </Col>
                  <Col md={8}>
                    <Form.Control value={lastName} name="lastName"
                                  onChange={this.handleChange}
                                  onBlur={this.handleBlur}
                    />
                  </Col>
                  <Col md={4} />
                  <Col md={8} className='error-text padding-bottom'>{lastNameError && 'Last name is required.'}</Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <Form.Label>
                      <span className='star-color'>*</span>
                      Date of Birth
                    </Form.Label>
                  </Col>
                  <Col md={8}>
                    <DatePicker
                      placeholderText="MM/DD/YYYY"
                      selected={dob}
                      onChange={this.handleDateChange}
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      onBlur={this.handleBlur}
                      maxDate={new Date()}
                      className='form-control'
                    />
                  </Col>
                  <Col md={4} />
                  <Col md={8} className='error-text padding-bottom'>{dobError && 'Date of Birth is required.'}</Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <Form.Label>
                      <span className='star-color'>*</span>
                      SSN
                    </Form.Label>
                  </Col>
                  <Col md={8}>
                    <Form.Control placeholder='Last 4 digits' value={last4ofSSN} name="last4ofSSN"
                                  onChange={this.handleSSNInputChange}
                                  onBlur={this.handleSSNBlur}
                    />
                    <p style={{ fontStyle: 'italic', fontSize: '12px' }}>(last 4 digits)</p>
                  </Col>
                  <Col md={4} />
                  <Col md={8} className='error-text padding-bottom'>{last4ofSSNError && 'Enter a valid SSN.'}</Col>
                </Row>
              </div>
            </div>
          </Col>
          <Col md='12'>
            <div className='border-box margin-top-large'>
              <Row>
                <Col md={6} sm={12}>
                  <h5>Create Your Password</h5>
                  <div className="p-2">
                    <Row>
                      <Col md={4}>
                        <Form.Label>
                          <span className='star-color'>*</span>
                          Password
                        </Form.Label>
                      </Col>
                      <Col md={8}>
                        <Form.Control type="password" placeholder="" value={password} name="password"
                                      onChange={this.handleChange}
                        />
                      </Col>
                      <Col md={4} />
                      { isNameInput ?
                        <Col md={8} className='padding-bottom' style={{ visibility: 'hidden', fontSize: '12px' }}>123</Col>
                        :  <Col md={8} className='error-text padding-bottom'>{!isPwdPass && 'Please follow the password policy.'}</Col>
                      }
                    </Row>
                    <Row>
                      <Col md={4}>
                        <Form.Label>
                          <span className='star-color'>*</span>
                          Confirm Password
                        </Form.Label>
                      </Col>
                      <Col md={8}>
                        <Form.Control type="password" placeholder="" value={confirmPassword} name="confirmPassword"
                                      onChange={this.handleChange}
                        />
                      </Col>
                      <Col md={4}/>
                      <Col md={8} className='error-text padding-bottom'>{confirmPassword !== password && "Passwords don't match."}</Col>
                    </Row>
                  </div>
                </Col>
                <Col md={6} sm={12}>
                  <PasswordPolicy
                    password={password}
                    firstName={firstName}
                    lastName={lastName}
                    userLogin={userLogin}
                    style={this.style.listitem}
                  />
                </Col>
              </Row>
            </div>
          </Col>

        </Row>
        <div className='border-box margin-top-large padding-bottom-large'>
          <h5>Select your Security Questions and Answers</h5>
          <div className="p-2">
            <Row className='padding-bottom'>
              <Col lg='2' md='4' xs='12'>
                <label >Question 1</label>
              </Col>
              <Col lg='4' md='6' xs='12'>
                <Form.Control as="select"
                              onChange={(e) => this.handleSelectChange(e, 0)}
                              value={challenges[0].challenge}
                >
                  {allChallengeQuestions.filter(item => item !== challenges[1].challenge && item !== challenges[2].challenge)
                    .map(item => <option key={item}>{item}</option>)}
                </Form.Control>
              </Col>
              <Col lg='2'>
                <label>
                  <span className='star-color'>*</span>
                  Answer 1
                </label>
              </Col>
              <Col lg='4'>
                <Form.Control
                  value={challenges[0].response}
                  onChange={(e) => this.handleAnswerInputChange(e, 0)}
                  onBlur={(e) => this.handleAnswerBlur(e, 0)}
                />
              </Col>
              <Col lg='8' />
              {
                challenges[0].responseError ?
                  <Col lg='4' className='error-text'>Answer is required.</Col> : <Col lg='4' style={{ visibility: 'hidden', fontSize: '12px' }}>123</Col>
              }
            </Row>
            <Row className='padding-bottom'>
              <Col lg='2' md='4' xs='12'>
                <label >Question 2</label>
              </Col>
              <Col lg='4' md='6' xs='12'>
                <Form.Control as="select"
                              onChange={(e) => this.handleSelectChange(e, 1)}
                              value={challenges[1].challenge}
                >
                  {allChallengeQuestions.filter(item => item !== challenges[0].challenge && item !== challenges[2].challenge)
                    .map(item => <option key={item}>{item}</option>)}
                </Form.Control>
              </Col>
              <Col lg='2'>
                <label>
                  <span className='star-color'>*</span>
                  Answer 2
                </label>
              </Col>
              <Col lg='4'>
                <Form.Control
                  value={challenges[1].response}
                  onChange={(e) => this.handleAnswerInputChange(e, 1)}
                  onBlur={(e) => this.handleAnswerBlur(e, 1)}
                />
              </Col>
              <Col md={8}/>
              {
                challenges[1].responseError ?
                  <Col lg='4' className='error-text'>Answer is required.</Col> : <Col lg='4' style={{ visibility: 'hidden', fontSize: '12px' }}>123</Col>
              }
            </Row>
            <Row>
              <Col lg='2' md='4' xs='12'>
                <label >Question 3</label>
              </Col>
              <Col lg='4' md='6' xs='12'>
                <Form.Control as="select"
                              onChange={(e) => this.handleSelectChange(e, 2)}
                              value={challenges[2].challenge}
                >
                  {allChallengeQuestions.filter(item => item !== challenges[0].challenge && item !== challenges[1].challenge)
                    .map(item => <option key={item}>{item}</option>)}
                </Form.Control>
              </Col>
              {/* <Col lg='1'></Col> */}
              <Col lg='2'>
                <label>
                  <span className='star-color'>*</span>
                  Answer 3
                </label>
              </Col>
              <Col lg='4'>
                <Form.Control
                  value={challenges[2].response}
                  onChange={(e) => this.handleAnswerInputChange(e, 2)}
                  onBlur={(e) => this.handleAnswerBlur(e, 2)}
                />
              </Col>
              <Col lg='8' />
              {
                challenges[2].responseError ?
                  <Col lg='4' className='error-text'>Answer is required.</Col> : <Col lg='4' style={{ visibility: 'hidden', fontSize: '12px' }}>123</Col>
              }
            </Row>
          </div>
        </div>
        <br/>
        <div className="text-right">
          <button type="button" className="btn btn-success btn-md" onClick={this.handleSubmitBtnClick} disabled={afterSubmit}>
            { afterSubmit ? <div className="spinner-border spinner-border-sm text-dark"/> : null }
            {' '} Submit
          </button>
        </div>
      </Container>
    );
  }
}

export default ClaimAccount;