// Department routes. Mounted at /api/departments.
// Policy: any authenticated user may READ; only admins may WRITE.

import { Router } from "express";
import * as departmentController from "../controllers/department.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

// Every department route requires authentication.
router.use(protect);

router
  .route("/")
  .get(departmentController.getAll)
  .post(authorize("admin"), departmentController.create);

router
  .route("/:id")
  .get(departmentController.getById)
  .put(authorize("admin"), departmentController.update)
  .delete(authorize("admin"), departmentController.remove);

export default router;
