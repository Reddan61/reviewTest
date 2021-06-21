import React from 'react'

const Input = ({field,form,...custom}) => {

    return (
        <>
            <input {...field} {...custom}/>
        </>
    )
}

export default Input;