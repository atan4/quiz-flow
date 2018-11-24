import React, { Component } from "react";
import './Admin.css';
import CandidateOverview from '../CandidateOverview/CandidateOverview'

class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      candidates: {},
      sortFinished: false,
      selectedCandidate: {}
    }

    this.sortCandidates = this.sortCandidates.bind(this)
    this.toggleSelectedCandidate = this.toggleSelectedCandidate.bind(this)
  }

  componentDidMount() {
    this.getCandidates()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err, "ERROR"));
  }

  toggleSelectedCandidate(e) {
    const { candidates } = this.state
    var tabIndex = e.target.id;
    this.setState({
      selectedCandidate: candidates[tabIndex]
    })
  }

  getCandidates = async () => { //TO DO: implement retry/exponential backoff
    const response = await fetch('/api/getCandidates');
    const body = await response.json();
    if (response.status !== 200) throw Error(response.statusText);
    this.setState({
      candidates: body
    }, this.sortCandidates)
    return body;
  };

  sortCandidates() {
    const { candidates } = this.state
    var sortedCandidates = {}
    candidates.map((candidate) => {
      var perc = candidate.percentage
      if (perc in sortedCandidates){
        sortedCandidates[perc].push(candidate)
      } else {
        sortedCandidates[perc] = [candidate]
      }
      return perc
    })
    //primary percentage sort
    var percentageSort = Object.entries(sortedCandidates).sort(function(a, b) {
      if (parseFloat(a[0]) > parseFloat(b[0])) return -1;
      if (parseFloat(a[0]) < parseFloat(b[0])) return 1;
      return 0;
    })
    
    //secondary alphabetical sort
    var alphabeticalSort = percentageSort.map((percentage) => { 
      return percentage[1].sort(function(a, b){
        if(a.firstName < b.firstName) { return -1; }
        if(a.firstName > b.firstName) { return 1; }
        return 0;
      })
    })
    var allCandidates = []
    alphabeticalSort.map((percentage) => {
      percentage.map((candidate) => allCandidates.push(candidate))
      return percentage
    })

    this.setState({
      candidates: allCandidates,
      sortFinished: true,
      selectedCandidate: allCandidates[0]
    })
  }

  render() {
    const { candidates, sortFinished, selectedCandidate } = this.state
    return (
      <div className="admin">
        <nav className="nav-bar">
          <div className="navigation-logo">
            <img
              src="https://cache-landingpages.services.handy.com/assets/pages/region/handy_logo-e5d858d96595ec001c5268a2d7a0f91800da2c7c2f963a5307154917289c347a.svg"
              alt="Handy logo"
            />
          </div>
          <div className="dashboard">
            <div className="candidate-wrapper">
              {sortFinished ? (candidates.map((candidate, idx) => (
                <div className="candidate" id={idx} onClick={this.toggleSelectedCandidate}>
                  <h2 className="name" id={idx}>{candidate.firstName} {candidate.lastName}</h2>
                  <h2 className="score" id={idx}>{Math.round(candidate.percentage)}%</h2>
                </div>
                ))) :
                (<div className="candidate">
                  Loading...
                </div>)
              }
            </div>
            <div className="candidate-info">
              {sortFinished ? <CandidateOverview selectedCandidate={selectedCandidate}/> :
                <div className="candidate-overview">loading...</div>
              }
            </div>
          </div>
        </nav>
      </div>
    )
  }
}

export default Admin;