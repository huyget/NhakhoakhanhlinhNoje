
import bcrypt from 'bcryptjs';
import db from '../models/index';
import { raw } from 'body-parser';
const salt = bcrypt.genSaltSync(10);


//1- su dung ham ( async-await) de xu ly bat dong bo( xu ly bat dong bo la gi la co nghia la khi chay thi phai bi bat chay theo thu tu a-z)


//tao user moi
let createNewUser = async(data) =>{
    return new Promise(async(resolve, reject)=>{
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password)
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastname,
                address: data.address,
                phoneNumber: data.PhoneNumber,
                gender:data.gender === '1' ? true : false,
                roleId: data.RoleId
            })
            resolve ('ok create a new user succeed')
        } catch (e) {
            reject(e)
        }
    })
}
//ma hoa password bang (sequelize hash)
let hashUserPassword = (password) =>{
    return new Promise(async(resolve, reject) =>{
        try {
            let hashPassword =await bcrypt.hashSync(password, salt);
            resolve(hashPassword)
        } catch (e) {
            reject(e);
        }
    })
}
//lay ra tat ca user
let getAllUser = () => {
    return new Promise(async(resolve, reject) => {
        try {
            let users = db.User.findAll({
                raw: true,
            });
            resolve(users)
        } catch (e) {
            reject(e)
        }
    })
}

// lay ra user theo dia chi id
let getUserInfoById = (userId) =>{
    return new Promise(async (resolve, reject) => {
        try {
            let user =await db.User.findOne({
                where :{id :userId},
                raw: true
            });
            if (user) {
                resolve(user)
            } else {
                resolve([])
            }
        } 
        catch (e) {
            reject(e)
            
        }
    })
}
// let updateUserData = (data) =>{
//     return new Promise( async (resolve, reject) => {
//         try {
//             let user =await db.User.findOne({
//                 where :{id :user.id},
//                 raw: true
//             });
//             if(user){
//                 resolve(user)
//             }
//             else{
//                 resolve()
//             }
//         } catch (e) {
//             resolve(e)
//         }
//     })
// }


let updateUserData = (data) =>{
    return new Promise(async(resolve, reject) => {
        //lay ra gia tri tronfg databiyte va so sanh voi gia tri nhap vao bang function : findOne 
        try {
            let user = await db.User.findOne({  // tao the user va lay gia trij databyte va gan cho user
                where: {id : data.id},
                raw : false
            })
            //gan gia tri cho nhap tu may vao gia tri lay ra tu databiyte
            if (user) {
                user.lastName = data.lastName;
                user.firstName = data.firstName;

                user.address = data.address;
                user.phoneNumber = data.phoneNumber;

                await user.save();
                let AllUsers = await db.User.findAll();
                resolve(AllUsers)
            } else {
                resolve()
            }
        } catch (e) {
            console.log(e)
        }
    })
}

// su dung function user.destroy de xoa user duoc lay ra
let deleteUserData = (userId) =>{
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where:{ id: userId}
            });
            if (user) {
                await db.User.destroy({where:{ id: userId}});
                let AllUsers = await db.User.findAll();
                resolve(AllUsers)
            } else {
                resolve()
            }
            resolve('thanh cong')
        } catch (e) {
            console.log(e)
        }
    })
}
// function deleteUserData(id) {
//     return new Promise(async(resolve, reject) => {
//       try {
//         let user = await db.User.findOne({
//           where: {id: id}
//         });
//         if (user) {
//           await user.destroy();
//           let AllUsers = await db.User.findAll();
//           resolve(AllUsers);
//         } else {
//           resolve();
//         }
//       } catch (e) {
//         console.log(e);
//       }
//     });
//   }
module.exports = {
    createNewUser : createNewUser,
    getAllUser:getAllUser,
    getUserInfoById : getUserInfoById,
    updateUserData : updateUserData,
    deleteUserData : deleteUserData,
}