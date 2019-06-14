const arr = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]

const result = arr.filter((item) => {
  return item.id !== 1
})

console.log(result)
