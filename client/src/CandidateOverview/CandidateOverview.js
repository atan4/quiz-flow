import React, { Component } from 'react'
import classnames from 'classnames'
import './CandidateOverview.css'

class CandidateOverview extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  render() {
    const { selectedCandidate } = this.props
    var questions = Object.values(selectedCandidate.candidateQuestions)
    var answers = Object.values(selectedCandidate.candidateAnswers)

    return (
      <div className="candidate-overview">
        <div className="candidate-overview-header">
          <div className="score-box">
            <span>{Math.round(selectedCandidate.percentage * 100) / 100}%</span>
          </div>
          <div className="candidate-name-email">
            <h2 className="candidate-name">{selectedCandidate.firstName} {selectedCandidate.lastName}</h2>
            <h3>{selectedCandidate.email}</h3>
          </div>
        </div>
        <div className="question-wrapper">
          {questions.map((question) => {
            var questionObject = Object.values(question)[0]
            var questionIdx = questionObject.questionIndex
            var questionText = questionObject.questionText
            return(
            <div className="question-response-wrapper">
              <div className="question-header overview">
                <span className={classnames("question", {"correct": (answers[questionIdx-1].points === 1)})}>{questionText}</span>
              </div>
              <div className="response">
                {answers[questionIdx-1].selected}
              </div>
            </div>
          )})}
        </div>
      </div>
    )
  }
}

export default CandidateOverview;