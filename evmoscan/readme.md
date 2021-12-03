# Evmoscan
The Etherscan for Evmos.

## How to run
```flask run```


## ETL
- catch up: `python etl/scraper.py --raw-db-file <FILENAME> --catch-up`
- scrape a range `python evmoscan/etl/scraper.py --block-from 0 --block-to 6000 --raw-db-file <FILENAME>`