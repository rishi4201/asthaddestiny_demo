import { Router, type IRouter } from "express";
import healthRouter from "./health";
import storageRouter from "./storage";
import usersRouter from "./users";
import questionnaireRouter from "./questionnaire";
import chatRouter from "./chat";
import paymentsRouter from "./payments";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(storageRouter);
router.use(usersRouter);
router.use(questionnaireRouter);
router.use(chatRouter);
router.use(paymentsRouter);
router.use(adminRouter);

export default router;
