import React, { useEffect, useReducer } from "react";
import { useHistory } from "react-router-dom";
import classes from "./homeStyles.module.scss"
import MealItem from "../MealItem/MealItem";
import Line from "../Line/Line"
import {reviewsAPI} from "../API/API"

const initialState = {
    reviews: null
}

function reducer(state, action) {
    switch (action.type) {
      case "addReviews":
        return {...state, reviews:[...action.reviews]};
      default:
        return state
    }
  }


const Home = () => {
    const history = useHistory();
    const [state,dispatch] = useReducer(reducer,initialState);
    useEffect(() => {
        (async function () {
            const response = await reviewsAPI.getReviews();
            dispatch({type:"addReviews",reviews:response})
        })()
    },[])
    const clickHandler = () => {
        history.push('/review')
    }

    return <div className = {classes.home}>
        <div className = {classes.home__container}>
            <div className = {classes.home__header}>
                <button onClick = {clickHandler}>Make Review</button>
            </div>
            <Line />
            <div className = {classes.home__reviews}>
                {state.reviews && state.reviews.map((el) => {
                    return <MealItem key = {el.id} review = {el}/>
                })}
            </div>
        </div>
    </div>
}


export default Home;