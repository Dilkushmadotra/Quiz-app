const PASSWORD = "ror123";
const LOCAL_STORAGE_KEY = "quizQuestions";

// Load questions from localStorage or use default
let quizData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    answer: "Paris"
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    answer: "Mars"
  },
  {
    question: "What is 5 + 3?",
    options: ["5", "8", "9", "7"],
    answer: "8"
  }
];

const form = document.getElementById('quiz-form');
const resultContainer = document.getElementById('result');
const submitBtn = document.getElementById('submit-btn');
const restartBtn = document.getElementById('restart-btn');

const authBtn = document.getElementById('auth-btn');
const authInput = document.getElementById('auth-password');
const authMessage = document.getElementById('auth-message');
const addForm = document.getElementById('add-question-form');

const userAnswers = {};

// 🔓 Teacher login
authBtn.onclick = () => {
  const entered = authInput.value.trim();
  if (entered === PASSWORD) {
    document.getElementById('auth-section').style.display = 'none';
    addForm.style.display = 'block';
  } else {
    authMessage.classList.remove('d-none');
    authInput.value = '';
  }
};

// ➕ Add Question to Quiz
const addBtn = document.getElementById('add-question-btn');
addBtn.onclick = () => {
  const question = document.getElementById('new-question').value.trim();
  const optionsEls = document.querySelectorAll('.new-option');
  const options = Array.from(optionsEls).map(el => el.value.trim());
  const correctAnswer = document.getElementById('correct-answer').value.trim();

  if (!question || options.some(o => !o) || !correctAnswer) {
    alert('Please fill in all fields.');
    return;
  }

  if (!options.includes(correctAnswer)) {
    alert('Correct answer must match one of the options.');
    return;
  }

  const newQ = { question, options, answer: correctAnswer };
  quizData.push(newQ);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quizData));

  Object.keys(userAnswers).forEach(key => delete userAnswers[key]);
  renderQuiz();
  submitBtn.disabled = false;
  resultContainer.innerHTML = '';
  restartBtn.style.display = 'none';

  document.getElementById('new-question').value = '';
  optionsEls.forEach(el => el.value = '');
  document.getElementById('correct-answer').value = '';
};

function renderQuiz() {
  form.innerHTML = '';
  quizData.forEach((q, index) => {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';
    questionDiv.innerHTML = `<p>${index + 1}. ${q.question}</p>`;

    q.options.forEach(option => {
      const optionEl = document.createElement('div');
      optionEl.className = 'option';
      optionEl.innerText = option;
      optionEl.onclick = () => selectOption(index, optionEl);
      questionDiv.appendChild(optionEl);
    });

    form.appendChild(questionDiv);
  });
}

function selectOption(qIndex, optionEl) {
  const allOptions = form.children[qIndex].querySelectorAll('.option');
  allOptions.forEach(opt => opt.classList.remove('selected'));
  optionEl.classList.add('selected');
  userAnswers[qIndex] = optionEl.innerText;
}

submitBtn.onclick = () => {
  let score = 0;

  quizData.forEach((q, i) => {
    const options = form.children[i].querySelectorAll('.option');
    options.forEach(option => {
      const isSelected = option.classList.contains('selected');
      if (option.innerText === q.answer) {
        option.classList.add('correct');
      } else if (isSelected) {
        option.classList.add('wrong');
      }
      option.onclick = null;
    });

    if (userAnswers[i] === q.answer) score++;
  });

  resultContainer.innerHTML = `<h2>You scored ${score} out of ${quizData.length}</h2>`;
  restartBtn.classList.remove('d-none');
  submitBtn.disabled = true;
};

restartBtn.onclick = () => {
  Object.keys(userAnswers).forEach(key => delete userAnswers[key]);
  renderQuiz();
  resultContainer.innerHTML = '';
  restartBtn.classList.add('d-none');
  submitBtn.disabled = false;
};

renderQuiz();
