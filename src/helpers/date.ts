import moment from 'moment'

function today() {
  return moment().format('Y-MM-D')
}

export {
  today
}