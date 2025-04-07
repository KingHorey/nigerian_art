import { Request, Response, Router } from "express";

import { ArtWorkModel } from "../schema/schema";

export const artModelRoute: Router = Router();

// Create a new artwork
artModelRoute.post("/create", async (req: Request, res: Response) => {
  const { title, description, image, artist, category } = req.body;
  try {
    const artwork = new ArtWorkModel({
      title,
      description,
      artistId: artist,
      category,
      imageUrl: image,
    });
    await artwork.save();
    res.status(201).json({
      message: "Artwork created successfully",
      data: artwork,
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({
        message: "Error creating artwork",
        error: err.message,
      });
    }
  }
});

// Fetch all artworks
artModelRoute.get("/all", async (req: Request, res: Response) => {
  try {
    const response = await ArtWorkModel.find().populate("artistId");
    res.status(200).json({
      message: "Artworks fetched successfully",
      data: response,
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({
        message: "Error fetching artworks",
        error: err.message,
      });
    }
  }
});

// fetch featured artworks
artModelRoute.get("/featured", async (req: Request, res: Response) => {
  try {
    const response = await ArtWorkModel.find({featured : true}).populate("artistId");
    res.status(200).json({
      message: "Featured artworks fetched successfully",
      data: response,
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({
        message: "Error fetching artworks",
        error: err.message,
      });
    }
  }
})

// Fetch artwork by ID
artModelRoute.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const artwork = await ArtWorkModel.findById(id).populate("artistId");
    res.status(200).json({
      message: "Artwork fetched successfully",
      data: artwork,
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({
        message: "Error fetching artwork",
        error: err.message,
      });
    }
  }
});

// Fetch artworks by artist ID
artModelRoute.get("/artist/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const artworks = await ArtWorkModel.find({ artistId: id }).populate(
      "artistId"
    );
    res.status(200).json({
      message: "Artworks fetched successfully",
      data: artworks,
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({
        message: "Error fetching artworks",
        error: err.message,
      });
    }
  }
});

// delete an artwork
artModelRoute.delete("/delete/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const artwork = await ArtWorkModel.findByIdAndDelete(id);
    if (artwork) {
      res.status(200).json({
        message: "Artwork deleted successfully",
        data: artwork,
      });
    } else {
      res.status(404).json({
        message: "Artwork not found",
      });
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({
        message: "Error deleting artwork",
        error: err.message,
      });
    }
  }
});

// update an artwork
artModelRoute.put("/update/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, image, artist, category } = req.body;
  try {
    const artwork = await ArtWorkModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
        imageUrl: image,
        artistId: artist,
        category,
      },
      { new: true }
    );
    if (artwork) {
      res.status(200).json({
        message: "Artwork updated successfully",
        data: artwork,
      });
    } else {
      res.status(404).json({
        message: "Artwork not found",
      });
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({
        message: "Error updating artwork",
        error: err.message,
      });
    }
  }
});

// like an artwork
artModelRoute.put("/like/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const artwork = await ArtWorkModel.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (artwork) {
      res.status(200).json({
        message: "Artwork liked successfully",
        data: artwork,
      });
    } else {
      res.status(404).json({
        message: "Artwork not found",
      });
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({
        message: "Error liking artwork",
        error: err.message,
      });
    }
  }
});

// comment on an artwork
artModelRoute.post("/comment/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, comment } = req.body;
  try {
    const artwork = await ArtWorkModel.findByIdAndUpdate(
      id,
      {
        $push: {
          comments: {
            name,
            comment,
          },
        },
      },
      { new: true }
    );
    if (artwork) {
      res.status(200).json({
        message: "Comment added successfully",
        data: artwork,
      });
    } else {
      res.status(404).json({
        message: "Artwork not found",
      });
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({
        message: "Error adding comment",
        error: err.message,
      });
    }
  }
});
