// Define the URL for the API endpoint
const mainUrlJS = "http://localhost:8000/api/v1/titles/"


// Function to fetch the best movie based on IMDb score and display its title, image, and description.
// When the user clicks on the button to view more details about the movie, a modal window pops up with additional information about the movie.
function fetchBestMovieJS() {

   // Get the elements from the HTML where the data will be displayed
   let bestTitleJS = document.getElementById('top-title_id');
   let bestImgJS = document.getElementsByClassName('best-cover_cl')[0].getElementsByTagName("img")[0];
   let bestDescriptionJS = document.getElementsByClassName('best-description_cl')[0];
   let bestButtonJS = document.getElementsByClassName('button_cl')[1];

   // Fetch the data from the API endpoint and update the elements in the HTML with the data
   fetch(mainUrlJS + "?sort_by=-imdb_score")
      .then(responseJS => responseJS.json())
      .then(dataJS => {
         bestTitleJS.innerHTML = dataJS["results"][0]["title"];
         bestImgJS.src = dataJS["results"][0]["image_url"];
         bestButtonJS.setAttribute("onclick", `openModalJS("${dataJS["results"][0]["id"]}")`)
         fetch(dataJS["results"][0]["url"])
            .then(responseJS => responseJS.json())
            .then(dataJS => {
               bestDescriptionJS.innerHTML = dataJS["description"];
            })
      })

}


// Function to control the modal window and display more information about a movie when the user clicks on the "View More" button
function openModalJS(id_JS) {

   // Get the elements from the HTML where the data will be displayed
   let modalJS = document.getElementById("modal_id");
   let spanJS = document.getElementsByClassName("close_cl")[0];

   // Fetch the data from the API endpoint and update the elements in the modal window with the data
   fetchModalDataJS(id_JS)

   // Show the modal window
   modalJS.style.display = "block";

   // When the user clicks on the "x" button to close the modal window, hide the window
   spanJS.onclick = function () {
      modalJS.style.display = "none";
   }

   // When the user clicks outside the modal window, hide the window
   window.onclick = function (event_JS) {
      if (event_JS.target === modal_cl)
         modalJS.style.display = "none";
   }
}

// Function to fetch more information about a movie with the given ID and update the content in the modal window.
function fetchModalDataJS(id_JS) {

   // Fetch the data for the movie with the given ID from the API endpoint
   fetch(mainUrlJS + id_JS)
      .then(responseJS => responseJS.json())
      .then(dataJS => {

         // Update the elements in the modal window with the data for the movie
         document.getElementById('modal-cover_id').src = dataJS["image_url"];
         document.getElementById('modal-title_id').innerHTML = dataJS["title"];

         document.getElementById('modal-year_id').innerHTML = dataJS["year"];
         document.getElementById('modal-duration_id').innerHTML = dataJS["duration"] + " min";
         document.getElementById('modal-genres_id').innerHTML = dataJS["genres"];
         document.getElementById('modal-imdb_id').innerHTML = dataJS["imdb_score"] + " / 10";

         document.getElementById('modal-directors_id').innerHTML = dataJS["directors"];
         document.getElementById('modal-cast_id').innerHTML = dataJS["actors"] + "...";
         document.getElementById('modal-country_id').innerHTML = dataJS["countries"];


         // This function checks if the 'rated' property in dataJS is a string, and if so, displays it in the modal.
         // Otherwise, it displays the value of the 'rated' property followed by a plus sign.
         if (typeof dataJS["rated"] === 'string' || dataJS["rated"] instanceof String)
            document.getElementById('modal-rating_id').innerHTML = dataJS["rated"];
         else
            document.getElementById('modal-rating_id').innerHTML = dataJS["rated"] + "+";

         // This code block sets the text in the modal's box office section to the worldwide gross income of the movie.
         // If the value of 'worldwide_gross_income' is null, it displays "N/A" instead.
         let modalBoxOfficeJS = document.getElementById('modal-box-office_id');
         if (dataJS["worldwide_gross_income"] == null)
            modalBoxOfficeJS.innerHTML = "N/A";
         else
            modalBoxOfficeJS.innerHTML = dataJS["worldwide_gross_income"] + " " + dataJS["budget_currency"];

         // This regular expression checks if the 'long_description' property in dataJS contains any letters.
         // If it does, the description is displayed in the modal. Otherwise, "N/A" is displayed.
         let regExpJS = /[a-zA-Z]/g;
         if (regExpJS.test(dataJS["long_description"]))
            document.getElementById('modal-description_id').innerHTML = dataJS["long_description"];
         else
            document.getElementById('modal-description_id').innerHTML = "N/A";
      })
}


// This function fetches movies in a given category, and returns an array of movie data.
// It takes three parameters: the category name, the number of movies to skip (for pagination), and the total number of movies to return.
async function fetchCategoriesJS(name_JS, skip_JS, total_JS = 7) {

   // This code block fetches the movie data from the API.
   const resultsJS = await fetch(mainUrlJS + "?sort_by=-imdb_score&genre=" + name_JS);

   // This code block checks if the API call was successful, and returns if not.
   if (!resultsJS.ok)
      return
   // This code block converts the API response to JSON format.
   const dataJS = await resultsJS.json();
   // This code block converts the 'results' property in the dataJS object to an array.
   let moviesDataJS = Array(...dataJS.results);

   // This code block removes movies from the beginning of the array based on the value of 'skip_JS'.
   if (skip_JS > 0)
      moviesDataJS.splice(0, skip_JS);

   // This code block adds more movies to the array if there are not enough.
   if (moviesDataJS.length < total_JS) {
      let results2JS = await (await fetch(dataJS.next)).json();
      moviesDataJS.push(...Array(...results2JS.results).slice(0, total_JS - moviesDataJS.length));
   }

   // This function returns the array of movie data.
   return moviesDataJS;
}

// This function moves the movie carousel to the left.
function moveCarouselLeftJS(category_JS) {

   // This code block selects the carousel and its left and right buttons.
   let carrouselContentJS = document.querySelector("#" + category_JS + "-movies");
   let carrouselLeftButtonJS = document.querySelector("#" + category_JS + "-left");
   let carrouselRightButtonJS = document.querySelector("#" + category_JS + "-right");

   // This line sets the left style property of the carousel content to -680px, effectively moving it to the left.
   carrouselContentJS.style.left = "-680px";

   // This line removes the "showing" class from the right arrow button, hiding it from the user.
   carrouselRightButtonJS.classList.remove("showing");
   // This line adds the "showing" class to the left arrow button, making it visible to the user.
   carrouselLeftButtonJS.classList.add("showing");
}

// This function moves the carousel to the right to show more movies.
function moveCarouselRightJS(category_JS) {

   // This code block selects the carousel and its left and right buttons using the category_JS parameter.
   let carrouselContentJS = document.querySelector("#" + category_JS + "-movies");
   let carrouselLeftButtonJS = document.querySelector("#" + category_JS + "-left");
   let carrouselRightButtonJS = document.querySelector("#" + category_JS + "-right");

   // This line sets the left style property of the carousel content to 0px, effectively moving it to the right.
   carrouselContentJS.style.left = "0px";

   // This line adds the "showing" class to the right arrow button, making it visible to the user.
   carrouselRightButtonJS.classList.add("showing");

   // This line removes the "showing" class from the left arrow button, hiding it from the user.
   carrouselLeftButtonJS.classList.remove("showing");
}

// This function builds a carousel for the given category and appends it to the DOM (Document Object Model).
// It accepts three parameters: the category name, the category ID, and the number of movies to skip (for pagination)
async function buildCarouselJS(category_JS, name_JS, skip_JS = 0) {

   // If the category name is "best_cl", we set the categoryNameJS variable to an empty string, otherwise we set it to the same value as name_JS.
   let categoryNameJS = name_JS;
   if (name_JS === "best_cl")
      categoryNameJS = "";

   // Create a new section element and add the "categories_cl" class to it.
   const sectionJS = document.createElement("section")
   sectionJS.classList.add("categories_cl")

   // Create a new div element and add the "container_cl" class to it.
   const carouselJS = document.createElement('div');
   carouselJS.classList.add('container_cl');

   // Create a new h2 element and set its innerHTML to the category name.
   const categoryTitleJS = document.createElement('h2');
   categoryTitleJS.innerHTML = `${category_JS} movies`;
   carouselJS.append(categoryTitleJS);

   // Create a new div element and add the "carousel-container_cl" class to it.
   const carouselContainerJS = document.createElement('div');
   carouselContainerJS.classList.add('carousel-container_cl');

   // Create a div to hold the movies in the carousel
   const carouselContentJS = document.createElement('div');
   carouselContentJS.classList.add('carousel-content_cl');
   carouselContentJS.setAttribute("id", `${name_JS}-movies`)

   // Append the section to the webpage
   document.querySelector('.carousels_cl').appendChild(sectionJS);

   // Fetch the movies to display in the carousel
   const moviesJS = await fetchCategoriesJS(categoryNameJS, skip_JS);

   // Loop through the movies and create a box element for each one
   let j = 0;
   for (const movieJS of moviesJS) {
      // Create a box to hold the movie
      const boxJS = document.createElement('div');
      boxJS.classList.add("box_cl");
      boxJS.setAttribute("id", `${categoryNameJS}${j + 1}`);

      // Create an image element for the movie cover
      const movieCoverJS = document.createElement("img");
      movieCoverJS.setAttribute("alt", movieJS.title);
      movieCoverJS.src = movieJS.image_url;
      boxJS.appendChild(movieCoverJS);

      // Create an overlay for the box
      const overlayJS = document.createElement("div");
      overlayJS.classList.add("overlay_cl");

      // Create a title element for the movie
      const movieTitleJS = document.createElement("p");
      movieTitleJS.innerHTML = movieJS.title;
      overlayJS.appendChild(movieTitleJS);

      // Create a button to display more information about the movie
      const playButtonJS = document.createElement("button");
      playButtonJS.classList.add("overlay-button_cl");
      playButtonJS.innerHTML = '<i class="bi_cl bi-play-fill_cl"></i> Play';
      overlayJS.appendChild(playButtonJS);

      const modalButtonJS = document.createElement("button");
      modalButtonJS.classList.add("overlay-button_cl");
      modalButtonJS.setAttribute("onclick", `openModalJS("${movieJS.id}")`);
      modalButtonJS.innerHTML = "More info";
      overlayJS.appendChild(modalButtonJS);

      // Add the overlay to the box
      boxJS.appendChild(overlayJS);
      // Add the box to the carousel content
      carouselContentJS.appendChild(boxJS);

      // Increment the counter for the movie box id
      j++;
   }

   // Create controls for the carousel
   const controlsJS = document.createElement("div");
   controlsJS.classList.add("controls_cl");
   // Create a button to move the carousel left
   const leftButtonJS = document.createElement('button');
   // Add classes to the left button
   leftButtonJS.classList.add('button-added_cl');
   leftButtonJS.classList.add('left-corner');
   // Set an aria-label for accessibility
   leftButtonJS.setAttribute('aria-label', `${name_JS} slide left`);
   // Set an id for the left button
   leftButtonJS.setAttribute('id', `${name_JS}-left`);
   // Set the onclick function for the left button
   leftButtonJS.setAttribute('onclick', `moveCarouselRightJS("${name_JS}")`);
   // Add a chevron icon to the left button

   leftButtonJS.innerHTML = '<i class="bi_cl bi-chevron-left"></i>';
   controlsJS.appendChild(leftButtonJS);

   // Create a button to move the carousel right
   const rightButtonJS = document.createElement('button');
   // Add classes to the right button
   rightButtonJS.classList.add('button-added_cl');
   rightButtonJS.classList.add('right-corner');
   rightButtonJS.classList.add('showing');
   // Set an id for the right button
   rightButtonJS.setAttribute('id', `${name_JS}-right`);
   // Set an aria-label for accessibility
   rightButtonJS.setAttribute('aria-label', `${name_JS} slide right`);
   // Set the onclick function for the right button
   rightButtonJS.setAttribute('onclick', `moveCarouselLeftJS("${name_JS}")`);
   // Add a chevron icon to the right button
   rightButtonJS.innerHTML = '<i class="bi_cl bi-chevron-right"></i>';
   controlsJS.appendChild(rightButtonJS);

   // Append carousel content and controls to carousel container
   carouselContainerJS.appendChild(carouselContentJS);
   carouselContainerJS.appendChild(controlsJS);

   // Append carousel container to carousel
   carouselJS.appendChild(carouselContainerJS);
   // Append carousel to section
   sectionJS.appendChild(carouselJS);
}

// When the window loads, build four carousels with different categories and fetch the best movie
window.addEventListener('load', () => {
   buildCarouselJS("Best rated", "best_cl", 1);
   buildCarouselJS("History", "history");
   buildCarouselJS("Romance", "romance");
   buildCarouselJS("Horror", "horror");

   fetchBestMovieJS()
});