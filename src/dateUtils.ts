const getCurrentWeekIndex = () => {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), 0, 1);
    return Math.ceil( (Math.floor((currentDate.valueOf()-startDate.valueOf()) /  (24 * 60 * 60 * 1000))) / 7)
}

const getWeekDates = (weekNumber: number) => {
    const date = new Date(new Date().getFullYear(), 0, 1 + (weekNumber - 1) * 7);
    const startDate = new Date(date);
    const endDate = new Date(date);

    startDate.setDate(startDate.getDate() - startDate.getDay() + 1);
    endDate.setDate(endDate.getDate() - endDate.getDay() + 7);

    return {
        start: startDate,
        end: endDate,
    };
}

export {getCurrentWeekIndex, getWeekDates}