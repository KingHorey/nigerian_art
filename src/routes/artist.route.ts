import { Response, Request, Router } from "express";

import { ArtistModel } from "../schema/schema";

export const artistRoute: Router = Router();

// Create a new artist
artistRoute.post("/create", async (req: Request, res: Response) => {
  const {
    name,
    description,
    username,
    image,
    instaLink,
    websiteUrl,
    category,
  } = req.body;
  try {
    const artist = new ArtistModel({
      name,
      description,
      username,
      image,
      instaLink,
      websiteUrl,
      category,
    });
    await artist.save();
    res.status(201).json(artist);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({
        message: "Error creating artist",
        error: err.message,
      });
    }
  }
});

// Fetch all artists
artistRoute.get("/all", async (req: Request, res: Response) => {
  try {
    const response = await ArtistModel.find();
    res.status(200).json(response);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({
        message: "Error fetching artists",
        error: err.message,
      });
    }
  }
});

// Fetch artist by ID
artistRoute.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const artist = await ArtistModel.findById(id).populate("artworks");
    if (artist) {
      res.status(200).json(artist);
    } else {
      res.status(404).json({
        message: "Artist not found",
      });
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({
        message: "Error fetching artist",
        error: err.message,
      });
    }
  }
});

// Fetch artworks by artist ID
artistRoute.put("/update/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    description,
    username,
    image,
    instaLink,
    websiteUrl,
    category,
  } = req.body;
  try {
    const artist = await ArtistModel.findByIdAndUpdate(
      id,
      {
        name,
        description,
        username,
        image,
        instaLink,
        websiteUrl,
        category,
      },
      { new: true }
    );
    if (artist) {
      res.status(200).json(artist);
    } else {
      res.status(404).json({
        message: "Artist not found",
      });
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({
        message: "Error updating artist",
        error: err.message,
      });
    }
  }
});

// delete an artist
artistRoute.delete("/delete/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const artist = await ArtistModel.findByIdAndDelete(id);

    if (artist) {
      res.status(204);
    } else {
      res.status(404).json({
        message: "Artist not found",
      });
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({
        message: "Error deleting artist",
        error: err.message,
      });
    }
  }
});

// like an artist
artistRoute.put("/like/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const artist = await ArtistModel.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (artist) {
      res.status(200).json(artist);
    } else {
      res.status(404).json({
        message: "Artist not found",
      });
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({
        message: "Error liking artist",
        error: err.message,
      });
    }
  }
});
