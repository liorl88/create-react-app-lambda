import logo from "./logo.svg";
import "./App.css";
import "./pyro/pyro.css";
import  * as t from './countdown_timer/countdown.js';
//import ReactDOM from 'react-dom';
import * as ReactDOM from 'react-dom';
//import { render } from "@testing-library/react";
import React from "react";
//declaring global game variables
var questions=null,         /*pull of questions from api*/
    current_question_num=0,   /*pointing to the current question number in questions collection*/
    total_scores,                 /*score user gets during the game*/
    nickname,               /*user's nickname for registering the score*/
    difficulty,             /*difficulty of the game, help calculate scores for each question*/
    max_questions_in_game = 10;  //number of questions to retrieve for each game

const CORRECT_ANSWER_POINTS = 10;
var SECONDS_FOR_EACH_ANSWER = 10;
      const root = document.getElementById('root');
//-------------------------------------------------------------------


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
    total_scores=0;
    createQuestionsPull().then(()=>{
      //after loading questions
      current_question_screen()
      
    });

}


//paints and run a cycle of question screen
export function current_question_screen()
{
  let choosen_answer = 0;
  let correct_answer_place;

  //this calculates the score and shows answer on screen
  function end_round(){
    //score update and calculation
    if (choosen_answer==correct_answer_place) //In case choosen answer is correct
      {
        total_scores +=CORRECT_ANSWER_POINTS;
        document.getElementById("answer_"+choosen_answer).style.background = 'green';
      }
    else
    {
      if (choosen_answer!=0)
      {
        document.getElementById("answer_"+choosen_answer).style.background = 'red';
      }
      document.getElementById("answer_"+correct_answer_place).setAttribute("style","background-color: #6bff7a;border-style: solid;border-width:thick;border-color:black");
    }
    next_question();
    setTimeout(()=>{if(current_question_num+1==max_questions_in_game) finish_game_screen(); else current_question_screen()}, 3000);


  }

  function choose_answer(answer){
    choosen_answer = answer;
    console.log("Choosen answer is:"+choosen_answer);
    //set choosen answer highlighted
    let buttons = document.getElementById("answers_container").children;
    for (let i = 1; i <= buttons.length; i++) {
      if (i !=choosen_answer) 
        document.getElementById("answer_"+i).style.background='';
      else
        document.getElementById("answer_"+i).style.background='yellow';
    }
  }

  console.log('question_screen');
  console.log(current_question());
  ReactDOM.unmountComponentAtNode(document.getElementById('root'));
  ReactDOM.render(
    <div align="center" className="question_screen" id="current_screen">
    <span className="main_logo_text">Triv-U</span>
    <div id="countdown_timer" style={{padding:'10px'}}></div>
    <div className="question_container"><span id="question"></span></div>
    <br/>
    <div id="answers_container">
      <button id="answer_1" className="answer_button" onClick={()=>choose_answer(1)}></button>
      <button id="answer_2" className="answer_button" onClick={()=>choose_answer(2)}></button>
        <button id="answer_3" className="answer_button" onClick={()=>choose_answer(3)}></button>
        <button id="answer_4" className="answer_button" onClick={()=>choose_answer(4)}></button>
    </div>
    <br/>
    <div id="score" className="score_status" style={{padding:'20px'}}>Player: {nickname} | Question: {current_question_num+1}/{max_questions_in_game} | Score: {total_scores}</div>
    <button onClick={()=>{document.location.reload();}} className="button-19">Exit game</button>
    </div>, root);

    //Using javaScript avoids React's showing html sign codes on user's interface
    document.getElementById("question").innerHTML = current_question().question;

    if (current_question().type=='boolean') //for boolean type questions
    {
      if(current_question().correct_answer=='True')
        correct_answer_place = 1;
      else
        correct_answer_place = 2;      
      document.getElementById("answer_1").innerHTML = "True";
      document.getElementById("answer_2").innerHTML = "False";
      ReactDOM.unmountComponentAtNode(document.getElementById("answer_3"));
      ReactDOM.unmountComponentAtNode(document.getElementById("answer_4"));
      document.getElementById("answer_3").remove();
      document.getElementById("answer_4").remove();
    }
    else //for multiple questions
    {

      correct_answer_place = 1+Math.floor(Math.random() * 4); //randomize place of correct answer in buttons(between 1 and 4)
      let incorect_answer_loc=0; //incorrect answer pointer in incorrect answers
      for(let i=1; i<=4;i++)
          if (correct_answer_place==i)
            document.getElementById("answer_"+i).innerHTML = current_question().correct_answer;
          else
            document.getElementById("answer_"+i).innerHTML = current_question().incorrect_answers[incorect_answer_loc++];
    }
    console.log(correct_answer_place);
    console.log(current_question().correct_answer);
    t.timerReset();
    t.paint_timer();
    t.startTimer();
    //wait for the countdown timer to end the round
    document.getElementById("countdown_timer").addEventListener("timesUp", (event) => {
      end_round();
    });
}

//for showing game screen
function finish_game_screen()
{
  ReactDOM.unmountComponentAtNode(document.getElementById('root'));
  ReactDOM.render(
    <div align="center" className="finish_game" id="current_screen">
      <div className="pyro">
        <div className="before"></div>
          <br/>
          <div className="finish_frame"><h1>Congratulations {nickname}!</h1>
          <h2>Game's score is:</h2>
          <h1>{total_scores}</h1>
          <img src="images/clapping_hands.gif" alt="clapping hands" width="150px" />
          </div><br/>
          <button onClick={()=>{document.location.reload();}} className="button-19">Reload a new game!</button>
      <div className="after"></div>
      </div>
      </div>
      ,root);
}
//first welcome form to show
function welcomeForm(){
    t.set_countdown_time(SECONDS_FOR_EACH_ANSWER);
    return (
        <div align="center" className="start_game_form" id="current_screen">
                <span className="main_logo_text">Triv-U</span>
                <br/>
                <label htmlFor="nickname">Nickname:</label>
                <br/>
                <input id="nickname" type="text" className="nickname" autoComplete="off" required></input>
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

class App extends React.Component {
  render() {
    return (
      welcomeForm()
    );
  }
}


export default App;
