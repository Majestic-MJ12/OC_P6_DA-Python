const Url = "http://localhost:8000/api/v1/titles/"


// Best movie part

function fetchTheBestMovie() {

   let theBestTitle = document.getElementById('best-best-top-title');
   let the_BestImage = document.getElementsByClassName('best_best_cover')[0].getElementsByTagName("img")[0];
   let theBestDescription = document.getElementsByClassName('best_best_description')[0];
   let theBestButton = document.getElementsByClassName('best_best_button')[1];

   fetch(Url + "?sort_by=-imdb_score")
      .then(response => response.json())
      .then(data => {
         theBestTitle.innerHTML = data["results"][0]["title"];
         theBestImage.src = data["results"][0]["image_url"];
         theBestButton.setAttribute("onclick", `openTheModal("${data["results"][0]["id"]}")`)
         fetch(data["results"][0]["url"])
            .then(response => response.json())
            .then(data => {
               theBestDescription.innerHTML = data["description"];
            })
      })

}

// Modal control

function openTheModal(id) {

   let theModal = document.getElementById("modal-modal");
   let theSpan = document.getElementsByClassName("modal_modal_close")[0];

   fetchTheModalData(id)

   theModal.style.display = "block";

   theSpan.onclick = function () {
      theModal.style.display = "none";
   }

   window.onclick = function (events) {
      if (events.target === theModal)
         theModal.style.display = "none";
   }
}

function fetchTheModalData(id) {

   fetch(Url + id)
      .then(response => response.json())
      .then(data => {

         document.getElementById('modal-modal-cover').src = data["image_url"];
         document.getElementById('modal-modal-title').innerHTML = data["title"];

         document.getElementById('modal-modal-year').innerHTML = data["year"];
         document.getElementById('modal-modal-duration').innerHTML = data["duration"] + " min";
         document.getElementById('modal-modal-genres').innerHTML = data["genres"];
         document.getElementById('modal-modal-imdb').innerHTML = data["imdb_score"] + " / 10";

         document.getElementById('modal-modal-directors').innerHTML = data["directors"];
         document.getElementById('modal-modal-cast').innerHTML = data["actors"] + "...";
         document.getElementById('modal-modal-country').innerHTML = data["countries"];


         if (typeof data["rated"] === 'string' || data["rated"] instanceof String)
            document.getElementById('modal-modal-rating').innerHTML = data["rated"];
         else
            document.getElementById('modal-modal-rating').innerHTML = data["rated"] + "+";

         let theModalBoxOffice = document.getElementById('modal-modal-box-office');
         if (data["worldwide_gross_income"] == null)
            theModalBoxOffice.innerHTML = "N/A"; // placeholder for unspecified box-office
         else
            theModalBoxOffice.innerHTML = data["worldwide_gross_income"] + " " + data["budget_currency"];

         let reExp = /[a-zA-Z]/g;
         if (reExp.test(data["long_description"]))
            document.getElementById('modal-modal-description').innerHTML = data["long_description"];
         else
            document.getElementById('modal-modal-description').innerHTML = "N/A";

      })
}

// Categories

async function fetchTheCategories(names, skipping, theTotal = 7) {

   const theResults = await fetch(Url + "?sort_by=-imdb_score&genre=" + names);

   if (!theResults.ok)
      return
   const theData = await theResults.json();
   let theMoviesData = Array(...theData.theResults);

   if (skip_it > 0)
      theMoviesData.splice(0, skip_it);

   if (theMoviesData.length < theTotal) {
      let theResults2 = await (await fetch(theData.next)).json();
      theMoviesData.push(...Array(...theResults2.theResults).slice(0, theTotal - theMoviesData.length));
   }

   return theMoviesData;
}

// The carousel controls part

function movingTheCarouselOnLeft(categories) {

   let theCarrouselContent = document.querySelector("#" + categories + "-movies");
   let theCarrouselLeftButton = document.querySelector("#" + categories + "-left");
   let theCarrouselRightButton = document.querySelector("#" + categories + "-right");

   theCarrouselContent.style.left = "-680px";
   theCarrouselRightButton.classList.remove("showing");
   theCarrouselLeftButton.classList.add("showing");
}

function moveTheCarouselOnRight(categories) {

   let theCarrouselContent = document.querySelector("#" + categories + "-movies");
   let theCarrouselLeftButton = document.querySelector("#" + categories + "-left");
   let theCarrouselRightButton = document.querySelector("#" + categories + "-right");

   theCarrouselContent.style.left = "0px";
   theCarrouselRightButton.classList.add("showing");
   theCarrouselLeftButton.classList.remove("showing");
}

async function buildTheCarousel(categories, names, skipping = 0) {

   let categoryName = names;
   if (names === "best")
      categoryName = "";

   const theSection = document.createElement("section")
   theSection.classList.add("categories_categories")

   const theCarousel = document.createElement('div');
   theCarousel.classList.add('categories_categories_container');

   const theCategoryTitle = document.createElement('h2');
   theCategoryTitle.innerHTML = `${categories} movies`;
   theCarousel.append(theCategoryTitle);

   const theCarouselContainer = document.createElement('div');
   theCarouselContainer.classList.add('categories_categories_carousel_container');

   const theCarouselContent = document.createElement('div');
   theCarouselContent.classList.add('categories_categories_carousel_content');
   theCarouselContent.setAttribute("id", `${names}-movies`)

   document.querySelector('.carousels').appendChild(section);

   const theMovies = await fetchTheCategories(names, skipping);

   let j = 0;
   for (const theMovie of theMovies) {
      const theBox = document.createElement('div');
      theBox.classList.add("categories_categories_box");
      theBox.setAttribute("id", `${categoryName}${j + 1}`);

      const theMovieCover = document.createElement("img");
      theMovieCover.setAttribute("alt", movie.title);
      theMovieCover.src = movie.image_url;
      theBox.appendChild(theMovieCover);

      const theOverlay = document.createElement("div");
      theOverlay.classList.add("categories_categories_overlay");

      const theMovieTitle = document.createElement("p");
      theMovieTitle .innerHTML = movie.title;
      theOverlay.appendChild(theMovieTitle);

      const playingButton = document.createElement("button");
      playingButton.classList.add("categories_categories_overlay_button");
      playingButton.innerHTML = '<i class="modal_modal_bi modal_modal_bi-play-fill"></i> Play';
      theOverlay.appendChild(playingButton);

      const theModalButton = document.createElement("button");
      theModalButton.classList.add("overlay_overlay_button");
      theModalButton.setAttribute("onclick", `openModal("${movie.id}")`);
      theModalButton.innerHTML = "+++";
      theOverlay.appendChild(modalButton);

      theBox.appendChild(theOverlay);
      theCarouselContent.appendChild(theBox);

      j++;
   }

   const theControls = document.createElement("div");
   theControls.classList.add("categories_categories__controls");

   const theLeftButton = document.createElement('button');
   theLeftButton.classList.add('categories_categories_button');
   theLeftButton.classList.add('left');
   theLeftButton.setAttribute('aria-label', `${the_name} slide left`);
   theLeftButton.setAttribute('id', `${the_name}-left`);
   theLeftButton.setAttribute('onclick', `move_carousel_right("${the_name}")`);
   theLeftButton.innerHTML = '<i class="modal_modal_bi bi_chevron_left"></i>';
   theControls.appendChild(theLeftButton);

   const theRightButton = document.createElement('button');
   theRightButton.classList.add('categories_categories_button');
   theRightButton.classList.add('right');
   theRightButton.classList.add('showing');
   theRightButton.setAttribute('id', `${the_name}-right`);
   theRightButton.setAttribute('aria-label', `${name} slide right`);
   theRightButton.setAttribute('onclick', `move_carousel_left("${the_name}")`);
   theRightButton.innerHTML = '<i class="modal_modal_bi bi_chevron_right"></i>';
   theControls.appendChild(theRightButton);

   theCarouselContainer.appendChild(theCarouselContent);
   theCarouselContainer.appendChild(theControls);

   theCarousel.appendChild(theCarouselContainer);
   section.appendChild(theCarousel);
}

window.addEventListener('load', () => {
   buildCarousel("Best-rated", "best", 1);
   buildCarousel("Horror", "horror");
   buildCarousel("History", "history");
   buildCarousel("Romance", "romance");

   fetchTheBestMovie()
});