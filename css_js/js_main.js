const mainUrlJS = "http://localhost:8000/api/v1/titles/"


// Best movie part

function fetchBestMovieJS() {

    let bestTitleJS = document.getElementById('top-title_id');
    let bestImgJS = document.getElementsByClassName('best-cover_cl')[0].getElementsByTagName("img")[0];
    let bestDescriptionJS = document.getElementsByClassName('best-description_cl')[0];
    let bestButtonJS = document.getElementsByClassName('button_cl')[1];

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


// Modal control

function openModalJS(id_JS) {

    let modalJS = document.getElementById("modal_id");
    let spanJS = document.getElementsByClassName("close_cl")[0];

    fetchModalDataJS(id_JS)

    modalJS.style.display = "block";

    spanJS.onclick = function () {
        modalJS.style.display = "none";
    }

    window.onclick = function (event_JS) {
        if (event_JS.target === modal_cl)
            modalJS.style.display = "none";
    }
}

function fetchModalDataJS(id_JS) {

    fetch(mainUrlJS + id_JS)
        .then(responseJS => responseJS.json())
        .then(dataJS => {

            document.getElementById('modal-cover_id').src = dataJS["image_url"];
            document.getElementById('modal-title_id').innerHTML = dataJS["title"];

            document.getElementById('modal-year_id').innerHTML = dataJS["year"];
            document.getElementById('modal-duration_id').innerHTML = dataJS["duration"] + " min";
            document.getElementById('modal-genres_id').innerHTML = dataJS["genres"];
            document.getElementById('modal-imdb_id').innerHTML = dataJS["imdb_score"] + " / 10";

            document.getElementById('modal-directors_id').innerHTML = dataJS["directors"];
            document.getElementById('modal-cast_id').innerHTML = dataJS["actors"] + "...";
            document.getElementById('modal-country_id').innerHTML = dataJS["countries"];


            if (typeof dataJS["rated"] === 'string' || dataJS["rated"] instanceof String)
                document.getElementById('modal-rating_id').innerHTML = dataJS["rated"];
            else
                document.getElementById('modal-rating_id').innerHTML = dataJS["rated"] + "+";

            let modalBoxOfficeJS = document.getElementById('modal-box-office_id');
            if (dataJS["worldwide_gross_income"] == null)
                modalBoxOfficeJS.innerHTML = "N/A";
            else
                modalBoxOfficeJS.innerHTML = dataJS["worldwide_gross_income"] + " " + dataJS["budget_currency"];

            let regExpJS = /[a-zA-Z]/g;
            if (regExpJS.test(dataJS["long_description"]))
                document.getElementById('modal-description_id').innerHTML = dataJS["long_description"];
            else
                document.getElementById('modal-description_id').innerHTML = "N/A";
        })
}


// Categories

async function fetchCategoriesJS(name_JS, skip_JS, total_JS = 7) {

    const resultsJS = await fetch(mainUrlJS + "?sort_by=-imdb_score&genre=" + name_JS);

    if (!resultsJS.ok)
        return
    const dataJS = await resultsJS.json();
    let moviesDataJS = Array(...dataJS.results);

    if (skip_JS > 0)
        moviesDataJS.splice(0, skip_JS);

    if (moviesDataJS.length < total_JS) {
        let results2JS = await (await fetch(dataJS.next)).json();
        moviesDataJS.push(...Array(...results2JS.results).slice(0, total_JS - moviesDataJS.length));
    }

    return moviesDataJS;
}

// The carousel controls part

function moveCarouselLeftJS(category_JS) {

    let carrouselContentJS = document.querySelector("#" + category_JS + "-movies");
    let carrouselLeftButtonJS = document.querySelector("#" + category_JS + "-left");
    let carrouselRightButtonJS = document.querySelector("#" + category_JS + "-right");

    carrouselContentJS.style.left = "-680px";
    carrouselRightButtonJS.classList.remove("showing");
    carrouselLeftButtonJS.classList.add("showing");
}

function moveCarouselRightJS(category_JS) {

    let carrouselContentJS = document.querySelector("#" + category_JS + "-movies");
    let carrouselLeftButtonJS = document.querySelector("#" + category_JS + "-left");
    let carrouselRightButtonJS = document.querySelector("#" + category_JS + "-right");

    carrouselContentJS.style.left = "0px";
    carrouselRightButtonJS.classList.add("showing");
    carrouselLeftButtonJS.classList.remove("showing");
}

async function buildCarouselJS(category_JS, name_JS, skip_JS = 0) {

    let categoryNameJS = name_JS;
    if (name_JS === "best_cl")
        categoryNameJS = "";

    const sectionJS = document.createElement("section")
    sectionJS.classList.add("categories_cl")

    const carouselJS = document.createElement('div');
    carouselJS.classList.add('container_cl');

    const categoryTitleJS = document.createElement('h2');
    categoryTitleJS.innerHTML = `${category_JS} movies`;
    carouselJS.append(categoryTitleJS);

    const carouselContainerJS = document.createElement('div');
    carouselContainerJS.classList.add('carousel-container_cl');

    const carouselContentJS = document.createElement('div');
    carouselContentJS.classList.add('carousel-content_cl');
    carouselContentJS.setAttribute("id", `${name_JS}-movies`)

    document.querySelector('.carousels_cl').appendChild(sectionJS);

    const moviesJS = await fetchCategoriesJS(categoryNameJS, skip_JS);

    let j = 0;
    for (const movieJS of moviesJS) {
        const boxJS = document.createElement('div');
        boxJS.classList.add("box_cl");
        boxJS.setAttribute("id", `${categoryNameJS}${j + 1}`);

        const movieCoverJS = document.createElement("img");
        movieCoverJS.setAttribute("alt", movieJS.title);
        movieCoverJS.src = movieJS.image_url;
        boxJS.appendChild(movieCoverJS);

        const overlayJS = document.createElement("div");
        overlayJS.classList.add("overlay_cl");

        const movieTitleJS = document.createElement("p");
        movieTitleJS.innerHTML = movieJS.title;
        overlayJS.appendChild(movieTitleJS);

        const playButtonJS = document.createElement("button");
        playButtonJS.classList.add("overlay-button_cl");
        playButtonJS.innerHTML = '<i class="bi_cl bi-play-fill_cl"></i> Play';
        overlayJS.appendChild(playButtonJS);

        const modalButtonJS = document.createElement("button");
        modalButtonJS.classList.add("overlay-button_cl");
        modalButtonJS.setAttribute("onclick", `openModalJS("${movieJS.id}")`);
        modalButtonJS.innerHTML = "More information";
        overlayJS.appendChild(modalButtonJS);

        boxJS.appendChild(overlayJS);
        carouselContentJS.appendChild(boxJS);

        j++;
    }

    const controlsJS = document.createElement("div");
    controlsJS.classList.add("controls_cl");

    const leftButtonJS = document.createElement('button');
    leftButtonJS.classList.add('button-added_cl');
    leftButtonJS.classList.add('left-corner');
    leftButtonJS.setAttribute('aria-label', `${name_JS} slide left`);
    leftButtonJS.setAttribute('id', `${name_JS}-left`);
    leftButtonJS.setAttribute('onclick', `moveCarouselRightJS("${name_JS}")`);
    leftButtonJS.innerHTML = '<i class="bi_cl bi-chevron-left"></i>';
    controlsJS.appendChild(leftButtonJS);

    const rightButtonJS = document.createElement('button');
    rightButtonJS.classList.add('button-added_cl');
    rightButtonJS.classList.add('right-corner');
    rightButtonJS.classList.add('showing');
    rightButtonJS.setAttribute('id', `${name_JS}-right`);
    rightButtonJS.setAttribute('aria-label', `${name_JS} slide right`);
    rightButtonJS.setAttribute('onclick', `moveCarouselLeftJS("${name_JS}")`);
    rightButtonJS.innerHTML = '<i class="bi_cl bi-chevron-right"></i>';
    controlsJS.appendChild(rightButtonJS);

    carouselContainerJS.appendChild(carouselContentJS);
    carouselContainerJS.appendChild(controlsJS);

    carouselJS.appendChild(carouselContainerJS);
    sectionJS.appendChild(carouselJS);
}

window.addEventListener('load', () => {
    buildCarouselJS("Best rated", "best_cl", 1);
    buildCarouselJS("History", "history");
    buildCarouselJS("Romance", "romance");
    buildCarouselJS("Horror", "horror");

    fetchBestMovieJS()
});