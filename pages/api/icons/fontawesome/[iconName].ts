import { Buffer } from "node:buffer";
import {
  library,
  icon,
  Icon,
  IconPrefix,
  IconName,
} from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import type { NextApiRequest, NextApiResponse } from "next";

library.add(fas, far, fab);

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

function buildSVGImageStr(anIcon: Icon): string {
  const { icon: iconContent } = anIcon;
  const [w, h, ligatures, unicode, data] = iconContent;
  return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">
            <path d="${data}" />
        </svg>
    `;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Buffer | string>
) {
  const { iconName, prefix = "fas" } = req.query;
  const reqIcon = icon({
    prefix: prefix as IconPrefix,
    iconName: iconName as IconName,
  });
  if (!reqIcon) return res.status(404).send("Image not found");
  const iconStr = buildSVGImageStr(reqIcon);
  const imageBuffer = Buffer.from(iconStr, "utf-8");
  res.setHeader("Content-Type", "image/svg+xml");
  res.status(200).send(imageBuffer);
}
