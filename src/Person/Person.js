import React from "react"
const person = (props) => {
    return (
        <div>
            <p>Enter text here: <input type="text"/></p>
            <button color="danger" onClick={props.click}>Submit</button>
            <div>{props.name}</div>
        </div>
    )
}

export default person;