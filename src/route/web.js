import express from "express";
import homeController from "../controller/homeController";
import aboutController from "../controller/homeController";
import userController from "../controller/userController";
//import homeController from "../controllers/homeController";

let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/", homeController.getHomePage);
  //router.get('/about', homeController.getAboutPage);

  router.get("/hoihuy", (rep, res) => {
    return res.send("huy owi laf huy");
  });

  router.get("/about", aboutController.getAbout);
  router.get("/crud", homeController.getCrud);
  router.post("/post-crud", homeController.postCRUD);
  router.get("/get-crud", homeController.displayGetCRUD);
  router.get("/edit-crud", homeController.editCRUD);
  router.post("/post-editUser", homeController.postEditUser);
  router.get("/delete-crud", homeController.deleteCRUD);

  //APIs nhung api suw dung voi react thi bat dau bang api
  router.post("/api/login", userController.handleLogin);
  router.get("/api/get-all-user", userController.handleGetAllUser);
  router.post("/api/create-new-user", userController.handleCreateUrer);
  router.put("/api/edit-user", userController.handleEditUser);
  router.delete("/api/delete-user", userController.handleDeleteUser);
  router.get("/api/allcode", userController.getAllcode);

  return app.use("/", router);
};

module.exports = initWebRoutes;
