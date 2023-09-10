import React, {ChangeEventHandler, FocusEventHandler} from "react";

const TextField = ({onChange, onBlur, placeholder}: {onChange?: ChangeEventHandler<HTMLInputElement>, onBlur?: FocusEventHandler<HTMLInputElement>, placeholder: string}) => (
    <input className={"bg-gray-100 border-2 border-gray-300 text-gray-900 text-sm rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 p-1.5"} inputMode={"text"} placeholder={placeholder} onChange={onChange} onBlur={onBlur} />
)

export {TextField}