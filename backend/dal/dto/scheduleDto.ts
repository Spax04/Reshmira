interface ScheduleCreateResponse {
  name: string,
  guards: [GuardObject]
  shifts: []
  guards_pre_position: number
  positions: []
  shift_time: number
}

interface GuardObject {
  _id:string
  fullName: string
}
