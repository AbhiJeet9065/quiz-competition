import React, { Fragment, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import classnames from "classnames";
import questions from "../../questions.json";
import isEmpty from "../../utils/is-empty";
import { useNavigate } from "react-router-dom";

export default function Play() {
  const navigate = useNavigate();

  const [currentQ, setCurrentQ] = useState(questions[0].question);
  const [options, setOptions] = useState([
    questions[0].optionA,
    questions[0].optionB,
    questions[0].optionC,
    questions[0].optionD,
  ]);
  const [Answers, setAnswers] = useState([]);
  const [state, setState] = useState({
    questions,
    currentQuestion: {},
    nextQuestion: {},
    previousQuestion: {},
    answer: "",
    numberOfQuestions: 0,
    numberOfAnsweredQuestions: 0,
    currentQuestionIndex: 0,
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    nextButtonDisabled: false,
    time: {
      seconds: 30, // Initial timer value
    },
  });
  let interval = null;

  useEffect(() => {
    console.log(options);
    const { questions, currentQuestion, nextQuestion, previousQuestion } =
      state;
    displayQuestions(
      questions,
      currentQuestion,
      nextQuestion,
      previousQuestion
    );
    startTimer();

    return () => {
      clearInterval(interval);
    };
  }, [options, state, interval]);

  function displayQuestions(
    questions = state.questions,
    currentQuestion,
    nextQuestion,
    previousQuestion
  ) {
    let { currentQuestionIndex } = state;
    if (!isEmpty(state.questions) && currentQuestionIndex < 15) {
      questions = state.questions;
      console.log("www", state);
      currentQuestion = questions[currentQuestionIndex];
      nextQuestion = questions[currentQuestionIndex + 1];
      previousQuestion = questions[currentQuestionIndex - 1];
      const answer = currentQuestion.answer;
      setState((s) => ({
        ...s,
        currentQuestion,
        nextQuestion,
        previousQuestion,
        numberOfQuestions: questions.length,
        answer,
      }));
    }
  }

  useEffect(() => {
    handleDisableButton();
  }, [state.currentQuestionIndex]);

  const handleOptionClick = (option) => {
    const mOptions = ["a", "b", "c", "d"];
    setAnswers((s) => [...s, mOptions[option]]);
    const prevIndex = state.currentQuestionIndex;

    // Check if this is the last question
    if (prevIndex + 1 >= questions.length) {
      navigate("/play/quizSummary", { state: state });
    } else {
      handleNextButtonClick();
    }
  };

  const handleNextButtonClick = () => {
    if (state.nextQuestion !== undefined) {
      const prevIndex = state.currentQuestionIndex;
      if (prevIndex + 1 < 15) {
        console.log("NextLine", prevIndex);
        setCurrentQ(questions[prevIndex + 1].question);
        setOptions([
          questions[prevIndex + 1].optionA,
          questions[prevIndex + 1].optionB,
          questions[prevIndex + 1].optionC,
          questions[prevIndex + 1].optionD,
        ]);
        setState((s) => ({
          ...s,
          currentQuestionIndex: s.currentQuestionIndex + 1,
        }));
        setState((s) => ({ ...s, nextButtonDisabled: false }));
      } else {
        setState((s) => ({ ...s, nextButtonDisabled: true }));
      }
    }
  };

  const handleQuitButtonClick = () => {
    if (window.confirm("Are you sure you want to quit?")) {
      navigate("/play/quizSummary", { location: state });
    }
  };

  const handleButtonClick = (e) => {
    switch (e.target.id) {
      case "next-button":
        handleNextButtonClick();
        break;

      case "quit-button":
        handleQuitButtonClick();
        break;

      default:
        break;
    }
  };

  // const correctAnswer = () => {
  //   setState(
  //     (s) => ({
  //       ...s,
  //       score: s.score + 1,
  //       correctAnswers: s.correctAnswers + 1,
  //       currentQuestionIndex: s.currentQuestionIndex + 1,
  //       numberOfAnsweredQuestions: s.numberOfAnsweredQuestions + 1,
  //     }),
  //     () => {
  //       if (state.nextQuestion === undefined) {
  //         endGame();
  //       } else {
  //         displayQuestions(
  //           state.questions,
  //           state.currentQuestion,
  //           state.nextQuestion,
  //           state.previousQuestion
  //         );
  //       }
  //     }
  //   );
  // };

  // const wrongAnswer = () => {
  //   setState(
  //     (prevState) => ({
  //       ...prevState,
  //       wrongAnswers: prevState.wrongAnswers + 1,
  //       currentQuestionIndex: prevState.currentQuestionIndex + 1,
  //       numberOfAnsweredQuestions: prevState.numberOfAnsweredQuestions + 1,
  //     }),
  //     () => {
  //       if (state.nextQuestion === undefined) {
  //         endGame();
  //       } else {
  //         displayQuestions(
  //           state.questions,
  //           state.currentQuestion,
  //           state.nextQuestion,
  //           state.previousQuestion
  //         );
  //       }
  //     }
  //   );
  // };

  const startTimer = () => {
    const initialCountDownTime = Date.now() + 10000; // 30 seconds per question
    setInterval(() => {
      const now = new Date();
      const distance = initialCountDownTime - now;

      const seconds = Math.floor(distance / 1000);

      if (distance < 0) {
        clearInterval(interval);
        setState(
          (s) => ({
            ...s,
            time: {
              seconds: 0,
            },
          })
        );
        if (currentQuestionIndex < 15) {
          handleNextButtonClick();
        }
      } else {
        setState((s) => ({
          ...s,
          time: {
            seconds,
          },
        }));
      }
    }, 1000);
  };

  const handleDisableButton = () => {
    setState((s) => ({
      ...s,
      nextButtonDisabled: s.currentQuestionIndex === s.numberOfQuestions - 1,
    }));
  };

  // const endGame = () => {
  //   alert("Quiz has ended!");
  //   const playerStats = {
  //     score: state.score,
  //     numberOfQuestions: state.numberOfQuestions,
  //     numberOfAnsweredQuestions: state.correctAnswers + state.wrongAnswers,
  //     correctAnswers: state.correctAnswers,
  //     wrongAnswers: state.wrongAnswers,
  //   };
  //   setTimeout(() => {
  //     navigate("/play/quizSummary", { state: playerStats });
  //   }, 1000);
  // };

  const { currentQuestionIndex, numberOfQuestions, time } =
    state;

  return (
    <Fragment>
      <Helmet>
        <title>Quiz Page</title>
      </Helmet>
      <h2>Team Udaan</h2>
      <div className="questions">
        <div>
          <p>
            <span className="left" style={{ float: "left" }}>
              {currentQuestionIndex + 1} of {numberOfQuestions}
            </span>
            <span className="right">
              <span className="mdi mdi-clock-outline mdi-24px">
                {time.seconds}
              </span>
            </span>
          </p>
        </div>
        <h5>{currentQ}</h5>
        <div className="options-container">
          {options.map((o, i) => (
            <p key={o} onClick={() => handleOptionClick(i)} className="option">
              {o}
            </p>
          ))}
        </div>

        <div className="button-container">
          <button
            className={classnames("", {
              disable: state.nextButtonDisabled,
            })}
            id="next-button"
            onClick={handleButtonClick}
          >
            Next
          </button>
          <button id="quit-button" onClick={handleButtonClick}>
            Quit
          </button>
        </div>
      </div>
    </Fragment>
  );
}
