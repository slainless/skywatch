import { Backend, HTTPError } from "@skywatch/common";
import type { ErrorRequestHandler } from "express";

export class ErrorHandler extends Backend.Component {
  mount(): ErrorRequestHandler {
    return (error, req, res, next) => {
      this.logger?.error(error);
      res.set("Content-Type", "text/plain; charset=utf-8");
      if (error instanceof HTTPError)
        res.status(error.status).send(error.message);
      else if (error instanceof Error) res.status(500).send(error.message);
      else res.status(500).send(error);
    };
  }
}
