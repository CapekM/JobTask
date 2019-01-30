import { HttpServer } from "../server/httpServer";
import { Controller } from "./controller";
import { Request, Response } from "restify";
import { authenticate } from "../services/auth";
import * as jwt from "jsonwebtoken";

require("dotenv").config();

export class HelpController implements Controller {
    public initialize(httpServer: HttpServer): void {
        httpServer.get("ping", (req, res) => res.send(200, "hello"));
        httpServer.get("auth", this.auth.bind(this));
    }

    private async auth(req: Request, res: Response): Promise<void> {
        try {
            const user = await authenticate(req);

            const token = jwt.sign(JSON.parse(JSON.stringify(user)), process.env.JWT_SECRET, {
                expiresIn: "20m",
            });
            // const decoded = jwt.decode(token);
            res.send(token);
        } catch (err) {
            res.send("Invalid user");
        }
    }
}
