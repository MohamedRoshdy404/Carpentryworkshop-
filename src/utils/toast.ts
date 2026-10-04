export const showToast = (message: string) => {
  window.dispatchEvent(
    new CustomEvent("app-toast", {
      detail: { message },
    }),
  );
};
