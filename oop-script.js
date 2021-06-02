//the API documentation site https://developers.themoviedb.org/3/

class App {
  static async run() {
    //fetches now playing movies and displays them in the homepage
    const movies = await APIService.fetchMovies();
    HomePage.renderMovies(movies);
  };
};

class APIService {

  static TMDB_BASE_URL = 'https://api.themoviedb.org/3';
  //returns now playing movie objects
  static async fetchMovies() {
    const url = APIService._constructUrl(`movie/now_playing`)
    const response = await fetch(url)
    const data = await response.json()
    //results is the array that has the movies as objects inside
    return data.results.map(movie => new Movie(movie))
  };
  //returns single movie object
  static async fetchMovie(movieId) {
    const url = APIService._constructUrl(`movie/${movieId}`)
    const response = await fetch(url)
    const data = await response.json()
    return new Movie(data)
  };
  //Creates the url to look up
  static _constructUrl(path) {
    return `${this.TMDB_BASE_URL}/${path}?api_key=${atob('NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI=')}`;
  };
  //returns actor objects for any given movie id
  static async fetchActors(movieId) {
    const url = APIService._constructUrl(`movie/${movieId}/credits`);
    const response = await fetch(url);
    const data = await response.json();
    return new CastCrew(data);
  };
  //returns related (recommended) movie objects for any given movie id
  static async fetchRelatedMovie(movieId) {
    const url = APIService._constructUrl(`movie/${movieId}/recommendations`);
    const response = await fetch(url);
    const data = await response.json();
    return new RelatedMovies(data);
  };
  //returns trailer object for any given movie id
  static async fetchTrailer(movieId) {
    const url = APIService._constructUrl(`movie/${movieId}/videos`);
    const response = await fetch(url);
    const data = await response.json();
    return new Trailer(data);
  };

  //returns actor details for single actor page for any actor id
  static async fetchSingleActor(personId){
    const url = APIService._constructUrl(`person/${personId}`);
    const response = await fetch(url);
    const data = await response.json();
    return new SingleActor(data);
  }

  //returns the movie credits for a person id
  static async fetchMovieCreditsForActor(personId){
    const url = APIService._constructUrl(`person/${personId}/movie_credits`);
    const response = await fetch(url);
    const data = await response.json();
    return new MovieCredits(data);
  }
};

class HomePage {

  static container = document.getElementById('container');
  
  // can we get these four lines in one method?
  // get moviesContainer() {
  //   const container = document.getElementById('container')
  //   const div = document.createElement("div")
  //   div.setAttribute("class","row g-2")
  //   return this.container.appendChild(div) 
  // } 

  // static moviesContainer () {
  //   const container = document.getElementById('container')
  //   const div = document.createElement("div")
  //   div.setAttribute("class","row g-2")
  //   return container.appendChild(div) 
  // }
  //displays returned movie objects in the home page
  static renderMovies(movies) {

    if(this.container.innerText !== "") {
      this.container.innerText = "";
    }

    const div = document.createElement("div");
    div.setAttribute("class","homePageMovies row g-3 p-4");
    const moviesContainer = this.container.appendChild(div); 

    movies.forEach(movie => {
      //creates single movie divisions for the home page for each movie
      const movieDiv = document.createElement("div");
      movieDiv.setAttribute("class", "col-md-4 col-sm-6")
      const movieImage = document.createElement("img");
      movieImage.setAttribute("class","img-fluid homePageMovieImg");
      movieImage.src = `${movie.backdropUrl}`;

      const movieTitle = document.createElement("h3");
      movieTitle.textContent = `${movie.title.toUpperCase()}`;      
      movieTitle.setAttribute("class", "movie-title text-center");

      movieImage.addEventListener("click", function () {
        Movies.run(movie); //calls Movies.run with the movie parameter from movies.forEach(movie)
      });

      movieDiv.appendChild(movieImage);
      movieDiv.appendChild(movieTitle);
      moviesContainer.appendChild(movieDiv);
    })
    
  }
}

class Movies {
  static async run(movie) {
    //gets the movie info from "Movies.run(movie)" and passes it into fetch to get that movie's info
    const movieData = await APIService.fetchMovie(movie.id)
    const castCrew = await APIService.fetchActors(movie.id)
    const relatedMovies = await APIService.fetchRelatedMovie(movie.id)
    const trailer = await APIService.fetchTrailer(movie.id)

    MoviePage.renderMovieSection(movieData, castCrew, relatedMovies, trailer);
  };
};

class MoviePage {
  static container = document.getElementById('container');
  static renderMovieSection(movie, castCrew, relatedMovies, trailer) {
    MovieSection.renderMovie(movie);
    MovieSection.renderCastCrew(castCrew);
    MovieSection.renderRelatedMovies(relatedMovies);
    MovieSection.renderTrailer(trailer);
  };
};

class ActorPage {
  static container = document.getElementById('container');
  static async run (personId) {
    const actorData = await APIService.fetchSingleActor(personId)
    const movieCredits = await APIService.fetchMovieCreditsForActor(personId)
    
    ActorPage.renderActorPage(actorData, movieCredits)
  }
  static renderActorPage(actorData, movieCredits) {
    console.log(movieCredits)
    //A function to create the string of the birthday and deathday if the actor is deceased, otherwise only birthday, none if no info
    const birthAndDeathday = actorData => {
      if (actorData.birthday != null) {
        if (actorData.deathday != null) {return `Birthday: ${actorData.birthday} Deathday: ${actorData.deathday}`}
        else {return `Birthday: ${actorData.birthday}`}}
      else return ``
    }

    //A function to create the string for the gender of the actor
    const gender = actorData => actorData.gender == 1 ? "Female" : "Male";

    //Loop through movies played in and create a html string to display 
    const moviesCast = movieCredits.moviesInCast.map(movie =>`<div class="movie-card col-md-2 col-sm-4"><img class="img-fluid" src=${movieCredits.castMoviesPosterUrl(movieCredits.moviesInCast.indexOf(movie))} alt="${movie.title}"><h6>${movie.title}</h6></div>`).join(" ") 

    //Loop through movies worked in and create a html string to display
    const moviesCrew = movieCredits.moviesInCrew.map(movie =>`<div class="movie-card col-md-2 col-sm-4"><img class="img-fluid" src=${movieCredits.crewMoviesPosterUrl(movieCredits.moviesInCrew.indexOf(movie))} alt="${movie.title}"><h6>${movie.title}</h6></div>`).join(" ")


    this.container.innerHTML = `
    <div class="row">
        <div class="col-md-4">
          <img id="actor-profile" class="img-fluid" src=${actorData.actorsProfileUrl()}> 
        </div>
        <div class="col-md-8">
        <h2 id="actor-name">${actorData.name}</h2>
        <p id="gender">${gender(actorData)}</p>
        <p id="popularity">Popularity: ${actorData.popularity}</p>
        <p id="biography">Biography: ${actorData.biography}</p>
        <p id="birthday & deathday">${birthAndDeathday(actorData)}</p>
      </div>}        
    </div>
    <div class="row">
    <h3>Movies In Cast</h3>
    ${moviesCast}
    </div>
    <div class="row">
    <h3>Movies In Crew</h3>
    ${moviesCrew}
    </div>`
  };
};


class MovieSection {
  static renderMovie(movie) {

    //Loop through genres and create a html string to display
    const genres = movie.genres.map(genre => genre.name).join(", ")

    //Loop through languages and create a html string to display        
    const languages = movie.spokenLanguages.map(language => language.name).join(", ")

    //Loop through production companies and createa html string to display
    const production = movie.productionCompanies.map(company => `<div class="company-card column"><h6>${company.name}</h6><img src=${movie.productionLogoUrl(movie.productionCompanies.indexOf(company))} alt="${company.name}" height="150px" width="300px"></div>`).join(" ")

    MoviePage.container.innerHTML = `
      <div class="row">
        <div class="col-md-4">
          <img id="movie-backdrop" src=${movie.backdropUrl}> 
        </div>
        <div class="col-md-8">
          <h2 id="movie-title">${movie.title}</h2>
          <p id="genres">${genres}</p>
          <p id="vote">Vote Count: ${movie.voteCount}, Vote Average: ${movie.voteAverage}</p>
          <p id="languages">${languages}</p>
          <p id="movie-release-date">${movie.releaseDate}</p>
          <p id="movie-runtime">${movie.runtime}</p>
          <h3>Overview:</h3>
          <p id="movie-overview">${movie.overview}</p>
        </div>
      </div>
      <div id="castCrew-wrapper" class="row">
      </div>
      <div class="column">
      <h3>Recommended:</h3>
      <div id ="related-movies" class="row">
      </div>
      </div>
      <div class="trailerDiv">
      </div>
      <div class="productionDiv">
      ${production}
      </div>
    `
  }

  static renderCastCrew(castCrew) {
    const castCrewDiv = document.querySelector('#castCrew-wrapper')

    //Loop through actors and create a html string including their names and photos, onclick image, call renderActorPage with the actor's id 
    const actors = castCrew.actors.map(actor => `<div class="actor col-md-2"><img style="cursor: pointer;" onclick="ActorPage.run(${actor.id})" src=${castCrew.actorsProfileUrl(castCrew.actors.indexOf(actor))} class="img-fluid"><h6>${actor.name}</h6></div>`).join(" ")

    castCrewDiv.innerHTML = ` 
      <div class="col-md-10 actor-card-wrapper column">
        <h3>Actors:</h3>
        <div class="row">
        ${actors}
        </div>
      </div>
      <div class="col-md-2 director-card column">
       <h3>Director:</h3>
       <div class="row">
        <img src=http://image.tmdb.org/t/p/w780/${castCrew.director.profile_path} class="img-fluid">
        <h6>${castCrew.director.name}</h6>
        </div>
      </div>`
  }

  static renderRelatedMovies(relatedMovies) {
    const relatedMoviesDiv = document.querySelector('#related-movies')

    //Loop through related movies and create a html string to display
    const recommendations = relatedMovies.movies.map(movie => `<div class="related-movie col-md-2"><img src=${relatedMovies.relatedMoviesPosterUrl(relatedMovies.movies.indexOf(movie))} class="img-fluid" role="button" ><h6>${movie.title}</h6></div>`).join(" ")
    // role="button" bootstrap cursor change on hover
    relatedMoviesDiv.innerHTML = recommendations
  }

  //Displays the trailer from youtube in the trailer section of single movie page, takes trailer class instance as a parameter
  static renderTrailer(trailer) {
    const trailerDiv = document.querySelector('.trailerDiv');

    trailerDiv.innerHTML = `<h3>Trailer</h3><iframe width="984" height="554" src=${trailer.trailerUrl()} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
  }
};

class Movie {
  static BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780';
  constructor(json) {
    this.id = json.id;
    this.title = json.title;
    this.releaseDate = json.release_date;
    this.runtime = json.runtime + " minutes";
    this.overview = json.overview;
    this.backdropPath = json.backdrop_path;
    this.genres = json.genres;
    this.spokenLanguages = json.spoken_languages;
    this.voteAverage = json.vote_average;
    this.voteCount = json.vote_count;
    this.productionCompanies = json.production_companies;
  };

  //Backdrop url is the pictures of the movies that can be used as a background
  get backdropUrl() {
    return this.backdropPath ? Movie.BACKDROP_BASE_URL + this.backdropPath : "";
  };

  //Production logo url is the url of production company logos
  productionLogoUrl(i) {
    return this.productionCompanies[i].logo_path ? Movie.BACKDROP_BASE_URL + this.productionCompanies[i].logo_path : "";
  };
};

class CastCrew {
  static PROFILE_BASE_URL = 'http://image.tmdb.org/t/p/w780';
  constructor(json) {
    this.actors = json.cast.slice(0, 5);
    this.director = json.crew.find((person) => person.job === "Director");
  };

  //Profile url is the pictures of the cast & crew
  actorsProfileUrl(i) {
    return this.actors[i].profile_path ? CastCrew.PROFILE_BASE_URL + this.actors[i].profile_path : "";
  };
}

class RelatedMovies {
  static POSTER_BASE_URL = 'http://image.tmdb.org/t/p/w780';
  constructor(json) {
    this.movies = json.results.slice(0, 5);
  };

  //Poster url is the pictures of the movie posters
  relatedMoviesPosterUrl(i) {
    return this.movies[i].poster_path ? RelatedMovies.POSTER_BASE_URL + this.movies[i].poster_path : "";
  };
}

class Trailer {
  static TRAILER_BASE_URL = 'https://www.youtube.com/embed/';
  constructor(json) {
    this.trailer = json.results[0];
  };

  //Trailer url is the pictures of the movie posters
  trailerUrl() {
    return this.trailer.key ? Trailer.TRAILER_BASE_URL + this.trailer.key : "";
  };
}

class SingleActor {
  static PROFILE_BASE_URL = 'http://image.tmdb.org/t/p/w780';
  constructor(json) {
    this.name = json.name;
    this.gender = json.gender; // 1: Female, 2:Male
    this.profilePath = json.profile_path; 
    this.popularity = json.popularity;
    this.biography = json.biography;
    this.birthday = json.birthday;
    this.deathday = json.deathday;
  }

  //Profile url is the pictures of the cast & crew
  actorsProfileUrl() {
    return this.profilePath ? SingleActor.PROFILE_BASE_URL + this.profilePath : "";
  };
}

class MovieCredits {
  static POSTER_BASE_URL = 'http://image.tmdb.org/t/p/w780';
  constructor(json){
    this.moviesInCast = json.cast.slice(0,6)
    this.moviesInCrew = json.crew.slice(0,6)
  }

  //Backdrop url is the pictures of the movies that can be used as a background
  castMoviesPosterUrl(i) {
    return this.moviesInCast[i].poster_path ? MovieCredits.POSTER_BASE_URL + this.moviesInCast[i].poster_path : "";
  };

  crewMoviesPosterUrl(i) {
    return this.moviesInCrew[i].poster_path ? MovieCredits.POSTER_BASE_URL + this.moviesInCrew[i].poster_path : "";
  };
}
document.addEventListener("DOMContentLoaded", App.run);