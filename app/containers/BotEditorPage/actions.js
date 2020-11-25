/*
 *
 * BotEditorPage actions
 *
 */

export function loadBotModel(botId, createIfNone) {
  return {
    type: 'LOAD_BOT_MODEL',
    botId,
    createIfNone,
  };
}
