import sqlite3
import time
import os

from flask import Flask, render_template, jsonify
from evmoscan.etl.utils import *

DB_FILE_PATH = os.getenv('DB_FILE_PATH')


def creat_app():
    app = Flask(__name__)
    if DB_FILE_PATH:
        dbconn = sqlite3.connect(DB_FILE_PATH, isolation_level=None)  # autocommits
        app.cur = dbconn.cursor()
    return app


app = creat_app()
MAX_BLOCK_DISPLAY = 10


@app.route("/")
def index():
    current_block_number = get_latest_block_number()
    current_gas_price = get_gas_price()
    latest_blocks = [block_loader(json.loads(get_block_info_rpc(current_block_number - i))) for i in range(MAX_BLOCK_DISPLAY)]
    latest_transactions = [transaction_loader(json.loads(get_transaction_info_rpc(item))) for sublist in [x.transactions for x in latest_blocks] for item in sublist]  # flatten list of list
    gas_fees = [x.gas_price / 1000000000 for x in latest_transactions]

    avg_block_time = (latest_blocks[0].timestamp -  latest_blocks[-1].timestamp) / (len(latest_blocks) - 1)
    tps = len(latest_transactions) / (latest_blocks[0].timestamp -  latest_blocks[-1].timestamp)

    validators, n_validators = get_validators()
    current_time = time.time()
    return render_template(
        "index.html",
        hash=hash,
        current_gas_price=current_gas_price,
        current_block_number=current_block_number,
        latest_blocks=latest_blocks,
        current_time=current_time,
        validators=validators,
        n_validators=n_validators,
        latest_transactions=latest_transactions,
        gas_fees=gas_fees,
        avg_block_time=avg_block_time,
        tps=tps,
    )


@app.route("/validator/<addr>")
def validator(addr):
    validator_ = get_validator(addr)
    delegations = get_delegation(addr)
    return render_template("validator.html", validator=validator_, delegations=delegations)


@app.route("/tx/<hash>")
def transaction(hash):
    transaction_ = transaction_loader(json.loads(get_transaction_info_rpc(hash)))
    return render_template("transaction.html", transaction=transaction_)


@app.route("/tx/<hash>/<tracer>")
def tracer(hash, tracer):
    traces = trace_tx(hash, tracer_name=tracer)
    return jsonify(traces)


@app.route("/block/<block_number>")
def block(block_number):
    block_ = block_loader(json.loads(get_block_info_rpc(block_number)))
    return render_template("block.html", block=block_)


@app.route("/proposal/<prop_id>")
def proposal(prop_id):
    proposal_ = get_proposal(prop_id)
    return render_template("proposal.html", proposal=proposal_)

