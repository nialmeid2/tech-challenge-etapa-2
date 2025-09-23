
import db from "../db/db";
import { compare, genSalt, hash } from 'bcrypt';
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { isPassSecure } from "./utils/str";





export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    balance: number;
    createdAt: Date;
}


export async function loginUser(user: User) {
    "use server"

    try {
        const foundUser = await db.user.findUnique({
            where: { email: user.email },
        });

        if (!foundUser || !user.password) return undefined;

        const isValid = await compare(user.password!, foundUser.password);
        if (!isValid)
            return undefined;

        foundUser.password = '';
        await db.$disconnect();

        return foundUser as User;

    } catch (err) {
        console.log(err)
        throw err;
    }
}

export async function createUser(user: Omit<User, "id">) {
    "use server"

    try {

        const salt = await genSalt(+(process.env as any).SALT_ROUNDS);
        user.password = await hash(user.password, salt);


        const createdUser = await db.user.upsert({
            where: { email: user.email },
            update: {},
            create: user
        });

        createdUser.password = ''; // no pass circulating around        
        await db.$disconnect();

        return createdUser as User;
    } catch (err) {
        console.log(err)
        throw err;
    }
}

export async function updateUser(id: number, name: string, pass: string) {
    "use server"

    try {

        if (!name && !pass) return;

        if (pass && !isPassSecure(pass)) return;


        if (!pass) {
            await db.user.update({
                where: { id },
                data: { name }
            })
        } else {
            const salt = await genSalt(+(process.env as any).SALT_ROUNDS);
            const hashPass = await hash(pass, salt);
            if (name) {
                await db.user.update({
                    where: { id },
                    data: { name, password: hashPass }
                })
            } else {
                await db.user.update({
                    where: { id },
                    data: { password: hashPass }
                })
            }
        }


        await db.$disconnect();

    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function emailExists(email: string) {
    "use server"

    try {
        const user = await db.user.findUnique({
            where: { email: email },
            select: { email: true }
        })

        await db.$disconnect();

        if (user)
            return true; // email exists

        return false;
    } catch (err) {
        console.log(err);
        throw err;
    }

}

export async function getRefreshedData(userId: number) {
    "use server"

    try {
        const refreshedData = await db.user.findUnique({
            where: { id: userId },
        });

        await db.$disconnect();

        return refreshedData;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function createUserCookie(theCookies: ReadonlyRequestCookies, user: User) {
    "use server"

    theCookies.set('user', JSON.stringify(user), {
        httpOnly: true,
        secure: true,
        sameSite: 'strict', // anti-xss
        maxAge: 60 * 60 * 24 * 1 // 1 day = 1 * 24 (1 day = 24 hours) * 60 (1 hour = 60 minutes) * 60 (1 minute = 60 seconds)
    });

    return;
}

export async function getUserCookie(theCookies: ReadonlyRequestCookies) {
    "use server";

    const cookieVal = theCookies.get('user')

    return cookieVal?.value ? JSON.parse(cookieVal.value) as User : undefined;

}