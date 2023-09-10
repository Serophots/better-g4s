import {Dispatch, SetStateAction, useEffect, useState} from "react";

export default function useStickyState<S>(initialState: S, key: string): [S, Dispatch<SetStateAction<S>>] {
	const [value, setValue] = useState<S>(() => {
		const stickyValue = window.localStorage.getItem(key);
		return stickyValue !== null ? JSON.parse(stickyValue) : initialState;
	});

	useEffect(() => {
		window.localStorage.setItem(key, JSON.stringify(value));
	}, [key, value]);

	return [value, setValue]
}