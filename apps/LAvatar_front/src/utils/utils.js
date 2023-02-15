export function convertMsToTime(milliseconds) {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);
    let months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    seconds = seconds % 60;
    minutes = minutes % 60;
    hours = hours % 24;
    days = days % 30;
    months = months % 12;
    const r = {};

    r['years'] = years;
    r['months'] = months;
    r['days'] = days;
    r['hours'] = hours;
    r['minutes'] = minutes;
    return r;
}
