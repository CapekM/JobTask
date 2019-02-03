import { HttpServer } from "../server/httpServer";
import { Controller } from "./controller";
import { Request, Response } from "restify";
import { authenticate } from "../services/auth";
import * as jwt from "jsonwebtoken";

require("dotenv").config();

export class HelpController implements Controller {
    public initialize(httpServer: HttpServer): void {
        httpServer.get("ping", (req, res) => res.send(200, "hello"));
        httpServer.post("auth", this.auth.bind(this));
    }

    private async auth(req: Request, res: Response): Promise<void> {
        try {
            const user = await authenticate(req.body.name);

            const token = jwt.sign(JSON.parse(JSON.stringify(user)), process.env.JWT_SECRET, {
                expiresIn: "1h",
            });
            const decoded = jwt.decode(token);
            res.send({decoded, token});
        } catch (err) {
            res.send("Invalid user");
        }
    }
}
