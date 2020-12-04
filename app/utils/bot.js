export function hasTransition(model, state) {
  return (
    model &&
    model.transitions &&
    model.transitions.some(t => t.fromStateId === state.id)
  );
}
