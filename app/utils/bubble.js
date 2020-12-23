import {
  START_MESSAGE_BUBBLE_BACKGROUND_COLOR,
  END_MESSAGE_BUBBLE_BACKGROUND_COLOR,
  FILTER_MESSAGE_BUBBLE_BACKGROUND_COLOR,
  BOT_MESSAGE_BUBBLE_BACKGROUND_COLOR,
  BOT_MESSAGE_BUBBLE_FONT_COLOR,
  USER_MESSAGE_BUBBLE_BACKGROUND_COLOR,
  USER_MESSAGE_BUBBLE_FONT_COLOR,
} from './constants';
import { filters } from './filters';

export function getBubbleFontColor(user) {
  return user === 'bot'
    ? BOT_MESSAGE_BUBBLE_FONT_COLOR
    : USER_MESSAGE_BUBBLE_FONT_COLOR;
}

export function getBubbleBackgroundColor(user, type) {
  let color = BOT_MESSAGE_BUBBLE_BACKGROUND_COLOR;
  switch (user) {
    case 'start':
      color = START_MESSAGE_BUBBLE_BACKGROUND_COLOR;
      break;
    case 'end':
      color = END_MESSAGE_BUBBLE_BACKGROUND_COLOR;
      break;
    case 'typing':
      color = USER_MESSAGE_BUBBLE_BACKGROUND_COLOR;
      break;
    case 'user':
      color =
        type === 'filter'
          ? FILTER_MESSAGE_BUBBLE_BACKGROUND_COLOR
          : USER_MESSAGE_BUBBLE_BACKGROUND_COLOR;
      break;
    case 'bot':
    default:
      color = BOT_MESSAGE_BUBBLE_BACKGROUND_COLOR;
      break;
  }
  return color;
}

export function getBubbleText(user, text, type) {
  if (user !== 'user' || type === 'response') {
    return text;
  }
  if (type === 'filter') {
    return filters[text];
  }
  return '';
}
