import { Router } from "itty-router";
import { handler as reportHandler } from "./routes/report/handler";

export interface Env {
  REPORTS_SECRET?: string;
  REPORTS_DISCORD_WEBHOOK_URL?: string;
}

const rootRouter = Router();
rootRouter.all("/report/*", reportHandler);

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    return rootRouter.handle(request, env, ctx);
  },
};
