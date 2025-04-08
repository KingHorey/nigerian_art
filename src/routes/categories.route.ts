import { Response, Request, Router } from "express";

import { CategoriesModel } from "../schema/schema";
import { checkPermission } from "../controllers/auth.controller";

export const categoriesRoute: Router = Router();

// Create a new category
categoriesRoute.post(
  "/create",
  // checkPermission,
  async (req: Request, res: Response) => {
    const { name, description } = req.body;
    try {
      // const getCategoryName = await CategoriesModel.findOne({ name });
      // if (getCategoryName) {
      //   res.status(400).json({
      //     message: "Category name already exists",
      //     data: getCategoryName,
      //   });
      // }
      const categories = new CategoriesModel({ name, description });
      await categories.save();
      res.status(201).json(categories);
    } catch (err) {
      if (err instanceof Error) {
        res.status(400).json({
          message: "Error creating category",
          error: err.message,
        });
      }
    }
  }
);

// Fetch all categories
categoriesRoute.get("/all", async (req: Request, res: Response) => {
  try {
    const response = await CategoriesModel.find();

    res.status(200).json(response);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({
        message: "Error fetching categories",
        error: err.message,
      });
    }
  }
});

// Fetch category by ID
categoriesRoute.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const response = await CategoriesModel.findById(id).populate("artworks");
    res.status(200).json(response);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({
        message: "Error fetching category",
        error: err.message,
      });
    }
  }
});

// Update category by ID
categoriesRoute.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const response = await CategoriesModel.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    res.status(200).json(response);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({
        message: "Error updating category",
        error: err.message,
      });
    }
  }
});

// Delete category by ID
categoriesRoute.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const response = await CategoriesModel.findByIdAndDelete(id);
    res.status(204);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({
        message: "Error deleting category",
        error: err.message,
      });
    }
  }
});
