import { Repository, Entity } from '.'

type TestType = {
    name: string
}

class TestList extends Repository<TestType> {}

describe('Test List', () => {
    it('Should get the list of TestType', async () => {
        // Given
        const stringList = new TestList()

        // When

        //Then
        await expect(stringList.getAll()).resolves.toEqual([])
    })

    it('Should throw error when TestType with given id does not exist', async () => {
        // Given
        const testList = new TestList()

        // When

        // Then
        await expect(testList.getOne(1)).rejects.toThrowError()
    })

    it('Should create an TestType', async () => {
        //Given
        const name = 'IPL'
        const testType: TestType = {
            name,
        }
        const expectedTestType: TestType & Entity = { ...testType, id: 1 }
        const testList = new TestList()

        // When
        const testId = await testList.addOne(testType)
        const newTestType = await testList.getOne(testId)

        // Then
        expect(newTestType).toEqual(expectedTestType)
    })

    it('Should be able to delete a TestType', async () => {
        // Given
        const testList = new TestList()
        const testId1 = await testList.addOne({
            name: 'IPL 1',
        })

        // When
        await testList.deleteOne(testId1)

        // Then
        await expect(testList.getOne(testId1)).rejects.toThrowError()
    })

    it('Should not be able to delete a TestType that does not exist', async () => {
        // Given
        const testList = new TestList()

        // When

        // Then
        await expect(testList.deleteOne(100)).rejects.toThrowError()
    })

    it('Should be able to update an auction', async () => {
        //Given
        const testList = new TestList()
        const id = await testList.addOne({
            name: 'IPL 1',
        })

        const newTestType = {
            name: 'IPL 2',
        }

        //When
        await testList.updateOne(id, newTestType)

        //Then
        await expect(testList.getOne(id)).resolves.toEqual({
            ...newTestType,
            id,
        })
    })
})
