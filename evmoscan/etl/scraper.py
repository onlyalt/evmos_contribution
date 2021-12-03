import sqlite3
from tqdm import tqdm
import click
from utils import *


def get_blocks_within_range(raw_db_file: str, block_from: int, block_to: int,  catch_up: bool, flush: int = 100):
    dbconn = sqlite3.connect(raw_db_file, isolation_level=None)  # autocommits
    cur = dbconn.cursor()
    cur.execute(
        """
          CREATE TABLE IF NOT EXISTS blocks_meta(
            block_number INTEGER PRIMARY KEY NOT NULL,
            meta BLOB)
        """
    )
    if catch_up:
        block_from = cur.execute("SELECT max(block_number) from blocks_meta").fetchone()[0]

    blocks = []
    for i in tqdm(range(block_from, block_to)):
        if i % flush == 0 and i != block_from:
            cur.executemany(
                "INSERT INTO blocks_meta (block_number, meta) VALUES (?, ?) ON CONFLICT DO NOTHING",
                blocks,
            )
            blocks =[]
        try:
            block = get_block_info_rpc(i)
            blocks.append([i, block])
        except:
            print(i)

    cur.executemany(
        "INSERT INTO blocks_meta (block_number, meta) VALUES (?, ?) ON CONFLICT DO NOTHING",
        blocks,
    )


@click.command()
@click.option('--block-from', type=int, default=0)
@click.option('--block-to', type=int, default=-1)
@click.option('--raw-db-file', type=str)
@click.option('--w3-rpc', type=str, default=RPC_ENDPOINT)
@click.option("--catch-up", is_flag=True, default=False)
def scrape(block_from: int, block_to: int, raw_db_file: str, w3_rpc: str, catch_up: bool):
    if block_to == -1:
        block_to = get_latest_block_number(w3_rpc)
        print(f"set block_to to {block_to}")
    get_blocks_within_range(raw_db_file, block_from, block_to, catch_up)

if __name__ == '__main__':
    scrape()