# Electron Web-screenshot Timer

Uses Electron to breifly load and screenshot a webpage, optionally at regular intervals.

Includes example config to screenshot the YouTube pages of The White House channel.

# Use

`config.js` contains:

* `interval` - number of milliseconds between screenshot runs
* `pauseAfterLoad` - number of milliseconds to pause after page load before taking the screenshot
* `maxScreenshots` - quit after this many screenshot runs
* `uris` - an object where the key is a directory name under `screenshots` in which to save, and the value is the URI to screenshot in each screenshot.
