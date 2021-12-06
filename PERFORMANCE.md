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
|`PerformancePaintTiming`|Stores data about paint or "render" operations. _For example: entries can be with names: `first-paint` or `first-contentful-paint`_

### Methods

|property|description|
|--------|-----------|
`getEntries()`| returns `PerformanceEntry` list of object (more on that later)
`getEntriesByName()`| retrieved entries by `EntryType` 
`mark()`| creates custom mark that is added to the entries list and can be then fetched with the `getEntries()`

#### Important `mark()` properties

|property|description|
|--------|-----------|
|`entryType`|will be set to `mark` this is the property by which you can then filter the entry with `getEntriesByName()`|
|`name`| name of the mark|
|`duration`| set to 0 as mark doesn't have duration|

## Measuring Time
When measuting time with `Date.now()` timestamp the maximum accuracy would be [mostly](https://johnresig.com/blog/accuracy-of-javascript-time/) around 1ms or more. In addition, `Date.now()` will give you time in milliseconds relative to EPOC time.

Often, to measure performance it is just not enough. To solve this Browsers provide the `performance.now()` method. This method return time relative to `performance.timing.navigationStart` timestamp. In other words to calculate current time you can do `performance.timing.navigationStart + performance.now()`. This function is not blocked to a `1ms` percision.

> NOTE: In current versions some browsers limiting the percision of a `performance.now()` function to protect users from timing attacks. Some are limiting percision to a `1ms` as same as `Date.now()`. This is due to change in the future when these attacks can be addressed. In any case it is very recommended to use `performance.now()` measurement as is it generally more accurate.

## Exercise
In this workshop we will use performance api to write detailed log of our site loading times. 

You need to use performance API and implement a single function that you will be able to run from chrome console.

The function should make use of `console.table()` function to draw beautiful tables with the following data:

1. General timeline table - this table should display main events happened throughout the loading of the page. Things like:
    * `first-paint`
    * `first-contentful-paint`.
    * when DOM has become interactive
    * How much time `content-loaded` even took
2. Table per resource type - you should aggregate and display table for the following resource types: `css`, `scripts`, `images`. For every resource display the following info:
    * total duration
    * dns lookup time
    * url of the resource
    * from `request start` to `response end`
3. Total metricts
    * Total load size (zipped and unzipped)
    * Total load time
    * Total resource count (by type)
4. Custom metrics - At the bottom of the screen there is a weather table, open the code (found in `behaviour.js`) and add marks at:
    * beginning of the `getWeather` function
    * end of the `getWeather` function
    * mark beginning and end for every iteration of the inner for loop to see how much time it takes to parse a single row
    * display the calculated times at the bottom of the table
    
**NOTE: All resource tables should be sorted by loading time from `high` to `low`**
