// Payroll routes. Mounted at /api/payrolls.
// Policy: admin-only for every operation (sensitive financial data).

import { Router } from "express";
import * as payrollController from "../controllers/payroll.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

// Authenticated AND admin for all payroll routes.
router.use(protect, authorize("admin"));

router
  .route("/")
  .get(payrollController.getAll)
  .post(payrollController.generate);

router
  .route("/:id")
  .get(payrollController.getById)
  .delete(payrollController.remove);

export default router;
