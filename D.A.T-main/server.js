// server.js
// The code is hosted at https://github.com/HardRoker-7/D.A.T
// The site is live at https://render.com/
// using
// The username and password for Render is 
// Username:avinashsreekumar007@yahoo.com
// password:birkbeck
// / The username and password for Mongodb Backend is 
// Username:avinashsreekumar007@yahoo.com
// password:birkbeck


// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const axios = require('axios');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://birkbeck:birkbeck@birkbeck.tqawffy.mongodb.net/stockApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const stockSchema = new mongoose.Schema({
    symbol: String,
    qty: Number,
});

const Stock = mongoose.model('Stock', stockSchema);
const dummyStocks = [
    { symbol: 'AAPL', qty: 10 },
    { symbol: 'GOOGL', qty: 15 },
    { symbol: 'AMZN', qty: 8 },
    { symbol: 'MSFT', qty: 12 },
    { symbol: 'TSLA', qty: 20 }
];

app.get('/', async (req, res) => {
    try {
        const stockDataPromises = dummyStocks.map(async stock => {
            const symbol = stock.symbol;
            const qty = stock.qty;

            // Fetch dummy stock data (replace this with actual API calls if needed)
            const stockPrice = Math.random() * 1000; // Generate random stock prices
            const stockValue = stockPrice * qty;

            return {
                symbol: symbol,
                qty: qty,
                stockPrice: stockPrice.toFixed(2),
                stockValue: stockValue.toFixed(2)
            };
        });

        const stockData = await Promise.all(stockDataPromises);

        // Render the 'index' template with the dummy stock data
        res.render('index', { stocks: stockData });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/addStock', async (req, res) => {
    const { symbol, qty } = req.body;
    try {
        const userStocks = await Stock.find();
        if (userStocks.length >= 5) {
            return res.status(400).send('Maximum stock limit reached');
        }

        await Stock.create({ symbol, qty });

        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/deleteStock', async (req, res) => {
    const { id } = req.body;
    try {
        await Stock.findByIdAndDelete(id);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/stocks', async (req, res) => {
    try {
        const stocks = await Stock.find();
        res.json(stocks);
    } catch (err) {
        console.error('Error fetching stock data:', err);
        res.status(500).json({ error: 'Error fetching stock data.' });
    }
});
// Route for '/index' redirects to the root URL ('/')
app.get('/index', (req, res) => {
    res.redirect('/');
});

// Route for '/api' serves an HTML file located in the 'views' directory
app.get('/api', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'api.html');
    res.sendFile(filePath);
});

// Route for '/news' serves an HTML file located in the 'views' directory
app.get('/news', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'news.html');
    res.sendFile(filePath);
});

// Route for '/sitemap' serves an HTML file located in the 'views' directory
app.get('/sitemap', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'sitemap.html');
    res.sendFile(filePath);
});

// Route for '/asian' serves an HTML file located in the 'views' directory
app.get('/asian', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'asian.html');
    res.sendFile(filePath);
});

// Route for '/land' serves an HTML file located in the 'views' directory
app.get('/land', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'landing.html');
    res.sendFile(filePath);
});

// Route for '/video' serves an HTML file located in the 'views' directory
app.get('/video', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'video.html');
    res.sendFile(filePath);
});

// Route for '/logout' destroys the user session and redirects to the root URL ('/')
app.get('/logout', (req, res) => {
    req.session.destroy(); // Destroy the user's session data
    res.redirect('/'); // Redirect the user to the root URL
});

// Middleware for serving JavaScript files under the '/js' path with the correct content type
app.use('/js', (req, res, next) => {
    res.setHeader('Content-Type', 'application/javascript');
    next();
});

// Serve static JavaScript files from the 'public/js' directory
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));

// Serve static assets from the 'assets' directory
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Route for '/video' renders an HTML template named 'video'
app.get('/video', (req, res) => {
    res.render('video');
});

// Start the server and listen on the specified port (PORT)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
