import { expect } from 'chai'
import sinon from 'sinon'

import { pack } from '../../dist/pack'
import { packToBlob } from '../../dist/pack/blob'

import { MemoryBlockStore } from '../../dist/blockstore/memory'

describe('pack', () => {
  [MemoryBlockStore].map((Blockstore) => {
    describe(`with ${Blockstore.name}`, () => {
      it('with iterable input', async () => {
        const { root, out } = await pack({
          input: [new Uint8Array([21, 31])],
          blockstore: new Blockstore()
        })

        const carParts = []
        for await (const part of out) {
          carParts.push(part)
        }

        expect(root.toString()).to.eql('bafkreifidl2jnal7ycittjrnbki6jasdxwwvpf7fj733vnyhidtusxby4y')
        expect(carParts.length).to.eql(4)
      })

      it('returns a car blob', async () => {
        const { root, car } = await packToBlob({
          input: [new Uint8Array([21, 31])],
          blockstore: new Blockstore()
        })

        expect(root.toString()).to.eql('bafkreifidl2jnal7ycittjrnbki6jasdxwwvpf7fj733vnyhidtusxby4y')
      })

      it('pack does not destroy provided blockstore', async () => {
        const blockstore = new Blockstore()
        const spy = sinon.spy(blockstore, 'destroy')

        await pack({
          input: [new Uint8Array([21, 31])],
          blockstore
        })

        expect(spy.callCount).to.eql(0)
        await blockstore.destroy()
      })

      it('packToBlob does not destroy provided blockstore', async () => {
        const blockstore = new Blockstore()
        const spy = sinon.spy(blockstore, 'destroy')

        await packToBlob({
          input: [new Uint8Array([21, 31])],
          blockstore
        })

        expect(spy.callCount).to.eql(0)
        await blockstore.destroy()
      })
    })
  })
})
