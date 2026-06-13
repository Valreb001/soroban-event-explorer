import { xdr, Address, scValToNative } from '@stellar/stellar-sdk'
import { DecodedTopic, DecodedValue } from '@/types'

export function identifyType(xdrStr: string): string {
  try {
    const val = xdr.ScVal.fromXDR(xdrStr, 'base64')
    const arm = val.switch().name
    const typeMap: Record<string, string> = {
      scvSymbol: 'Symbol',
      scvString: 'String',
      scvAddress: 'Address',
      scvU64: 'U64',
      scvI64: 'I64',
      scvU128: 'U128',
      scvI128: 'I128',
      scvU32: 'U32',
      scvI32: 'I32',
      scvBool: 'Bool',
      scvBytes: 'Bytes',
      scvVec: 'Vec',
      scvMap: 'Map',
      scvVoid: 'Void',
      scvError: 'Error',
      scvLedgerKeyContractInstance: 'ContractInstance',
    }
    return typeMap[arm] || arm
  } catch {
    return 'Unknown'
  }
}

function scValToString(val: xdr.ScVal): string {
  const arm = val.switch().name
  try {
    if (arm === 'scvSymbol') return val.sym().toString()
    if (arm === 'scvString') return val.str().toString()
    if (arm === 'scvAddress') return Address.fromScVal(val).toString()
    if (arm === 'scvBool') return val.b().toString()
    if (arm === 'scvVoid') return 'void'
    if (arm === 'scvBytes') return Buffer.from(val.bytes()).toString('hex')
    if (arm === 'scvU32') return val.u32().toString()
    if (arm === 'scvI32') return val.i32().toString()
    if (arm === 'scvU64') return val.u64().toString()
    if (arm === 'scvI64') return val.i64().toString()
    if (arm === 'scvU128') {
      const hi = BigInt(val.u128().hi().toString())
      const lo = BigInt(val.u128().lo().toString())
      return ((hi << 64n) | lo).toString()
    }
    if (arm === 'scvI128') {
      const hi = BigInt(val.i128().hi().toString())
      const lo = BigInt(val.i128().lo().toString())
      return ((hi << 64n) | lo).toString()
    }
    if (arm === 'scvVec') {
      const items = val.vec()
      if (!items) return '[]'
      return '[' + items.map(scValToString).join(', ') + ']'
    }
    if (arm === 'scvMap') {
      const entries = val.map()
      if (!entries) return '{}'
      return '{' + entries.map(e => `${scValToString(e.key())}: ${scValToString(e.val())}`).join(', ') + '}'
    }
    // fallback: use SDK native converter
    const native = scValToNative(val)
    return String(native)
  } catch {
    return val.toXDR('base64')
  }
}

export function decodeTopic(rawXdr: string): DecodedTopic {
  try {
    const val = xdr.ScVal.fromXDR(rawXdr, 'base64')
    return { raw: rawXdr, decoded: scValToString(val), type: identifyType(rawXdr) }
  } catch {
    return { raw: rawXdr, decoded: rawXdr, type: 'Unknown' }
  }
}

export function decodeValue(rawXdr: string): DecodedValue {
  try {
    const val = xdr.ScVal.fromXDR(rawXdr, 'base64')
    return { raw: rawXdr, decoded: scValToString(val), type: identifyType(rawXdr) }
  } catch {
    return { raw: rawXdr, decoded: rawXdr, type: 'Unknown' }
  }
}

export function formatDecodedValue(decoded: DecodedValue): string {
  return decoded.decoded || decoded.raw
}

export function isValidContractId(id: string): boolean {
  return /^C[A-Z2-7]{55}$/.test(id)
}
