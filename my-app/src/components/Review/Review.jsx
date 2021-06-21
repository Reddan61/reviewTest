import React, { useEffect, useRef, useState } from "react"
import ReactDOM from 'react-dom'
import { Field, Form, Formik } from "formik";
import classes from "./review.module.scss"
import Input from "../Formik/Input/Input"
import StarRatings from 'react-star-ratings';
import { useHistory } from "react-router-dom";
import noImg from "../../assets/no_foto.jpg"
import TextArea from "../Formik/TeaxtArea/TextArea";
import * as Yup from 'yup';
import {reviewsAPI} from "../API/API"

const Review = () => {
    const [isOpen,setOpen] = useState(false)
    const [rating,setRating] = useState(0);
    const [imagesUrl,setImagesUrl] = useState(null);
    const [filesImages,setFilesImages] = useState(null);
    const history = useHistory();
    const ref = useRef(document.createElement('div'));
    function setImages(e,isDrop) {
        try{
            e.preventDefault()
            const extensions = ["image/jpg", "image/jpeg", "image/png"];
            const files = isDrop?e.dataTransfer.files:e.target.files;

            if(files.length > 3) {
                throw new Error("Вы можете передать только 3 картинки ")
            }
            [].forEach.call(files,el => {
                if(!extensions.includes(el.type)) {
                    throw new Error("Можно передать только картинки")
                }
            })
            setImagesUrl(null);
            setFilesImages(null);
            [].forEach.call(files,el => {
                const reader = new FileReader();
                reader.readAsDataURL(el);
                reader.onload = () => {
                    setImagesUrl(state => {
                        if(state) {
                            return [...state,reader.result]
                        } else {
                            return [reader.result]
                        }
                    })
                    
                }
                reader.onerror = function(){
                    throw new Error("Что-то пошло не так!")
                }
            })
            setFilesImages(files)
        }
        catch(e) {
            alert(e.message)
        }
    }
    useEffect(() => {
        document.body.appendChild(ref.current)
        setOpen(true)
        return () => {
            document.body.removeChild(ref.current)
        }
    },[])

    async function submit(values,{setErrors, setStatus, resetForm}) {
        if(!imagesUrl) {
            setStatus({image:"Required"})
            return
        }
        const payload = Object.assign({},values,{stars:rating})
        const response = await reviewsAPI.addReview(payload,filesImages);
        resetForm();
        setImagesUrl(null);
        setFilesImages(null);
        setRating(0)
    }
    return <>
        {isOpen && ReactDOM.createPortal(<div className = {classes.review}>
        <div className = {classes.review__container}>
            <div className = {classes.review__header}>
                <div className = {classes.review__close} onClick = {() => history.push('/')}></div>
            </div>
            <div className = {classes.review__title}>
                <span>Meal Review</span>
            </div>
            <div className = {classes.review__body}>
                <Formik
                    initialValues={{ title: '', text: "",username:"",accept:false }}
                    onSubmit={submit}
                    validationSchema = {formSchema}
                >
                    {({errors,touched,status}) => (
                        <Form className = {`${classes.review__form} ${classes.form}`}>
                            <div className = {`${classes.preview} ${touched.title && Boolean(errors.title) ? classes.preview_error :null}`}>
                                <div className = {classes.preview__image}>
                                    <img src = {imagesUrl?imagesUrl[0]:noImg} alt = {"image"} width = {200} height = {150}/>
                                </div>
                                <div className = {`${classes.preview__title}`} >
                                    <Field name = {"title"} component = {TextArea} placeholder = {"Meal name"} />
                                    {/* {touched.title && Boolean(errors.title) && (
                                        <span className = {classes.error__text}>{errors.title}</span>
                                    )} */}
                                </div>
                                <div className = {classes.preview__stars}>  
                                    <StarRatings
                                        starRatedColor="#F2AE04"
                                        rating={rating}
                                        changeRating={setRating}
                                        numberOfStars={5}
                                        starSpacing="3px"
                                        starEmptyColor = {"#BEC1C4"}
                                        starDimension = {"20px"}
                                    />
                                    <span>{rating}/5</span>
                                </div>
                            </div>
                            <div className = {`${classes.review__textarea} ${touched.text && Boolean(errors.text) ? classes.review__textarea_error :null}`}>
                                <Field className = {touched.text && Boolean(errors.text) ? classes.error__border :null}  name = {"text"} component = {TextArea} placeholder = {"Meal Summary Review"} />
                                {touched.text && Boolean(errors.text) && (
                                    <span className = {classes.error__text}>{errors.text}</span>
                                )}
                            </div>
                            <div className = {classes.drop}>
                                <div className = {classes.drop__title}>
                                    <span>Add the meal photos</span>
                                </div>
                                <div className = {`${classes.drop__area} ${status?.image && imagesUrl === null ? classes.drop__area_error:null}`} 
                                    onDragEnter = {(e) => e.preventDefault()}
                                    onDragOver = {(e) => e.preventDefault()}
                                    onDrop = {(e) => setImages(e,true)}>
                                    <div className = {classes.drop__content}>
                                        <input type="file" id = {"file-loader"} onChange = {(e) => setImages(e,false)} multiple style ={{display:'none'}}/>
                                        <label htmlFor="file-loader">
                                            <div className = {classes.drop__image}>
                                                <svg display = "none">
                                                    <symbol viewBox="0 0 384 384" id = "image-icon">
                                                        <g>
                                                            <g>
                                                                <path d="M341.333,0H42.667C19.093,0,0,19.093,0,42.667v298.667C0,364.907,19.093,384,42.667,384h298.667
                                                                    C364.907,384,384,364.907,384,341.333V42.667C384,19.093,364.907,0,341.333,0z M42.667,320l74.667-96l53.333,64.107L245.333,192
                                                                    l96,128H42.667z"/>
                                                            </g>
                                                        </g>
                                                    </symbol>
                                                </svg>
                                                <svg className = {classes.drop__icon}>
                                                    <use xlinkHref='#image-icon'></use>
                                                </svg>
                                            </div>
                                        </label>
                                        
                                        <div className = {classes.drop__text}>
                                            <span>or drop theme here</span>
                                        </div>
                                    </div>
                                    {imagesUrl &&<div className = {classes.drop__images}>
                                        {imagesUrl.map((el,index) => {
                                            return <img key = {index} width = {75} height = {75} src = {el} alt = {'alt'}/>
                                        })}
                                    </div>}
                                </div>
                            </div>
                            <div className = {`${classes.form__input} ${touched.username && Boolean(errors.username) ? classes.form__input_error :null}`}>
                                <fieldset>
                                    <legend>Your Nickname (other users will see this)</legend>
                                    <div>
                                        <Field  name = {"username"} type = {"text"} component = {Input} placeholder = {"Mike Korsky"}/>  
                                        <svg viewBox="0 0 512 512">
                                            <path d="m498.828125 76.84375-63.671875-63.675781c-8.488281-8.484375-19.792969-13.16406275-31.828125-13.167969-.007813 0-.011719 0-.019531 0-12.035156 0-23.332032 4.671875-31.8125 13.152344l-324.648438 324.644531c-2.660156 2.722656-3.753906 6.597656-4.542968 9.023437l-41.726563 146.046876c-1.496094 5.242187-.035156 10.882812 3.816406 14.734374 2.855469 2.855469 6.691407 4.398438 10.613281 4.398438 1.378907 0 2.765626-.1875 4.125-.578125l145.964844-41.703125c.433594-.125 6.882813-2.34375 9.105469-4.566406l324.644531-324.648438c8.488282-8.484375 13.15625-19.789062 13.152344-31.832031-.003906-12.035156-4.683594-23.339844-13.171875-31.828125zm-461.964844 398.292969 28.023438-98.078125 70.054687 70.054687zm126.726563-41.824219-84.902344-84.902344 260.953125-260.953125 84.902344 84.902344zm314.03125-314.03125-31.851563 31.855469-84.90625-84.90625 31.855469-31.851563c2.8125-2.8125 6.574219-4.359375 10.589844-4.359375h.007812c4.023438 0 7.792969 1.554688 10.613282 4.375l63.675781 63.675781c5.851562 5.851563 5.859375 15.367188.015625 21.210938zm0 0"/>
                                        </svg>
                                    </div>
                                </fieldset>
                                {touched.username && Boolean(errors.username) && (
                                    <span className = {classes.error__text}>{errors.username}</span>
                                )}
                            </div>
                            <div className = {`${classes.form__accept} ${touched.username && Boolean(errors.username) ? classes.form__input_error :null}`}>                                <div>
                                    <Field className = {touched.accept && Boolean(errors.accept) ? classes.error__border :null}  name = {"accept"} type = {"checkbox"} id = {"form-checkbox"}/>
                                    <label htmlFor="form-checkbox"></label>
                                    <span>
                                        I confirm that I have read and accepted <a href = {"#"}>Terms and Conditions</a> and <a href = {"#"}>Privacy Policy</a> 
                                    </span> 
                                </div>
                                {touched.accept && Boolean(errors.accept) && (
                                    <span className = {classes.error__text}>{errors.accept}</span>
                                )}
                            </div>
                            <div className = {classes.form__button}>
                                <button type = {"submit"}>Submit Review</button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    </div>,ref.current)}
     </>
}

const formSchema = Yup.object().shape({
    username: Yup.string()
        .min(2, "Too short!")
        .max(60, "Too long!")
        .required("Required"),
    title: Yup.string()
        .min(6, "Too short!")
        .max(70, "Too long!")
        .required("Required"),
    text: Yup.string()
        .min(6, "Too short!")
        .required("Required"),
    accept: Yup.boolean()
        .oneOf([true],'Must Accept Terms and Conditions')
})

export default Review;