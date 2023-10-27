//VIET API

import bcrypt from "bcryptjs";
import db from "../models/index";
import { raw } from "body-parser";
const salt = bcrypt.genSaltSync(10);

//function kiem tra user nhap vao co dung khong
let handleUserlogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExist = await checkUseremail(email);
      //user already exist( nguoi dung da ton tai)
      //compare error(so sanh loi )

      if (isExist) {
        //lay ra gia tri User trong databyte  gan vao user kiem tra
        // sử dungj (attributes :[giá trị]) để hiển thị các giá trị từ data lên theo mong muốn
        let user = await db.User.findOne({
          attributes: ["email", "roleId", "password", "firstName", "lastName"],
          where: {
            email: email,
          },
          raw: true,
        });
        //kiem tra mat khau cua nguoi dung co dung khong dung ham (let matchPasswords= await bcrypt.compareSync(password,user.password);)
        if (user) {
          let checkPasswords = await bcrypt.compareSync(
            password,
            user.password
          );
          if (checkPasswords) {
            userData.errcode = 0;
            userData.errMessage = "dang nhap thanh cong";
            userData.user = user;
            delete user.password; //sử dung thư vien delete user.password đê xoa đi phần dư được lấy lên tư data
          } else {
            userData.errcode = 3;
            userData.errMessage =
              "password not//kieu la mat khau sai roi do nhap chi";
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
      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};
//check email exist(kiem tra email truoc)

let checkUseremail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};
//liet ke all user
let getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "ABC";
      if (userId === "ALL") {
        users = await db.User.findAll({
          attributes: {
            exclude: ["password"],
          },
          // hàm attributes nhằm cho phép xuẩt ra cho nguoi dùng những nội dung quy định.ví dụ trong
          // truong hợp này thì không cho người dùng xem password
        });
      }
      if (userId && userId !== "ALL") {
        users = await db.User.findOne({
          where: { id: userId },
          attributes: {
            exclude: ["password"],
          },
        });
      }
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};
//them moi user
let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let check = await checkUseremail(data.email);

      if (check === true) {
        resolve({
          errcode: 1,
          errmessage: "Email da ton tai, vui long nhap lai email khac",
        });
      } else {
        let hashPasswordFromBcrypt = await hashUserPassword(data.password);
        await db.User.create({
          email: data.email,
          password: hashPasswordFromBcrypt,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          phoneNumber: data.phoneNumber,
          gender: data.gender,
          roleId: data.roleId,
          positionId: data.positionId,
        });
        resolve({
          errcode: 0,
          message: "Create user successfully! them user thanh cong",
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
//ma hoa password
let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};
// xoa user
let deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({ where: { id: userId } });
      if (!user) {
        resolve({
          errcode: 2,
          errMessage: `this user isn't exist-nguoi dung nay khong ton tai`,
        });
      }
      //tranh loi user.destroy is not function(nhung ham lien qua den sequelize thi chi dung duoc khi sequelize goi toi)
      await db.User.destroy({
        where: { id: userId },
      });
      resolve({
        errcode: 0,
        errMessage: `this user is delete- user da duoc xoa`,
      });
    } catch (e) {
      reject(e);
    }
  });
};
//edit user
let updateUser = (data) => {
  return new Promise(async (resolve, reject) => {
    if (!data.id) {
      resolve({
        errcode: 2,
        errMessage: "vui long chon id",
      });
    }
    try {
      let user = await db.User.findOne({
        // tao the user va lay gia trij databyte va gan cho user
        where: { id: data.id },
        raw: false, // cach thu 2 de khong gap loi user.save is not function
      });
      //gan gia tri cho nhap tu may vao gia tri lay ra tu databiyte
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;

        await user.save();
        resolve({
          errcode: 0,
          errMessage: `update the user succeed- câp nhật người dung thành công`,
        });
      } else {
        resolve({
          errcode: 1,
          errMessage: "can not find this id- không thể tim thấy id",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
//allcode
let getAllCodeService = (typeInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!typeInput) {
        resolve({
          errcode: 1,
          errMessage: "missing required parame",
        });
      } else {
        let res = {};
        let allcode = await db.Allcode.findAll({
          where: { type: typeInput },
        });
        res.errcode = 0;
        res.data = allcode;
        resolve(res);
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  handleUserlogin: handleUserlogin,
  getAllUsers: getAllUsers,
  createNewUser: createNewUser,
  deleteUser: deleteUser,
  updateUser: updateUser,
  getAllCodeService: getAllCodeService,
};
