import React, { Component } from "react";
import classnames from "classnames";
import "./Quiz.css";
import Question from "./Question/question";

class Quiz extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      serviceType: "handyman",
      uniqueEmails: [],

      submitPrequiz: false,
      quizSubmitted: false,
      invalidFirstName: false,
      invalidLastName: false,
      invalidEmail: false,

      questions: {},
      candidateAnswers: {},
      candidateResponse: {},
    };

    this.handleChange = this.handleChange.bind(this);
    this.onSubmitPrequiz = this.onSubmitPrequiz.bind(this);
    this.onSubmitQuiz = this.onSubmitQuiz.bind(this);
    this.handleSubmitQuiz = this.handleSubmitQuiz.bind(this);
    this.constructCandidateResponse = this.constructCandidateResponse.bind(this);
    this.getQuestions = this.getQuestions.bind(this);
    this.getEmails = this.getEmails.bind(this);

    this.getHandymanQuestions = this.getHandymanQuestions.bind(this);
    this.getHomecleaningQuestions = this.getHomecleaningQuestions.bind(this);
  }

  componentDidMount() {
    this.getHomecleaningQuestions()
      .catch(err => console.log(err, "ERROR"));
    this.getHandymanQuestions()
      .catch(err => console.log(err, "ERROR"));
    this.getEmails()
      .catch(err => console.log(err, "ERROR"));
  }

  getQuestions = async () => { //TO DO: implement retry/exponential backoff if error
    const response = await fetch("/api/getQuestions");
    const body = await response.json();
    if (response.status !== 200) throw Error(response.statusText);
    this.setState({
      questions: body
    });
    return body;
  };

  getHandymanQuestions = async () => { //TO DO: implement retry/exponential backoff if error
    const response = await fetch("/api/getHandymanQuestions");
    const body = await response.json();
    if (response.status !== 200) throw Error(response.statusText);
    this.setState(prevState => ({
      questions: {
        ...prevState.questions,
        "handyman": body
      }
    }));
    return body;
  };

  getHomecleaningQuestions = async () => { //TO DO: implement retry/exponential backoff if error
    const response = await fetch("/api/getHomecleaningQuestions");
    const body = await response.json();
    if (response.status !== 200) throw Error(response.statusText);
    this.setState(prevState => ({
      questions: {
        ...prevState.questions,
        "homecleaning": body
      }
    }));
    return body;
  };

  getEmails = async() => { //TO DO: implement retry/exponential backoff if error
    const response = await fetch('/api/getEmails');
    const body = await response.json();
    if (response.status !== 200) throw Error(response.statusText);
    this.setState({
      uniqueEmails: body
    });
    return body;
  }

  handleSubmitQuiz = async e => {
    var candidate = this.constructCandidateResponse();
    this.setState({
      candidateResponse: candidate,
      quizSubmitted: true
    });
    e.preventDefault();
    const response = await fetch("/api/addCandidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ post: candidate })
    });
    return response
  };

  handleChange(event) {
    const inputName = event.target.name;
    this.setState({ [inputName]: event.target.value });
  }

  onSubmitPrequiz() { //optimize this
    const { firstName, lastName, email, uniqueEmails } = this.state;
    if (firstName === "") {
      this.setState({
        invalidFirstName: true
      });
    } else {
      this.setState({
        invalidFirstName: false
      });
    }
    if (lastName === "") {
      this.setState({
        invalidLastName: true
      });
    } else {
      this.setState({
        invalidLastName: false
      });
    }
    if (/^[\w.-]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email) && !uniqueEmails.includes(email)) {
      this.setState(
        {
          invalidEmail: false
        },
        this.isValid
      );
    } else {
      this.setState(
        {
          invalidEmail: true
        }
      );
    }
  }

  isValid() {
    const { invalidFirstName, invalidLastName, invalidEmail } = this.state;
    if (!invalidFirstName && !invalidLastName && !invalidEmail) {
      this.setState({
        submitPrequiz: true
      });
    }
  }

  collectResponses = answer => {
    const { candidateAnswers } = this.state;
    const answers = Object.assign(candidateAnswers, answer);
    this.setState({
      candidateAnswers: answers
    });
  };

  constructCandidateResponse() {
    const {
      serviceType,
      questions,
      firstName,
      lastName,
      email,
      candidateAnswers
    } = this.state;

    var points = Object.values(candidateAnswers)
      .map(question => question.points)
      .reduce((total, current) => total + current);
    var percentage =
      (points / questions[serviceType].length) * 100;
    var candidate = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      serviceType: serviceType,
      points: points,
      percentage: percentage,
      candidateQuestions: questions[serviceType],
      candidateAnswers: candidateAnswers
    };
    return candidate;
  }

  onSubmitQuiz() {
    var candidate = this.constructCandidateResponse();
    this.setState({
      candidateResponse: candidate
    });
  }

  render() {
    const {
      firstName,
      lastName,
      email,
      serviceType,
      invalidFirstName,
      invalidLastName,
      invalidEmail,
      submitPrequiz,
      questions,
      quizSubmitted,
      candidateAnswers
    } = this.state;

    return (
      <div className="Quiz">
        <nav className="nav-bar">
          <div className="navigation-logo">
            <img
              src="https://cache-landingpages.services.handy.com/assets/pages/region/handy_logo-e5d858d96595ec001c5268a2d7a0f91800da2c7c2f963a5307154917289c347a.svg"
              alt="Handy logo"
            />
          </div>
        </nav>
        <div className={classnames("quiz", { prequiz: !submitPrequiz })}>
          {!submitPrequiz && (
            <div className="quiz-form">
              <h1>Sign up to be a professional with Handy!</h1>
              <div className="quiz-input-wrapper">
                <input
                  className={classnames("quiz-input first-name", {
                    invalid: invalidFirstName
                  })}
                  name="firstName"
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={this.handleChange}
                />
                <input
                  className={classnames("quiz-input last-name", {
                    invalid: invalidLastName
                  })}
                  name="lastName"
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={this.handleChange}
                />
                <input
                  className={classnames("quiz-input email", {
                    invalid: invalidEmail
                  })}
                  name="email"
                  type="text"
                  placeholder="Email address"
                  value={email}
                  onChange={this.handleChange}
                />
                <select
                  className="quiz-input service-type"
                  name="serviceType"
                  value={serviceType}
                  onChange={this.handleChange}
                >
                  <option value="handyman">Handyman</option>
                  <option value="homecleaning">Home cleaning</option>
                </select>
                {
                  <div className="invalid-warning">
                    {(invalidFirstName || invalidLastName) &&
                      "*All fields are required. "}
                    {invalidEmail && "A valid, unused email must be submitted."}
                  </div>
                }
                <div className="submit" onClick={this.onSubmitPrequiz}>
                  Get started
                </div>
              </div>
            </div>
          )}
          {serviceType === "handyman" && submitPrequiz && !quizSubmitted && (
            <div className="handyman-quiz">
              {questions.handyman.map(questionObject => {
                var question = Object.values(questionObject)[0]
                return(
                <Question
                  key={question.questionIndex}
                  idx={question.questionIndex}
                  answerText={question.answerText}
                  answers={question.answers}
                  questionText={question.questionText}
                  collectResponses={this.collectResponses}
                />
              )})}
              <div
                className={classnames("submit", {
                  disabled:
                    Object.keys(candidateAnswers).length !==
                    questions[serviceType].length
                })}
                onClick={this.handleSubmitQuiz}
              >
                Submit
              </div>
            </div>
          )}
          {serviceType === "homecleaning" && submitPrequiz && !quizSubmitted && (
            <div className="homecleaning-quiz">
              {questions.homecleaning.map(questionObject => {
                var question = Object.values(questionObject)[0]
                return(
                <Question
                  key={question.questionIndex}
                  idx={question.questionIndex}
                  answerText={question.answerText}
                  answers={question.answers}
                  questionText={question.questionText}
                  collectResponses={this.collectResponses}
                />
              )})}
              <div
                className={classnames("submit", {
                  disabled:
                    Object.keys(candidateAnswers).length !==
                    questions[serviceType].length
                })}
                onClick={this.handleSubmitQuiz}
              >
                Submit
              </div>
            </div>
          )}
          {quizSubmitted && (
            <div className="quiz prequiz">
              <div className="submission-completed">
                <h1>Thanks for submitting!</h1>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
export default Quiz;
