import { useState, useEffect } from 'react'
import { nanoid } from 'nanoid'
import he, { decode } from "he";
import './index.css'
import Question from "./components/Question"

function App() {
  const [questions, setQuestions] = useState([])
  const [quizOngoing, setQuizOngoing] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [checked, setChecked] = useState(false)

  const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

  async function fetchQuestions() {
    const res = await fetch("https://opentdb.com/api.php?amount=5");
    const data = await res.json();
    let q = [];
    data.results.forEach((question) => {
      const decodedQuestion = he.decode(question.question);
      const decodedCorrectAnswer = he.decode(question.correct_answer);
      const decodedIncorrectAnswers = question.incorrect_answers.map(he.decode);
      q.push({
        id: nanoid(),
        question: decodedQuestion,
        correctAnswer: decodedCorrectAnswer,
        answers: shuffleArray([...decodedIncorrectAnswers, decodedCorrectAnswer]),
        selected: null,
        checked: false,
      });
    });
    setQuestions(q);
  }

  function startQuiz() {
    setQuizOngoing(true);
    setChecked(false)
    fetchQuestions();
  }

  function setSelected(question, answer){
    if(!checked){
      setQuestions(questions => questions.map(q => {
        if(q.question === question){
          return {
            ...q,
            selected: he.decode(answer)
          }
        }
        else{
          return q
        }
      }))
    }
  }

  function checkAnswers(){
    setChecked(true)

    setQuestions(questions => questions.map(q => {
      return {
        ...q,
        checked: true
      }
    }))

    let correctAnswers = 0
    for(let i = 0; i < questions.length; i++){
      if(questions[i].selected === questions[i].correctAnswer){
        correctAnswers += 1;
      }
    }
    setCorrectAnswers(correctAnswers)
  }

  //console.log(questions)

  const questionElements = questions.map(question => {
    return <Question 
            key={nanoid()}
            question={question.question}
            answers={question.answers}
            selectedAnswer={question.selected}
            selectAnswer={setSelected}
            correctAnswer={question.correctAnswer}
            checked={question.checked}
          />
  })

  return (
    <main>
      {quizOngoing ? 
        <div>
          <div className="quiz-container">
            {questionElements}
          </div>
          <div className="results">
            {checked && <h4>You scored {correctAnswers}/5 answers correct</h4>}
            {!checked ? 
              <button className="button" onClick={checkAnswers}>Check Answers</button> :
              <button className="button" onClick={startQuiz}>Play Again</button>  
          }
            
          </div>
        </div>
      :
      <div>
          <h1>Quizzical</h1>
          <p>Test Your Knowledge!</p>
          <button onClick={startQuiz} className="button">
            Start Quiz
          </button>
        </div>
      }   
    </main>
  )
}

export default App
