# Performance API
Performance API provide very useful methods to allow developers understand how application behave in regards of time.

## Usage
`performance` object can be found on the `window` object and thus can be accessed directly from the global scope

Performance APi allow one to read and write entries to the performance stack and the use this information to recreate the load flow of the app.

Every entry is either of type `PerformanceEntry` or derives from it.

### Types of entries

Every entry has an `entryType` and a `name` properties that are used to distiguish between different entries types.

|Entry Type|Description|
|----------|-----------|
|`PerformanceNavigationTiming`|Stores metrics regarding vaigation events. This object can be used to detirmine how much time it took to load the app
|`PerformanceResourceTiming`|Stores detailed timing analysis on a specific resource (it provides high-resolution timing that should be accurate up to a **5 µs** accuracy|
|`PerformancePaintTiming`|Stores data about paint or "render" operations. _For example: entries can be with names: `first-paint` or `irst-contentful-paint`_
**Methods**

|property|description|
---------|------------
`getEntries()`| returns `PerformanceEntry` list of object (more on that later)
`getEntriesByName()`| retrieved entries by `EntryType` 

## Exercise
In this workshop we will use performance api to write detailed log of our site loading times. 

You need to use performance API and implement a single function that you will be able to run from chrome console.

The function should make use of `console.table()` function to draw beautiful tables with the following data:

1. General timeline table - this table should display main events happened throughout the loading of the page. Things like:
    * `first-paint`
    * `first-meaningful-paint`.
    * when DOM has become interactive
    * How much time `content-loaded` even took
2. Table per resource type - you should aggregate and display table for the following resource types: `css`, `scripts`, `images`. For every resource display the following info:
    * total duration
    * dns lookup time
    * url of the resource
    * from `request start` to `response end`
3. Total metrict
    * Total load size (zipped and unzipped)
    * Total load time
    * Total resource count (by type)
    
**NOTE: All resource tables should be sorted by loading time from `high` to `low`**
