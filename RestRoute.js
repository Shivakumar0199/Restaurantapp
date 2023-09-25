const RestController = require("./RestController");

module.exports = (app) =>{

    app.get("/api", RestController.getData);

    app.get("/fetchDetails/:id", RestController.getId);

    app.get("/getplaceorder/:id", RestController.getplaceorder);

    app.get("/getCart/:id", RestController.getCart);

    app.get("/getProfile/:id", RestController.getProfile);

    app.post("/login", RestController.login);

    app.post("/register", RestController.register);

    app.post("/RestuarantList", RestController.restuarantList);

    app.put("/updateList", RestController.updateList);

    app.put("/updateOrder", RestController.updateOrder);

    app.put("/addToCart", RestController.addToCart);

    app.delete("/deleteList", RestController.deleteList);

    app.post("/deleteitem", RestController.deleteitem);

    app.post("/placeorder", RestController.placeorder);
}