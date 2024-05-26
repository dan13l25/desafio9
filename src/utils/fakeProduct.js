import { fakerES as faker } from "@faker-js/faker";

const generateFakeProduct = () => {
    const productQuantity = 100
    const products = [];
    for (let i = 0; i < productQuantity; i++) {
        products.push(createProduct());
    }
    return products;
};

const createProduct = () => {
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        thumbnails: [faker.image.url()],
        code: faker.string.alphanumeric(10),
        stock: faker.number.int({ min: 0, max: 100 }),
        status: faker.datatype.boolean(),
        category: faker.commerce.department(),
        brand: faker.company.name()
    };
};

export { generateFakeProduct };
