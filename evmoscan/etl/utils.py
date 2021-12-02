import backoff
import requests
import json

# RPC_ENDPOINT = 'http://localhost:8545'
RPC_ENDPOINT = 'https://ethereum.rpc.evmos.dev/'


@backoff.on_exception(backoff.constant, Exception, interval=0, max_tries=2)
def get_block_info_rpc(block_number: int, rpc: str = RPC_ENDPOINT) -> str:
    res = requests.post(rpc, data=f'{{"jsonrpc":"2.0","method":"eth_getBlockByNumber","params":[{block_number}, false],"id":1}}', headers={'Content-Type': 'application/json'})
    res.raise_for_status()
    return res.text


def get_latest_block_number(rpc: str = RPC_ENDPOINT) -> int:
    res = requests.post(rpc, data='{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}', headers={'Content-Type': 'application/json'})
    res.raise_for_status()
    return int(json.loads(res.text)['result'], 16)


def get_transaction_info_rpc(tx_hash: str, rpc: str = RPC_ENDPOINT) -> str:
    res = requests.post(rpc, data=f'{{"jsonrpc":"2.0","method":"eth_getTransactionByHash","params":["{tx_hash}"],"id":1}}', headers={'Content-Type': 'application/json'})
    res.raise_for_status()
    return res.text


def get_gas_price(rpc: str = RPC_ENDPOINT) -> int:
    res = requests.post(rpc, data='{"jsonrpc":"2.0","method":"eth_gasPrice","params":[],"id":1}', headers={'Content-Type': 'application/json'})
    res.raise_for_status()
    return int(json.loads(res.text)['result'], 16)


class Block:
    def __init__(
            self,
            base_fee_per_gas: int,
            gas_limit: int,
            gas_used: int,
            hash: str,
            miner: str,
            block_number: int,
            parent_hash: str,
            timestamp: int,
            transactions: list,
    ):
        self.base_fee_per_gas = base_fee_per_gas
        self.gas_limit = gas_limit
        self.gas_used = gas_used
        self.hash = hash
        self.miner = miner
        self.block_number = block_number
        self.parent_hash = parent_hash
        self.timestamp = timestamp
        self.transactions = transactions


def block_loader(block: dict) -> Block:
    result = block['result']
    return Block(
        base_fee_per_gas=int(result['baseFeePerGas'], 16),
        gas_limit=int(result['gasLimit'], 16),
        gas_used=int(result['gasUsed'], 16),
        hash=result['hash'],
        miner=result['miner'],
        block_number=int(result['number'], 16),
        parent_hash=result['parentHash'],
        timestamp=int(result['timestamp'], 16),
        transactions=result['transactions'],
    )


class Transaction:
    def __init__(
            self,
            block_hash: str,
            block_number: int,
            created_from: str,
            created_to: str,
            gas: int,
            gas_price: int,
            max_fee_per_gas: int,
            max_priority_fee_per_gas: int,
            hash: str,
            value: int
    ):
        self.block_hash = block_hash
        self.block_number = block_number
        self.created_from = created_from
        self.created_to = created_to
        self.gas = gas
        self.gas_price = gas_price
        self.max_fee_per_gas = max_fee_per_gas
        self.max_priority_fee_per_gas = max_priority_fee_per_gas
        self.hash = hash
        self.value = value


def transaction_loader(tx: dict) -> Block:
    result = tx['result']
    return Transaction(
        block_hash=result['blockHash'],
        block_number=int(result['blockNumber'], 16),
        created_from=result['from'],
        created_to=result['to'],
        gas=int(result['gas'], 16),
        gas_price=int(result['gasPrice'], 16),
        max_fee_per_gas=int(result['maxFeePerGas'], 16),
        max_priority_fee_per_gas=int(result['maxPriorityFeePerGas'], 16),
        hash=result['hash'],
        value=int(result['value'], 16)
    )