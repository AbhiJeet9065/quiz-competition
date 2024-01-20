import React, { Component, Fragment } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

class QuizSummary extends Component {
    constructor (props) {
        super(props);
        this.state = {
          score: 0,
          numberOfQuestions: 0,
          numberOfAnsweredQuestions: 0,
          correctAnswers: 0,
          wrongAnswers: 0,
        };
    }

    componentDidMount () {
      console.log(this.props);
      console.log(this.props.location);
        // const { state } = this.props.location;
        const state = this.props.location;
        if(state) {
          this.setState({
            score: (state.score / state.numberOfQuestions) * 100,
            numberOfQuestions: state.numberOfQuestions,
            numberOfAnsweredQuestions: state.numberOfAnsweredQuestions,
            correctAnswers: state.correctAnswers,
            wrongAnswers: state.wrongAnswers,
          });
        }
    }

    render () {
        // const { state, score } = this.props.location;
        const state = this.props.location;
        let stats, remark;
        const userScore = this.state.score;

        if (userScore < -30) {
          remark = "You need more practice!";
        } else if (userScore > 30 && userScore <= 50) {
          remark = "Better lick next time!";
        } else if (userScore <= 70 && userScore > 50) {
          remark = "You can do better!";
        } else if (userScore >= 71 && userScore <= 84) {
          remark = "You did great!";
        } else {
          remark = "You're an absolute genius!";
        }

        if (state !== undefined) {
            stats = (
              <Fragment>
                <div>
                  <span className="mdi mdi-check-circle-outline success-icon"></span>
                </div>
                <h1>Quiz has ended</h1>
                <div className="container">
                  <h4>{remark}</h4>
                  <h2>Your Score: {this.state.score.toFixed(0)}&#37</h2>
                  <span className="stat left">Total number of questions: </span>
                  <span className="right">{this.state.numberOfQuestions}</span>
                  <br />

                  <span className="stat left">Number of attempted questions: </span>
                  <span className="right">{this.state.numberOfAnsweredQuestions}</span>
                  <br />

                  <span className="stat left">Number of Correct Answers: </span>
                  <span className="right">{this.state.correctAnswers}</span>
                  <br />

                  <span className="stat left">Number of Wrong Answers: </span>
                  <span className="right">{this.state.wrongAnswers}</span>
                </div>
                <section>
                  <ul>
                    <li>
                      <Link to="/">Back to Home</Link>
                    </li>
                  </ul>
                </section>
              </Fragment>
            );
        } else {
            stats = (
              <section>
                <h1 className="no-stats">No Statistics Available</h1>
                <ul>
                  <li>
                    <Link to="/">Back to Home</Link>
                  </li>
                  <li>
                    <Link to="/play/quiz">Take a Quiz</Link>
                  </li>
                </ul>
              </section>
            );
        }
        
        return (
            <Fragment>
                <Helmet><title>Quiz App - Summary</title></Helmet>
                {stats}
            </Fragment>
        );
    }
}

export default QuizSummary;