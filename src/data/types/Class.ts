import {Homework} from "./Homework";

interface Class {
	name: string,
	code: string,
	id: string,

	homeworks: Homework[]
}
export type {Class}