import { User } from "../entity/User";
import { getRepository } from "typeorm";
import * as jwt from "jsonwebtoken";

export async function authenticate(name: string): Promise<string> {
    const users = await getRepository(User).find();
    let user = new User();
    users.forEach((tmp) => {
        if (tmp.username === name) {
            user = tmp;
        }
    });
    if (user.username !== name) {
        return Promise.reject();
    }

    return  jwt.sign(JSON.parse(JSON.stringify(user)), process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
}

export function getUserID(auth: string): number {
    let token: string;
    if (auth.substring(0, 6) === "Bearer") {
        token = auth.substring(7);
    } else if (auth.substring(0, 3) === "Jwt") {
        token = auth.substring(4);
    }
    const decoded = jwt.decode(token);
    return decoded["id"];
}
