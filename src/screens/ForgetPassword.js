import React, { Fragment, Component } from 'react';
import { Container, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';

import check from '../components/images/check.jpg';
import PasswordPolicy from '../components/PasswordPolicy';

import 'react-block-ui/style.css';
import {ApiService} from "../services/ApiService";

const hostUrl = window.location.protocol+'//'+window.location.host;

class ForgetPassword extends Component {
	_apiService = new ApiService();

	constructor(props) {
		super(props);
		this.state = {
			step1Show: true,
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
				isLoaderShow: false,
				step1Error: false,
				firstName: data.firstName,
				lastName: data.lastName,
			})

			if (data.challengeQuestions === undefined || data.challengeQuestions.length === 0) {
				window.scrollTo(0, 0);
				this.setState({
					step1Show: true,
					step1Error: true,
					apiMessage: 'Your security questions have not been setup. Please contact the helpdesk to reset your password.'
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
			step1Show: true
		})
	}

	handleSubmitBtnClick = () => {
		this.setState({
			isLoaderShow: true,
			afterSubmit: true
		})
		var self = this;
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
						<Col md={12}>
							<label>
								<span className='star-color'>*</span>
								Payroll ID:
							</label>
						</Col>
						<Col md={12}>
							<Form.Control
								value={userName}
								onChange={this.handleUserNameChange}
								onBlur={this.handleUserNameBlur}
							/>
						</Col>
						<Col md={12} className="text-danger font-italic cursor-pointer">
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
						<h4>
							Answer the following question
							<span style={{ fontStyle: 'italic', fontSize: '12px', marginLeft: '10px' }}>
								(answers are not case-sensitive)
							</span>
						</h4>
						<Row className='padding-box'>
							<Col md='6' sm='12'>
								<Col md='12'>
									<p>
										{questions[questionNum]}
										<span
											style={{ cursor: 'pointer', fontStyle: 'italic', fontSize: '12px', marginLeft: '10px', textDecorationLine: 'underline' }}
											onClick={this.handleQuestionChange}
										>Choose another question
										</span>
									</p>
									<Form.Control
										value={answer}
										onChange={this.handleAnswerInput}
										onBlur={this.handleAnswerBlur}
									/>
									<p className='error-text padding-bottom'>{ answerError && 'Answer is required.' }</p>
								</Col>
								<Col md='12'>
									<label>
										<span className='star-color'>*</span>
										New Password
									</label>
									<Form.Control
										type='password'
										value={password}
										onChange={this.handlePasswordInputChange}
									/>
									<p className='error-text padding-bottom'>{ password && !isPwdPass && 'Please follow the password policy.' }</p>
								</Col>
								<Col md='12'>
									<label>
										<span className='star-color'>*</span>
										Confirm Password
									</label>
									<Form.Control
										type='password'
										value={confirmPassword}
										onChange={this.handleConfirmPasswordInputChange}
									/>
									<p className='error-text padding-bottom'>{ confirmPassword !== password && "Passwords don't match." }</p>
								</Col>
							</Col>
							<Col md='6' sm='12' >
								<PasswordPolicy 
									password={password}
									firstName={firstName}
									lastName={lastName}
									userName={userName}
									style={this.style.listitem}
								/>
							</Col>
						</Row>
						<Row className='padding-box'>
							<Col xl='6' md='6'>
								<button type="button" className="btn btn-danger btn-md" onClick={this.handlePreBtnClick} disabled={isSubmitBtnWork || afterSubmit}>
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
				<Row className='border-box'>
					<Col md='6'>
						<Col md='12' className='blank-height'/>
						<Col md='12' className='text-center'>
								<span
									className='dot'
									style={this.state.step1Show ? { backgroundColor: '#00BC8C' } : {}}
								>1</span>
						</Col>
						<Col md='12' className='text-center'>
							<p className='text-padding-top'>User ID Login</p>
						</Col>
					</Col>
					<Col md='6'>
						<Col md='12' className='blank-height'/>
						<Col md='12' className='text-center'>
								<span
									className='dot'
									style={this.state.step1Show ? {} : { backgroundColor: '#00BC8C' }}
								>2</span>
						</Col>
						<Col md='12' className='text-center'>
							<p className='text-padding-top'>Reset Password</p>
						</Col>
					</Col>
				</Row>
				{this.state.step1Error ?
					<Row className='error-banner' style={{ paddingLeft: '20px' }}><p style={{ paddingTop: '10px' }}>{this.state.apiMessage}</p></Row> : null
				}
				<Row className='padding-box'>
					{this.renderStep()}
				</Row>
			</Container>
		);
	}
}

export default ForgetPassword;