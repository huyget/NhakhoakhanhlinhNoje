//viết API

import Userservices from '../services/Userservices'
import db from '../models/index';

//Kiểm tra xemq thử email và password bên trong phía người dùng gủi lên
let handleLogin = async (req, res) =>{
    let email = req.body.email;
    let password = req.body.password;
//!email : kiem tra dieu kien email nghia la email khac rong( neu !EMAIL rong thi se in ra)
    if (!email || !password) {
        return res.status(500).json({
            errCode : 1,
            message: 'missing inputs parameter// tham so dau vao thieu'
        })
    } 
//ham kiem tra ben controller trỏ tới services không hiển thị ra màng hình
    let userDATA = await Userservices.handleUserlogin(email, password);

    //check email exist
    //compare password
    //return userInfor
    //access token : jwt json web token

    //kiểm tra email password đung
    return res.status(200).json({
        errCode : userDATA.errcode,
        message:userDATA.errMessage,
        user : userDATA? userDATA.user : {}//trả về về thành công thì chỉ trả về giá trị của nó 
       // userDATA,//tra ra them  errCode : userDATA.errcode,
        //message:userDATA.errMessage,


        // errCode: 0,
        // message:"text",
        // youremail:email,
        // yourpassword:password,
        // test: 'test'
    })

}
//liet ke all user
let handleGetAllUser = async (req, res) =>{
    let id = req.query.id; // .id tra ra 2 gia tri truyen vào đó là ALL HOẶC SINGLE
//truyên tham số vào trên url (vi dụ http://localhost:3000/api/get-all-user?id=12) còn req.body thì khong có 
    if (!id){
        return res.status(200).json({
        errCode : 1,
        message:'(missing required parameter( thieu tham so bat buoc))',
        user :[]
    })
}

    let user = await Userservices.getAllUsers(id);
    return res.status(200).json({
        errCode : 0,
        message:'nhan duoc',
        user
    })
}
//them moi user
let handleCreateUrer =async (req, res) =>{
   let message = await Userservices.createNewUser(req.body)
   console.log(message)
   return res.status(200).json(message)
}
//delete user
let handleDeleteUser = async (req, res) =>{
    if(!req.body.id){
        res.status(200).json({
            errCode : 1,
            errMessage:'missing required parameter-thieu tham so bat buoc'
        })
    }
    let message = await Userservices.deleteUser(req.body.id)
    return res.status(200).json(message)
}
//edit user
let handleEditUser = async (req, res) =>{
    let data = req.body
    let message = await Userservices.updateUser(data)
    return res.status(200).json(message)
}
module.exports = {
    handleLogin:handleLogin,
    handleGetAllUser:handleGetAllUser,
    handleCreateUrer:handleCreateUrer,
    handleDeleteUser:handleDeleteUser,
    handleEditUser: handleEditUser,
}