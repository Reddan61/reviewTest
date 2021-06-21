import React from "react"


const TextArea = ({field,form, ...custom}) => {
    return (
        <>
            <textarea {...field} {...custom}></textarea>
        </>
    )
}

export default TextArea;