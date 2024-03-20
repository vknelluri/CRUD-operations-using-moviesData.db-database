const express = require("express");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "moviesData.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/movies/", async (request, response) => {
  const movieNamesQuery = `
    SELECT * FROM movie
    ORDER BY movie_id`;

  const movieNames = await db.all(movieNamesQuery);
  response.send(movieNames);
});

app.post("/movies/", async (request, response) => {
  const updateMovie = request.body;
  const { directorId, movieName, leadActor } = updateMovie;

  const updateMovieQuery = `
    INSERT INTO movie (director_id,movie_name,lead_actor)
    VALUES(
        ${directorId},
        '${movieName}',
        '${leadActor}',
    );`;

  const addMovie = await db.run(updateMovieQuery);
  response.send("Movie Successfully Added");
});

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieQuery = `
    SELECT * FROM movie
    WHERE movie_id = ${movieId};`;

  const result = await db.get(movieQuery);
  response.send(result);
});


app.put("/movies/:movieId/", async(request, response) => {
    const {movieId} = request.params;
    const addMovie = request.body;
    const{
        directorId,
        movieName,
        leadActor,
    } = addMovie;
    const changeMovie = `
    UPDATE movie
    SET 
    director_id = ${directorId},
    movie_name = '${movieName}',
    lead_actor = '${leadActor}',

    WHERE movie_id = ${movieId};

    const movieUpdate = await db.run(changeMovie);
    response.send("Movie Details Updated")
});


// app.delete("/movies/:movieId/", async (request, response) => {
//     const {movieId} = request.params;
//     const deleteQuery = `
//     DELETE FROM
//     movie
//     WHERE
//     movie_id = ${movieId};`;
    
//     await db.run(deleteQuery);
//     response.send("Movie Removed");
// });


app.get("/directors/", (request, response) => {
    const directorsQuery = `
    SELECT * FROM director
    ORDER BY director_id`;

    const allDirectors = db.run(directorsQuery);
    response.send(allDirectors);
});


app.get("/directors/:directorId/movies/", (request, response) => {
    const {directorId} = request.params;

    const getDirectorMoviesQuery = `
    SELECT * FROM 
    movie 
    WHERE 
    director_id = ${directorId};`;

})