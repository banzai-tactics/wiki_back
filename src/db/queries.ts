import { User } from './entity/User';
import { Search } from './entity/Search';
import { createQueryBuilder } from 'typeorm';


// /*TYPEORM */
export async function getAllUsersTypeORM() {
    const users = await createQueryBuilder("user")
        .select('user')
        .from(User, 'user')
        .leftJoinAndSelect("user.searches", "search")
        .getMany()
    // const users = await AppDataSource
    // .getRepository(User)
    // .createQueryBuilder("user")
    // .leftJoinAndSelect("user.searches", "search")
    // .getMany()
    return users;

}

export async function createUserTypeORM(username: string, lang: string) {
    //check if user already exists
    const userTmp = await getUserByNameTypeORM(username);
    if (userTmp != null) {
        console.log(userTmp.searches);
        return userTmp;
    } else {
        const user = User.create({
            username: username,
            lang: lang,
            searches: []
        });
        await user.save();
        return user;
    }
}

export async function getUserByNameTypeORM(username: string) {

    const byNameUser = await createQueryBuilder("user")
        .select('user')
        .from(User, 'user')
        .where('user.username = :username', { username: username })
        .leftJoinAndSelect("user.searches", "search")
        .getOne()
    // const userRepo = AppDataSource.getRepository(User);
    // //get by name user
    // const byNameUser = await userRepo.findOneBy({
    //     username: username,
    // })
    // console.log("First user from the db: ", byNameUser)
    return byNameUser;
}

export async function getUserByIdTypeORM(token: string) {
    const user = await createQueryBuilder("user")
        .select('user')
        .from(User, 'user')
        .where("user.token = :token", { token: token })
        .leftJoinAndSelect("user.searches", "search")
        .getOne();

    // const user = await AppDataSource
    // .getRepository(User)
    // .createQueryBuilder("user")
    // .leftJoinAndSelect("user.searches", "search")
    // .where("user.token = :token", { token: token })
    // .getOne()
    return user;
}

//update user function
export async function updateUserTypeORM(token: string, lang: string) {
    const user = User.create({
        lang: lang,
        searches: []
    });
    await user.save();
    return user;

    //     const userRepository = AppDataSource.getRepository(User)
    // const userToUpdate = await userRepository.findOneBy({
    //     token: token,
    // })
    // userToUpdate!.lang = lang;
    // await userRepository.save(userToUpdate!);
}

//remove user function
export async function removeUserTypeORM(token: string) {
    const res = await User.delete(token);
    return res
    // const userRepository = AppDataSource.getRepository(User)
    // const userToUpdate = await userRepository.findOneBy({
    //     token: token,
    // })
    // await userRepository.remove(userToUpdate!);
}

//add search
export async function addSearchTypeORM(user: User, title: string) {
    const search = Search.create({
        searchTitle: title,
        searchTime: new Date().getDate()
    });
    user.addSearch(search);
    user.save();
}

