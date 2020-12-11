export function hasInTransition(model, state) {
  return (
    model &&
    model.transitions &&
    model.transitions.some(t => t.toStateId === state.id)
  );
}

export function hasOutTransition(model, state) {
  return (
    model &&
    model.transitions &&
    model.transitions.some(t => t.fromStateId === state.id)
  );
}

export function getTransition(model, fromStateId, toStateId, event) {
  return (
    model &&
    model.transitions &&
    model.transitions.find(
      t =>
        t.fromStateId === fromStateId &&
        t.toStateId === toStateId &&
        t.event.type === event.type &&
        t.event.value === event.value,
    )
  );
}

export function isDirectAncestor(model, testStateId, baseStateId) {
  function test(toStateId) {
    return model.transitions
      .filter(
        t =>
          t.toStateId === toStateId &&
          t.event.type === 'response' &&
          t.event.value === '',
      )
      .some(t => t.fromStateId === testStateId || test(t.fromStateId));
  }
  return (
    model &&
    model.transitions &&
    (testStateId === baseStateId || test(baseStateId))
  );
}
