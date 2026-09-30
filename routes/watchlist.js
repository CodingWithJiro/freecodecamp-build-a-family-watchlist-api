import express from "express";
import {
  getWatchlist,
  addMovie,
  updateMovie,
  deleteMovie,
} from "../utils/db.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";

const router = express.Router();

router.get("/:userId", authenticate, (req, res) => {
  const userId = +req.params.userId;
  const watchlist = getWatchlist(userId);
  return res.status(200).json({ watchlist });
});

router.post(
  "/:userId/movies",
  authenticate,
  authorizeModification,
  (req, res) => {
    const userId = +req.params.userId;
    const movie = addMovie(userId, req.body);
    return res.status(201).json({ movie });
  },
);

router.put(
  "/:userId/movies/:movieId",
  authenticate,
  authorizeModification,
  (req, res) => {
    const userId = +req.params.userId;
    const movieId = +req.params.movieId;
    const updates = req.body;
    const movie = updateMovie(userId, movieId, updates);
    return res.status(200).json({ movie });
  },
);

router.delete(
  "/:userId/movies/:movieId",
  authenticate,
  authorizeModification,
  (req, res) => {
    const userId = +req.params.userId;
    const movieId = +req.params.movieId;
    const isDeleted = deleteMovie(userId, movieId);
    if (!isDeleted) {
      return res.status(400).json({
        error: "Movie not in watchlist.",
      });
    }
    return res.sendStatus(200);
  },
);

export default router;
