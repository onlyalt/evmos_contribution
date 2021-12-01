import time

from flask import Flask, render_template
from evmoscan.etl.utils import *


def creat_app():
    app = Flask(__name__)
    return app


app = creat_app()
MAX_TX_DISPLAY = 5
MAX_BLOCK_DISPLAY = 5


@app.route("/")
def index():
    current_block_number = get_latest_block_number()
    current_gas_price = get_gas_price()
    latest_blocks = [block_loader(json.loads(get_block_info_rpc(current_block_number - i))) for i in range(MAX_BLOCK_DISPLAY)]

    current_time = time.time()
    return render_template(
        "index.html",
        hash=hash,
        current_gas_price=current_gas_price,
        current_block_number=current_block_number,
        latest_blocks=latest_blocks,
        current_time=current_time,
    )


# @app.route("/address/<addr>")
# def address(addr):
#     return render_template("address.html", addr=addr)


@app.route("/tx/<hash>")
def transaction(hash):
    transaction_ = transaction_loader(json.loads(get_transaction_info_rpc(hash)))
    return render_template("transaction.html", transaction=transaction_)


@app.route("/block/<block_number>")
def block(block_number):
    block_ = block_loader(json.loads(get_block_info_rpc(block_number)))
    return render_template("block.html", block=block_)