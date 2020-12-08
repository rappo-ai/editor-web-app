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
