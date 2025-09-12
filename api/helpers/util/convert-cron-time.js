const { CronTime } = require('cron-time-generator');

module.exports = {


  friendlyName: 'Convert cron time',


  description: '',


  inputs: {
    data: {
      type: 'ref',
      required: true
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs, exits) {
    // TODO
    try {
      const { repeat } = _.get(inputs, 'data', {});
      const { every, onSpecific, between, cron } = repeat || {};
      if (cron) {
        return exits.success(cron);
      }
      let cronTime = '';
      if (every) {
        const { minute, hour, day, week, month, year, date, weekDay, weekend } = every || {};
        if (minute) {
          const nth = _.get(minute, 'nth', 0);
          if (nth) {
            cronTime = CronTime.every(nth).minutes();
          }
          else { cronTime = CronTime.everyMinute(); }
        }
        if (hour) {
          const nth = _.get(hour, 'nth', 0);
          const hourAt = _.get(hour, 'hourAt', 0);
          const even = _.get(hour, 'even', '');
          if (nth) {
            cronTime = CronTime.every(nth).hours();
          }
          else if (hourAt) {
            cronTime = CronTime.everyHourAt(at);
          }
          else if (even) {
            cronTime = CronTime.every(even).hours();
          }
          else { cronTime = CronTime.everyHour(); }
        }
        if (day) {
          const dayAt = _.get(day, 'dayAt', 0);
          const nth = _.get(day, 'nth', {});
          if (!_.isEmpty(nth)) {
            const { nthDay, at } = nth;
            const [hour, minute] = at.split(' ');
            if (at) {
              cronTime = CronTime.every(nthDay).days(hour, minute);
            }
            else { cronTime = CronTime.every(nthDay).days(); }
          }
          else if (dayAt) {
            const [hour, minute] = dayAt.split(' ');
            cronTime = CronTime.everyDayAt(hour, minute);
          }
          else { cronTime = CronTime.everyDay(); }
        }
        if (week) {
          const weekAt = _.get(week, 'weekAt', 0);
          if (weekAt) {
            const [day, hour, minute] = weekAt.split(' ');
            cronTime = CronTime.everyWeekOn(day, hour, minute);
          }
          else { cronTime = CronTime.everyWeek(); }
        }
        if (month) {
          const monthOn = _.get(month, 'monthOn', 0);
          if (monthOn) {
            const [day, hour, minute] = monthOn.split(' ');
            cronTime = CronTime.everyMonthOn(day, hour, minute);
          }
          else { cronTime = CronTime.everyMonth(); }
        }
        if (year) {
          const yearIn = _.get(year, 'yearIn', 0);
          if (yearIn) {
            const [month, day, hour, minute] = yearIn.split(' ');
            cronTime = CronTime.everyYearIn(month, day, hour, minute);
          }
          else { cronTime = CronTime.everyYear(); }
        }
        if (date) {
          const dayOfWeek = _.get(date, 'dayOfWeek', 0);
          const dateAt = _.get(date, 'dateAt', 0);
          let hour = '';
          let minute = '';
          if (dateAt) {
            [hour, minute] = dateAt.split(' ');
          }
          switch (dayOfWeek) {
            case 'sunday':
              if (dateAt) {
                cronTime = CronTime.everySundayAt(hour, minute);
              }
              else { cronTime = CronTime.everySunday(); }
              break;
            case 'monday':
              if (dateAt) {
                cronTime = CronTime.everyMondayAt(hour, minute);
              }
              else { cronTime = CronTime.everyMonday(); }
              break;
            case 'tuesday':
              if (dateAt) {
                cronTime = CronTime.everyTuesdayAt(hour, minute);
              }
              else { cronTime = CronTime.everyTuesday(); }
              break;
            case 'wednesday':
              if (dateAt) {
                cronTime = CronTime.everyWednesdayAt(hour, minute);
              }
              else { cronTime = CronTime.everyWednesday(); }
              break;
            case 'thursday':
              if (dateAt) {
                cronTime = CronTime.everyThursdayAt(hour, minute);
              }
              else { cronTime = CronTime.everyThursday(); }
              break;
            case 'friday':
              if (dateAt) {
                cronTime = CronTime.everyFridayAt(hour, minute);
              }
              else { cronTime = CronTime.everyFriday(); }
              break;
            case 'saturday':
              if (dateAt) {
                cronTime = CronTime.everySaturdayAt(hour, minute);
              }
              else { cronTime = CronTime.everySaturday(); }
              break;
          }
        }
        if (weekDay) {
          const weekDayAt = _.get(weekDay, 'weekDayAt', 0);
          if (weekDayAt) {
            const [hour, minute, startDay, endDay] = weekDayAt.split(' ');
            cronTime = CronTime.everyWeekDayAt(hour, minute, startDay, endDay);
          }
          else { cronTime = CronTime.everyWeekDay(); }
        }
        if (weekend) {
          const weekendAt = _.get(weekend, 'weekendAt', 0);
          if (weekendAt) {
            const [hour, minute, startDay, endDay] = weekendAt.split(' ');
            cronTime = CronTime.everyWeekendAt(hour, minute, startDay, endDay);
          }
          else { cronTime = CronTime.everyWeekend(); }
        }
      }
      else if (onSpecific) {
        const { days, time } = onSpecific;
        cronTime = CronTime.onSpecificDays(days, time);
      }
      else {
        const { start, end } = between || {};
        cronTime = CronTime.between(start, end);
      }
      return exits.success(cronTime);
    } catch (error) {
      /** Get code */
      const code = _.get(error, 'code') || 'G_ERROR';
      /** Get message from error */
      const message = _.get(error, 'message', 'Unknown error');
      /** Log */
      sails.log.error(`[H][U][C]: ${message}`);
      throw ({ code, message });
    }
  }


};

