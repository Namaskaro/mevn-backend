const router = require("express-promise-router")();

const { order } = require("../controllers");

router.route("/:id").get(order.get);
router.route("/").post(order.create);
router.route("/").get(order.getAll);
router.route("/:id").put(order.update);
router.route("/:id").delete(order.delete);

module.exports = router;
