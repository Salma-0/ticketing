import {Password} from '../password'

it('hashes string correctly', async() => {
    let str = 'AprilFool'

    const hash = await Password.toHash(str)

    expect(hash).toBeDefined()
    expect(typeof hash).toBe('string')

    const isMatch = await Password.compare(hash, str)

    expect(isMatch).toBe(true)
})


