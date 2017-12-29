
import app from './app';

const PORT = process.env.PORT || 8080;

app.listen( PORT, () => {
  console.log( `CDP service listening on port: ${PORT}` );
} );
