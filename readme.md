# Movie Project
This is a movie database project, where it shows movies, their casts, ratings, trailers, related movies, genres, and so on.

This project uses The Movie DB API: `https://api.themoviedb.org/`. It is up to
you to use your Google and Postman skills to explore the API and understand the
data.

Documentation : 'https://developers.themoviedb.org/3/getting-started/introduction'

# Already built for you
- A home page that shows popular movies
- When you click one of the movies, you'll see the Single Movie page, which includes:
    - Movie poster
    - Movie title
    - Movie release date
    - Movie runtime
    - Movie description
    - An empty cast section

# What you and your partner will build

## Homepage

### Navbar
Add a universal navbar (it appears on every page) to the home page that includes
buttons that go to the following pages:

- Home button, takes you to the home page
- Movies button that has a dropdown list to show different movie genres. For
  example: Action, Sci-Fi, Comedy ...etc, When you click one of them it should
  load the movies for that genre.
  (Genre List: https://api.themoviedb.org/3/genre/movie/list?api_key=ecfdd3d5230c96c392fc9421937894a9&language=en-US
  Pass the genre id to the discover API
  Get movies by genre https://developers.themoviedb.org/3/discover/movie-discover, with_genres)
- Actor list page
- About page that has a description of the website
- Search box where you can type the movie or actor name and display the
related results. (https://developers.themoviedb.org/3/search/multi-search)
- A filter dropdown to filter the displayed movies in the home page, based
on (popular, ???relase date???, top rated, now playing and up coming) (https://developers.themoviedb.org/3/movies/get-movie-details,
https://api.themoviedb.org/3/movie/popular?api_key=ecfdd3d5230c96c392fc9421937894a9,
https://api.themoviedb.org/3/movie/top_rated?api_key=ecfdd3d5230c96c392fc9421937894a9,
https://api.themoviedb.org/3/movie/now_playing?api_key=ecfdd3d5230c96c392fc9421937894a9,
https://api.themoviedb.org/3/movie/upcoming?api_key=ecfdd3d5230c96c392fc9421937894a9
- Deniz: Can it be done with vertical bootstrap tabs?

### Footer
Add a universal footer that includes:

- Credit to you and your partner for building the website, 
- You and your partner's github link inside an icon and optionally, your social
  media links

### Styling

- DONE Make it so that hovering over the movie makes the mouse pointer icon seem
  clickable. Right now, if you are about to click a movie, it's not obvious that
  it's clickable.

## Movies List Page

### Styling

- DONE Using CSS and Bootstrap, display the page as a grid with 3 columns (3 movies
  in the same row)
- DONE Make it responsive where it displays 2 columns for tablets and 1 column for
  phones
- Style the rest of the page however you like.
- Add the rating and genres to the movies in the home page and a description
  when you hover over one of them

## DUE 29th of MAY Single Movie Page 
We build part of the single movie page for you, but the information isn't
totally complete, a few more features are needed:

- DONE The main 5 actors of the movies in the credit section (https://developers.themoviedb.org/3/movies/get-movie-credits, cast[0-4].name)
- DONE The movie language (spoken_languages in API, loop through them like genres)
- DONE A related movies section which includes at least five related movies (https://developers.themoviedb.org/3/movies/get-movie-recommendations)
- DONE A trailer section that has the movie trailer from youtube (https://api.themoviedb.org/3/movie/550/videos?api_key=ecfdd3d5230c96c392fc9421937894a9)
- DONE The movie production company name and logo (https://api.themoviedb.org/3/movie/550?api_key=ecfdd3d5230c96c392fc9421937894a9 ,production companies)
- DONE The director name (https://developers.themoviedb.org/3/movies/get-movie-credits, crew[i].job == "director", return crew[i].name)
- DONE The movie rating and how many votes has it received (https://api.themoviedb.org/3/movie/550?api_key=ecfdd3d5230c96c392fc9421937894a9 voteAverage,voteCount)

### Functionality
- DONE Clicking an actor in the main actors should go to the single actor page. (Eventlisteners for actors just like eventlisteners for movies in homepage)

### Other requirements
- DONE There's an issue with duplication (undefined in the movie page) in the movie page that has to be fixed (and
  you need to open the site and read the code to fix it) 
- Style the page however you like

## Actor List Page
Displays a list of actors styles in the same way as the movies list page, but
with the actor photo and the actor name. Clicking any actor should go to the
Single Actor Page. CSS should most certainly be reused here!

## Single Actor Page
This page can be reached by clicking on an actor in the actors list page or the
credits in the single movie page.

### Data Display
- The actor name
- The actor gender
- A picture of the actor
- The actor popularity
- The birthday of the actor and (if available) death day
- A biography about the actor
- A list of movies the actor participated in

## Bonus
If you finish early you can work on the same functionalities, but for TV shows.
Your code should be completely reusable (e.g., don't just copy paste a second
copy of the files).
