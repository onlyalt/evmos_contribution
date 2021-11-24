import time

from flask import Flask, render_template
from web3 import Web3

app = Flask(__name__)
w3 = Web3(Web3.HTTPProvider('https://main-light.eth.linkpool.io/'))
MAX_TX_DISPLAY = 5
MAX_BLOCK_DISPLAY = 5

@app.route("/")
def index():
    current_block_number = w3.eth.block_number
    latest_blocks = [w3.eth.get_block(current_block_number - i) for i in range(MAX_BLOCK_DISPLAY)]

    latest_transactions = []
    for block in latest_blocks[::-1]:
        txs = block['transactions'][::-1]
        latest_transactions += [w3.eth.get_transaction(tx) for tx in txs[:MAX_TX_DISPLAY]]
        if len(latest_transactions) >= MAX_TX_DISPLAY:
            break

    current_time = time.time()
    return render_template(
        "index.html",
        hash=hash,
        eth=w3.eth,
        latest_blocks=latest_blocks,
        current_time=current_time,
        latest_transactions=latest_transactions,
    )

@app.route("/address/<addr>")
def address(addr):
    return render_template("address.html", addr=addr)

@app.route("/tx/<hash>")
def transaction(hash):
    transaction_ = w3.eth.get_transaction(hash)
    return render_template("transaction.html", hash=hash, transaction=transaction_)


@app.route("/block/<block_number>")
def block(block_number):
    return render_template("block.html", block_number=block_number)