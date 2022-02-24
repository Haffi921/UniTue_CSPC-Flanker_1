const path = require("path");
const fs = require("fs");

function resolveEntry(entry) {
  let resolved_entry = false;
  let entry_path = path.resolve(entry);
  if (fs.existsSync(entry_path)) {
    if (fs.statSync(entry_path).isFile()) {
      return entry_path;
    }
    if (fs.statSync(path.resolve(entry_path, "index.ts")).isFile()) {
      return path.resolve(entry_path, "index.ts");
    }
    if (fs.statSync(path.resolve(entry_path, "index.js")).isFile()) {
      return path.resolve(entry_path, "index.js");
    }
  }
  if (fs.statSync(path.resolve(entry_path + ".ts")).isFile()) {
    return path.resolve(entry_path + ".ts");
  }
  if (fs.statSync(path.resolve(entry_path + ".js")).isFile()) {
    return path.resolve(entry_path + ".js");
  }
  // try {
  //   if (!fs.lstatSync(entry).isFile()) {
  //     entry = path.resolve(entry, "index.ts");
  //   }
  //   if (fs.lstatSync(entry).isFile()) {
  //     resolved_entry = entry;
  //   }
  // } catch (e) {
  //   if (e.code === "ENOENT") {
  //     try {
  //       entry += ".ts";
  //       if (fs.lstatSync(entry).isFile()) {
  //         resolved_entry = entry;
  //       }
  //     } catch (e) {}
  //   }
  // }
  return resolved_entry;
}

module.exports.getEntries = function (entryList) {
  function entryFilter(entries, item) {
    let entry = resolveEntry(path.resolve(entryList[item]));
    if (entry) entries[item] = entry;
    return entries;
  }
  return Object.keys(entryList).reduce(entryFilter, {});
};
