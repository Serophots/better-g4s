import React, {ChangeEventHandler, FocusEventHandler} from "react";

const TextInput = ({onChange, onBlur, placeholder}: {onChange?: ChangeEventHandler<HTMLInputElement>, onBlur?: FocusEventHandler<HTMLInputElement>, placeholder: string}) => (
    <input className={"relative rounded-md pl-2 shadow-md border-2 border-gray-300 outline-blue-500"} inputMode={"text"} placeholder={placeholder} onChange={onChange} onBlur={onBlur} />
)

export {TextInput}