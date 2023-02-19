import { APIMessage } from 'discord-api-types/payloads/v10';

export const constructDiscordEmbed = ({
  host,
  type,
  reporterSteamID,
  offenderSteamID,
  summary,
  description,
}: {
  host: string;
  type: string;
  reporterSteamID: string;
  offenderSteamID: string;
  summary: string;
  description: string;
}): Partial<APIMessage> => {
  return {
    embeds: [{
      author: {
        name: 'Rust',
        icon_url: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Rust_Logo.png',
      },
      description: `A new report has been submitted on ${host}`,
      color: 10038562,
      fields: [
        {
          name: "Reporter Steam ID",
          value: reporterSteamID
            ? `[${reporterSteamID}](https://steamcommunity.com/profiles/${reporterSteamID})`
            : "_(none)_",
          inline: true,
        },
        {
          name: "Offender Steam ID",
          value: offenderSteamID
            ? `[${offenderSteamID}](https://steamcommunity.com/profiles/${offenderSteamID})`
            : "_(none)_",
          inline: true,
        },
        {
          name: 'Report type',
          value: type ?? '_(none)_',
        },
        {
          name: 'Summary',
          value: summary?.trim() ?? '_(none)_',
        },
        {
          name: 'Description',
          value: description?.trim() ?? '_(none)_',
        },
      ]
    }]
  };
};
