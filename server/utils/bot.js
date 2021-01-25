const TRANSITION_EVENT_TYPE_FILTER = 'filter';
const TRANSITION_EVENT_TYPE_RESPONSE = 'response';

const FALLBACK_FILTER = '*';

function getNextState(
  model,
  fromStateId,
  transitionEventType,
  transitionEventValue,
) {
  let isFallback = false;
  let transition = model.transitions.find(
    e =>
      e.fromStateId === fromStateId &&
      e.event.type === transitionEventType &&
      e.event.value === transitionEventValue,
  );
  if (!transition) {
    // direct transition not found, looking for catch-all
    transition =
      transitionEventValue !== '' &&
      model.transitions.find(
        e =>
          e.fromStateId === fromStateId &&
          e.event.type === TRANSITION_EVENT_TYPE_FILTER &&
          e.event.value === FALLBACK_FILTER,
      );
    if (transition) {
      isFallback = true;
    }
  }
  let state = null;
  if (transition) {
    state = model.states.find(e => e.id === transition.toStateId);
  }

  return {
    transition,
    state,
    isFallback,
  };
}

function hasOutTransition(model, stateId) {
  return (
    model &&
    model.transitions &&
    model.transitions.some(t => t.fromStateId === stateId)
  );
}

function hasNullOutTransition(model, stateId) {
  return (
    model &&
    model.transitions &&
    model.transitions.some(
      t =>
        t.fromStateId === stateId &&
        t.event.type === TRANSITION_EVENT_TYPE_RESPONSE &&
        t.event.value === '',
    )
  );
}

module.exports = {
  getNextState,
  hasOutTransition,
  hasNullOutTransition,
  TRANSITION_EVENT_TYPE_FILTER,
  TRANSITION_EVENT_TYPE_RESPONSE,
  FALLBACK_FILTER,
};
