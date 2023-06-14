export default async function fetchJSON(url, callback) {
  fetch(url)
  .then(response => {
    // The response is a Response instance
    // You parse the data into a useable format using `.json()`
    return response.json()
  })
  .then(data =>  {
    // `data` is the parsed version of the JSON returned from the above endpoint
    callback(data)
  })
}