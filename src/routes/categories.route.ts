import { Response, Request, Router } from "express";

import { CategoriesModel } from "../schema/schema";
import { checkPermission } from "../controllers/auth.controller";

export const categoriesRoute: Router = Router();

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
      res.status(201).json({
        message: "Category created successfully",
        data: categories,
      });
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

categoriesRoute.get("/all", async (req: Request, res: Response) => {
  try {
    const response = await CategoriesModel.find();

    res.status(200).json({
      message: "Categories fetched successfully",
      data: response,
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({
        message: "Error fetching categories",
        error: err.message,
      });
    }
  }
});

categoriesRoute.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const response = await CategoriesModel.findById(id).populate("artworks");
    res.status(200).json({
      message: "Category fetched successfully",
      data: response,
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({
        message: "Error fetching category",
        error: err.message,
      });
    }
  }
});
