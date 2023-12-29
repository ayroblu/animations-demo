type Deferred = ReturnType<typeof deferred>;
function deferred() {
  const result = {
    resolve: () => {},
    reject: () => {},
    promise: Promise.resolve(),
  };
  result.promise = new Promise<void>((resolve, reject) => {
    result.resolve = resolve;
    result.reject = reject;
  });
  return result;
}
export function wrapInViewTransition(func: () => void) {
  if (!document.startViewTransition) {
    func();
  } else {
    document.startViewTransition(async () => {
      const def = deferred();
      deferredItems.push(def);
      func();
      await def.promise;
    });
  }
}
let deferredItems: Deferred[] = [];
export function handleViewTransition() {
  deferredItems.forEach((p) => {
    p.resolve();
  });
  deferredItems = [];
}
