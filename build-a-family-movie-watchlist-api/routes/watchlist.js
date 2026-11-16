import { Router } from "express";

import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";
import {
  getWatchlist,
  addMovie,
  updateMovie,
  deleteMovie,
} from "../utils/db.js";

const router = Router();

// Every watchlist route requires a valid token
router.use(authenticate);

// Anyone in the family can read any watchlist
router.get("/:userId", (req, res) => {
  const watchlist = getWatchlist(Number(req.params.userId));

  if (!watchlist) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json(watchlist);
});

router.post("/:userId/movies", authorizeModification, (req, res) => {
  const { title, genre } = req.body ?? {};

  if (!title || !genre) {
    return res.status(400).json({ error: "Title and genre are required." });
  }

  const movie = addMovie(Number(req.params.userId), { title, genre });

  if (!movie) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(201).json(movie);
});

router.put("/:userId/movies/:movieId", authorizeModification, (req, res) => {
  // Only allow known fields to be changed
  const updates = {};
  for (const field of ["title", "genre", "watched"]) {
    if (req.body?.[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  const movie = updateMovie(
    Number(req.params.userId),
    Number(req.params.movieId),
    updates,
  );

  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }

  res.status(200).json(movie);
});

router.delete("/:userId/movies/:movieId", authorizeModification, (req, res) => {
  const deleted = deleteMovie(
    Number(req.params.userId),
    Number(req.params.movieId),
  );

  if (!deleted) {
    return res.status(404).json({ error: "Movie not found" });
  }

  res.status(200).json({ message: "Movie deleted" });
});

export default router;
