# Swiss Postal Addresses

A list of all swiss postal addresses known according to a data set provided
by the [Swiss Post](http://www.post.ch).

**No warrenty for completeness and correctness! Use at your own risk.**

## Usage
1. Download the file [swiss-addresses.csv.gz](swiss-addresses.csv.gz)
2. Extract file with `gunzip swiss-addresses.csv.gz`.
3. Use as follows:
   1. Use the entire file with all the addresses.
   2. Grep for matches with e.g.  `grep "AG;5420;" swiss-addresses.csv`
   3. Extract a random sample with e.g. `shuf -n 20 swiss-addresses.csv`

## Generating Addresses based on New Version of the Data from the Swiss Post
1. Login to the Swiss Post Website (or create a new user account first).
2. [Download](https://service.post.ch/zopa/dlc/app/?service=dlc-web&inMobileApp=false&inIframe=false&lang=de#/main)
the current *Address- und Geodaten*. Make sure to get both the data as well as the current explanations (*Strassenverzeichnis_mit_Sortierdaten_DE*).
3. Unzip the csv file, rename it to input.csv and copy it to this folder.
4. Run `npm install` to make sure you have all necessary dependencies.
5. Delete the existing output file with `rm swiss-addresses.csv`.
5. Run the extraction with `node --max-old-space-size=4096 index.js`
6. Verify the output in `swiss-addresses.csv`. If the output seems to be incorrect,
   consult the guide *Strassenverzeichnis_mit_Sortierdaten_DE* and fix the
   extraction code accordingly :-).
