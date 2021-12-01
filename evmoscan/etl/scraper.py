import sqlite3
from tqdm import tqdm
import click
from web3 import Web3
from utils import *

# @backoff.on_exception(backoff.constant, Exception, interval=0, max_tries=2)
# def get_block_info(w3, block_number: int) -> dict:
#     return w3.eth.get_block(block_number)


def get_blocks_within_range(raw_db_file: str, block_from: int, block_to: int, w3, flush = 100):
    dbconn = sqlite3.connect(raw_db_file, isolation_level=None)  # autocommits
    cur = dbconn.cursor()
    cur.execute(
        """
          CREATE TABLE IF NOT EXISTS blocks_meta(
            block_number INTEGER PRIMARY KEY NOT NULL,
            meta BLOB)
        """
    )
    blocks = []
    for i in tqdm(range(block_from, block_to)):
        if i % flush == 0 and i != block_from:
            cur.executemany(
                "INSERT INTO blocks_meta (block_number, meta) VALUES (?, ?) ON CONFLICT DO NOTHING",
                blocks,
            )
            blocks =[]
            # print('sleeping 10s')
            # time.sleep(10)

        try:
            block = get_block_info_rpc(i)
            blocks.append([i, block])
            # block = get_block_info(w3, i)
            # blocks.append([
            #     i,
            #     json.dumps({
            #         'baseFeePerGas': block['baseFeePerGas'],
            #         'difficulty': block['difficulty'],
            #         'extraData': block['extraData'].hex(),
            #         'gasLimit': block['gasLimit'],
            #         'gasUsed': block['gasUsed'],
            #         'hash': block['hash'].hex(),
            #         'logsBloom': block['logsBloom'].hex(),
            #         'miner': block['miner'],
            #         'mixHash': block['mixHash'].hex(),
            #         'nonce': block['nonce'].hex(),
            #         'number': block['number'],
            #         'parentHash': block['parentHash'].hex(),
            #         'receiptsRoot': block['receiptsRoot'].hex(),
            #         'sha3Uncles': block['sha3Uncles'].hex(),
            #         'size': block['size'],
            #         'stateRoot': block['stateRoot'].hex(),
            #         'timestamp': block['timestamp'],
            #         'totalDifficulty': block['totalDifficulty'],
            #         'transactions': [x.hex() for x in block['transactions']],
            #         'transactionsRoot': block['transactionsRoot'].hex(),
            #         'uncles': [x.hex() for x in block['uncles']],
            #     })
            # ])
        except:
            print(i)

    cur.executemany(
        "INSERT INTO blocks_meta (block_number, meta) VALUES (?, ?) ON CONFLICT DO NOTHING",
        blocks,
    )


@click.command()
@click.option('--block-from', type=int)
@click.option('--block-to', type=int, default=-1)
@click.option('--raw-db-file', type=str)
@click.option('--w3-rpc', type=str, default='http://localhost:8545')
def scrape(block_from: int, block_to: int, raw_db_file: str, w3_rpc: str):
    w3 = Web3(Web3.HTTPProvider(w3_rpc))
    if block_to == -1:
        block_to = w3.eth.block_number
        print(f"set block_to to {block_to}")

    get_blocks_within_range(raw_db_file, block_from, block_to, w3)
    # max = 63554

if __name__ == '__main__':
    scrape()