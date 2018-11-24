import React, { Component } from 'react'

class Question extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedValue: {}
    }
  }

  onRadioChange = e => {
    const { collectResponses, answerText } = this.props
    var answerIdx = e.target.name
    var answerValue = e.target.value
    var points = 0
    if(answerText === answerValue) {
      points = 1
    }
    var answer = {[answerIdx]: {
      selected: answerValue,
      points: points
      }
    }
    collectResponses(answer)
  }

  render() {
    const { idx, answers, questionText } = this.props
    var answersArray = Object.values(answers).map((val) => val);

    return (
      <div className="question-wrapper">
        <div className="question-header">
          <h2>{questionText}</h2>
        </div>
        {answersArray.map((answer) => (
          <div key={idx} className="answer-wrapper">
            <input type="radio" name={idx} value={answer} onChange={this.onRadioChange}/>
            <label>{answer}</label>
          </div>
        ))}
      </div>
    )
  }
}

export default Question;