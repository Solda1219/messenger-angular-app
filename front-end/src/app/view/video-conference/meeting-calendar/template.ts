export const template = {
    milestone: function(schedule) {
        return '<span class="calendar-font-icon ic-milestone-b"></span> <span style="background-color: ' + schedule.bgColor + '">' + 'ddd'+ schedule.title + '</span>';
    },
}