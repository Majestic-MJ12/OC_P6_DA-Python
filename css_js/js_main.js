const main_url = "http://localhost:8000/api/v1/titles/"


// Best movie part

function fetchBest_movie() {

   let best_title = document.getElementById('best-best-top-title');
   let best_image = document.getElementsByClassName('best_best_cover')[0].getElementsByTagName("img")[0];
   let best_description = document.getElementsByClassName('best_best_description')[0];
   let bestButton = document.getElementsByClassName('best_best_button')[1];

   fetch(main_url + "?sort_by=-imdb_score")
      .then(response => response.json())
      .then(data => {
         best_title.innerHTML = data["results"][0]["title"];
         best_image.src = data["results"][0]["image_url"];
         best_button.setAttribute("onclick", `openModal("${data["results"][0]["id"]}")`)
         fetch(data["results"][0]["url"])
            .then(response => response.json())
            .then(data => {
               best_description.innerHTML = data["description"];
            })
      })

}

// Modal control

function open_modal(id) {

   let modal_modal = document.getElementById("modal-modal");
   let span_span = document.getElementsByClassName("modal_modal_close")[0];

   fetchModal_data(id)

   modal_modal.style.display = "block";

   span_span.onclick = function () {
      modal_modal.style.display = "none";
   }

   window.onclick = function (event) {
      if (event.target === modal_modal)
         modal_modal.style.display = "none";
   }
}

function fetchModal_data(id) {

   fetch(main_url + id)
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
            document.getElementById('modal-modal-rating').innerHTML = data["rated"] + "+"; // add "+" if age rating is a number

         let modal_box_office = document.getElementById('modal-modal-box-office');
         if (data["worldwide_gross_income"] == null)
            modal_box_office.innerHTML = "N/A"; // placeholder for unspecified box-office
         else
            modal_box_office.innerHTML = data["worldwide_gross_income"] + " " + data["budget_currency"];

         let reg_exp = /[a-zA-Z]/g;
         if (reg_exp.test(data["long_description"]))
            document.getElementById('modal-modal-description').innerHTML = data["long_description"];
         else
            document.getElementById('modal-modal-description').innerHTML = "N/A"; // placeholder for missing description

      })
}

// Categories

async function fetchThe_categories(the_name, skip_it, the_total = 7) {

   const results_results = await fetch(main_url + "?sort_by=-imdb_score&genre=" + the_name);

   if (!results_results.ok)
      return
   const data_data = await results_results.json();
   let movies_data = Array(...data_data.results_results);

   if (skip > 0)
      movies_data.splice(0, skip_it);

   if (movies_data.length < the_total) {
      let results_2 = await (await fetch(data_data.next)).json();
      movies_data.push(...Array(...results_2.results_results).slice(0, total - movies_data.length));
   }

   return movies_data;
}

// The carousel controls part

function move_the_carousel_left(categories) {

   let carrousel_content = document.querySelector("#" + categories + "-movies");
   let carrousel_left_button = document.querySelector("#" + categories + "-left");
   let carrousel_right_button = document.querySelector("#" + categories + "-right");

   carrousel_content.style.left = "-680px";
   carrousel_right_button.classList.remove("show");
   carrousel_left_button.classList.add("show");
}

function move_the_carousel_right(categories) {

   let carrousel_content = document.querySelector("#" + categories + "-movies");
   let carrousel_left_button = document.querySelector("#" + categories + "-left");
   let carrousel_right_button = document.querySelector("#" + categories + "-right");

   carrousel_content.style.left = "0px";
   carrousel_right_button.classList.add("show");
   carrousel_left_button.classList.remove("show");
}

async function build_the_carousel(categories, the_name, skip_it = 0) {

   let category_name = the_name;
   if (the_name === "best")
      category_name = "";

   const section_section = document.createElement("section")
   section_section.classList.add("categories_categories")

   const carousel_carousel = document.createElement('div');
   carousel_carousel.classList.add('container_container');

   const category_title = document.createElement('h2');
   category_title.innerHTML = `${categories} movies`;
   carousel.append(category_title);

   const carousel_container = document.createElement('div');
   carousel_container.classList.add('carousel_carousel_container');

   const carousel_content = document.createElement('div');
   carousel_content.classList.add('carousel_carousel_content');
   carousel_content.setAttribute("id", `${the_name}-movies`)

   document.querySelector('.carousels').appendChild(section);

   const movies_movies = await fetchThe_categories(the_name, skip_it);

   let j = 0;
   for (const movie of movies_movies) {
      const box_box = document.createElement('div');
      box.classList.add("box_box");
      box.setAttribute("id", `${category_name}${j + 1}`);

      const movie_cover = document.createElement("img");
      movie_cover.setAttribute("alt", movie.title);
      movie_cover.src = movie.image_url;
      box_box.appendChild(movie_cover);

      const overlay_overlay = document.createElement("div");
      overlay_overlay.classList.add("overlay_overlay");

      const movie_title = document.createElement("p");
      movie_title.innerHTML = movie.title;
      overlay_overlay.appendChild(movie_title);

      const play_button = document.createElement("button");
      play_button.classList.add("overlay-button");
      play_button.innerHTML = '<i class="bi bi-play-fill"></i> Play';
      overlay_overlay.appendChild(play_button);

      const modal_button = document.createElement("button");
      modal_button.classList.add("overlay_overlay_button");
      modal_button.setAttribute("onclick", `openModal("${movie.id}")`);
      moda_Button.innerHTML = "+++";
      overlay_overlay.appendChild(modalButton);

      box_box.appendChild(overlay_overlay);
      carousel_content.appendChild(box_box);

      j++;
   }

   const controls_controls = document.createElement("div");
   controls.classList.add("controls_controls");

   const left_button = document.createElement('button');
   left_button.classList.add('btn');
   left_button.classList.add('left');
   left_button.setAttribute('aria-label', `${name} slide left`);
   left_button.setAttribute('id', `${name}-left`);
   left_button.setAttribute('onclick', `move_carousel_right("${name}")`);
   left_button.innerHTML = '<i class="chevron chevron-left"></i>';
   controls_controls.appendChild(left_button);

   const right_button = document.createElement('button');
   right_button.classList.add('button_button');
   right_button.classList.add('right_right');
   right_button.classList.add('show_show');
   right_button.setAttribute('id', `${name}-right`);
   right_button.setAttribute('aria-label', `${name} slide right`);
   right_button.setAttribute('onclick', `move_carousel_left("${name}")`);
   right_button.innerHTML = '<i class="chevron chevron-right"></i>';
   controls_controls.appendChild(right_button);

   carousel_container.appendChild(carousel_content);
   carousel_container.appendChild(controls_controls);

   carousel_carousel.appendChild(carousel_container);
   section.appendChild(carousel_carousel);
}

window.addEventListener('load', () => {
   buildCarousel("Best-rated", "best", 1);
   buildCarousel("Horror", "horror");
   buildCarousel("History", "history");
   buildCarousel("Romance", "romance");

   fetchBest_movie()
});