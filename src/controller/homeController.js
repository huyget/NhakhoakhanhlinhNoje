import db from '../models/index';
import CRUDservices from '../services/CRUDservices';
let getHomePage =async (req, res)=>{
    try {
        let data = await db.User.findAll();
        console.log('-------------------')
        console.log(data)
        console.log('-------------------')
        return res.render('homepage.ejs')
    } catch (e) {
        console.log(e)
    }
}

let getAbout = (req, res) =>{
    return res.render('text/about.ejs')
}
let getCrud = (req, res) =>{
    return res.render('crud.ejs')
}
let postCRUD = async(req, res) =>{
   let message = await CRUDservices.createNewUser(req.body);
   console.log(message)
    return res.send('post curd from server');

}
let displayGetCRUD = async (req, res) =>{
    let data = await CRUDservices.getAllUser();
    console.log('--------------------')
    console.log(data)
    console.log('--------------------')
    return res.render('displayCrud.ejs',{
        dataTable : data
    })
}

// let editCRUD = async (req, res) =>{
//     let userId = req.query.id;
//     if (userId) {
//         let userDATA = await CRUDservices.getUserInfoById(userId);
//         console.log('---------------')
//         console.log(userDATA)
//         console.log("----------------")
//         return res.send('haha xong')
//     } else {
//         return res.send('looix')
//     }
// } demo kiem tra file co hoat dong


let editCRUD = async (req, res) =>{
    let userId = req.query.id;// la
    if (userId) {
        let userData = await CRUDservices.getUserInfoById(userId);
       
        return res.render('editCRUD.ejs',{
            user : userData,
        });
    }
    else {
        return res.send('user not found!');
        }
}

// let postEditUser = async(req, res) =>{
//     let data = req.body;
//     console.log('-----------')
//     console.log(data)
//     return res.send('nhan duocj')
// } kiem tra data da duoc thay doi chua

let postEditUser = async (req, res) =>{
    let data = req.body;//lay du lieu nhap vaof
    let allUsers = await CRUDservices.updateUserData(data);
    return res.render('displayCrud.ejs',{
        dataTable : allUsers
    })
}

// let deleteCRUD = async (req, res) =>{
//     let id = req.query.id; 
//     if (id) {
//         let allUsers = await CRUDservices.deleteUserData(id)
//         return res.render('displayCrud.ejs',{
//             dataTable:allUsers
//         })
//     } else {
//         return res.send('that bai')
//     }
    
    
// }
let deleteCRUD = async (req, res) =>{
    let id = req.query.id; 
    if (id) {
        let allUsers = await CRUDservices.deleteUserData(id)
        return res.render('displayCrud.ejs',{
            dataTable:allUsers
        })
    } else {
        return res.send('that bai')
    }
    
    
}
// //object:{

//     key:
//     value:
// }

module.exports = {
    getHomePage:getHomePage,
    getAbout : getAbout,
    getCrud  : getCrud,
    postCRUD : postCRUD,
    displayGetCRUD : displayGetCRUD,
    editCRUD : editCRUD,
    postEditUser:postEditUser,
    deleteCRUD:deleteCRUD,
}