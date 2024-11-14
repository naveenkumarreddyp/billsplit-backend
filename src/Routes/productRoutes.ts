import { Router } from "express";
import ProductController from "../Controller/ProductController";

class ProductRoutes {
  private router: Router;
  private productController: ProductController = new ProductController();

  constructor() {
    this.router = Router();
    // this.productController = new ProductController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router
      .route("/getProduct")
      .get(this.productController.getProduct.bind(this.productController));
    this.router
      .route("/createProduct")
      .post(this.productController.createProduct.bind(this.productController));
  }

  public getRoutes(): Router {
    return this.router;
  }
}

export default ProductRoutes;
