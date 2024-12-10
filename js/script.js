const apiKey = "77f7ab6a"; // Replace with your actual API key
const baseUrl = "https://www.omdbapi.com/";

const searchButton = document.getElementById("search-button");
const filmsContainer = document.getElementById("films-container");
const paginationContainer = document.getElementById("pagination-container");
const detailsContainer = document.createElement("div"); // Container for movie details
detailsContainer.id = "details-container";
detailsContainer.classList.add("details-container");
filmsContainer.parentNode.insertBefore(detailsContainer, paginationContainer.nextSibling);

searchButton.addEventListener("click", () => {
    const title = document.getElementById("title").value;
    const type = document.getElementById("type").value;
    fetchMovies(title, type, 1); // Start on the first page
});

function fetchMovies(title, type, page) {
    const url = `${baseUrl}?apikey=${apiKey}&s=${encodeURIComponent(title)}&type=${type}&page=${page}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.Response === "True") {
                displayMovies(data.Search); // Show the movies
                setupPagination(title, type, page, Math.ceil(data.totalResults / 10)); // Configure pagination
            } else {
                filmsContainer.innerHTML = `<p>No movies found.</p>`;
                paginationContainer.innerHTML = ""; // Clear pagination
                detailsContainer.innerHTML = ""; // Clear details
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}

function displayMovies(movies) {
    filmsContainer.innerHTML = ""; // Clear previous results
    movies.forEach(movie => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <img src="${movie.Poster !== "N/A" ? movie.Poster : "placeholder.png"}" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
            <button onclick="fetchMovieDetails('${movie.imdbID}')">Details</button>
        `;
        filmsContainer.appendChild(card);
    });
}

function fetchMovieDetails(imdbID) {
    const url = `${baseUrl}?apikey=${apiKey}&i=${imdbID}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayMovieDetails(data);
        })
        .catch(error => {
            console.error("Error fetching movie details:", error);
        });
}

function displayMovieDetails(movie) {
    detailsContainer.innerHTML = `
        <div class="details-content">
            <img src="${movie.Poster !== "N/A" ? movie.Poster : "placeholder.png"}" alt="${movie.Title}" class="details-poster">
            <div class="details-text">
                <h2>${movie.Title}</h2>
                <p><strong>Year:</strong> ${movie.Year}</p>
                <p><strong>Rated:</strong> ${movie.Rated}</p>
                <p><strong>Released:</strong> ${movie.Released}</p>
                <p><strong>Runtime:</strong> ${movie.Runtime}</p>
                <p><strong>Genre:</strong> ${movie.Genre}</p>
                <p><strong>Director:</strong> ${movie.Director}</p>
                <p><strong>Writer:</strong> ${movie.Writer}</p>
                <p><strong>Actors:</strong> ${movie.Actors}</p>
                <p><strong>Plot:</strong> ${movie.Plot}</p>
                <p><strong>Language:</strong> ${movie.Language}</p>
                <p><strong>Country:</strong> ${movie.Country}</p>
                <p><strong>Awards:</strong> ${movie.Awards}</p>
            </div>
        </div>
    `;


    // Додаємо стилі для гарного вигляду
    const style = document.createElement("style");
    style.textContent = `
        .details-content {
            display: flex;
            gap: 20px; /* Відстань між картинкою та текстом */
        }
        .details-poster {
            flex: 1; /* Займає половину простору */
            height: auto;
            object-fit: cover; /* Зберігаємо співвідношення сторін та заповнюємо область */
        }
        .details-text {
            flex: 1; /* Займає іншу половину простору */
        }
    `;
    document.head.appendChild(style);
}
function setupPagination(title, type, currentPage, totalPages) {
    paginationContainer.innerHTML = ""; // Clear previous pagination
    const maxPagesToShow = 5; // Number of page buttons to display

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // Adjust startPage if we don't have enough pages at the end
    if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Add previous button if necessary
    if (currentPage > 1) {
        const prevButton = document.createElement("button");
        prevButton.textContent = "«";
        prevButton.addEventListener("click", () => fetchMovies(title, type, currentPage - 1));
        paginationContainer.appendChild(prevButton);
    }

    // Add page number buttons
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        if (i === currentPage) {
            pageButton.classList.add("active");
        }
        pageButton.addEventListener("click", () => fetchMovies(title, type, i));
        paginationContainer.appendChild(pageButton);
    }

    // Add next button if necessary
    if (currentPage < totalPages) {
        const nextButton = document.createElement("button");
        nextButton.textContent = "»";
        nextButton.addEventListener("click", () => fetchMovies(title, type, currentPage + 1));
        paginationContainer.appendChild(nextButton);
    }
}