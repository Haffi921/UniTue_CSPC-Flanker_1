const path = require("path");
const fs = require("fs");

function pathIsFile(path) {
  try {
    if (fs.statSync(path).isFile()) return true;
  } catch (e) {}
  return false;
}

function resolveEntry(entry) {
  let entry_path = path.resolve(entry);
  for (let ext of ["", "ts", "js", "index.ts", "index.js"]) {
    const entry_test = path.resolve(entry_path, ext);
    if (pathIsFile(entry_test)) return entry_test;
  }
  return false;
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
}

module.exports.getEntries = function (entryList) {
  function entryFilter(entries, item) {
    let entry = resolveEntry(path.resolve(entryList[item]));
    if (entry) entries[item] = entry;
    return entries;
  }
  return Object.keys(entryList).reduce(entryFilter, {});
};
