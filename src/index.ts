import express from 'express';
import Drawer from './classes/Drawer';
import Product from './classes/Product';
import Utils from './classes/Utils';

const app = express();

app.get('/', (req, res) => {
    const product = Product.create(req.query);

    res.contentType("image/svg+xml");
    res.send(Drawer.draw(product));
})

app.listen(5000, () => {
    console.log('app is listening to port 5000');
})