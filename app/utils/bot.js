export function hasTransition(model, state) {
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
        t.event === event,
    )
  );
}

export function isDirectAncestor(model, testStateId, baseStateId) {
  function test(toStateId) {
    return model.transitions
      .filter(t => t.toStateId === toStateId && t.event === '')
      .some(t => t.fromStateId === testStateId || test(t.fromStateId));
  }
  return (
    model &&
    model.transitions &&
    (testStateId === baseStateId || test(baseStateId))
  );
}
