import React, {useRef, useState} from 'react'
import classes from "./mealItem.module.scss"
import StarRatings from 'react-star-ratings';
import Line from "../Line/Line"
import { CSSTransition} from "react-transition-group";
import imageFake from "../../assets/no_foto.jpg"

const MealItem = ({review}) => {
    const [isOpen,setOpen] = useState(false);
    const [heightBody,setHeightBody] = useState(null);
    const ref = useRef(null)
    const {images,text,title,username,stars} = review;

    function calcHeight() {
        if(heightBody) {
            setHeightBody(null)
            return
        }
        setHeightBody(ref.current.offsetHeight)
    }
    return <div className = {classes.mealItem}>
        <div className = {classes.mealItem__container}>
            <div className = {classes.mealItem__header}>
                <div className = {classes.mealItem__initial}>
                    <div className = {classes.mealItem__image}>
                        <img src={images?`http://localhost:8888/${images[0]}`:imageFake} width = {"100%"} height = {"100%"} alt="image" />
                    </div>
                    <div className = {classes.mealItem__title}><span>{title}</span></div>
                    <div className = {classes.mealItem__stars}>
                        <StarRatings
                            rating={Math.trunc(stars)}
                            starRatedColor="#F2AE04"
                            numberOfStars={5}
                            starSpacing="3px"
                            starEmptyColor = {"#BEC1C4"}
                            starDimension = {"20px"}
                        />
                    </div>
             
                </div>
                <div className = {classes.mealItem__dots} onClick = {() => setOpen(!isOpen)}>
                    <span></span>
                </div>
            </div>
            <div className = {classes.mealItem__body} style = {{height:heightBody}}>
                <CSSTransition nodeRef = {ref} in={isOpen} timeout={500} unmountOnExit
                    onEnter = {calcHeight}
                    onExit = {calcHeight}
                >  
                    <div ref = {ref} style = {{width:"100%"}}>
                        <Line />
                        <div className = {classes.mealItem__content}>
                            <div className = {classes.mealItem__nickname}>
                                <span>{username}</span>
                            </div>
                            <div className = {classes.mealItem__text}>
                                <span>{text}</span>
                            </div>
                            <div className = {classes.mealItem__images}>
                                {images && images.map((el,index) => <img key = {index} width = {75} height = {75} src = {`http://localhost:8888/${el}`}/>)}
                            </div>
                        </div>
                    </div> 
                </CSSTransition>
            </div>
        </div>
    </div>
}


export default MealItem;