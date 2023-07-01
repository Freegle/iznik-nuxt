export const EMAIL_REGEX = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/
export const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g
export const SUBJECT_REGEX = /(.*?):([^)].*)\((.*)\)/

// These are the most common words in UK addresses.
export const ADDRESS_WORDS = [
  'house',
  'flat',
  'road',
  'close',
  'lane',
  'drive',
  'avenue',
  'street',
  'way',
  'court',
  'place',
  'gardens',
  'crescent',
  'park',
  'grove',
  'terrace'
]

export const DAY_WORDS = [
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat',
  'sun',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
  'today',
  'tomorrow',
  'this afternoon',
  'this evening',
  'tonight'
]

export const MAX_MAP_ZOOM = 14
