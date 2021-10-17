const v = '2.0.1'
const scriptTag = document.querySelector("script[data-send-location]")
const sendLocation =  scriptTag.getAttribute('data-send-location')
function sendRef(ref, queryString, urlParams) {
  console.info('Sending: ' + ref)
  const body = {
    referrer: ref
  }
  fetch(sendLocation, {
    method: 'POST',
    body: JSON.stringify(body)
  })
  .then(response => response.json())
  .then(data => console.log('Data Pushed, DB Reference ID: ' + data.dbref));
  console.info('Sent Data')
  localStorage.setItem('lastRef', ref);
}
window.addEventListener('load', function () {
  console.info("RefTracker loading version: " + v)
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const ref = urlParams.get('ref')

  if (!ref)  {
    console.info('No referrer in URL.')
    return
  }
  if (localStorage.getItem('lastRef') == ref) {
    console.info('Duplicate referrer, not sending.')
    return
  }
  sendRef(ref, queryString, urlParams)

})
