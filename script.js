/**
 * CSE 154 | Autumn 2019
 *
 * A program to fetch and display the Astronomy Picture of the Day from the NASA API.
 */
"use strict";
(function(){
  const URL = "https://api.nasa.gov/planetary/apod?";
  //get api key here: https://api.nasa.gov
  const API_KEY = "DEMO_KEY";

  window.addEventListener("load", init);

  /**
   * Initialize the ajax button to call the correct function when pressed.
   */
  function init() {
    id("apod-btn").addEventListener("click", fetchAPOD);
  }

  /**
   * Function to start the ajax fetch call to APOD API once the button is hit.
   * Upon success, shows the Astronomy Photo of the Day on the page.
   */
  function fetchAPOD() {
    // display loading text and disable button while ajax call is loading
    id("response-message").textContent = "Response Loading ...";
    id("response").innerHTML = "";
    id("apod-btn").disabled = true;
    let url = URL;
    // The APOD API requires one parameter: api_key
    url += "api_key=" + API_KEY;

    // The APOD API supports an optional date parameter
    // A valid date is 10 characters (YYYY-MM-DD)
    let dayInput = id("day-input");
    if (dayInput.value && dayInput.value.length === 10) {
      url += "&date=" + dayInput.value;
    }

    //start fetch call chain
    // TODO: insert Fetch call.
    fetch(url)
      .then(checkStatus)
      .then(resp => resp.json())
      .then(processApodJson)
      .catch(handleRequestError);
  }

  /*
  Sample JSON Response from url: https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY
  // get your own key from: https://api.nasa.gov
  {
    "copyright": "Josep M. DrudisDon Goldman",
    "date":"2019-10-30",
    "explanation": "The Great Nebula in Orion, an immense, nearby starbirth region, ...",
    "hdurl":"https://apod.nasa.gov/apod/image/1910/M42Detailed_DrudisGoldman_8150.jpg",
    "media_type": "image",
    "service_version": "v1",
    "title": "M42: Inside the Orion Nebula",
    "url":"https://apod.nasa.gov/apod/image/1910/M42Detailed_DrudisGoldman_960.jpg"
  }
  */
  function processApodJson(apodJson){
    //clear response box
    id("response-message").textContent = "Response";

    let title = gen("h2");
    title.textContent = apodJson.title;

    let image = gen("img");
    image.src = apodJson.url;
    image.alt = apodJson.title;

    let explanation = gen("p");
    explanation.textContent = apodJson.explanation;
    id("response").appendChild(title);
    id("response").appendChild(image);
    id("response").appendChild(explanation);

    if (apodJson.copyright) {
      let p = gen("p");
      p.textContent = "Copyright: " + apodJson.copyright;
      id("response").appendChild(p);
    }

    //re-enable button
    id("apod-btn").disabled = false;
  }

  /**
   * This function is called when an error occurs in the fetch call chain (e.g. the request
   * returns a non-200 error code, such as when the APOD service is down). Displays a user-friendly
   * error message on the page and re-enables teh APOD button.
   * @param {Error} err - the err details of the request.
   */
  function handleRequestError(err) {
    // ajax call failed! show error, place text, and re-enable the button
    let response = gen("p");
    let msg = "There was an error requesting data from the APOD service " +
              "(it's possible the DEMO_KEY rate limit is used up!) Please try again later.";
    response.textContent = msg;
    id("response").appendChild(response);
    id("response-message").textContent = "Response";
    id("apod-btn").disabled = false;
  }

  /* ------------------------------ Helper Functions  ------------------------------ */
  // Note: You may use these in your code, but do remember that your code should not have
  // any functions defined that are unused.

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  function gen(tagName) {
    return document.createElement(tagName);
  }

  function checkStatus(response) {
    if (response.ok) {
      return response;
    } else {
       throw Error("Error in request: " + response.statusText);
    }
  }

})();

