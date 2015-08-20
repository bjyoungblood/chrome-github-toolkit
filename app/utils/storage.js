export default function() {
  return next => (reducer, initialState) => {
    let store = next(reducer, initialState);
    store.subscribe(function() {
      chrome.storage.local.set({ state: JSON.stringify(store.getState()) });
    });
    return store;
  };
}
