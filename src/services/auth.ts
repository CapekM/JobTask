import { User } from "../entity/User";
import { getRepository } from "typeorm";
import { Request } from "restify";

export async function authenticate(req: Request): Promise<User> {
    return (req.body.name === "")
        ? getRepository(User).findOne(req.body.email)
        : getRepository(User).findOne(req.body.name);

    // bcrypt.compare(one, other, (err, isMatch) => {
    //     if (err) {
    //         throw err;
    //     }
    //     if (isMatch) {

    //     }
    //     else {

    //     }
    // })
}
