import {
  Injectable,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";
import { Strings } from "../data/strings";
import { Entities } from "../data/enums.js";

@Injectable()
export class ErrorsCatchingFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status: number;
    let errorResponse: any;
    let message: any;

    if (exception.getResponse && typeof exception.getResponse === "function") {
      console.log(exception.getResponse());
    } else {
      console.log(exception);
    }

    if (
      // exception.includes("Cast to ObjectId failed for value ") ||
      exception.message.includes("Cast to ObjectId failed for value ")
    ) {
      const match = exception.message.match(
        /Cast to ObjectId failed for value "(\w+)"/,
      );
      const fieldName = match ? match[1] : null;
      const id = fieldName.replace("_id", "");

      const splittedMessageArray = exception.message.split(" ");
      const entityText = splittedMessageArray[
        splittedMessageArray.length - 1
      ].replace(/"/g, "");
      const entity = Entities[entityText];

      message = Strings.entityWasNotFoundById(entity, id);
    } else if (exception.message.includes("duplicate key error")) {
      const entity =
        Entities[
          Strings.capitalizeFirstLetterAndRemoveSymbols(
            request.path.split("/")[1],
          )
        ];
      const field =
        Entities[
          Strings.capitalizeFirstLetterAndRemoveSymbols(
            Object.keys(exception.keyValue)[0],
          )
        ];

      message = Strings.objectWithFieldAlreadyExists(entity, field);
    } else {
      message =
        exception.getResponse && typeof exception.getResponse === "function"
          ? exception.getResponse().message
          : exception.message;
    }

    if (exception instanceof HttpException) {
      status = exception.getStatus();
    } else {
      status = HttpStatus.BAD_REQUEST;
    }

    errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    };

    response.status(status).json(errorResponse);
  }
}
