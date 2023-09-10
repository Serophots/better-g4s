import React, {useEffect, useState} from 'react';
import AuthTokenInput from "./components/AuthTokenInput";
import {getCurrentWeekIndex} from "./dateUtils";
import useStickyState from "./hooks/useStickyState";
import Timetable from "./components/Timetable";
import {TreeView} from "./structures/TreeView";
import {aggregateRawData, fetchRawData, RawData} from "./data/aggregator";

const days = [
    "Jupiter",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
]

const App = () => {

    const [authToken, setAuthToken] = useStickyState("", "authToken");
    const [studentId, setStudentId] = useStickyState("", "studentId");

    const [weekIndex, setWeekIndex] = useState(getCurrentWeekIndex());


    const [rawData, setRawData] = useState<RawData>({
        homework: [],
        subjects: [],
        timetable: [],
    });
    const [savedData, setSavedData] = useStickyState(null, "savedData");
    const data = aggregateRawData(rawData, savedData);


    const refetch = async () => {
        const rawData = await fetchRawData(authToken, studentId, weekIndex)
        setRawData(rawData);
        console.log("rawData", rawData)
    };

    useEffect(() => {
        refetch()
    }, [])


    return (
        <div className={"bg-blue-500 w-full h-full p-16"}>

            <div className={"bg-white rounded-md shadow-xl h-full w-full p-4"}>

                <div className={"flex p-2"}>
                    <h1 className={"flex-grow text-3xl font-semibold text-center"}>Better Go4Schools</h1>

                    <AuthTokenInput studentId={studentId} setStudentId={async (studentId: string) => {
                        setStudentId(studentId)
                        await refetch()
                    }} authToken={authToken} setAuthToken={async (authToken: string) => {
                        setAuthToken(authToken);
                        await refetch()
                    }}/>
                </div>

                {/* Timetable */}
                <div className={"flex flex-row justify-center"}>
                    <div>
                        <Timetable weekIndex={weekIndex} timetable={data.timetable}/>
                    </div>
                </div>

                <div className={"flex flex-row justify-around"}>
                    {/* Upcoming */}
                    <div>
                        <div className={"flex"}>
                            <h3 className={"flex-grow font-semibold text-xl"}>Up coming</h3>

                            <div className={"flex"}>
                                <button>Today</button>
                                <button>This Week</button>
                                <button>This Fortnight</button>
                            </div>
                        </div>

                        <TreeView data={{
                            "Overdue Homework": [
                                "scary"
                            ],
                            "Physics": [
                                "A","B","C"
                            ],
                            "Maths": [
                                "A","B","C"
                            ],
                            "Further Maths": [
                                "A","B","C"
                            ]
                        }}/>

                    </div>

                    {/* Breakdown by subject */}
                    <div>
                        <div className={"flex"}>
                            <h3 className={"flex-grow font-semibold text-xl"}>Subject breakdown</h3>

                            <div className={"flex"}>
                                <button>Today</button>
                                <button>This Week</button>
                                <button>This Fortnight</button>
                            </div>
                        </div>


                        <TreeView data={{
                            "Physics": [
                                "A","B","C"
                            ],
                            "Maths": [
                                "A","B","C"
                            ],
                            "Further Maths": [
                                "A","B","C"
                            ]
                        }}/>

                    </div>
                </div>



            </div>
        </div>

    );
}

export default App;
