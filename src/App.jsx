import { useState, useEffect } from 'react'
import { nanoid } from 'nanoid'
import he, { decode } from "he";
import './index.css'
import Question from "./components/Question"

function App() {
  const [questions, setQuestions] = useState([])
  const [quizOngoing, setQuizOngoing] = useState(false)
  const [questionCount, setQuestionCount] = useState(
    [
      {count: 3, selected: false},
      {count: 5, selected: true},
      {count: 7, selected: false},
    ]
  )
  const [questionAmount, setQuestionAmount] = useState(5)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [checked, setChecked] = useState(false)
  const [incomplete, setIncomplete] = useState(null)

  const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

  async function fetchQuestions() {
    const res = await fetch(`https://opentdb.com/api.php?amount=${questionAmount}`);
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

  function selectQuestionsAmount(count){
    setQuestionAmount(count)
    setQuestionCount(prevCount => prevCount.map(option => {
      if(option.count === count){
        return {
          count: count,
          selected: true
        }
      }
      else{
        return {
          ...option,
          selected: false
        }
      }
    }))
  }
      
  console.log(questionAmount)

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
    if (questions.every((q) => q.selected !== null)) {
      setChecked(true)
      setIncomplete(false)

      setQuestions(questions => questions.map(q => {
        return {
          ...q,
          checked: true
        }
      }))
    } else {
      setIncomplete(true)
    }

    let correctAnswers = 0
    for(let i = 0; i < questions.length; i++){
      if(questions[i].selected === questions[i].correctAnswer){
        correctAnswers += 1;
      }
    }
    setCorrectAnswers(correctAnswers)
  }

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


  const styles = (count) => ({
    backgroundColor: questionCount.find(option => option.count === count)?.selected ? "#D6DBF5" : "transparent"
  });

  return (
    <main>
      {quizOngoing ? 
        <div>
          <div className="quiz-container">
            {questionElements}
          </div>
          <div className="results">
            {incomplete && <h4>Please answer all questions before submitting.</h4>}
            {checked && <h4>You scored {correctAnswers}/{questionAmount} answers correct</h4>}
            {!checked ? 
              <button className="button" onClick={checkAnswers}>Check Answers</button> :
              <button className="button" onClick={() => setQuizOngoing(false)}>Play Again</button>  
          }
            
          </div>
        </div>
      :
      <div>
          <h1>Quizzical</h1>
          <p>Test Your Knowledge!</p>
          <div>
            <button onClick={() =>selectQuestionsAmount(3)} style={styles(3)} className="answer-button">
                3 Questions
            </button>
            <button onClick={() =>selectQuestionsAmount(5)} style={styles(5)} className="answer-button">
              5 Questions
            </button>
            <button onClick={() =>selectQuestionsAmount(7)} style={styles(7)} className="answer-button">
              7 Questions
            </button>
          </div>
            <button onClick={startQuiz} className="button">
              Start Quiz
            </button>
        </div>
      }   
    </main>
  )
}

export default App
