// Leave routes. Mounted at /api/leaves.
// Apply + read: any authenticated user. Approve/reject + delete: admin only.

import { Router } from "express";
import * as leaveController from "../controllers/leave.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.use(protect);

router
  .route("/")
  .get(leaveController.getAll)
  .post(leaveController.apply);

// Approve / reject — the admin-only workflow transition.
router.patch("/:id/status", authorize("admin"), leaveController.updateStatus);

router
  .route("/:id")
  .get(leaveController.getById)
  .delete(authorize("admin"), leaveController.remove);

export default router;
