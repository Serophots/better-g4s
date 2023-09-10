import React from "react";

const Checkbox = ({checked, readOnly}: {checked?: boolean, readOnly?: boolean}) => (
	<input checked={checked} readOnly={readOnly} type={"checkbox"} value="" className={"w-3 h-3"}/>
)

export {Checkbox}