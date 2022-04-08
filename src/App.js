import logo from "./logo.svg";
import "./App.css";
import ReactDOM from 'react-dom';
//import { render } from "@testing-library/react";
//declaring global game variables
var questions=null,         /*pull of questions from api*/
    current_question_num,   /*pointing to the current question number in questions collection*/
    scores,                 /*score user gets during the game*/
    nickname,               /*user's nickname for registering the score*/
    difficulty,             /*difficulty of the game, help calculate scores for each question*/
    max_questions_in_game = 20;  //number of questions to retrieve for each game

//gets a number of questions and difficulty level (easy/medium/hard), returns JSON of questions
async function getTriviaFromApi(results_number, difficulty) {
  try {
    var response = await fetch(
      "https://opentdb.com/api.php?amount=" +
        results_number +
        "&difficulty=" +
        difficulty
    );
    var responseJson = await response.json()
    questions = responseJson.results;
    console.log("end api get");
    return "good";
  } catch (error) {
    console.error(error);
  }
}

async function createQuestionsPull()
{
  console.log("quetsions pull");
  current_question_num=0;
  let x=await getTriviaFromApi(max_questions_in_game, difficulty)
  .then(()=>{
    console.log(questions);
    console.log(current_question());
    next_question();
    console.log(current_question().category);
  });

  return 'done';
}

//sets the next question
function next_question(){
    if(current_question_num<questions.length-1)
      current_question_num++;
}
//returns question
function current_question(){
  return questions[current_question_num];
}
//initializing and runnig the game
function startGame() {
    //initializing game variables
    nickname = document.getElementById('nickname').value;
    difficulty = document.getElementById('difficulty').value;
    scores=0;
    createQuestionsPull().then(()=>{
      //after loading questions
      current_question_screen()
      
    });

}

//paints and run a cycle of question screen
function current_question_screen()
{
  console.log('question_screen');
  console.log(current_question());
  document.getElementById("current_screen").remove();
  this.render(
    <div align="center" className="question_screen" id="current_screen">
      <div className="question_container"><span id="question"></span></div>
      <button id="answer_1"></button>
      <button id="answer_2"></button>
      <button id="answer_3"></button>
      <button id="answer_4"></button>
      <br/>
      <button onClick={()=>{next_question();current_question_screen();}}>next question</button>
    </div>
  
    );
    //Using javaScript avoids React's showing html sign codes on user's interface
    document.getElementById("question").innerHTML = current_question().question;
    let correct_answer_place;
    if (current_question().type=='boolean') //for boolean type questions
    {
      if(current_question().correct_answer=='True')
        correct_answer_place = 1;
      else
        correct_answer_place = 2;      
      document.getElementById("answer_1").innerHTML = "True";
      document.getElementById("answer_2").innerHTML = "False";
      document.getElementById("answer_3").remove();
      document.getElementById("answer_4").remove();
    }
    else //for multiple questions
    {

      correct_answer_place = 1+Math.floor(Math.random() * 4); //randomize place of correct answer in buttons(between 1 and 4)
      let incorect_answer_loc=0; //incorrect answer location in incorrect_answers
      for(let i=1; i<=4;i++)
          if (correct_answer_place==i)
            document.getElementById("answer_"+i).innerHTML = current_question().correct_answer;
          else
            document.getElementById("answer_"+i).innerHTML = current_question().incorrect_answers[incorect_answer_loc++];
    }
    console.log(correct_answer_place);
}

function welcomeForm(){
    return (
        <div align="center" className="start_game_form" id="current_screen">
                <span className="main_logo_text">Triv-U</span>
                <br/>
                <label htmlFor="nickname">Nickname:</label>
                <br/>
                <input id="nickname" type="text" className="nickname" autocomplete="off"></input>
                <br/>
                <label htmlFor="difficulty">Game level:</label>
                <br/>
                <select id="difficulty" className="difficulty">
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
                <br/>
                <br/>
                <button onClick={startGame} className="button-19">Let's Start!</button>
        </div>
    );
}

function gameBoard(){
const divStyle={background:'white'};
    return (
        <div style={divStyle}>
            <div id="question" align="center">
                <p>Question</p>
            </div>
            <div id="answers" align="center">
                Answers
            </div>
        </div>
    );
}

function App() {
  return welcomeForm();
  //return gameBoard();
}

export default App;
