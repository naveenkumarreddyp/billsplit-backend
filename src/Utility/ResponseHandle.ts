// Interface for structured response
export interface ApiResponse {
  success: boolean;
  statuscode: number;
  message: string;
  data: any;
}

class HandleResponse {
  // Method to handle response formatting
  public static handleResponse(
    success: boolean,
    statuscode: number,
    message: string,
    data: any
  ): ApiResponse {
    return { success, statuscode, data, message };
  }
}

export default HandleResponse;
