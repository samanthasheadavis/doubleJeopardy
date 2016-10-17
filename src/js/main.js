//JeopardyGame Constructor
function Question(response) {
    this.info = {
        question: response[0].question,
        answer: response[0].answer
    };
    this.postQ(this.info);
}

// Prototype Methods

// 1. Post new question to question field
Question.prototype.postQ = function(info) {
    $('.question').html(this.info.question);
    this.answerQ(info);
};

// 2. Create answer field
Question.prototype.answerQ = function(info) {
    $('.guessBtn').on('click', function(event) {
        event.preventDefault();
        var textbox = $('<textarea>').appendTo('.answer');
    });
    this.logAnswer(info);
    console.log(info.answer);

};

// 3. accept answer
Question.prototype.logAnswer = function(info) {
    var self = this;
    $('form').keyup(function(event) {
        var answer = $('textarea').val();
        if (event.keyCode == 13) {
            self.checkAnswer(answer, info);
        }
    });
};

// 4. Check answer: find longest word in correct answer string, see if user answer includes that word.
Question.prototype.checkAnswer = function(answer, info) {
    console.log(info);
    var answerSplit = answer.split(' ');
    var correctAnswerSplit = info.answer.split(' ');
    var longestWord = '';
    for (var count = 0; count < correctAnswerSplit.length; count++) {
        if (correctAnswerSplit[count].length > longestWord) {
            longestWord = correctAnswerSplit[count];
        }
    }
    console.log(longestWord);
    if(answer.includes(longestWord)) {
      $('.check').slideDown();
    } else {
      $('.wrong').slideDown();
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
