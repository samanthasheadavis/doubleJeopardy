
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
  console.log(this.info.answer);
  this.answerQ(info);
};

// 2. Create answer field
Question.prototype.answerQ = function(info) {
  $('.guessBtn').on('click', function(event) {
    event.preventDefault();
    var textbox = $('<textarea>').appendTo('.answer');
  });
  this.logAnswer(info);
};

// 3. accept answer
Question.prototype.logAnswer = function(info) {
  var self = this;
  $('form').keyup(function(event) {
    if(event.keyCode == 13) {
      var answer = $('textarea').val();
      self.checkAnswer(answer, info);
    }
  });
};

// 4. Check answer
Question.prototype.checkAnswer = function(answer, info) {
  console.log(answer);
  console.log(info);
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
