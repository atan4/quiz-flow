const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
import url from "./key.js"

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => console.log(`Listening on port ${port}`));

app.get("/api/getAllQuestions", (req, res) => {
  MongoClient.connect(
    url,
    function(err, db) {
      if (err) throw err;
      var dbo = db.db("handyquiz");
      dbo.collection("questions").find().toArray(function(err, result) {
        if (err) throw err;
        res.send(result)
        db.close();
      });
    }
  );
});

app.get("/api/getHandymanQuestions", (req, res) => {
  MongoClient.connect(
    url,
    function(err, db) {
      if (err) throw err;
      var dbo = db.db("handyquiz");
      dbo.collection("questions").distinct("handyman", function(err, result) {
        res.send(result);
        if (err) throw err;
        db.close();
      });
    }
  );
});

app.get("/api/getHomecleaningQuestions", (req, res) => {
  MongoClient.connect(
    url,
    function(err, db) {
      if (err) throw err;
      var dbo = db.db("handyquiz");
      dbo
        .collection("questions")
        .distinct("homecleaning", function(err, result) {
          res.send(result);
          if (err) throw err;
          db.close();
        });
    }
  );
});

app.get("/api/getCandidates", (req, res) => {
  MongoClient.connect(
    url,
    function(err, db) {
      if (err) throw err;
      var dbo = db.db("handyquiz");
      dbo
        .collection("candidates")
        .find()
        .toArray(function(err, result) {
          if (err) throw err;
          res.send(result);
          db.close();
        });
    }
  );
});

app.get("/api/getEmails", (req, res) => {
  MongoClient.connect(
    url,
    function(err, db) {
      if (err) throw err;
      var dbo = db.db("handyquiz");
      dbo.collection("candidates").distinct("email", function(err, result) {
        res.send(result);
      });
      if (err) throw err;
      db.close();
    }
  );
});

app.post("/api/addCandidate", (req, res) => {
  MongoClient.connect(
    url,
    function(err, db) {
      if (err) throw err;
      var dbo = db.db("handyquiz");
      dbo.collection("candidates").insertOne(req.body.post, function(err, res) {
        if (err) throw err;
        console.log("1 candidate inserted");
        db.close();
      });
    }
  );
});

//receives new question object: questionText, serviceType, answers, correctAnswer. See POST_BODY_TESTING_EXAMPLES to see how data is modeled. 
app.post("/api/addHomecleaningQuestion", (req, res) => {
  MongoClient.connect(
    url,
    function(err, db) {
      if (err) throw err;
      var dbo = db.db("handyquiz");
      var newQuestionBody = req.body.post;
      dbo
        .collection("questions")
        .distinct("homecleaning", function(err, result) {
          var newQuestionIndex = result.length + 1;
          var newQuestion = constructNewQuestion(
            newQuestionIndex,
            newQuestionBody.questionText,
            "homecleaning",
            newQuestionBody.answers,
            newQuestionBody.correctAnswer
          );
          dbo
            .collection("questions")
            .insertOne(newQuestion, function(err, res) {
              if (err) throw err;
              console.log("1 homecleaning question inserted");
            });
          if (err) throw err;
          db.close();
        });
    }
  );
});

//receives new question object: questionText, serviceType, answers, correctAnswer.  See POST_BODY_TESTING_EXAMPLES to see how data is modeled.
app.post("/api/addHandymanQuestion", (req, res) => {
  MongoClient.connect(
    url,
    function(err, db) {
      if (err) throw err;
      var dbo = db.db("handyquiz");
      var newQuestionBody = req.body.post;
      dbo.collection("questions").distinct("handyman", function(err, result) {
        var newQuestionIndex = result.length + 1;
        var newQuestion = constructNewQuestion(
          newQuestionIndex,
          newQuestionBody.questionText,
          "handyman",
          newQuestionBody.answers,
          newQuestionBody.answerText
        );
        dbo.collection("questions").insertOne(newQuestion, function(err, res) {
          if (err) throw err;
          console.log("1 handyman question inserted");
        });
        if (err) throw err;
        db.close();
      });
    }
  );
});

//receives object containing question object that is to be updated AND an question body object with updated information.  See POST_BODY_TESTING_EXAMPLES to see how data is modeled.
app.post("/api/updateQuestion", (req, res) => {
  console.log("hi ", req.body)
  MongoClient.connect(
    url,
    function(err, db) {
      if (err) throw err;
      var dbo = db.db("handyquiz");
      var question = req.body.post.oldQuestion; //question to be updated
      var serviceType = Object.keys(question)[0];
      var questionBody = Object.values(Object.values(question)[0])[0];
      var newValues = req.body.post.newQuestionBody; //new values of updated question object body
      var updateQuestion = constructNewQuestion(
        questionBody.questionIndex,
        newValues.questionText,
        serviceType,
        newValues.answers,
        newValues.answerText
      );
      dbo
        .collection("questions")
        .update(question, updateQuestion, function(err, result) {
          if (err) throw err;
          console.log("1 question updated");
          db.close();
        });
    }
  );
});

//Helper functinon to create question data.  See POST_BODY_TESTING_EXAMPLES to see how data is modeled.
constructNewQuestion = (
  questionIndex,
  questionText,
  serviceType,
  answers,
  answerText
) => {
  var qidx = "Q" + questionIndex;
  return {
    [serviceType]: {
      [qidx]: {
        questionIndex: questionIndex,
        questionText: questionText,
        answers: answers,
        answerText: answerText
      }
    }
  };
};