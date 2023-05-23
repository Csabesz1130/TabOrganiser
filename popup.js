document.getElementById("groupTabs").addEventListener("click", () => {
  chrome.storage.local.get(["windowLimit", "groupingOption"], (options) => {
    const windowLimit = options.windowLimit || 5;
    const groupingOption = options.groupingOption || "domain";

    chrome.tabs.query({}, (tabs) => {
      const groups = {};
      tabs.forEach((tab) => {
        const key =
          groupingOption === "domain" ? new URL(tab.url).hostname : tab.title;
        if (groups[key]) {
          groups[key].push(tab);
        } else {
          groups[key] = [tab];
        }
      });

      // Sort groups by size and take the largest ones up to the window limit
      const sortedGroups = Object.values(groups).sort(
        (a, b) => b.length - a.length
      );
      const selectedGroups = sortedGroups.slice(0, windowLimit);

      // Create a new window for each group of tabs and close the original tabs
      selectedGroups.forEach((tabs) => {
        const urls = tabs.map((tab) => tab.url);
        chrome.windows.create({ url: urls }, () => {
          tabs.forEach((tab) => chrome.tabs.remove(tab.id));
        });
      });

      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png",
        title: "Tab Organizer",
        message: "Your tabs have been grouped successfully!"
      });
    });
  });
});
