import React, { Fragment, Component } from 'react';
import { withRouter } from 'react-router-dom'
import {Container, Form, Row, Col, FormGroup} from 'react-bootstrap';
import axios from 'axios';

import check from '../components/images/check.jpg';
import PasswordPolicy from '../components/PasswordPolicy';

import 'react-block-ui/style.css';
import {ApiService} from "../services/ApiService";
import {Divider, Steps} from "antd";

const { Step } = Steps

const hostUrl = window.location.protocol+'//'+window.location.host;

class ForgetPassword extends Component {
	_apiService = new ApiService();

	constructor(props) {
		super(props);
		this.state = {
			step1Show: true,
			currentStep: 0,
			firstName:'',
			lastName:'',
			userName: '',
			userNameError: false,
			isCheckShow: false,
			questions: [],
			questionNum: 0,
			answer: '',
			answerError: false,
			// inputFieldShow: false,
			password: '',
			isPassword: true,
			isCapsLockOn: false,
			confirmPassword: '',
			isConfirmPwd: true,
			isConfirmCaps: false,
			errorMessage: '',
			afterSubmit: false,
			apiMessage: '',
			step1Error: false,
			isLoaderShow: false,
		};

		this.style = { listitem: { paddingBottom: '0', paddingTop: '0' } }
	}

	componentDidMount(){
		document.title = "Password Reset"
	}

	handleUserNameChange = (e) => {
		this.setState({
			userName: e.target.value.substring(0, 7)
		})
	}

	handleUserNameBlur = (e) => {
		if (/^[0-9]/.test(this.state.userName)) {
			this.setState({
				userName: '0'.repeat(7 - e.target.value.length) + e.target.value,
				userNameError: false
			})
		}
	}

	handleCheckShow = (e) => {
		this.setState(
			function (prevState) {
				return { isCheckShow: !prevState.isCheckShow }
			})
	}

	handleNextBtnClick = async () => {
		this.setState({
			isLoaderShow: true
		})

		const data = await this._apiService.getUserInformation(this.state.userName);
		if (!data || data.error) {
			window.scrollTo(0, 0);
			this.setState({
				step1Error: true,
				apiMessage: data.error,
				isLoaderShow: false
			})
		}else {
			this.setState({
				step1Show: false,
				currentStep: 1,
				isLoaderShow: false,
				step1Error: false,
				firstName: data.firstName,
				lastName: data.lastName,
				apiMessage: ''
			})

			if (data.challengeQuestions === undefined || data.challengeQuestions.length === 0) {
				window.scrollTo(0, 0);
				this.setState({
					step1Show: true,
					currentStep: 0,
					step1Error: true,
					apiMessage: 'The security questions have not been setup for your account. Please contact the helpdesk to reset your password.'
				})
			} else {
				this.setState({
					questions: data.challengeQuestions.sort(function () { return 0.5 - Math.random() }),
				})
			}
		}
	}

	handleQuestionChange = () => {
		if (this.state.questionNum === 2) {
			this.setState({
				questionNum: 0
			})
		} else {
			this.setState(
				function (prevState) {
					return { questionNum: prevState.questionNum + 1 }
				})
		}
	}

	handleAnswerInput = (e) => {
		this.setState({
			answer: e.target.value
		})
	}

	handleAnswerBlur = (e) => {
		if (e.target.value === undefined || e.target.value.length === 0) {
			this.setState({
				answerError: true
			})
		} else {
			this.setState({
				answerError: false
			})
		}
	}

	handlePasswordInputChange = (e) => {
		this.setState({
			password: e.target.value
		})
	}

	handleConfirmPasswordInputChange = (e) => {
		this.setState({
			confirmPassword: e.target.value
		})
	}

	handlePreBtnClick = () => {
		this.setState({
			step1Show: true,
			currentStep: 0,
			apiMessage: '',
			errorMessage: ''
		})
	}

	handleSubmitBtnClick = () => {
		this.setState({
			isLoaderShow: true,
			afterSubmit: true
		})
		const self = this;
		let url = hostUrl+`/SelfService/webapi/unauthapi/resetPassword`
		console.log(url)
		const data = {
			"userLogin": this.state.userName,
			"newPassword": this.state.password,
			"challengeQuestions": [
				{
					"name": this.state.questions[this.state.questionNum],
					"value": this.state.answer
				}
			]
		}
		axios.post(url, data
			, {
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json",
				}
			}
		)
			.then(function (response) {
				self.props.history.push({
					pathname: '/SelfService/unauth/success',
					state: { data: { location: 'forgetPassword' } }
				})
				self.setState({
					errorMessage: 'pass',
					isLoaderShow: false,
					afterSubmit: false,
					password: '',
					confirmPassword: '',
					answer: ''

				})
			})
			.catch(function (error) {
				self.setState({
					apiMessage: error.response.data.message === undefined ? 'An error has occurred' : error.response.data.message,
					errorMessage: 'apiError',
					isLoaderShow: false,
					afterSubmit: false
				})
			});
	}

	renderStep() {
		const {afterSubmit, isLoaderShow, step1Show, isCheckShow, questionNum, firstName, lastName,
			userName, password, questions, answer, answerError, confirmPassword} = this.state;

		let isNextBtnWork = userName.length < 7 || userName === undefined;
		let isPwdPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$#@$!%*?&])[A-Za-z\d$@#$!%*?&]{8,}/.test(password) &&
			!password.includes(userName) &&
			/[A-Za-z]/.test(password.substring(0, 1));

		let isSubmitBtnWork = answer === '' || answer === undefined ||
			!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$#@$!%*?&])[A-Za-z\d$@#$!%*?&]{8,}/.test(password) ||
			password.includes(userName) ||
			!/[A-Za-z]/.test(password.substring(0, 1)) ||
			confirmPassword !== password;

		if (step1Show) {
			return (
				<Fragment>
					<Col md={6} sm={12}>
						<Col md='10' lg='8' xl='6'>
							<label>
								<span className='star-color'>*</span>
								Payroll ID:
							</label>
						</Col>
						<Col md='10' lg='8' xl='6'>
							<Form.Control
								value={userName}
								onChange={this.handleUserNameChange}
								onBlur={this.handleUserNameBlur}
								size="sm"
							/>
						</Col>
						<Col md='10' lg='8' xl='6' className="text-danger font-italic cursor-pointer">
							<p onClick={this.handleCheckShow}>
								(Need help to find your ID Number?)
							</p>
						</Col>
					</Col>
					<Col md={6} sm={12}>
						{isCheckShow && <img src={check} alt='Here is a check'/>}
					</Col>
					<Col md={12} className="text-right">
						<button type="button" className="btn btn-success btn-md" onClick={this.handleNextBtnClick} disabled={isNextBtnWork || afterSubmit || isLoaderShow}>
							{ afterSubmit || isLoaderShow ? <div className="spinner-border spinner-border-sm text-dark"/> : null }
							{' '} Next
						</button>
					</Col>
				</Fragment>
			);
		} else {
			return (
				<Fragment>
					<Col md={12}>

						<Row>
							<Col md='6' sm='12'>

								<h5 className="p-0">
									Answer the following question
									<span style={{ fontStyle: 'italic', fontSize: '12px', marginLeft: '10px' }}>
										(answers are not case-sensitive)
									</span>
								</h5>

								<Col style={{marginBottom: 5}}>
									<span>
										{questions[questionNum]}
										<span
											style={{ cursor: 'pointer', fontStyle: 'italic', fontSize: '12px', marginLeft: '10px', textDecorationLine: 'underline' }}
											onClick={this.handleQuestionChange}
										>Choose another question
										</span>
									</span>
								</Col>

								<Col md='10' lg='8' xl='6'>
									<FormGroup controlId="formControlsSelect">
										<Form.Control
											value={answer}
											onChange={this.handleAnswerInput}
											onBlur={this.handleAnswerBlur}
											size="sm"
										/>
										<span className='error-text'>{ answerError && 'Answer is required.' }</span>
									</FormGroup>
								</Col>

								<h5 className="pl-0 pb-0">
									Set your password
								</h5>

								<Col md='10' lg='8' xl='6'>
									<FormGroup controlId="formControlsSelect">
										<label>
											<span className='star-color'>*</span>
											New Password
										</label>
										<Form.Control
											type='password'
											value={password}
											onChange={this.handlePasswordInputChange}
											size="sm"
										/>
										<span className='error-text'>{ password && !isPwdPass && 'Please follow the password policy.' }</span>
									</FormGroup>
								</Col>

								<Col md='10' lg='8' xl='6'>
									<FormGroup controlId="formControlsSelect">
										<label>
											<span className='star-color'>*</span>
											Confirm Password
										</label>
										<Form.Control
											type='password'
											value={confirmPassword}
											onChange={this.handleConfirmPasswordInputChange}
											size="sm"
										/>
										<span className='error-text'>{ confirmPassword !== password && "Passwords don't match." }</span>
									</FormGroup>
								</Col>

							</Col>
							<Col md='1'/>
							<Col md='5' sm='12' >
								<PasswordPolicy 
									password={password || ''}
									firstName={firstName || ''}
									lastName={lastName || ''}
									userName={userName || ''}
									style={this.style.listitem}
								/>
							</Col>
						</Row>
						<Row className='padding-box'>
							<Col xl='6' md='6'>
								<button type="button" className="btn btn-danger btn-md" onClick={this.handlePreBtnClick} disabled={step1Show}>
									Previous
								</button>
							</Col>
							<Col xl='6' md='6' className="text-right">
								<button type="button" className="btn btn-success btn-md" onClick={this.handleSubmitBtnClick} disabled={isSubmitBtnWork || afterSubmit}>
									{ afterSubmit || isLoaderShow ? <div className="spinner-border spinner-border-sm text-dark"/> : null }
									{' '} Submit
								</button>
							</Col>
						</Row>
					</Col>
				</Fragment>
			);
		}
	}

	render() {
		const { currentStep } = this.state
		let message = null;
		switch (this.state.errorMessage) {
			case 'apiError':
				message = <Row className='error-banner' style={{ paddingLeft: '20px' }}><p style={{ paddingTop: '10px' }}>{this.state.apiMessage}</p></Row>
				break;
			case 'pass':
				message = <Row className='pass-banner' style={{ paddingLeft: '20px' }}><p style={{ paddingTop: '10px' }}>Your password has been reset successfully. <a href='http://www.fdny.org/'>Click here </a>to go to home page.</p></Row>
				break;
			default:
				message = null;
		}

		return (
			<Container className={"container-design"}>
				<h4 className="text-left">
					Reset Password
				</h4>
				<hr/>
				{message}

				<Row>
					<Col md={6} sm={12}>
						<Steps current={currentStep}>
							<Step title="User ID Login" onClick={this.handlePreBtnClick}/>
							<Step title="Reset Password" />
						</Steps>
					</Col>

					<Divider/>
				</Row>
					{this.state.step1Error ?
						<Row className='error-banner' style={{ paddingLeft: '20px' }}><p style={{ paddingTop: '10px' }}>{this.state.apiMessage}</p></Row> : null
					}
						{this.renderStep()}

			</Container>
		);
	}
}

export default withRouter(ForgetPassword);