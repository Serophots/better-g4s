import React from "react";
import {Lesson} from "../data/types/Lesson";
import {Homework} from "../data/types/Homework";
import {Checkbox} from "../structures/Checkbox";

const chunkArray = (array: any[], chunker: number) => {
	let ret = []

	for(let i = 0; i < array.length; i += chunker) {
		ret.push(array.slice(i, i + chunker))
	}

	return ret
}

const TimetableCheckbox = ({text, checked, onClick}: {text: string, checked: boolean, onClick: (e: React.MouseEvent<HTMLDivElement>) => void}) => (
	<div className={"cursor-pointer px-1"} onClick={onClick}>
		<Checkbox checked={checked} readOnly={true}/>
		<span className={"px-1"}>{text}</span>
	</div>
)

const TimetableLesson = ({lesson, onHomeworkToggled}: {lesson: Lesson, onHomeworkToggled: (subject_id: string, homework_id: string, new_state: boolean) => void}) => (<>
	{
		lesson.homeworks_due.length > 0 && (<>
			<div className={"font-semibold text-base"}>Homework Due</div>

			{
				lesson.homeworks_due.map((homework) => <TimetableCheckbox text={homework.title} checked={homework.is_completed} onClick={e => {
					onHomeworkToggled(homework.subject_id, homework.id, !homework.is_completed);
				}}/>)
			}

		</>)
	}

	{
		lesson.homeworks_set.length > 0 && (<>
			<div className={"font-semibold text-base"}>Homework Set</div>

			{
				lesson.homeworks_set.map((homework) => <TimetableCheckbox text={homework.title} checked={homework.is_completed} onClick={e => {
					onHomeworkToggled(homework.subject_id, homework.id, !homework.is_completed);
				}}/>)
			}
		</>)
	}

	{
		lesson.lesson_tasks.length > 0 && (<>
			{
				(lesson.homeworks_set.length > 0 || lesson.homeworks_due.length > 0) && (
					<div className={"font-semibold text-base"}>Tasks</div>
				)
			}

			{
				lesson.lesson_tasks.map((homework) => <TimetableCheckbox text={homework.title} checked={homework.is_completed} onClick={e => {
					onHomeworkToggled(homework.subject_id, homework.id, !homework.is_completed);
				}}/>)
			}
		</>)
	}

</>)

const TimetableFree = ({lesson}: {lesson: Lesson}) => (<></>)


const TimetablePeriod = ({lesson, onHomeworkToggled}: {lesson: Lesson, onHomeworkToggled: (subject_id: string, homework_id: string, new_state: boolean) => void}) => {
	return (
		<td className={"border-black border p-1.5 align-top"}>
			<div className={"flex justify-between"}>
				<div className={"text-lg"}><b>{lesson.name}</b>{lesson.code ? (` - ${lesson.code}`) : ("")}</div>
				<button className={"w-6 h-6 m-1 border"}>S</button>
			</div>

			<div className={"px-1"}>
				{
					(lesson.subject_id == "0") ? (<TimetableFree key={lesson.date.toString()+"free"} lesson={lesson}/>) : (<TimetableLesson key={lesson.date.toString()+lesson.id} lesson={lesson} onHomeworkToggled={onHomeworkToggled}/>)
				}
			</div>
		</td>
	)
}

const Timetable = ({weekIndex, timetable, onHomeworkToggled}: {weekIndex: number, timetable: Lesson[], onHomeworkToggled: (subject_id: string, homework_id: string, new_state: boolean) => void}) => {
	return (<>
		<div className={"flex px-1 py-2"}>
			<h3 className={"font-semibold text-xl"}>Timetable</h3>
			<span className={"text-xl flex-grow text-center"}>Monday 10th - Friday 15th</span>
			<div>
				{weekIndex}
			</div>
		</div>

		<table className={"border-black border-2 text-sm"}>
			<tbody>
			{/*TODO: Subject colour coding to stand out*/}

			{
				chunkArray(timetable, 6).map((dayOfLessons: Lesson[], i) => (
					<tr key={i}>
						{
							dayOfLessons.map((lesson, i) => {
								if(lesson.name === "Tutor Time") return <></>
								return <TimetablePeriod key={i.toString() + lesson.date.toString()} lesson={lesson} onHomeworkToggled={onHomeworkToggled}/>
							})
						}
					</tr>
				))
			}
			</tbody>
		</table>
	</>)
}

export default Timetable