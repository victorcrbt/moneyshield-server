import App from './App';

const { server } = new App();

server.listen(3333, () => console.log('Server started...'));
