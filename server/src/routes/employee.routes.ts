// Employee routes. Mounted at /api/employees.
// Policy: any authenticated user may READ; only admins may WRITE.

import { Router } from "express";
import * as employeeController from "../controllers/employee.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.use(protect);

router
  .route("/")
  .get(employeeController.getAll)
  .post(authorize("admin"), employeeController.create);

router
  .route("/:id")
  .get(employeeController.getById)
  .put(authorize("admin"), employeeController.update)
  .delete(authorize("admin"), employeeController.remove);

export default router;
