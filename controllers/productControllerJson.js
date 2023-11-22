const data = {
 employees : require('../data/employee.json')
}

//Retreive All Products
const selectAllProducts = (req, res) => {
    //res.send('All Products Retreived')
    res.json(data.employees)
    console.log('All Products Retreived')
}

//Retreive One Product
const selectOneProduct = (req, res) => {
    const id = req.params.id
    const retreiveData = data.employees.find(employee => employee.id === parseInt(id))
    res.json(retreiveData)
    //res.send(`Retreive product ID : ${id}`)
    console.log('Retreive product ID '+id)
}

//Add Product
const addProdcut = (req, res) => {
    res.send(req.body)
    console.log(req.body)
}

//Delet Product
const deleteProduct = (req, res) => {
    const id = req.params.id
    res.send(`Delete product ID : ${id}`)
    console.log('Delete product ID '+id)
}

//Update Product
const updateProduct = (req, res) => {
    const id = req.params.id
    res.send(`Update product ID : ${id}`)
    console.log('Update product ID '+id)
}

module.exports = {
    selectAllProducts,
    selectOneProduct,
    addProdcut,
    deleteProduct,
    updateProduct
}


