import { APP_NAME, createCard } from "@mnemo/shared";

const card = createCard({
  front: "workspace",
  back: "npm workspaces",
});

console.log(`${APP_NAME} api`, card.front);
