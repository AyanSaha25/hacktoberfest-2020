const startButton = document.getElementById('start-btn')
const nextButton = document.getElementById('next-btn')
const questionContainerElement = document.getElementById('question-container')
const questionElement = document.getElementById('question')
const answerButtonsElement = document.getElementById('answer-buttons')

let shuffledQuestions, currentQuestionIndex

startButton.addEventListener('click', startGame)
nextButton.addEventListener('click', () => {
  currentQuestionIndex++
  setNextQuestion()
})

function startGame() {
  startButton.classList.add('hide')
  shuffledQuestions = questions.sort(() => Math.random() - .5)
  currentQuestionIndex = 0
  questionContainerElement.classList.remove('hide')
  setNextQuestion()
}

function setNextQuestion() {
  resetState()
  showQuestion(shuffledQuestions[currentQuestionIndex])
}

function showQuestion(question) {
  questionElement.innerText = question.question
  question.answers.forEach(answer => {
    const button = document.createElement('button')
    button.innerText = answer.text
    button.classList.add('btn')
    if (answer.correct) {
      button.dataset.correct = answer.correct
    }
    button.addEventListener('click', selectAnswer)
    answerButtonsElement.appendChild(button)
  })
}

function resetState() {
  clearStatusClass(document.body)
  nextButton.classList.add('hide')
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild)
  }
}

function selectAnswer(e) {
  const selectedButton = e.target
  const correct = selectedButton.dataset.correct
  setStatusClass(document.body, correct)
  Array.from(answerButtonsElement.children).forEach(button => {
    setStatusClass(button, button.dataset.correct)
  })
  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove('hide')
  } else {
    startButton.innerText = 'Restart'
    startButton.classList.remove('hide')
  }
}

function setStatusClass(element, correct) {
  clearStatusClass(element)
  if (correct) {
    element.classList.add('correct')
  } else {
    element.classList.add('wrong')
  }
}

function clearStatusClass(element) {
  element.classList.remove('correct')
  element.classList.remove('wrong')
}

const questions = [
  {
    question: '*Which among the following is India’s first comprehensive COVID-19 tracking application?',
    answers: [
      { text: 'Arogya Setu', correct: true },
      { text: 'Arogya Sanjeevani ', correct: false },
      { text: 'Samadhaan ', correct: false },
      { text: 'Shakti', correct: false}


    ]
  },
  {
    question: '*Which fund has been set up for COVID-19 relief??',
    answers: [
      { text: 'PM-Covid fund', correct: false },
      { text: 'PM-Cares fund', correct: true },
      { text: 'Covid se Suraksha', correct: false},
      { text: 'PM- Coronavirus', correct: false }
    ]
  },
  {
    question: '*As per the latest UNCTAD report, the world economy will go into recession with the exception of which two countries??',
    answers: [
      { text: 'US, China', correct: true },
      { text: 'China ,India', correct: false},
      { text: 'India, Japan', correct: false },
      { text: 'None', correct: false }
    ]
  },
{
    question: '*India locked down for how many days?',
    answers: [
      { text: '28', correct: false },
      { text: '21', correct: true },
      { text: '12', correct: false },
      { text: '25', correct: false}
    ]
  }
]
