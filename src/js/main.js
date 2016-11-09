//JeopardyGame Constructor
var game = {
    qCount: [],
    incorrectCount: [],
    correctCount: [],
    score: 0,
    storage: {
        set: function() {
            localStorage.setItem("totalQuestions", JSON.stringify(game.qCount));
        },
        get: function() {
            var totalQuestions = localStorage.totalQuestions === undefined ? false : JSON.parse(localStorage.totalQuestions);
            return totalQuestions;
        },
    }
};

function Question(response) {
    this.info = {
        question: response[0].question,
        answer: response[0].answer,
        value: response[0].value
    };
    this.postQ(this.info);
}

// -- Prototype Methods -- //

// 1. Post new question to question field, clear textarea and checkbox from previous question
Question.prototype.postQ = function(info) {
    $('.check').hide();
    $('.wrong').hide();
    $('.question').html(this.info.question);
    this.logAnswer(info);

};

// 3. accept answer
Question.prototype.logAnswer = function(info) {
  // log question to total questions array
  game.qCount.push(this.info);
  $('.totalCount').children('span').html(game.qCount.length);

  var self = this;
  $('.submitBtn').on('click', function() {

      var answer = $('textarea').val();
          self.checkAnswer(answer, info);
      $('.submitBtn').off('click');
  });
};

// 4. Check answer: find longest word in correct answer string, see if user answer includes that word.
Question.prototype.checkAnswer = function(answer, info) {
    var answerSplit = answer.split(' ');
    var correctAnswerSplit = info.answer.split(' ');
    var longestWord = '';
    for (var count = 0; count < correctAnswerSplit.length; count++) {
        if (correctAnswerSplit[count].length > longestWord) {
            longestWord = correctAnswerSplit[count];
        }
    }
    if (answer.includes(longestWord)) {
        this.correct(answer, info);
    } else {
        this.incorrect(answer, info);
    }
};

// 5. If answer is correct, add to number of correctly answered questions.
Question.prototype.correct = function(answer, info) {
    $('.check').slideDown();
    // add to correctly answered questions array
    game.correctCount.push(info);
    $('.correctCount').children('span').html(game.correctCount.length);
    // update score
    game.score += info.value;
    $('.score').html(game.score);
    this.clear();
};
// 6. If answer is incorrect, decrement score, add to incorrect questions count.
Question.prototype.incorrect = function(answer, info) {
    $('.wrong').slideDown();
    game.incorrectCount.push(info);
    $('.incorrectCount').children('span').html(game.incorrectCount.length);
    game.score -= info.value;
    $('.score').html(game.score);
    this.clear();
};

// Clears textarea field and populates next question.
// When a game has been completed (5 questions) game info is saved in local storage
// and user is alerted with final game stats.

Question.prototype.clear = function() {
    window.setTimeout(function() {
        $('.question').val('');
        $('textarea').val('');
        getQuestion();
    }, 2000);
    if (game.qCount.length === 5) {
        game.storage.set();
        alert('Game Over! ' + game.correctCount.length + ' correct, ' + game.incorrectCount.length + ' incorrect.');
    }
};
// Ajax Call
function getQuestion() {
    $.ajax({
        type: 'GET',
        url: 'http://jservice.io/api/random',
        success: function(response) {
            new Question(response);
        }
    });
}

//Event Listeners
$('.questionBtn').on('click', function(event) {
    event.preventDefault();
    getQuestion();
});
$('.guessBtn').on('click', function(event) {
    event.preventDefault();
    $('textarea').slideDown();
});
