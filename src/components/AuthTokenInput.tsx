import {TextInput} from "../structures/TextInput";
import React, {useState} from "react";
import internal from "stream";

const AuthTokenInput = ({authToken,  setAuthToken, studentId, setStudentId}: {authToken: string, setAuthToken: Function, studentId: string, setStudentId: Function}) => {
    const [internalAuthToken, setInternalAuthToken] = useState(authToken);
    const [internalStudentId, setInternalStudentId] = useState(studentId);

    return (
        <div>

            <TextInput placeholder={internalAuthToken} onChange={(e) => {
                e.preventDefault()

                setInternalAuthToken(e.target.value)
            }} onBlur={async (e) => {
                e.preventDefault()

                e.target.disabled = true;
                e.target.value = "";
                e.target.placeholder = "Fetching..."

                console.log("Saving auth token", internalAuthToken)
                await setAuthToken(internalAuthToken);


                e.target.disabled = false;
                e.target.placeholder = internalAuthToken
            }}/>

            <TextInput placeholder={internalStudentId} onChange={(e) => {
                e.preventDefault()

                setInternalStudentId(e.target.value)
            }} onBlur={async (e) => {
                e.preventDefault()

                e.target.disabled = true;
                e.target.value = "";
                e.target.placeholder = "Fetching..."

                console.log("Saving auth token", internalStudentId)
                await setStudentId(internalStudentId);

                e.target.disabled = false;
                e.target.placeholder = internalStudentId
            }}/>

        </div>
    )
}

export default AuthTokenInput