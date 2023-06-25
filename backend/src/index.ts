import app from './app';

const port = process.env.PORT || 8000 as number;

app.listen(port, () => {
    console.log(`Listening: http://localhost:${port}`)
})