// Load saved options when options page is opened
window.onload = () => {
  chrome.storage.local.get(["windowLimit", "groupingOption"], (options) => {
    document.getElementById("windowLimit").value = options.windowLimit || 5;
    document.getElementById("groupingOption").value =
      options.groupingOption || "domain";
  });
};

document.getElementById("saveOptions").addEventListener("click", () => {
  let windowLimit = parseInt(document.getElementById("windowLimit").value);
  let groupingOption = document.getElementById("groupingOption").value;

  // Validate and sanitize the options
  windowLimit =
    Number.isInteger(windowLimit) && windowLimit > 0 ? windowLimit : 5;
  groupingOption = ["domain", "title"].includes(groupingOption)
    ? groupingOption
    : "domain";

  // Save the options
  chrome.storage.local.set({ windowLimit, groupingOption }, () => {
    let status = document.getElementById("status");
    status.textContent = "Options saved successfully!";
    setTimeout(() => {
      status.textContent = "";
    }, 3000);
  });
});
