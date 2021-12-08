import backoff
import requests
import json

# RPC_ENDPOINT = 'http://localhost:8545'
RPC_ENDPOINT = 'https://evmos-testnet.gateway.pokt.network/v1/lb/61ac07b995d548003aedf5ee/'


@backoff.on_exception(backoff.constant, Exception, interval=0, max_tries=2)
def get_block_info_rpc(block_number: int, rpc: str = RPC_ENDPOINT, cur=None) -> str:
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


def trace_tx(tx_hash: str, tracer_name: str='callTracer', rpc: str = RPC_ENDPOINT) -> dict:
    res = requests.post(rpc, data=f'{{"jsonrpc":"2.0","method":"debug_traceTransaction","params":["{tx_hash}", {{"tracer": "{tracer_name}"}}],"id":1}}', headers={'Content-Type': 'application/json'})
    res.raise_for_status()
    return json.loads(res.text)['result']


def get_validators():
    res = requests.get('https://evmos-api.mercury-nodes.net/cosmos/staking/v1beta1/validators')
    res.raise_for_status()
    d = json.loads(res.text)
    return [validator_loader(x) for x in d['validators']], int(d['pagination']['total'])


def get_validator(addr):
    res = requests.get(f'https://evmos-api.mercury-nodes.net/cosmos/staking/v1beta1/validators/{addr}')
    res.raise_for_status()
    return validator_loader(json.loads(res.text)['validator'])


def get_delegation(validator_addr):
    res = requests.get(f'https://evmos-api.mercury-nodes.net/cosmos/staking/v1beta1/validators/{validator_addr}/delegations')
    res.raise_for_status()
    return [delegation_loader(x) for x in json.loads(res.text)['delegation_responses']]


def get_proposal(prop_id):
    res = requests.get(f'https://evmos-api.mercury-nodes.net/cosmos/gov/v1beta1/proposals/{prop_id}')
    res.raise_for_status()
    return json.loads(res.text)['proposal']


class Delegation:
    def __init__(
            self,
            delegator_address: str,
            validator_address: str,
            shares: int,
    ):
        self.delegator_address = delegator_address
        self.validator_address = validator_address
        self.shares = shares


def delegation_loader(d: dict) -> Delegation:
    return Delegation(
        delegator_address=d['delegation']['delegator_address'],
        validator_address=d['delegation']['validator_address'],
        shares=int(d['balance']['amount']),
    )


class Validator:
    def __init__(
            self,
            address: str,
            jailed: bool,
            tokens: int,
            delegator_shares: float,
    ):
        self.address = address
        self.jailed = jailed
        self.tokens = tokens
        self.delegator_shares = delegator_shares


def validator_loader(v: dict) -> Validator:
    return Validator(
        address=v['operator_address'],
        jailed=v['jailed'],
        tokens=v['tokens'],
        delegator_shares=float(v['delegator_shares']),
    )


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