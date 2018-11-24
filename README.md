## Hello
This app was made with React, Node.js, Express, and MongoDB.

## Requirements
This project uses Node v11.1.0 and yarn

## How to run
On the outermost directory, run `yarn` to install all node modules for ther server. This may take a few minutes. Then, `cd` into the client folder and run `yarn` to install all node modules for the client. This will also take a few minutes

`yarn dev` concurrently starts the client and server. It may take some seconds for the client server to start. A proxy is set up between the client (http://localhost:3000) to the server (http://localhost:5000) for GET and POST requests.

The quiz can be accessed on http://localhost:3000, while the administrative dashboard can be accessed on http://localhost:3000/admin.

## GET requests
GET requests can be viewed for the following in the browser or in Postman:

View Handyman questions: http://localhost:5000/api/getHandymanQuestions
View Homecleaning questions: http://localhost:5000/api/getHomecleaningQuestions
View all questions: http://localhost:5000/api/getAllQuestions
View candidates: http://localhost:5000/api/getCandidates

## Testing UI
UI:
-Chrome device toolbar to test for responsive layout for the Quiz
-All fields in the signup must be filled with a unique, valid email
-All questions must be answered in order to be submitted

## Tesing API:
(HANDY_QUIZ.postman_collection.json of my GET/POST tests can be imported if preferable)

GET requests can be viewed for the following in the browser or in Postman:

View Handyman questions: http://localhost:5000/api/getHandymanQuestions
View Homecleaning questions: http://localhost:5000/api/getHomecleaningQuestions
View all questions: http://localhost:5000/api/getAllQuestions
View candidates: http://localhost:5000/api/getCandidates

POST requests can be done in Postman, see POST_BODY_TESTING_EXAMPLES for the format of how to POST bodies (JSON). Functionality for adding a question and editing a question is currently implemented without a UI.

## Difficulties / Moving Forward
-Moving forward, extracting data from the database could be better optimized. I used MongoDb for the first time due to the quickness of the setup. However, the specific ways in which data is queried from MongoDb sometimes placed objects in arrays and made it difficult for me to extract data that I wanted, so in server.js there were a few convoluted ways to get the job done, e.g. `Object.values(Object.values(question)[0])[0]`,that I know can be improved.
-If a call to the API errors, implement a process for retrying the call.
-The admin dashboard only updates when refreshing the page. Could be improved to listen for any new candidates that are added to the database.
-Separate dashboard into Handyman and Homecleaning candidates
-Store candidate data in Redux such that API calls don't have to be made multiple times for getting questions, editing questions, and keeping track of question indexes/ids.