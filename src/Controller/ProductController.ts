import { Request, Response } from "express";
import HandleResponse, { ApiResponse } from "../Utility/ResponseHandle";
// import { IUserServiceInterface } from "../Services/UserService";
// import { UserDTO } from "../DTO/ProductDTO";
import { IGetUserAuthInfoRequest } from "../Utility/RequestModifier";
import ProductService from "../Services/ProductService";

class ProductController {
  private productService: ProductService = new ProductService();
  constructor() {
    // this.createProduct = this.createProduct.bind(this);
    // this.getProduct = this.getProduct.bind(this);
  }
  public async createProduct(
    req: IGetUserAuthInfoRequest,
    res: Response
  ): Promise<any> {
    let result: ApiResponse;
    try {
      // console.log(req.userDetails)
      const serviceInfo = await this.productService.addProduct(req.body);
      result = HandleResponse.handleResponse(
        true,
        200,
        "products created sucessfully",
        serviceInfo
      );
      return res.send(result);
    } catch (err) {
      console.log(err);
      result = HandleResponse.handleResponse(
        false,
        500,
        "product failed",
        null
      );
      res.status(500).send(result);
    }
  }

  public async getProduct(
    req: IGetUserAuthInfoRequest,
    res: Response
  ): Promise<any> {
    try {
      console.log(req.userDetails);
      // const data: UserDTO = req.body;

      const serviceInfo = await this.productService.fetchProduct();
      const result: ApiResponse = HandleResponse.handleResponse(
        true,
        200,
        "fetch products successfully",
        serviceInfo
      );
      return res.send(result);
    } catch (err) {
      const result: ApiResponse = HandleResponse.handleResponse(
        false,
        500,
        "failed to fetch user" + err,
        null
      );
      res.status(500).send(result);
    }
  }
}

export default ProductController;
