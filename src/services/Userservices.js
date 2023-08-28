//VIET API

import bcrypt from 'bcryptjs';
import db from '../models/index';
import { raw } from 'body-parser';
const salt = bcrypt.genSaltSync(10);


//function kiem tra user nhap vao co dung khong
let handleUserlogin = (email,password)=>
{
    return new Promise(async(resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUseremail(email)
                //user already exist( nguoi dung da ton tai)
                //compare error(so sanh loi )

        
            if (isExist) {

            //lay ra gia tri User trong databyte  gan vao user kiem tra
            // sử dungj (attributes :[giá trị]) để hiển thị các giá trị từ data lên theo mong muốn
                let user = await db.User.findOne({
                    attributes: ['email', 'roleId','password'],
                    where:{
                        email:email
                    },
                    raw : true
                    
                });
                //kiem tra mat khau cua nguoi dung co dung khong dung ham (let matchPasswords= await bcrypt.compareSync(password,user.password);)
                if (user) {
                    let checkPasswords= await bcrypt.compareSync(password,user.password);
                    if (checkPasswords) {
                        userData.errcode = 0;
                        userData.errMessage = 'dang nhap thanh cong';
                        userData.user = user;
                        delete user.password;//sử dung thư vien delete user.password đê xoa đi phần dư được lấy lên tư data
                    } else {
                        userData.errcode = 3;
                        userData.errMessage = 'password not//kieu la mat khau sai roi do nhap chi'
                    }
                    
                    
                } else {
                    userData.errcode = 2;
                    userData.errMessage = `user not found/ khong co user`;
                }
            } else {
                //return error
                userData.errcode = 1;
                userData.errMessage = `you's email isn't exist in your system try other email (email cua ban khogn ton tai trong he thongg vui long nhap email khac)`;

            }
            resolve(userData)
        } 
        catch (e) {
            reject(e)
        }
    })
}
//check email exist(kiem tra email truoc)

let checkUseremail = (userEmail) =>{
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {email: userEmail}
            })
            if (user) {
                resolve(true)
                
            } else {
                resolve(false)
            }
        } catch (e) {
            reject(e)
            
        }
    })
}
 let getAllUsers = (userId)=>{
    return new Promise(async(resolve, reject) => {
        try {
            let users = 'ABC'
            if(userId === 'ALL'){
                users = await db.User.findAll({
                    attributes: {
                        exclude : ['password']
                    }
                    // hàm attributes nhằm cho phép xuẩt ra cho nguoi dùng những nội dung quy định.ví dụ trong 
                    // truong hợp này thì không cho người dùng xem password
                })
            }
            if(userId && userId !== 'ALL'){
                users = await db.User.findOne({
                    where:{id : userId},
                    attributes: {
                        exclude : ['password']
                    }
                })
            }
            resolve(users)
        } catch (e) {
            reject(e)
        }
    })
 }
module.exports={
    handleUserlogin:handleUserlogin,
    getAllUsers : getAllUsers,
}