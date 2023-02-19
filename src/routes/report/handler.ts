import { IRequest, Router } from "itty-router";
import { BAD_GATEWAY, BAD_REQUEST, CREATED } from "http-status";
import { Env } from "../..";
import { toJSON } from "../../utils";
import { ResponseStatus } from "../../constants";
import { constructDiscordEmbed } from "./utilities";
import { ReportTypePhrases, ReportTypeValues } from "./constants";

interface Report {
  data: string;
  userid: string;
  key: string;
}

type ReportResponse =
  | { status: ResponseStatus.Success; message: string }
  | { status: ResponseStatus.Error; reason: string };

const hosts: Record<string, string> = {
  "157.90.1.44": "rust.level9.gg",
};

const post = async (
  request: IRequest,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> => {
  try {
    if (
      !env.REPORTS_DISCORD_WEBHOOK_URL ||
      !env.REPORTS_DISCORD_WEBHOOK_URL.startsWith(
        "https://discord.com/api/webhooks/"
      )
    ) {
      return toJSON<ReportResponse>(
        {
          status: ResponseStatus.Error,
          reason: `Missing or invalid webhook configuration.`,
        },
        { status: BAD_GATEWAY }
      );
    }

    const clientIP =
      request.headers.get("x-real-ip") ??
      request.headers.get("x-forwarded-for");
    const report = Object.fromEntries(await request.formData()) as Report;
    const reportData = JSON.parse(report.data);

    if (report.key !== env.REPORTS_SECRET) {
      return toJSON<ReportResponse>(
        {
          status: ResponseStatus.Error,
          reason: `Unexpected report key. Received "${report.key}".`,
        },
        { status: BAD_REQUEST }
      );
    }

    if (!hosts[clientIP]) {
      return toJSON<ReportResponse>({
        status: ResponseStatus.Error,
        reason: `Unexpected sender IP. Received "${clientIP}".`,
      });
    }

    const discordEmbed = constructDiscordEmbed({
      host: hosts[clientIP],
      type: ReportTypePhrases[reportData.Type as ReportTypeValues],
      reporterSteamID: report.userid,
      offenderSteamID: reportData.TargetId,
      summary: reportData.Subject,
      description: reportData.Message,
    });

    await fetch(env.REPORTS_DISCORD_WEBHOOK_URL, {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(discordEmbed),
    });

    return toJSON<any>(
      {
        status: ResponseStatus.Success,
        message: `Report sent successfully at ${new Date().toISOString()}.`,
      },
      { status: CREATED }
    );
  } catch (error) {
    return toJSON<ReportResponse>({
      status: ResponseStatus.Error,
      reason: (error as Error).message,
    });
  }
};

export const handler = Router({ base: "/report" }).post("/", post).handle;
