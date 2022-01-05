# Evmoscan
The Etherscan for Evmos.

## Mars Meteor Mission

This block explorer intends to complete the following mission of [Evmos Incentivized Testnet](https://evmos.blog/evmos-incentivized-testnet-event-the-mars-meteor-missions-bbbb7ffa1b7c):
- Build a dashboard or block explorer - 30 points
- Build and host a UI that represent gas usage and fees across the network - 10 points

Blogpost
- [Evmoscan and ETL](https://www.onlyalt.com/blog/evmoscan-and-etl)


## How to run
```flask run```


## ETL
- catch up: `python etl/scraper.py --raw-db-file <FILENAME> --catch-up`
- scrape a range `python evmoscan/etl/scraper.py --block-from 0 --block-to 6000 --raw-db-file <FILENAME>`
