export const APP_NAME = "MneMo";

export function createCard({ front, back }) {
  return {
    id: crypto.randomUUID(),
    front,
    back,
  };
}
