function padTo2Digits(num) {
  return num.toString().padStart(2, '0')
}

function formatMinutes(minutes) {
  let hours = Math.floor(minutes / 60)

  minutes = minutes % 60;

  return `${padTo2Digits(hours)}ч ${padTo2Digits(minutes)}мин`;
}

export default formatMinutes