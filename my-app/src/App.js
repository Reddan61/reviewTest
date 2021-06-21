import React from 'react';
import {Switch,Route,Redirect} from "react-router-dom";
import Home from "./components/Home/Home"
import Review from "./components/Review/Review"
import classes from './App.module.scss';

function App() {
  return (
    <div className = {classes.root}>
      <div className = {classes.root__container}>
        <Switch>
          <Route path = {"/"} exact render = {() => <Home />}/>
          <Route path = {"/review"} exact render = {() => <Review />}/>
          <Route render={() => <Redirect to={'/'} />} />
        </Switch>
      </div> 
    </div>
  );
}

export default App;
