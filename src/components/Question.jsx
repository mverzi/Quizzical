import React from 'react'
import { nanoid } from 'nanoid'

function Question(props){

    const buttonElements = props.answers.map(answer => {
        const isCorrect = props.selectedAnswer === answer && props.selectedAnswer === props.correctAnswer;
        const isIncorrect = props.selectedAnswer === answer && props.selectedAnswer != props.correctAnswer
        const isChecked = props.checked;
        const styles = {
            backgroundColor: isChecked ? 
                (isCorrect ? "#94D7A2" : (isIncorrect ? "#F8BCBC" : (props.correctAnswer === answer ? "#94D7A2" : "transparent"))) : 
                (props.selectedAnswer === answer ? "#D6DBF5" : "transparent")
          };
        return <button 
                    key={nanoid()} 
                    className='answer-button' 
                    onClick={() => props.selectAnswer(props.question, answer)}
                    style={styles}
                    >
                    {answer}
                </button>
    })

    return (
        <div className='questions-container'>
            <h3 className='question'>{props.question}</h3>
            {buttonElements}
        </div>
    )
}

export default Question