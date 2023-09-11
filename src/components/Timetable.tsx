import React from "react";
import {Lesson} from "../data/types/Lesson";
import {Checkbox} from "../structures/Checkbox";
import {AggregateDataTimetable} from "../data/aggregator";
import {LessonTask} from "../data/types/Task";
import {getWeekDates} from "../dateUtils";
import {start} from "repl";

const short_weekdays = [
	"",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri"
];
const full_weekdays = [
	"",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday"
]

const TimetableCheckbox = ({text, checked, onClick}: {text: string, checked: boolean, onClick: (e: React.MouseEvent<HTMLDivElement>) => void}) => (
	<div className={"cursor-pointer px-1"} onClick={onClick}>
		<Checkbox checked={checked} readOnly={true}/>
		<span className={"px-1"}>{text}</span>
	</div>
)

const TimetableLesson = ({lesson, onHomeworkToggled}: {lesson: Lesson, onHomeworkToggled: (subject_id: string, task_id: string, new_state: boolean) => void}) => {

	const categorised_tasks: { [category: string]: LessonTask[] } = {};

	lesson.tasks.forEach(task => {
		if(!categorised_tasks[task.category]) categorised_tasks[task.category] = []
		categorised_tasks[task.category].push(task)
	})

	return <>
		<div className={"flex justify-between"}>

			<div className={"flex-grow flex justify-between"}>

				<span className={"font-bold"}>
					{lesson.name}
				</span>

				<span className={"font-mono"}>
						{lesson.code}
				</span>

				<span className={"font-mono"}>
					{lesson.room}
				</span>

			</div>
			{/*<button className={"w-6 h-6 m-1 border"}>S</button>*/}
		</div>

		<div className={"px-1"}>
			{
				Object.keys(categorised_tasks).map(category => <>
						<div className={"font-semibold text-base"}>{category}</div>
						{
							categorised_tasks[category].map(task => <TimetableCheckbox text={task.title} checked={task.is_completed} onClick={e => {
								onHomeworkToggled(task.subject_id, task.id, !task.is_completed);
							}}/>)
						}
					</>
				)
			}
		</div>
	</>
}

const TimetableFree = () => {
	return<div className={"flex justify-between"}>
		{/*<div className={"text-lg"}>Free Period</div>*/}
	</div>
}

const TimetablePeriod = ({lesson, onHomeworkToggled}: {lesson: Lesson, onHomeworkToggled: (subject_id: string, homework_id: string, new_state: boolean) => void}) => {
	return (
		<div className={"border-black border p-1.5 align-top"}>
			{
				lesson.subject_id == "0" ? (<TimetableFree/>) : (<TimetableLesson lesson={lesson} onHomeworkToggled={onHomeworkToggled}/>)
			}
		</div>
	)
}

const TimetableDayIndiactor = ({weekday_index}: {weekday_index: number}) => {

	const short_weekday = short_weekdays[weekday_index]

	return (
		<div className={"border-black border p-1.5 align-top"}>
			<div className={"flex justify-between"}>
				<div className={"text-sm font-mono"}><b>{short_weekday}</b></div>
			</div>
		</div>
	)
}

const Timetable = ({weekIndex, timetable, onHomeworkToggled}: {weekIndex: number, timetable: AggregateDataTimetable, onHomeworkToggled: (subject_id: string, homework_id: string, new_state: boolean) => void}) => {
	const dates = getWeekDates(weekIndex);

	return (<>
		<div className={"flex px-1 py-2"}>
			<h3 className={"font-semibold text-xl"}>Timetable</h3>
				<span className={"text-xl flex-grow text-center"}>Monday {dates.start.getDate()}th - Friday {dates.end.getDate()}th</span>
			<div>
				{weekIndex}
			</div>
		</div>

		<div className={"grid grid-cols-[0fr_2fr_2fr_2fr_2fr_2fr] grid-rows-[0.65fr_0.65fr_0.65fr_0.65fr_0.65fr] border-black border"}>
			{
				(Object.keys(timetable) as unknown as Array<keyof typeof timetable>).map(weekday_index => <>
					{
						timetable[weekday_index].map(lesson => {
							if(lesson.name === "Tutor Time") {
								return <TimetableDayIndiactor weekday_index={weekday_index}/>
							}else{
								return <TimetablePeriod lesson={lesson} onHomeworkToggled={onHomeworkToggled}/>
							}
						})
					}
				</>)
			}
		</div>
	</>)
}

export default Timetable