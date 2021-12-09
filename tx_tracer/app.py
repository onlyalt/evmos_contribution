
from flask import Flask, render_template, jsonify, request
import requests
import json

# RPC_ENDPOINT = 'http://localhost:8545'
RPC_ENDPOINT = 'https://evmos-testnet.gateway.pokt.network/v1/lb/61ac07b995d548003aedf5ee/'


def trace_tx(tx_hash: str, tracer_name: str='callTracer', rpc: str = RPC_ENDPOINT) -> dict:
    res = requests.post(rpc, data=f'{{"jsonrpc":"2.0","method":"debug_traceTransaction","params":["{tx_hash}", {{"tracer": "{tracer_name}"}}],"id":1}}', headers={'Content-Type': 'application/json'})
    res.raise_for_status()
    return json.loads(res.text)['result']


def creat_app():
    app = Flask(__name__)
    return app


app = creat_app()


@app.route("/")
def index():
    return render_template(
        "index.html",
    )


@app.route("/tx")
def tx():
    hash = request.args.get('tx_hash')
    return render_template(
        "transaction.html",
        hash=hash
    )


@app.route("/<hash>/<tracer>")
def tracer(hash, tracer):
    traces = trace_tx(hash, tracer_name=tracer)
    return jsonify(traces)
