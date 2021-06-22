import { Address, BigInt } from "@graphprotocol/graph-ts"
import { Account, Punk } from "../generated/schema"
import {
  Assign,
  PunkTransfer,
  PunkBought
} from "../generated/Contract/Contract"

export function getAccount(address: Address): Account {

  let account = Account.load(address.toHexString())

  if (account == null) {
    account = new Account(address.toHexString())
    account.totalPunks = BigInt.fromI32(0)
    account.save()
  }
  return account as Account
}

export function getPunk(punkIndex: BigInt): Punk {
  let punk = Punk.load(punkIndex.toString())

  if (punk == null) {
    punk = new Punk(punkIndex.toString())
    punk.totalOwners = BigInt.fromI32(0)
  }
  return punk as Punk
}

export function handleAssign(event: Assign): void {
  let to = getAccount(event.params.to)
  to.totalPunks = to.totalPunks.plus(BigInt.fromI32(1))
  to.save()

  let punk = getPunk(event.params.punkIndex)
  punk.owner = to.id
  punk.totalOwners = punk.totalOwners.plus(BigInt.fromI32(1))
  punk.save()
}

export function handlePunkTransfer(event: PunkTransfer): void {
  let from = getAccount(event.params.from)
  let to = getAccount(event.params.to)
  let punk = getPunk(event.params.punkIndex)

  from.totalPunks = from.totalPunks.minus(BigInt.fromI32(1))
  to.totalPunks = to.totalPunks.plus(BigInt.fromI32(1))

  punk.totalOwners = punk.totalOwners.plus(BigInt.fromI32(1))
  punk.owner = to.id

  from.save()
  to.save()
  punk.save()
}

export function handlePunkBought(event: PunkBought): void {
  let punk = getPunk(event.params.punkIndex)
  let from = getAccount(event.params.fromAddress)
  let to = getAccount(event.params.toAddress)

  punk.totalOwners = punk.totalOwners.plus(BigInt.fromI32(1))
  punk.owner = to.id

  to.totalPunks = to.totalPunks.plus(BigInt.fromI32(1))
  from.totalPunks = from.totalPunks.minus(BigInt.fromI32(1))

  punk.save()
  from.save()
  to.save()
}