import { Entity } from '.'

describe('Types', () => {
    it('Should be able to create an object of Entity type', () => {
        const entity: Entity = { id: 1 }

        expect(entity.id).toBe(1)
    })
})
